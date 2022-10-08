import $ from 'jquery'
import Vue from 'vue'
import locale from '@/i18n'
import { sendMessage } from '@/utils/chrome'
import store from './store'
import Crx from '../vue/Crx.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)

Vue.prototype.$msg = function (msg, type = 'success') {
//   message[type](msg)
}

export const t = function (text) {
  return locale[store.state.lang ?? 'ja'][text]
}

Vue.prototype.$t = t

Vue.prototype.$jump = function (url) {
  return window.open(process.env.VUE_APP_HOST + url)
}

Vue.prototype.sendMessage = sendMessage

Vue.prototype.getToken = function (init) {
  // 从直行便获取用户信息
  this.sendMessage('getUserData').then(res => {
    console.log(res)
    store.commit('setUserData', res ?? {})
    // 先使用轮询替代，订阅模式需要 chrome.tabs 权限
    setTimeout(e => this.getToken(), 3000)
  })
  this.sendMessage('read', 'lang').then(res => {
    store.commit('setLang', res ?? 'ja')
  })
}

const id = '__sniff_v1_crx__'
export const createDom = (parent = 'body') => {
  const el = $(`<div id="${id}"><div>`)
  $(parent).append(el)
  return id
}

export const createCrx = ({ plat, content, product }) => {
  Vue.prototype._platform = plat
  Vue.prototype._content = content.length ? content : null
  Vue.prototype.$platType = {
    1688: 'AM',
    '1688-new': 'AM',
    taobao: 'TB',
    tmall: 'TM'
  }[plat]
  Vue.prototype.$product = product
  Vue.prototype.getToken()
  //
  const id = Vue.prototype.$crxId = createDom()
  return new Vue({
    store,
    render: h => h(Crx)
  }).$mount('#' + id)
}

console.log('chrome', chrome)
