// 'use strict'

// import axios from 'axios'
// import api, { homeUrl } from '@/api'
// import { serize } from '@/common/util.js'
// const config = {
//   baseURL: process.env.baseURL || process.env.apiUrl || api.baseURL,
//   timeout: 60 * 1000,
//   withCredentials: true // Check cross-site Access-Control
// }
// // axios.defaults.withCredentials = true

// const _axios = axios.create(config)
// // 重写get请求
// const _getter = _axios.get
// _axios.get = function (url, params) {
//   return _getter(url, params ? { params } : undefined)
// }
// // 新标签页打开
// _axios.open = function (url, params = {}) {
//   // const config = this.defaults
//   // const data = generate(config, url, params, 'link')
//   window.open(serize(params, (homeUrl || config.baseURL) + url))
// }
// // 取消请求
// // const CancelToken = axios.CancelToken
// // const source = CancelToken.source()

// // 拦截请求
// function generate (config, url, data, method) {
//   // 获取真正请求的url
//   // 如果url还需要拼接参数
//   let suffix = ''
//   config.url = [method].concat(url.split('/')).reduce((acc, v) => {
//     if (typeof acc[v]._headers === 'function') {
//       config.headers = acc[v]._headers()
//     }
//     // _params用来修改或者添加参数
//     if (typeof acc[v]._params === 'function') {
//       // 参数合并
//       const next = acc[v]._params(data)
//       if (next instanceof FormData) {
//         data = next
//       } else {
//         data = { ...next }
//       }
//     } else if (typeof acc[v]._params === 'object') {
//       // 参数替换
//       data = acc[v]._params
//     }
//     // 替换basbeUrl,一般作为其他跨域接口
//     if (acc[v]._baseUrl) {
//       config.baseURL = v._baseUrl
//     }
//     // 获得 suffix
//     if (acc[v]._suffix) {
//       suffix = serize(acc[v]._suffix(data))
//     }
//     // 返回下一级
//     return acc[v]
//   }, api).url
//   // 拼接
//   config.url = config.url + suffix
//   return config.headers['Content-Type'] &&
//     config.headers['Content-Type'].includes('application/x-www-form-urlencoded')
//     ? serize(data).slice(1)
//     : data
// }
// _axios.interceptors.request.use(
//   async function (config) {
//     // 通过api获得真正的请求路径
//     const { method, url } = config
//     const paramType = method === 'post' ? 'data' : 'params'
//     // 生成url和参数
//     config[paramType] = generate(config, url, config[paramType], method)
//     return config
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )
// // 拦截响应
// _axios.interceptors.response.use(
//   function (res) {
//     // 目前请求只用于 b2b 接口
//     console.log(res)
//     const SUCCESS = '0'
//     const code = res.data.code
//     if (code !== SUCCESS) {
//       // 需要考虑是 background 请求，还是是popup请求
//       const store = typeof inject === 'function' ? inject('__clearToken__') : inject
//       store.dispatch('cache/_delcache', 'cache/sniff_token')
//     }
//     return res.data
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )

// let inject = null
// _axios._setStore = val => {
//   inject = val
// }
// export default _axios
