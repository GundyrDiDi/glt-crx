<template>
  <div
    class="sniff-crx-bubble"
    v-drag="{ selector:'.sniff-crx-bubble-icon', can: () => !!user, onDrag: (v) => (drag = v) }"
  >
    <div class="abs sniff-crx-bubble-icon" @click="$emit('after',()=> drag || (collapse = !collapse))"></div>
    <div class="abs sniff-crx-bubble-box" :class="{collapse}">
      <div class="abs sniff-crx-bubble-close" @click="collapse=true">×</div>
      <Search></Search>
      <Pocket></Pocket>
    </div>
  </div>
</template>

<script>
import Pocket from './Pocket.vue'
import Search from './Search.vue'
import dragDrective from '@/directives/drag'

export default {
  props: ['user'],
  components: {
    Pocket,
    Search
  },
  directives: {
    drag: dragDrective
  },
  data () {
    return {
      collapse: false,
      drag: false
    }
  },
  watch: {
    user (v) {
      if (!v) {
        this.collapse = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sniff-crx-bubble {
  position: fixed;
  // 由于taobao商详的层级很高
  z-index: 200000000;
  right: 63%;
  top: 80px;
  padding-right:50px;
  font-size:12px;
  &-icon{
    width:50px;
    height:50px;
    border-radius:50%;
    background:#232323;
  }
  &-box{
    top:55px;
    right:-5px;
    width:220px;
    min-height: 300px;
    max-height:500px;
    background:#FDFDFD;
    transition:all .2s ease-in-out;
    overflow: hidden;
    &.collapse{
      min-height:0px;
      height:0;
    }
  }
  &-close{
    color: #565656;
    z-index:1;
    right: 12px;
    top: 0px;
    font-size: 30px;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
  @keyframes bounce_a_bit {
    0% {
      transform: translateY(-3px);
    }

    2% {
      transform: translateY(0px);
    }

    4% {
      transform: translateY(-3px);
    }

    6% {
      transform: translateY(0px);
    }
  }
  </style>
