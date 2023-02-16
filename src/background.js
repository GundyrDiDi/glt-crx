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
      beforeLanguageCode: lang,
      afterLanguageCode: 'zh',
      keyword: data.keyword
    }
    http.search(data)
    return http.translate(formData)
  },
  async localize ({ data }) {
    const lang = await read('lang')
    const formData = {
      beforeLanguageCode: 'zh',
      afterLanguageCode: lang,
      keyword: data.keyword
    }
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
  async updateUserData () {
    const userData = await read('userData')
    const { token } = userData
    if (token) {
      return http.getUser({ token }).then(res => {
        const data = { token, user: res.data, curShop: res.data.customerShopList[0]?.customerShopId ?? ' ' }
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
  async updateSheetData ({ loop, data: { delItem, addItems } = {} }) {
    const { user = {} } = await read('userData')
    const { googleUrl, langcode: langCode = 'en' } = user
    const thMap = {
      time: 'Date',
      photoUrl: 'Photo Url',
      productName: 'Product Name',
      productUrl: 'Product Url',
      productSpecification: 'Product Specification'
    }
    const googleHeaderData = Object.values(thMap).join(',')
    const setProps = (data, forward) => {
      return data.map(v => {
        const o = {}
        Object.entries(thMap).forEach(([key1, key2]) => {
          if (forward) {
            o[key1] = v[key2]
          } else {
            o[key2] = v[key1]
          }
        })
        return o
      })
    }
    if (!googleUrl) {
      if (delItem || addItems) {
        const msg = '谷歌表为空'
        return Promise.reject(msg)
      } else {
        await write('sheetData', [])
      }
    } else {
      this.onUpdating = true
      if (addItems) {
        this.onAdd = http.postGoogleSheet({
          googleUrl,
          langCode,
          data: setProps(addItems)
        })
        await this.onAdd.catch(e => {})
      } else if (delItem) {
        this.onDelete = http.deleteGoogleSheet({
          googleUrl,
          langCode,
          ...delItem,
          googleHeaderData
        })
        await this.onDelete.catch(e => {})
      } else {
        await this.onDelete.catch(e => {})
        await this.onAdd.catch(e => {})
        await http.getGoogleSheet({
          googleUrl,
          langCode,
          googleHeaderData
        }).then(res => {
          const list = setProps(res.data, true)
          write('sheetData', list)
        }, () => write('sheetData', []))
      }
      // await new Promise(resolve => {
      //   setTimeout(e => {
      //     resolve(true)
      //   }, 20000)
      // })
      this.onUpdating = false
    }
    loop && setTimeout(() => {
      this.updateSheetData({ loop })
    }, 1000 * 10 * 60)
    if (delItem) {
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
  },
  async url2base64 ({ data }) {
    const src = data.imgData.src
    return fetch(src, {
      responseType: 'blob'
    }).then(res => res.blob())
      .then(res => {
        return new Promise((resolve, reject) => {
          // console.log(res)
          const fd = new FileReader()
          fd.onload = (res) => {
            console.log(res)
            resolve(res.target.result)
          }
          setTimeout(reject, 30 * 1000)
          fd.readAsDataURL(res)
        })
      }).catch(() => {
        return ''
      })
  }
  // todo:找相似 需要商品offerId 商品图片链接
  // https://s.1688.com/selloffer/similar_search.html?offerIds=653423014399&imageAddress=https%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2FO1CN01rtJrg41YIXBNU9EJB_!!2309863036-0-cib.jpg&scene=similar_search&postCatPaths=201568525%20124014010%2070&sameDesignEnable=false
}

const timeout = { value: null }

setTimeout(() => {
  // 启动时确认用户名是否过期
  dispatch.updateUserData()
  dispatch.updateSheetData({ loop: true })
}, 1000)
