// service worker 不能使用xhr，改为fetch
// import md5 from 'md5'
import { serize } from '@/utils/utils'
import { read } from './store'

const reqURL = process.env.VUE_APP_URL

// 造 axios
const http = async (url, config = {}) => {
  const { params, ...rest } = config
  const whole = reqURL + serize(params, url)
  return fetch(whole, await http.default(rest))
    .then(res => res.json())
    .then(res => http.response(res))
}

http.post = (url, config) =>
  http(url, {
    method: 'post',
    ...config
  })
http.get = (url, config) =>
  http(url, {
    method: 'get',
    ...config
  })
http.default = async config => {
  const { token, curShop } = await read('userData')
  const headers = {
    'X-AuthToken': token,
    'X-AuthShopId': curShop
  }
  // if (config)
  console.log(config)
  if (config.body instanceof FormData) {

  } else if (config.body instanceof URLSearchParams) {

  } else {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    if (config.body instanceof Object) {
      config.body = JSON.stringify(config.body)
    }
  }
  return {
    headers,
    ...config
  }
}

// 接口
const apis = {
  // 登录
  loginByPwd: data => http.post('/customer/passwordLogin', { body: data }),
  getLoginCode: data => http.post('/customer/emailLogin/send/code', { body: data }),
  loginByCode: data => http.post('/customer/emailLogin', { body: data }),
  // 保存谷歌表链接
  setGoogleTable: data => http.post('/customer/passwordLogin', { body: data }),
  // 商品加入谷歌表
  postGoogleTable: data => http.post('/customer/passwordLogin', { body: data }),
  // 翻译
  translate: data =>
    http.post('/goods-validate/translate/common', { body: data }),
  // 用户搜索记录
  search: data => http.post('/goods/search/key/plugin/log', { body: data }),
  // 用户浏览记录
  record: data => http.post('/goods/footprint/footprint/recordPluginProduct', { body: data }),
  // 商品详情
  getDetail: data => http.post('/goods/product/searchAndSaveProductByPlugin', { body: data }),
  // 加购
  addCart: data =>
    http.post('/order/cart/add/commontProduct', {
      body: data
    }),
  addFavo: data =>
    http.post('', {
      body: data
    })
}

// 拦截响应
http.response = res => {
  const code = res.code
  if (code === '0') {
    res.success = true
  }
  // write('userData', null)
  return res
}

export default apis
