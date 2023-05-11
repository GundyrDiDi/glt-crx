const path = require('path')
const fs = require('fs/promises')
const { zip } = require('zip-a-folder')
const webpack = require('webpack')

module.exports = {
  lintOnSave: false,
  pages: {},
  productionSourceMap: true,
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js'
            ]
          }
        }
      }
    }
  },
  // 插件使用引用都转成内联，base64格式
  chainWebpack: config => {
    const rule = config.module.rule('fonts').use('url-loader')
    rule.tap(options => {
      return {
        ...options,
        limit: 100 * 1024 * 1024
      }
    })
    const rule2 = config.module.rule('images').use('url-loader')
    rule2.tap(options => {
      return {
        ...options,
        limit: 1024 * 1024
      }
    })

    const dir = path.resolve(__dirname, 'src/assets/icons')
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(dir).end() // 包含 icons 目录
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ extract: false }).end()
    config.plugin('svg-sprite').use(
      require('svg-sprite-loader/plugin'), [{ plainSprite: true }]
    )
    config.module.rule('svg').exclude.add(dir) // 其他 svg loader 排除 icons 目录

    config.plugin('zip-a-folder').use(
      new webpack.ProgressPlugin(async (percent) => {
        if (percent === 1 && /^production|test$/.test(process.env.NODE_ENV)) {
          try {
            const v3 = JSON.parse(await fs.readFile('./v3.json', { encoding: 'utf-8' }))
            const dist = await fs.opendir('./dist/css')
            const css = []
            const { version } = v3
            for await (const f of dist) {
              css.push('css/' + f.name)
            }
            v3.content_scripts[0].css = css
            await fs.writeFile('./dist/manifest.json', JSON.stringify(v3))
            await zip('./dist', `${version}.zip`)
            return true
          } catch (err) {
            console.log(err)
            return false
          }
        }
      })
    )
  }
}
