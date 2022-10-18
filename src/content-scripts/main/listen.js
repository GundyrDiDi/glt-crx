import $ from 'jquery'
import { createCrx } from './vue'
import { execImgData } from '@/utils/search-image/image'
import { sendMessage } from '@/utils/chrome'
import execDetail from './detailData'

window.addEventListener('message', res => {
  const { platform, detail } = res.data
  // console.log(res.data)
  if (!platform) return
  //
  let plat = platform
  if (detail?.length) {
    execDetail(plat, detail)
  }
  console.log({ plat, detail })
  // 当前是否在商详页
  let product
  // 匹配各个平台元素
  if (plat === '1688') {
    const temp1 = !$('.obj-order')[0]
    product = temp1 ? $('.order-button-children')[0] : $('.obj-order')[0]
    plat = temp1 ? plat + '-new' : plat
    if (temp1) {
      product && (product.style.display = 'block')
    }
  } else if (plat === 'tmall') {
    product = document.querySelectorAll('.tb-sku .tb-action')[0]
  } else if (plat === 'taobao') {
    product = document.querySelectorAll('.tb-skin')[0]
  } else if (plat === 'theckb') {
    window.postMessage({ isInstall: true }, '*')
    // 与直行便系统的通道
    window.addEventListener('message', (res) => {
      const { cmd, imgData, userData, lang } = res.data ?? {}
      if (cmd === 'uploadImg') {
        execImgData(imgData)
      } else if (cmd === 'transferUser') {
        sendMessage('setUserData', userData)
      } else if (cmd === 'transferLang') {
        sendMessage('write', ['lang', lang])
      }
    })
  }
  // 初始化vue实例
  if (plat) {
    createCrx({ plat, product })
  }
})
