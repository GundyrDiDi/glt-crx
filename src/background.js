import store, { read, write } from './service/store'
import http from './service/fetch'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 不能传输函数
  Promise.resolve()
    .then(() => dispatch[request.cmd](request, sender))
    .then(res => sendResponse(res))
    .catch(e => sendResponse({ error: 'background error', res: e }))
    // 异步返回必须先返回true
  return true
})

const dispatch = {
  // 翻译
  async translate ({ data }) {
    const lang = await read('lang')
    const formData = {
      from: lang,
      to: 'zh',
      text: data.keyword
    }
    http.search(data)
    return http.translate(formData)
  },
  // 获取商品信息
  async getDetail ({ data }) {
    return http.getDetail(data)
  },
  // 收藏
  //   addFavo ({ data }) {
  //     return http.addFavo(data)
  //   },
  // 浏览记录
  record ({ data }) {
    return http.record(data)
  },
  // 立即购买
  addCart ({ data }) {
    return http.addCart(data)
  },
  // 直行便调取搜图接口
  async pushSearchImg ({ data }) {
    return store.pushSearchImg(data)
  },
  async getSearchImg ({ data }) {
    return store.getSearchImg(data)
  },
  // 用户信息 登录状态
  getUserData () {
    return read('userData')
  },
  setUserData ({ data }) {
    clearTimeout(timeout.value)
    // 一天后过期
    timeout.value = setTimeout(() => {
      write('userData', {})
    }, 1000 * 60 * 60 * 24)
    return write('userData', data)
  },
  // 通用
  request ({ data }) {
    return http[data[0]](data[1])
  },
  read ({ data }) {
    return read(data)
  },
  write ({ data }) {
    return write(data[0], data[1])
  },
  // 临时
  test ({ data }) {
    const headers = {}
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    const body = JSON.stringify(data)
    return fetch('http://192.168.102.63:15678//productPlugInInsert', { method: 'post', headers, body }).then(res => res.json()).then(res => {
      const code = res.code
      if (code === '0') {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
  }
  // todo:找相似 需要商品offerId 商品图片链接
  // https://s.1688.com/selloffer/similar_search.html?offerIds=653423014399&imageAddress=https%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2FO1CN01rtJrg41YIXBNU9EJB_!!2309863036-0-cib.jpg&scene=similar_search&postCatPaths=201568525%20124014010%2070&sameDesignEnable=false
}

const timeout = { value: null }

// 启动时确认用户名是否过期
