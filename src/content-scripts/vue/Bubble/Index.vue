<template>
  <div
    class="sniff-crx-bubble"
    :style="collapse ? mini : expand"
    v-drag="{ can: () => collapse && user, onDrag: (v) => (drag = v) }"
  >
    <div class="abs-wrap" @click="drag || (collapse = !collapse)">
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
      collapse: true,
      drag: false,
      expand: {
        height: '88px',
        width: '360px',
        borderRadius: '4px',
        transition: 'all .2s ease-in .05s , border-radius .15s ease-in'
      },
      mini: {
        height: '50px',
        width: '50px',
        borderRadius: '50%',
        transition: 'all .2s ease-in , border-radius .15s ease-in .1s',
        animation: 'bounce_a_bit 10s ease-in-out 10s infinite alternate'
      }
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
<style scoped lang="scss">
.sniff-crx-bubble {
  position: fixed;
  z-index: 200000000;
  right: 5%;
  top: 20px;
  overflow: hidden;
  background: #ffbb00;
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.2);
  padding: 10px 15px 10px 15px;
}
</style>
