import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const langs = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'ko' },
  { label: 'ภาษาไทย', value: 'th' }
]

const store = new Vuex.Store({
  state: {
    langs,
    //
    lang: 'en',
    token: '',
    curShop: null,
    user: null,
    systemSource: 1,
    sheetData: [],
    //
    showModal: false,
    outModal: false,
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
    outModal (state, val) {
      state.outModal = val
    },
    setParabola (state, val) {
      state.parabola = val
    }
  }
})

export default store
