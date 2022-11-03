<template>
  <div class="sniff-crx-bubble-pocket flex-col-bwn rel">
    <slot></slot>
    <div
      v-if="!list.length"
      class="abs-wrap flex-cen"
      style="padding: 100px 10px; color: #aaa; text-align:center"
    >
      <div class="abs arrow-d" v-show="!user?.googleUrl">
        <!-- <svg-icon name="指针"></svg-icon> -->
        <img src="@/assets/箭头.png" alt="">
      </div>
      <img class="abs" style="width:70px;height:50px;top:45px;" src="@/assets/装饰1.png" alt="">
      <div v-html="str"></div>
    </div>
    <transition-group
      tag="div"
      name="list"
      class="sniff-crx-bubble-pocket-list"
    >
      <div
        v-for="(v, i) in list"
        :key="v.time+v.productSpecification"
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
          <div class="wrap flex-center" @click="$emit('del', i)">
            <span>
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
    return {
    }
  },
  computed: {
    ...mapState(['lang', 'user']),
    str () {
      return this.$t('绑定X后即可选购商品').replace('X', `<span 
      style="color:#f96113;font-weight: 500;"
      >${this.$t('谷歌表')}</span>`)
    }
  },
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
      img {
        height: 40px;
        width: 40px;
        border-radius: 2px;
      }
      a {
        color: inherit !important;
      }
      &:hover .sniff-crx-bubble-pocket-drawer>div{
        opacity:1;
        transform: translateX(0);
      }
    }
    &-desc {
      width: 150px;
      margin-left: 10px;
      margin-top: 2px;
      transition: all 0.2s ease-in-out;
    }
    &-prop {
      margin: 16px 0 0 10px;
      background: #FBFBFB;
      padding-left: 10px;
      border-radius: 10px;
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
      width: 50px;
      >div{
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        transition: all 0.2s ease-in-out;
        transform: translateX(100%);
        cursor: pointer;
        opacity:0;
      }
      span {
        font-size: 16px;
      }
    }
  }
}

.arrow-d{
  font-size: 30px;
  right: 9px;
  top: -23px;
  img{
    height:80px;
    width:60px;
    animation: sniffzoom 1s  infinite;
  }
}

@keyframes sniffzoom{
  0%{
    transform: scale(.98) rotate(2deg);
  }
  50%{
    transform: scale(1) rotate(-2deg);
  }
  100%{
    transform: scale(.98) rotate(2deg);
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
