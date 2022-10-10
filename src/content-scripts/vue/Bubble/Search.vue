<template>
  <div class="abs sniff-crx-bubble-search flex-col-bwn">
    <div>
      <a-dropdown :getPopupContainer="n=>n.parentNode">
        <a>{{ $t(langs.find(v=>v.value===lang).label) }}</a>
        <a-menu slot="overlay">
          <a-menu-item v-for="v in langs" :key="v.value"
          @click="setLang(v)"
          > {{ $t(v.label) }} </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="flex">
      <a-input v-model="keyword" :placeholder="$t('搜索商品名或店舗名')"
      @keyup.enter="search"
      ></a-input>
      <div class="sniff-crx-bubble-tablebtn">
        <a-button @click="showModal=true">T</a-button>
      </div>
    </div>
    <GoogleModal v-model="showModal"/>
  </div>
</template>
<script>
import gbk from '@/plugins/gbk.min.js'
import { mapState } from 'vuex'
import GoogleModal from './GoogleModal.vue'
export default {
  components: { GoogleModal },
  data () {
    return {
      showModal: false,
      keyword: '',
      langs: [
        { label: '中文', value: 'zh' },
        { label: '日语', value: 'ja' },
        { label: '韩语', value: 'ko' },
        { label: '英语', value: 'en' }
      ],
      searchUrl: {
        TB: 'https://s.taobao.com/search?q=',
        AM: 'https://s.1688.com/selloffer/offer_search.htm?keywords=',
        TM: 'https://list.tmall.com/search_product.htm?q='
      }
    }
  },
  computed: mapState(['lang', 'user']),
  methods: {
    setLang (v) {
      console.log(v)
    },
    search () {
      const w = this.keyword.replace(/\s/g, '+')
      this.sendMessage('translate', {
        customerId: this.user?.customerId,
        keyword: w,
        platformType: this.$platType
      }).then(res => {
        console.log(res)
        window.open(
          this.searchUrl[this.$platType] + gbk.URI.encodeURI(res.data)
        )
      }, () => {
        window.open(this.searchUrl[this.$platType] + gbk.URI.encodeURI(w))
      })
    }
  },
  mounted () {
    console.log(this.lang)
  }
}
</script>
<style lang="scss" scoped>
.sniff-crx-bubble {
  &-search {
    width: 100%;
    height: 80px;
    background: #f9f9f9;
    padding:10px;
  }
}
</style>
