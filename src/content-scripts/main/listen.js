import $ from 'jquery'
import Vue, { createVue } from '../monster/vue'
import { createAttach, execImgData } from '../monster/image'

window.addEventListener('message', res => {
  let { plat, content } = res.data
  if (!plat) return
  console.log({ plat, content })
  // 商品操作按钮
  let product
  // 平台全局气泡
  let body
  // 匹配各个平台元素
  if (plat === '1688') {
    const temp1 = !$('.obj-order')[0]
    product = temp1 ? $('.order-button-children')[0] : $('.obj-order')[0]
    plat = temp1 ? plat + '-new' : plat
    if (temp1) {
      product && (product.style.display = 'block')
    } else {
    }
    body = $('body')[0]
  } else if (plat === 'tmall') {
    product = document.querySelectorAll('.tb-sku')[0]
    body = $('body')[0]
  } else if (plat === 'taobao') {
    product = document.querySelectorAll('.tb-skin')[0]
    body = $('body')[0]
  } else if (plat === 'theckb') {
    window.postMessage({ isInstall: true }, '*')
    //
    window.addEventListener('message', (res) => {
      const { cmd, imgData, userData, lang } = res.data ?? {}
      if (cmd === 'uploadImg') {
        execImgData(imgData)
      } else if (cmd === 'transferUser') {
        Vue.sendMessage('setUserData', userData)
      } else if (cmd === 'transferLang') {
        Vue.sendMessage('write', ['lang', lang])
      }
    })
  }
  //
  Vue.initGlobal(plat, product ? content : null)
  Vue.getToken(true)
  createAttach()
//   if (body) {
//     if (!$('#sniff-app').length) {
//       const bubble = require('./Bubble/Index.vue').default
//       const div = $('<div id="_bubble_"></div>')
//       $(body).append(div)
//       createVue(bubble, '#sniff-search')
//     }
//   }
//   if (product) {
//     if (!$('#sniff-app').length) {}
//   }
})
