<template>
  <div class="sniff-crx-bubble-pocket flex-col-bwn rel">
    <slot></slot>
    <div v-if="!list.length" class="abs-wrap flex-cen" style="padding:100px 10px;color:#aaa;">
      {{$t('绑定谷歌表后即可选购商品')}}
    </div>
    <transition-group tag="div" name="list" class="sniff-crx-bubble-pocket-list">
      <div
        v-for="(v,i) in list"
        :key="v.time"
        class="sniff-crx-bubble-pocket-item flex rel"
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
        <div class="abs sniff-crx-bubble-pocket-drawer flex-center">
          <span @click="$emit('del',i)">
            <svg-icon name="删除"></svg-icon>
          </span>
        </div>
      </div>
    </transition-group>
    <div class="sniff-crx-bubble-pocket-bottom flex-ter-bwn">
      <div>
        <span>{{ $t("数量") }}: </span>
        <span class="sniff-crx-bubble-pocket-num">{{ list.length }}</span>
      </div>
      <div>
        <a-button type="black" :disabled="!user?.googleUrl" @click="jump">{{$t('查看谷歌表')}}</a-button>
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
    jump () {
      window.open(this.user?.googleUrl)
    }
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
    &-drawer{
      height: 100%;
      color: #fff;
      top:0;
      right: 0;
      background: rgba(0,0,0,.6);
      width: 20%;
      transition:all .2s ease-in-out;
      transform: translateX(100%);
      span{
        font-size:16px;
        cursor:pointer;
      }
    }
  }
}

.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.5s;
}

.sniff-crx-bubble-pocket-item:hover{
  .sniff-crx-bubble-pocket-drawer{
    transform: translateX(0);
  }
}
</style>
