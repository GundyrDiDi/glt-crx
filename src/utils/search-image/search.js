import $ from 'jquery'
import md5 from 'md5'
import axios from 'axios'
import { serizeR } from '@/utils/utils'
import { sendMessage } from '@/utils/chrome'
import Cookies from '@/plugins/cookie'
import Loading from '@/plugins/loading'
import { beforeJump } from './image'
import locale from '@/i18n'

const _axios = axios.create({
  withCredentials: true
})

// 1688搜图接口
function tbsign (data) {
  const token = (
    Cookies.get('_m_h5_tk') ||
      Cookies.get('_m_h5_tk_enc') ||
      ''
  ).split('_')[0]
  const t = Date.now()
  const appKey = 12574478
  return {
    jsv: '2.4.11',
    appKey,
    t,
    sign: md5(`${token}&${t}&${appKey}&${data}`),
    api: 'mtop.1688.imageService.putImage',
    ecode: 0,
    v: '1.0',
    type: 'originaljson',
    dataType: 'jsonp'
  }
}

function search1688 (res) {
  let data = {
    imageBase64: res.replace(/^data:image\/.+;base64,/, ''),
    appName: 'searchImageUpload',
    appKey: 'pvvljh1grxcmaay2vgpe9nb68gg9ueg2'
  }
  data = JSON.stringify(data)
  return _axios({
    url: 'https://h5api.m.1688.com/h5/mtop.1688.imageservice.putimage/1.0/',
    method: 'post',
    params: tbsign(data),
    data: new URLSearchParams({ data })
  }).then(res => {
    if (res.data.data.imageId) {
      window.stop()
      location.replace(
          `https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageAddress=&imageId=${res.data.data.imageId}`
      )
    } else {
      return { error: true }
    }
  })
}

// 淘宝搜图接口
function dataURLtoBlob (dataurl) {
  const arr = dataurl.split(',')
  // 注意base64的最后面中括号和引号是不转译的
  const _arr = arr[1].substring(0, arr[1].length - 2)
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(_arr)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], {
    type: mime
  })
  return new File([blob], 'filename.' + mime.split('/')[1], {
    type: 'image/jpeg' // 固定格式
  })
}

function searchTB (res) {
  const file = dataURLtoBlob(res)
  const fd = new FormData()
  fd.append('imgfile', file)
  _axios({
    url: 'https://s.taobao.com/image',
    data: fd,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    console.log(res)
    if (res.data?.name) {
      window.stop()
      location.replace(
          `https://s.taobao.com/search?q=&imgfile=&js=1&style=grid&stats_click=search_radio_all%253A1&initiative_id=staobaoz_20220314&ie=utf8&tfsid=${res.data.name}&app=imgsearch`
      )
    }
  })
}

// 拼多多搜图接口
function searchPDD (res) {
  // const file = dataURLtoBlob(res)
  // const fd = new FormData()
  // // HTMLFormControlsCollection.log(cookies)
  // // console.log(localStorag.item)
  // fd.append('file', file)
  // setTimeout(() => {
  //   const code = pdd()().messagePackSync(
  //     'https://pifa.pinduoduo.com'
  //   )
  //   console.log(code)
  //   _axios({
  //     url: 'https://pifa.pinduoduo.com/mille/slow/upload/uploadSearchImage',
  //     data: fd,
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       'anti-content': code
  //     }
  //   })
  //     .then(res => {
  //       console.log(res)
  //       if (res.data?.result?.imageUrl) {
  //         window.stop()
  //         location.replace(
  //           `https://pifa.pinduoduo.com/search?imgUrl=${encodeURIComponent(
  //             res.data.result.imageUrl
  //           )}`
  //         )
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }, 10)
}

// 总是执行搜图
export const getImgData = async () => {
  // props: 当前是否为图片链接 平台 搜索来源 已存的图片key
  const { orginImg, plat, source, sniffimg } = serizeR(location.href)
  // 先判断是否图片地址，再判断是否平台搜图地址
  if (orginImg) {
    const cur = $('img')[0]
    const { height, width } = cur.getBoundingClientRect()
    beforeJump({ height, width, plat, cur }, source, true)
  } else if (sniffimg) {
    sendMessage('getSearchImg', sniffimg).then(dataurl => {
      let ins = null
      sendMessage('read', 'lang').then(res => {
        console.log(res)
        ins = Loading.service({
          text: '유사 상품 검색 중이니 잠시만 기다려주세요.'
        })
      })
      source === '1688' && (search1688(dataurl))
      source === 'taobao' && (searchTB(dataurl))
      source === 'pinduoduo' && (searchPDD(dataurl))
      setTimeout(e => {
        ins.close()
      }, 3000)
    })
  }
}
