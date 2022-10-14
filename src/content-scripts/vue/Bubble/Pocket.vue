<template>
  <div class="sniff-crx-bubble-pocket flex-col-bwn rel">
    <div class="sniff-crx-bubble-pocket-list">
      <slot></slot>
      <div
        v-for="v in list"
        :key="v.time"
        class="sniff-crx-bubble-pocket-item flex"
      >
        <div>
          <a :href="v.photoUrl" target="_blank">
            <img :src="v.photoUrl" alt="" />
          </a>
        </div>
        <div class="sniff-crx-bubble-pocket-desc flex-col">
          <a :href="v.productUrl" target="_blank" class="line--2">{{
            v.productName
          }}</a>
          <span class="sniff-crx-bubble-pocket-prop line--only">{{
            v.productSpecification
          }}</span>
        </div>
      </div>
    </div>
    <div class="sniff-crx-bubble-pocket-bottom flex-ter-bwn">
      <div>
        <span>{{ $t("数量") }}: </span>
        <span class="sniff-crx-bubble-pocket-num">{{ list.length }}{{ $t("件") }}</span>
      </div>
      <div>
        <a-button type="primary" :disabled="!user?.googleUrl">{{$t('查看谷歌表')}}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['list'],
  data () {
    return {}
  },
  computed: mapState(['lang', 'user']),
  methods: {
    deleteItem () {}
  }
}
</script>
<style lang="scss" scoped>
.sniff-crx-bubble {
  &-pocket {
    width: 100%;
    background: #fdfdfd;
    &-list {
      min-height: 200px;
      max-height: 360px;
      overflow: auto;
      color: #565656;
      line-height: 17px;
    }
    &-item {
      width:215px;
      height: 100px;
      background: #fefefe;
      margin-bottom: 1px;
      padding: 15px 5px 15px 10px;
      overflow: hidden;
      img {
        height: 40px;
        width: 40px;
        border-radius: 2px;
      }
      a {
        color: inherit !important;
      }
    }
    &-desc {
      margin-left: 10px;
      margin-top: 2px;
    }
    &-prop {
      margin: 16px 0 0 10px;
    }
    &-bottom {
      height: 60px;
      padding:0 10px;
      border-top: 1px solid #f4f4f4;
      font-size:14px;
      .ant-btn{
        height: 34px;
      }
    }
    &-num{
      font-weight: 500;
      color: #F96113;
    }
  }
}
</style>
