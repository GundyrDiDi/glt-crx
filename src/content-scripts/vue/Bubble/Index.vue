<template>
  <div
    class="sniff-crx-bubble"
    v-drag="{ selector:'.sniff-crx-bubble-icon', can: () => !!user, onDrag: (v) => (drag = v) }"
  >
    <div class="abs sniff-crx-bubble-icon" @click="$emit('after',()=> drag || (collapse = !collapse))">
      <svg-icon name="购物袋" :class="{droping}"></svg-icon>
      <div class="sniff-crx-bubble-count" v-show="list.length>0">{{list.length}}</div>
    </div>
    <div class="abs sniff-crx-bubble-box" :class="{collapse}">
      <div class="abs sniff-crx-bubble-close" @click="collapse=true"
      @contextmenu.prevent="logout"
      >
        <svg-icon name="关闭"></svg-icon>
      </div>
      <Search></Search>
      <Pocket :list="list" @del="deleteItem">
        <div v-if="loading" class="abs-wrap flex-center" style="background: rgba(255,255,255,.2);z-index: 1;">
          <a-spin style="margin-top:-40px"/>
        </div>
      </Pocket>
    </div>
    <GoogleModal v-if="user"/>
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
  computed: {
    ...mapState(['lang', 'user', 'parabola', 'sheetData']),
    loading () {
      // 获取sheet中
      return this.sheetData === true
    }
  },
  data () {
    return {
      collapse: false,
      drag: false,
      droping: false,
      list: []
    }
  },
  watch: {
    user: {
      handler (v, o) {
        if (!v) {
          this.collapse = true
        }
        if (o?.googleUrl !== v?.googleUrl) {
          this.sendMessage('updateSheetData')
        }
      },
      immediate: true
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
    },
    sheetData (v) {
      if (Array.isArray(v)) {
        this.list = v
      }
    }
  },
  methods: {
    deleteItem (i) {
      console.log(this.list[i].time)
      const timeHeader = this.list[i].time
      const skuNameHeader = this.list[i].productSpecification
      this.list.splice(i, 1)
      this.sendMessage('write', ['sheetData', this.list])
      this.sendMessage('updateSheetData', {
        delItem: {
          timeHeader,
          skuNameHeader
        }
      }).catch((res) => {
        this.$msg('删除失败', 'error')
        this.sendMessage('updateSheetData')
      })
    },
    logout () {
      this.sendMessage('write', ['userData', {}])
    }
  }
}
</script>
<style lang="scss" scoped>
.sniff-crx-bubble {
  position: fixed;
  // 由于taobao商详的层级很高
  z-index: 200000000;
  right: 5%;
  top: 90px;
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
  &-count{
    position: absolute;
    top: -2px;
    right: -6px;
    height: 18px;
    min-width: 18px;
    background: #E83D51;
    border-radius: 8px;
    color: #fff;
    padding: 0 4px;
    line-height: 18px;
    font-size:12px;
    pointer-events: none;
    text-align: center;
    white-space: nowrap;
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
    top: 10px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    &:hover{
      color:#232323;
    }
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
