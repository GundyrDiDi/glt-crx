module.exports = {
  lintOnSave: false,
  pages: {},
  productionSourceMap: false,
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
  }
}
