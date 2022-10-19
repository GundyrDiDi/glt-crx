// V3 不能声明变量，只能使用 chrome.storage 声明要用的变量，不能储存函数(函数保存为字符串也不行，因为有 CSP 限制)
// 使用时 storage.sync，如果用户启用了同步，存储的数据将自动同步到用户登录的任何 Chrome 浏览器。 storage chrome.storage.local
const storage = chrome.storage.local // sync 最大8k local 最大5m
// default value
const store = {
  userData: {},
  source: '1688',
  lang: process.env.VUE_APP_I18N_LOCALE,
  sheetData: []
}

storage.get(Object.keys(store), res => {
  Object.keys(store).forEach(key => {
    if (!res[key]) {
      storage.set({
        [key]: store[key]
      })
    }
  })
})

const read = key =>
  new Promise(resolve =>
    storage.get([key], res => {
      resolve(res[key])
    })
  )

const write = (key, val) =>
  Promise.resolve(() => read(key)).then(old => {
    if (old === val) return val
    storage.set({ [key]: val }, res => {
      return val
    })
  })

const proto = {
  images: {},
  //
  pushSearchImg (data) {
    const images = this.images
    const t = Date.now()
    images[t] = data
    return t
  },
  getSearchImg (data) {
    const src = this.images[data]
    delete this.images[data]
    return src
  }
}

Object.setPrototypeOf(store, proto)

export default store
export { read, write }
