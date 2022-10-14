<template>
  <div class="sniff-crx-bubble-search flex-col-bwn">
    <div>
      <a-popover
        v-model="dropdown"
        trigger="click"
        placement="bottom"
        overlayClassName="sniff-crx-lang"
        :arrowPointAtCenter="true"
      >
        <span class="rel" style="cursor: pointer; height: 1px">
          <svg-icon
            name="切换语言"
            style="font-size: 16px; color: #565656"
          ></svg-icon>
          <span class="rel" style="color: #565656; top: -2px">
            {{ $t(langs.find((v) => v.value === lang).label) }}
          </span>
          <svg-icon
            class="rel"
            name="展开"
            style="font-size: 9px; color: #565656; top: -2px"
            :style="{ transform: `scale(${dropdown ? -1 : 1})` }"
          ></svg-icon>
        </span>
        <a-menu slot="content" id="sniff-popover">
          <a-menu-item
            v-for="v in langs"
            :key="v.value"
            @click="setLang(v)"
          >
            {{ $t(v.label) }}
          </a-menu-item>
        </a-menu>
      </a-popover>
    </div>
    <div class="flex">
      <a-input
        v-model="keyword"
        :placeholder="$t('搜索商品名或店舗名')"
        @keyup.enter="search"
      ></a-input>
      <div class="sniff-crx-bubble-tablebtn">
        <a-button @click="$store.commit('showModal', true)">T</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import gbk from '@/plugins/gbk.min.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dropdown: false,
      showModal: false,
      keyword: '',
      langs: [
        { label: '日语', value: 'ja' },
        // { label: '中文', value: 'zh' },
        // { label: '英语', value: 'en' }
        { label: '韩语', value: 'ko' }
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
    padding: 10px;
  }
}
#sniff-popover{
  border-radius:4px;
}
#sniff-popover .ant-menu-item {
  width: 100px;
  padding: 0px 10px;
  margin: 0;
  line-height: 30px;
  height: 30px;
  font-size:12px;
  &:hover{
    background: #FFFDFC;
    font-weight: 500;
    color: #F96113;
  }
}
</style>
