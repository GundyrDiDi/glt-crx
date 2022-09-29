<template>
  <div>
    <div
      :id="$elemIds.attach"
      v-if="user"
      @mouseenter="focus(true)"
      @mouseleave="focus(false)"
      :style="{ width: visible ? '40px' : '40px' }"
    >
      <div class="flex-center img">
        <img :src="icon" @click="search()" />
      </div>
      <div class="abs popup" v-if="visible">
        <span
          class="btn"
          v-for="v in sources"
          :key="v"
          :class="{ selected: v === source }"
          @click="toggle(v)"
          >{{ v }}</span
        >
      </div>
    </div>
  </div>
  </template>

<script>
// data () {
//     return {
//       timer: '',
//       plat,
//       cur: '',
//       active: false,
//       height: 0,
//       width: 0
//     }
//   },
//   methods: {
//     search: v => beforeJump(v),
//     focus (bool) { this.active = bool }
//   },
//   mounted () {
//     console.log('attach')
//   }

export default {
  data () {
    return {
      icon: require('@/assets/sqire.png'),
      visible: false,
      sources: ['1688', 'taobao'],
      source: null
    }
  },
  methods: {
    focus (v) {
      this.visible = v
      this.$parent.focus(v)
    },
    search () {
      // this.source = 'pinduoduo'
      this.$parent.search(this.source)
    },
    toggle (v) {
      this.sendMessage('write', ['source', v]).then(() => {
        this.source = v
        this.search()
      })
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.sendMessage('read', 'source').then(res => {
      this.source = res
    })
    console.log(this.height)
    console.log(this.cur)
    // 先使用轮询替代，订阅模式需要 chrome.tabs 权限
    // setInterval(e => {
    //   this.sendMessage('read', 'source').then(res => {
    //     this.source = res
    //   })
    // }, 2000)
  }
}
</script>

  <style scoped lang="scss">
  #_sniff_btn {
    position: absolute !important;
    height: 40px !important;
    width: 40px !important;
    z-index: 10000 !important;
    display: none;
    background: #ffbb00 !important;
    border-radius: 3px !important;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1) !important;
    color: #000 !important;
    cursor: pointer !important;
    overflow: hidden !important;
    transition: all 0.15s ease-in-out !important;
    .img {
      height: 40px !important;
      width: 40px !important;
      > img {
        height: 70% !important;
        width:70% !important;
        background: #ffbb00 !important;
      }
    }
    .popup {
      top: 0;
      left: 40px;
      .btn {
        line-height: 40px !important;
        font-weight: bold !important;
        margin: 0 3px !important;
        font-size: 14px !important;
        &.selected {
          color: #df1515;
        }
        &:hover {
          color: #df2525;
        }
      }
    }
  }
  </style>
