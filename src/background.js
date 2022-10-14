import store, { read, write } from './service/store'
import http from './service/fetch'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 不能传输函数
  Promise.resolve()
    .then(() => dispatch[request.cmd](request, sender))
    .then(res => sendResponse(res))
    .catch(e => sendResponse({ error: 'background error', res: e, request }))
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
  async updateUserData () {
    const userData = await read('userData')
    const { token } = userData
    if (token) {
      return http.getUser({ token }).then(res => {
        const data = { token, user: res.data, curShop: res.data.customerShopList[0]?.customerShopId }
        return dispatch.setUserData({ data })
      }, res => write('userData', {}))
    } else {
      return userData
    }
  },
  setUserData ({ data }) {
    clearTimeout(timeout.value)
    // 一天后过期
    timeout.value = setTimeout(() => {
      write('userData', {})
    }, 1000 * 60 * 60 * 24)
    return write('userData', data)
  },
  // 谷歌表
  async getSheetData () {
    return this.onUpdating ? this.onUpdating : read('sheetData')
  },
  onUpdating: null,
  onDelete: Promise.resolve(),
  onAdd: Promise.resolve(),
  async updateSheetData ({ loop, data: { delKey, addItems } }) {
    const { user } = await read('userData')
    const { googleUrl } = user
    const googleHeaderData = 'time,photoUrl,productName,productUrl,productSpecification'
    this.onUpdating = true
    if (googleUrl) {
      await this.onDelete.catch(e => {})
      await this.onAdd.catch(e => {})
      if (addItems) {
        this.onAdd = http.postGoogleSheet({
          googleUrl,
          data: addItems
        })
      } else if (delKey) {
        this.onDelete = http.deleteGoogleSheet({
          googleUrl,
          timeHeader: delKey,
          googleHeaderData
        })
      } else {
        await http.getGoogleSheet({
          googleUrl,
          googleHeaderData
        }).then(res => write('sheetData', res.data), () => write('sheetData', []))
      }
    } else {
      await write('sheetData', [])
    }
    this.onUpdating = false
    loop && setTimeout(() => {
      this.updateSheetData({ loop })
    }, 1000 * 10 * 60)
    if (delKey) {
      return this.onDelete
    }
    if (addItems) {
      return this.onAdd
    }
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
  }
  // todo:找相似 需要商品offerId 商品图片链接
  // https://s.1688.com/selloffer/similar_search.html?offerIds=653423014399&imageAddress=https%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2FO1CN01rtJrg41YIXBNU9EJB_!!2309863036-0-cib.jpg&scene=similar_search&postCatPaths=201568525%20124014010%2070&sameDesignEnable=false
}

const timeout = { value: null }
// 启动时确认用户名是否过期
// dispatch.updateUserData()
// dispatch.updateSheetData({ loop: true })
