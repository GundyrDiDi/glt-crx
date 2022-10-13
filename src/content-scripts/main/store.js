import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const languages = ['zh', 'ja', 'ko', 'en', 'en-us']

function getLang () {
  return languages.includes(navigator.language.toLowerCase()) ? navigator.language.toLowerCase() : 'ja'
}

const store = new Vuex.Store({
  state: {
    lang: 'ja',
    token: getLang(),
    systemSource: 1,
    curShop: null,
    user: null,
    //
    showModal: false,
    parabola: null
  },
  mutations: {
    setUserData (state, val) {
    //   console.log(val)
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
    },
    showModal (state, val) {
      state.showModal = val
    },
    setParabola (state, val) {
      state.parabola = val
    }
  }
})

export default store
