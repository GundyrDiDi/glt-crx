<template>
  <div
    class="sniff-crx-bubble"
    v-drag="{ selector:'.sniff-crx-bubble-icon', can: () => !!user, onDrag: (v) => (drag = v) }"
  >
    <div class="abs sniff-crx-bubble-icon" @click="$emit('after',()=> drag || (collapse = !collapse))">
      <svg-icon name="购物袋" :class="{droping}"></svg-icon>
    </div>
    <div class="abs sniff-crx-bubble-box" :class="{collapse}">
      <div class="abs sniff-crx-bubble-close" @click="collapse=true">×</div>
      <Search></Search>
      <Pocket :list="list">
        <div v-if="loading" class="abs-wrap flex-center" style="background: rgba(255,255,255,.2);z-index: 1;">
          <a-spin/>
        </div>
      </Pocket>
    </div>
    <GoogleModal/>
  </div>
</template>

<script>
import Pocket from './Pocket.vue'
import Search from './Search.vue'
import GoogleModal from './GoogleModal.vue'
import dragDrective from '@/directives/drag'
import { mapState } from 'vuex'

export default {
  components: {
    Pocket,
    Search,
    GoogleModal
  },
  directives: {
    drag: dragDrective
  },
  computed: mapState(['lang', 'user', 'parabola']),
  data () {
    return {
      collapse: false,
      drag: false,
      list: [],
      loading: false,
      droping: false
    }
  },
  watch: {
    user (v) {
      if (!v) {
        this.collapse = true
      }
    },
    parabola (v) {
      if (v) {
        setTimeout(() => {
          this.droping = true
          setTimeout(() => {
            this.droping = false
          }, 100)
        }, 900)
      }
    }
  },
  methods: {
    getList () {
      // this.loading = true
      this.list = []
      // this.sendMessage('request', [
      //   'getGoogleTable',
      //   { googleUrl: this.user.googleUrl, googleHeaderData: 'time,photoUrl,productUrl,productName,productSpecification' }
      // ]).then((res) => {
      //   this.list = res.data
      //   this.loading = false
      //   console.log(res)
      // })
    },
    deleteItem () {
      this.sendMessage('request', ['deleteGoogleTable']).then((res) => {})
    }
  },
  created () {
    this.getList()
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
    animation: bounce_a_bit 10s ease-in-out infinite alternate;
    svg{
      font-size:50px;
      border-radius:50%;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.2);
      transition: all .1s ease-out;
    }
    .droping{
      transform:translateY(4px);
    }
  }
  &-box{
    top:55px;
    right:-5px;
    width:220px;
    transform:scaleY(1);
    transform-origin: top center;
    background:#FDFDFD;
    transition:all .2s ease-in-out;
    overflow: hidden;
    box-shadow: 0px 2px 4px 0px #DEDEDE;
    border-radius:8px;
    &.collapse{
      transform:scaleY(0);
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
