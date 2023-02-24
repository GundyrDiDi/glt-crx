import $ from 'jquery'
import Logger from 'alife-logger'
import store from './store'

function matchUrl (url) {
  const match = /[^?]\.(taobao\.|tmall\.|1688\.|amazon\.|aliexpress\.|theckb\.|rakuten\.|yahoo\.|pinduoduo\.|coupang\.|gmarket\.|11st\.)/
  const word = (url.match(match) || [])[1]
  return (word || '').slice(0, -1) || process.env.VUE_APP_IN
}

export const getPlat = () => matchUrl(location.href.replace(/\?.*$/, ''))
export const plat = getPlat()

if (plat) {
  const value = {
    1688: '[window.iDetailData?.sku ? window.iDetailData?.sku : window.__GLOBAL_DATA?.skuModel]',
    tmall: '[location.href.includes(`detail.tmall.com`)?true:undefined]',
    taobao: '[window.Hub?.config?.config?.sku.valItemInfo]',
    theckb: 'null',
    aliexpress: 'null',
    amazon: 'null',
    coupang: 'null',
    gmarket: 'null',
    '11st': 'null'
  }[plat]
  // V3 不允许使用 script 注入
  const div = $(`<div id="trigger-post" onclick="window.postMessage({platform:'${plat}',detail:${value}})"></div>`)
  $('body').append(div)
  setTimeout(e => {
    div.trigger('click')
    setTimeout(e => {
      div.remove()
    }, 200)
  }, 2000)
  if (process.env.NODE_ENV === 'production') {
    const __bl = Logger.singleton(
      {
        pid: 'exbrfir0yx@a8343bfd0256743',
        appType: 'web',
        imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
        behavior: true,
        enableConsole: true,
        release: process.env.VUE_APP_ARMS_VERSION, // 版本号
        environment: process.env.VUE_APP_ARMS_PROD // 环境
      }
    )
    __bl.setConfig({
      disableHook: true
    })
    setTimeout(() => {
      __bl.setConfig({
        setUsername: function () {
          return store.state?.user?.userName ?? null
        }
      })
    }, 5000)
  }
}
