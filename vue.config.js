const path = require('path')

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
  }
}
