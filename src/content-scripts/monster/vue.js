import $ from 'jquery'
import Vue from 'vue'
import locale from '@/i18n'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$msg = function (msg, type = 'success') {
//   message[type](msg)
}

Vue.prototype.$t = function (text) {
  return locale[this.$store.state.lang ?? 'ja'][text]
}

Vue.prototype.sendMessage = (cmd, data) => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ cmd, data }, resolve)
  })
}

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

Vue.prototype.initGlobal = function (plat, content) {
  Vue.prototype._platform = plat
  Vue.prototype._platType = {
    1688: 'AM',
    '1688-new': 'AM',
    taobao: 'TB',
    tmall: 'TM'
  }[plat]
  Vue.prototype._content = content
}

const elemIds = Vue.prototype.$elemIds = {
  product: '__sniff_v1_crx_product__',
  bubble: '__sniff_v1_crx_bubble__',
  attach: '__sniff_v1_crx_attach__'
}

//
export default Vue.prototype

export const createVue = (components, elemId, options) => {
  if (!$('#' + elemId).length) {
    elemId = createDom(elemId)
  }
  return new Vue({
    store,
    ...options,
    render: h => h(components)
  }).$mount('#' + elemId)
}

export const createDom = (id) => {
  const el = $(`<div id="${elemIds[id]}"><div>`)
  $('body').append(el)
  return el.id
}

console.log('chrome', chrome)
