<template>
  <div class="sniff-crx-bubble-search flex-col-bwn">
    <div class="flex-bwn-ter" style="padding:22px 0 0 0;">
      <lang-btn></lang-btn>
      <div class="flex-ter sniff_btn sniff_color--info" @click="$store.commit('outModal',true)" style="position:relative;top:-2px">
        <svg-icon name="退出登录" style="font-size:14px;margin-right:5px;"></svg-icon>
        {{ $t('退出登录') }}
      </div>
    </div>
    <div class="flex-ter">
      <div class="flex-ter rel">
        <a-input v-model="keyword" :placeholder="$t('搜索商品名或店舗名')" name="sniff-search-keyword"
          @keyup.enter="handleEnter"></a-input>
        <div class="abs" @click="search">
          <svg-icon name="搜索"></svg-icon>
        </div>
      </div>
      <div class="sniff-crx-bubble-tablebtn" :class="{ active: user?.googleUrl }"
        @click="$store.commit('showModal', true)">
        <svg-icon name="谷歌表" style="font-size: 20px;position:relative;top:1px;"></svg-icon>
      </div>
    </div>
  </div>
</template>
<script>
import gbk from '@/plugins/gbk.min.js'
import { mapState } from 'vuex'
let isEnter = false
export default {
  data () {
    return {
      keyword: '',
      searchUrl: {
        TB: 'https://s.taobao.com/search?q=',
        AM: 'https://s.1688.com/selloffer/offer_search.htm?keywords=',
        TM: 'https://list.tmall.com/search_product.htm?q='
      }
    }
  },
  computed: mapState(['user']),
  methods: {
    handleEnter () {
      isEnter = !isEnter
      if (isEnter) {
        setTimeout(() => {
          isEnter && this.search()
          isEnter = false
        }, 400)
      }
    },
    search () {
      const w = this.keyword.trim().replace(/\s/g, '+')
      if (!w) return
      this.sendMessage('translate', {
        customerId: this.user?.customerId,
        keyword: w,
        platformType: this.$platType
      }).then(
        (res) => {
          console.log(res)
          window.open(
            this.searchUrl[this.$platType] + gbk.URI.encodeURI(res.data)
          )
        },
        () => {
          window.open(this.searchUrl[this.$platType] + gbk.URI.encodeURI(w))
        }
      )
    }
  },
  mounted () { }
}
</script>
<style lang="scss" scoped>
.sniff-crx-bubble {
  &-search {
    width: 100%;
    height: 100px;
    background: #f9f9f9;
    padding: 10px;
    color: #232323;
  }

  &-tablebtn {
    margin-left: 10px;
    cursor: pointer;
    &.active .sniff-svg-icon {
      color: #f96113 !important;
    }
  }

  .ant-input {
    width: 175px;
    padding-right: 30px;
    background-color: transparent;

    ~.abs {
      right: 5px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>
