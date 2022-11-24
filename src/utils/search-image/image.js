import $ from 'jquery'
import { sendMessage } from '../chrome'

// 上传图片方式搜图，兼容老插件
export const execImgData = (imgData) => {
  const { height, width, src, type } = imgData
  const cur = { src, type, upload: true }
  beforeJump({ height, width, cur })
}

// 判断图片是否跨域
export const beforeJump = async (imgData, source = '1688', original = false) => {
  const base64 = await url2base64(imgData, source)
  if (/^data:image/.test(base64)) {
    sendMessage('pushSearchImg', base64).then(res => {
      jumpTo(res, source)
    })
  } else if (base64) {
    if (original) {
      alert('類似商品の検索に問題が発生しました。別の商品でもう一度お試しください。')
      window.close()
    } else {
      window.open(base64 + `?orginImg=true&plat=${imgData.plat}&source=${source}`)
    }
  }
}

export const jumpTo = (imgKey, source, replace) => {
  const map = {
    1688: 'https://www.1688.com/',
    taobao: 'https://s.taobao.com/',
    pinduoduo: 'https://pifa.pinduoduo.com/'
  }
  const url = map[source] + `?sniffimg=${imgKey}&source=${source}`
  replace ? location.replace(url) : window.open(url)
}

// 将图片链接转为base64格式，注意需要区分不同的平台、图片格式、大小
export const url2base64 = ({ height, width, plat, cur }) => {
  const radio = parseInt(Math.max(300 / height, 300 / width) * 100) / 100
  height *= radio
  width *= radio
  //
  let src = cur.src.replace(/\?.+$/, '')
  const reg = /.(png|jpg|jpeg|bmp|webp)$/ // 1688搜图仅支持 png jpg jpeg bmp，如果是webp格式... jfif
  let type = (src.match(reg) || [''])[1]
  // 1688规则
  if (type === 'webp' && plat === '1688') {
    const i = src.indexOf('jpg') + 3
    src = src.slice(0, i)
    type = 'jpg'
  }
  // 速卖通、淘宝 图片规则
  if (type === 'webp' && (plat === 'aliexpress' || plat === 'taobao')) {
    src = src.replace(/_\.webp/, '')
    type = src.match(reg)[1]
  }
  // 雅虎日本规则
  if (type === undefined && plat === 'yahoo') {
    type = 'jpg'
  }
  // ebay规则
  if (type && plat === 'ebay') {
    type = 'jpg'
  }
  // 直行便上传图片规则
  if (cur.upload && cur.type) {
    type = cur.type
  }
  console.log(src, type)
  if (type) {
    const tempImg = new Image()
    tempImg.height = height
    tempImg.width = width
    tempImg.crossOrigin = 'anonymous'
    tempImg.src = src + (cur.upload ? '' : ('?t=' + Date.now()))
    return new Promise((resolve, reject) => {
      tempImg.onerror = reject
      tempImg.onload = function () {
        const canvas = $('<canvas>')
        canvas.attr({ height, width })
        const ctx = canvas[0].getContext('2d')
        ctx.drawImage(tempImg, 0, 0, width, height)
        // resolve(canvas[0].toDataURL('image/jpeg'))
        // console.log(type)
        resolve(canvas[0].toDataURL(`image/${type}`))
      }
    }).catch(err => {
      console.log(err)
      return src
    })
  } else {
    return src
  }
}
