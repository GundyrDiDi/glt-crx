import $ from 'jquery'

function matchUrl (url) {
  const match = /[^?]\.(taobao\.|tmall\.|1688\.|amazon\.|aliexpress\.|theckb\.|rakuten\.|yahoo\.|pinduoduo\.)/
  const word = (url.match(match) || [])[1]
  return (word || '').slice(0, -1) || process.env.VUE_APP_IN
}

export const getPlat = () => matchUrl(location.href.replace(/\?.*$/, ''))
export const plat = getPlat()

if (plat) {
  const value = {
    1688: '[window.__GLOBAL_DATA?.skuModel]',
    tmall: '[location.href.includes(`detail.tmall.com`)?true:undefined]',
    taobao: '[window.Hub?.config?.config?.sku.valItemInfo]',
    theckb: 'null',
    aliexpress: 'null',
    amazon: 'null'
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
}
