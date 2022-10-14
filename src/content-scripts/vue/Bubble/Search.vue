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
        <span
          class="rel"
          style="cursor: pointer; height: 10px; display: inline-flex"
        >
          <svg-icon
            name="切换语言"
            style="font-size: 16px; color: #565656"
          ></svg-icon>
          <span class="rel" style="color: #565656; top: -2px; margin-left: 3px">
            {{ $t(langs.find((v) => v.value === lang).label) }}
          </span>
          <svg-icon
            class="rel"
            name="展开"
            style="font-size: 9px; color: #565656; top: 4px; left: 2px"
            :style="{ transform: `scale(${dropdown ? -1 : 1})` }"
          ></svg-icon>
        </span>
        <a-menu slot="content" id="sniff-popover">
          <a-menu-item v-for="v in langs" :key="v.value" @click="setLang(v)">
            {{ $t(v.label) }}
          </a-menu-item>
        </a-menu>
      </a-popover>
    </div>
    <div class="flex-ter">
      <div class="flex-ter rel">
        <a-input
          v-model="keyword"
          :placeholder="$t('搜索商品名或店舗名')"
          @keyup.enter="handleEnter"
        ></a-input>
        <div class="abs" @click="search">
          <svg-icon name="搜索"></svg-icon>
        </div>
      </div>
      <div class="sniff-crx-bubble-tablebtn"
      :class="{active:user?.googleUrl}"
      @click="$store.commit('showModal', true)">
        <svg-icon name="谷歌表" style="font-size:20px;"></svg-icon>
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
      this.sendMessage('write', ['lang', v.value])
      this.dropdown = false
    },
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
    color: #232323;
  }
  &-tablebtn{
    margin-left:10px;
    cursor:pointer;
    &.active{
      color: #F96113;
    }
  }
  .ant-input {
    padding-right: 30px;
    ~ .abs {
      right: 5px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
#sniff-popover {
  border-radius: 4px;
}
#sniff-popover .ant-menu-item {
  width: 100px;
  padding: 0px 10px;
  margin: 0;
  line-height: 30px;
  height: 30px;
  font-size: 12px;
  &:hover,
  &.ant-menu-item-selected {
    background: #fffdfc;
    font-weight: 500;
    color: #f96113;
  }
}
</style>
