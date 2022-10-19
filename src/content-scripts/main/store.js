import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const languages = ['ko', 'en', 'zh']

function getLang () {
  return languages.includes(navigator.language.toLowerCase()) ? navigator.language.toLowerCase() : process.env.VUE_APP_I18N_LOCALE
}

const store = new Vuex.Store({
  state: {
    lang: getLang(),
    token: '',
    curShop: null,
    user: null,
    systemSource: 1,
    sheetData: [],
    //
    showModal: false,
    parabola: null
  },
  mutations: {
    setUserData (state, val) {
      const { token, systemSource, user, curShop } = val
      if (curShop && user && token) {
        state.token = token
        state.curShop = curShop
        state.user = user
        state.systemSource = systemSource
      } else {
        state.token = ''
        state.curShop = null
        state.user = null
        state.systemSource = 1
      }
    },
    setLang (state, val) {
      state.lang = val
    },
    setSheetData (state, val) {
      state.sheetData = val
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
