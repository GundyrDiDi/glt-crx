import $ from 'jquery'
import Vue from 'vue'
import locale from '@/i18n'
import { sendMessage } from '@/utils/chrome'
import store from './store'
import Crx from '../vue/Crx.vue'
import Antd, { message } from 'ant-design-vue'
import { debounce } from '@/utils/utils'

Vue.config.productionTip = false

const requireComponent = require.context(
  '../components',
  false,
  /\.vue$/
  // 找到components文件夹下以.vue命名的文件
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  Vue.component(componentName, componentConfig.default || componentConfig)
})

Vue.use(Antd)

Vue.prototype.$msg = function (msg, type = 'success') {
  message[type](this.$t(msg) ?? msg)
}

export const t = function (text) {
  if (!locale[store.state.lang][text]) {
    console.warn('找不到“' + text + '”')
  }
  return locale[store.state.lang][text] ?? text
}

Vue.prototype.$t = t

Vue.prototype.$jump = function (url) {
  return window.open(process.env.VUE_APP_HOST + url)
}

Vue.prototype.sendMessage = (...rest) => {
  return sendMessage(...rest).then(res => {
    // this.dp(...rest)
    // console.log(rest[0])
    if (rest[0] !== 'read') {
      syncData()
    }
    return res
  }, err => {
    if (err?.res?.code === '24010062' || err?.res?.code === '10000000') {
      this.sendMessage('write', ['userData', {}])
      this.$msg('登录状态失效', 'error')
    }
    return Promise.reject(err)
  })
}

const syncData = debounce((loop) => {
  // 从直行便获取用户信息
  Promise.all([
    sendMessage('read', 'userData').then(res => {
      console.log(res)
      store.commit('setUserData', res ?? {})
    }),
    sendMessage('read', 'lang').then(res => {
      store.commit('setLang', res ?? process.env.VUE_APP_I18N_LOCALE)
    }),
    sendMessage('getSheetData').then(res => {
      store.commit('setSheetData', res ?? [])
    })
  ]).then(() => {
    // 先使用轮询替代，订阅模式需要 chrome.tabs 权限
    loop && setTimeout(syncData, 2820, true)
  })
}, 180)

const id = '__sniff_v1_crx__'
export const createDom = (parent = 'body') => {
  const el = $(`<div id="${id}"><div>`)
  $(parent).append(el)
  return id
}

export const createCrx = ({ plat, product }) => {
  Vue.prototype.$platform = plat
  Vue.prototype.$platType = {
    1688: 'AM',
    '1688-new': 'AM',
    taobao: 'TB',
    tmall: 'TM'
  }[plat]
  Vue.prototype.$product = product
  syncData(true)

  //
  const id = createDom()
  setTimeout(() => {
    new Vue({
      store,
      render: h => h(Crx)
    }).$mount('#' + id)
  }, 500)
}

console.log('chrome', chrome)
