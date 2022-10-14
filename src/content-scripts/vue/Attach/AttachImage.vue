<template>
  <div
    v-show="cur"
    ref="el"
    class="sniff-crx-attach-image"
    :style="{
      width: visible ? '40px' : '40px',
      left: left + 'px',
      top: top + 'px',
    }"
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
</template>

<script>
import $ from 'jquery'
import { beforeJump } from '@/utils/search-image/image'
import { debounce } from '@/utils/utils'
/**
 * 1. 创建按钮，绑定点击事件
 * 2. 鼠标移动到图片，找到图片元素，添加按钮到图片上
 * 3. 点击生成base64图片，传输到background
 * 4. 打开新搜图页
 */
export default {
  data () {
    return {
      icon: require('@/assets/sqire.png'),
      sources: ['1688', 'taobao'],
      source: null,
      visible: false,
      timer: '',
      plat: this._platform,
      cur: '',
      height: 0,
      width: 0,
      left: 0,
      top: 0
    }
  },
  methods: {
    show (target, { left, top, width, height }) {
      this.cur = target
      this.height = height
      this.width = width
      this.left = left + window.scrollX
      this.top = top + window.scrollY
    },
    hide () {
      this.cur = null
    },
    focus (v) {
      this.visible = v
    },
    search () {
      beforeJump(this)
    },
    toggle (v) {
      this.sendMessage('write', ['source', v]).then(() => {
        this.source = v
        this.search()
      })
    }
  },
  created () {
    this.sendMessage('read', 'source').then((res) => {
      this.source = res
    })
    // 先使用轮询替代，订阅模式需要 chrome.tabs 权限
    // setInterval(e => {
    //   this.sendMessage('read', 'source').then(res => {
    //     this.source = res
    //   })
    // }, 2000)
  },
  async mounted () {
    //
    const has = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(!!$('#_sniff_btn')[0])
      }, 100)
    })
    if (has) return
    //
    $('body').on('mouseover', (e) => {
      const [tar, x, y] = [e.target, e.clientX, e.clientY]
      if (this.$refs.el.contains(tar)) return
      let t = null
      const parent = $(tar).parent()
      //
      let imgs = [...parent.find('img')]
      if (this.plat === 'rakuten') {
        imgs = [...parent.find('a.image')].concat(imgs)
      }
      if (this.plat === '1688') {
        imgs = [...parent.find('.img')].concat(imgs)
      }
      //
      imgs.forEach((v) => {
        // 不同平台的图片位置还需在这里做下处理
        const el = customer(v, this.plat)
        if (!el) return
        const { left, top, height, width } = el.getBoundingClientRect()
        if (height < 70 || width < 70) return
        if (height * width > 760 * 760) return
        if (left <= x && left + width >= x && top <= y && top + height >= y) {
          t = [el, { left, top, width, height }]
        }
      })
      t ? this.show(...t) : this.hide()
    })
  }
}

function customer (el, plat) {
  if (plat === 'theckb') {
    // 在直行便中，商品图片的 data-goods 值是 ''
    if (el.dataset.goods ?? true) return
  }
  if (el.nodeName !== 'IMG') {
    // 使用 background 图片的商品
    const src = ($(el).css('background').match(/url\((.*)\)/) || '')[1]
    if (!src) return
    el.src = src.slice(1, -1)
  }
  return el
}
</script>

<style scoped lang="scss">
.sniff-crx-attach-image {
  position: absolute !important;
  height: 40px;
  width: 40px;
  z-index: 200000000 !important;
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
      width: 70% !important;
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
