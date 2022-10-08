import $ from 'jquery'

function matchUrl (url) {
  const match = /[^?]\.(taobao\.|tmall\.|1688\.|amazon\.|aliexpress\.|theckb\.|rakuten\.|yahoo\.|pinduoduo\.)/
  const word = (url.match(match) || [])[1]
  return (word || '').slice(0, -1) || process.env.VUE_APP_IN
}

export const getPlat = () => matchUrl(location.href.replace(/\?.*$/, ''))
export const plat = getPlat()

// 统一传入 { detailData , sku } 两类数据
if (plat) {
  const value = {
    1688: `{
        detailData:{
            init: window.__INIT_DATA,
            storage: window.__STORE_DATA
        },
        sku:{
            skuModel:window.__GLOBAL_DATA?.skuModel,
            sku:window.iDetailData?.sku||{
                price: window.iDetailConfig?.refPrice,
                skuId: window.iDetailConfig?.offerId,
                skuName: '—',
                skuProps: []
            },
        }
    }`,
    tmall: `{
        sku:null
    }`,
    taobao: `{
        detailData:{},
        sku:window.Hub?.config.config.sku.valItemInfo.skuMap
    }`,
    theckb: '{}',
    aliexpress: '[]',
    amazon: '[]'
  }[plat]
  // V3 不允许使用 script 注入
  const div = $(`<div id="trigger-post" onclick="window.postMessage({plat:'${plat}',content:${value}})"></div>`)
  $('body').append(div)
  setTimeout(e => {
    div.trigger('click')
    setTimeout(e => {
      div.remove()
    }, 200)
  }, 200)
}
