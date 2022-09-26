import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery'
import Observe from './image'
import locale from './i18n'
import './assets/css'
import { message } from 'ant-design-vue'
import 'ant-design-vue/lib/message/style/index.css'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$msg = function (msg, type = 'success') {
  message[type](msg)
}

Vue.prototype.http = url => {
  const host = process.env.VUE_APP_HOST
  window.open(host + url)
}

Vue.prototype.sendMessage = (cmd, data) => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ cmd, data }, resolve)
  })
}

console.log(locale)
Vue.prototype.$t = function (text) {
  return locale[this.$store.state.lang ?? 'ja'][text]
}

// 状态管理
const store = new Vuex.Store({
  state: {
    lang: 'ja',
    token: '',
    systemSource: 1,
    curShop: null,
    user: null
  },
  mutations: {
    setUserData (state, val) {
      console.log(val)
      const { token, systemSource, user, curShop } = val
      if (curShop && user && token) {
        state.token = token
        state.systemSource = systemSource
        state.curShop = curShop
        state.user = user
      } else {
        state.token = ''
        state.systemSource = 1
        state.curShop = null
        state.user = null
      }
    },
    setLang (state, val) {
      state.lang = val
    }
  }
})

function matchUrl (url) {
  const match = /[^?]\.(taobao\.|tmall\.|1688\.|amazon\.|aliexpress\.|theckb\.|rakuten\.|yahoo\.|pinduoduo\.)/
  const word = (url.match(match) || [])[1]
  return (word || '').slice(0, -1) || process.env.VUE_APP_IN
}
const searchImg = {}

chrome.runtime.sendMessage(
  { cmd: 'inject', url: location.href.replace(/\?.*$/, '') },
  url => {
    const plat = matchUrl(url)
    searchImg.value = new Observe(plat, store)
    //
    if (!plat) return
    const value = {
      1688: `{
        detailData:{
          init: window.__INIT_DATA,
          storage: window.__STORE_DATA
        },
        sku:{
          skuModel:window.__GLOBAL_DATA?.skuModel,
          sku:window.iDetailData?.sku||{
            price: window.iDetailConfig?.refPrice,
            skuId: window.iDetailConfig?.offerId,
            skuName: '—',
            skuProps: []
          },
        }
      }`,
      tmall: `{
        sku:null
      }`,
      taobao: `{
        detailData:{},
        sku:window.Hub?.config.config.sku.valItemInfo.skuMap
      }`,
      theckb: '{}',
      aliexpress: '[]',
      amazon: '[]'
    }[plat]
    // V3 不允许使用 script 注入
    const div = $(`<div id="trigger-post" onclick="
      window.postMessage({plat:'${plat}',content:${value}})
    "></div>`)
    $('body').append(div)
    setTimeout(e => {
      div.trigger('click')
      setTimeout(e => {
        $('body').remove(div)
      }, 200)
    }, 200)
  }
)

window.addEventListener('message', res => {
  let { plat, content } = res.data
  if (!plat) return
  console.log({ plat, content })
  // 匹配各个平台元素
  let parent
  let body
  if (plat === '1688') {
    const temp1 = !$('.obj-order')[0]
    parent = temp1 ? $('.order-button-children')[0] : $('.obj-order')[0]
    plat = temp1 ? plat + '-new' : plat
    if (temp1) {
      parent && (parent.style.display = 'block')
    } else {
    }
    console.log(parent)
    body = $('body')[0]
  } else if (plat === 'tmall') {
    parent = document.querySelectorAll('.tb-sku')[0]
    body = $('body')[0]
  } else if (plat === 'taobao') {
    parent = document.querySelectorAll('.tb-skin')[0]
    body = $('body')[0]
  } else if (plat === 'theckb') {
    //
    window.postMessage({ isInstall: true }, '*')
    //
    window.addEventListener('message', (res) => {
      const { cmd, imgData, userData, lang } = res.data ?? {}
      if (cmd === 'uploadImg') {
        searchImg.value.execImgData(imgData)
      } else if (cmd === 'transferUser') {
        Vue.prototype.sendMessage('setUserData', userData)
      } else if (cmd === 'transferLang') {
        Vue.prototype.sendMessage('write', ['lang', lang])
      }
    })
  }
  const getToken = function (init) {
    // 从直行便获取用户信息
    Vue.prototype.sendMessage('getUserData').then(res => {
      store.commit('setUserData', res ?? {})
      // 先使用轮询替代，订阅模式需要 chrome.tabs 权限
      setTimeout(e => {
        getToken()
      }, 3000)
    })
    Vue.prototype.sendMessage('read', 'lang').then(res => {
      store.commit('setLang', res ?? 'ja')
    })
  }
  getToken(true)
  Vue.prototype._platform = plat
  Vue.prototype._platType = {
    1688: 'AM',
    '1688-new': 'AM',
    taobao: 'TB',
    tmall: 'TM'
  }[plat]
  // 加载css 放在这里可以节省客户资源
  // todo:打包后css文件不会生效 import()方式页不会从chrome://获取，这种情况css文件会初始加载到全局
  if (body || parent) {
    require('./components')
  }

  // 搜索条
  if (body) {
    const bar = require('./Bar.vue').default
    const div = $('<div></div>')
    div.attr('id', 'sniff-search')
    $(body).append(div)
    new Vue({
      store,
      render: h => h(bar)
    }).$mount('#sniff-search')
  }
  // 功能按钮
  if (parent) {
    Vue.prototype._content = content
    if ($('#sniff-app').length) return
    const app = require('./App.vue').default
    const div = $('<div></div>')
    div.attr('id', 'sniff-app')
    $(parent).append(div)
    new Vue({
      store,
      render: h => h(app)
    }).$mount('#sniff-app')
  }
})
