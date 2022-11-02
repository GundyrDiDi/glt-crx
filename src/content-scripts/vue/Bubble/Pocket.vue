<template>
  <div class="sniff-crx-bubble-pocket flex-col-bwn rel">
    <slot></slot>
    <div
      v-if="!list.length"
      class="abs-wrap flex-cen"
      style="padding: 100px 10px; color: #aaa; text-align:center"
    >
      <div class="abs arrow-d" v-show="!user?.googleUrl">
        <svg-icon name="指针"></svg-icon>
      </div>
      {{ $t("绑定谷歌表后即可选购商品") }}
    </div>
    <transition-group
      tag="div"
      name="list"
      class="sniff-crx-bubble-pocket-list"
    >
      <div
        v-for="(v, i) in list"
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
        <div class="abs sniff-crx-bubble-pocket-drawer">
          <div class="wrap flex-center">
            <span @click="$emit('del', i)">
              <svg-icon name="删除"></svg-icon>
            </span>
          </div>
        </div>
      </div>
    </transition-group>
    <div class="sniff-crx-bubble-pocket-bottom flex-ter-bwn">
      <div>
        <span>{{ $t("数量") }}: </span>
        <span class="sniff-crx-bubble-pocket-num">{{ list.length }}</span>
      </div>
      <div>
        <a-button type="black" :disabled="!user?.googleUrl" @click="jump">{{
          $t("查看谷歌表")
        }}</a-button>
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
      overflow-x:hidden;
      color: #565656;
      line-height: 17px;
    }
    &-item {
      width: 220px;
      height: 100px;
      background: #fefefe;
      margin-bottom: 1px;
      padding: 15px 5px 15px 10px;
      // overflow: hidden;
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
      transition: all 0.2s ease-in-out;
    }
    &-prop {
      margin: 16px 0 0 10px;
    }
    &-bottom {
      height: 60px;
      padding: 0 10px;
      border-top: 1px solid #f4f4f4;
      font-size: 14px;
      .ant-btn {
        height: 34px;
      }
    }
    &-num {
      font-weight: 500;
      color: #f96113;
    }
    &-drawer {
      height: 100%;
      top: 0;
      right: 0px;
      width: 60px;
      >div{
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        transition: all 0.2s ease-in-out;
        transform: translateX(100%);
        opacity:0;
      }
      &:hover>div{
        opacity:1;
        transform: translateX(0);
      }
      span {
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
}

.arrow-d{
  font-size: 30px;
  transform: rotate(207deg);
  color: orangered;
  right: 15px;
  top: -20px;
  >svg{
    animation: zoom 1s  infinite;
  }
}

@keyframes zoom{
  0%{
    transform: scale(.9) rotate(1deg);
  }
  50%{
    transform: scale(1) rotate(-1deg);
  }
  100%{
    transform: scale(.9) rotate(1deg);
  }
}

.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) !important;
}
.list-move {
  transition: transform 0.5s;
}
</style>
