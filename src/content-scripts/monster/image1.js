// 所有页面都会执行
// 1.判断图片源是否跨域 2.获取图片数据(统一base64格式便于传输) 3.跳转对应平台 4.平台调用搜索
import $ from 'jquery'
import md5 from 'md5'
import { serizeR } from '@/common/util'
import Cookies from '@/common/plugins/cookie'
import axios from 'axios'
import { createVue } from '../vue'
import Loading from './loading'
import ImgBtn from './AttachImage.vue'

const _axios = axios.create({
  withCredentials: true
})

function find (el, plat) {
  const $el = $(el)
  const c = $el.find('>img')[0]
  const n = $el.next()[0]
  const p = $el.prev()[0]
  // 平台规则 乐天
  if (plat === 'rakuten' && $el.hasClass('image')) {
    const src = ($el.css('background').match(/url\((.*)\)/) || '')[1]
    if (src) {
      el.src = src.slice(1, -1)
      return el
    }
  }
  // 1688
  if (plat === '1688') {
    if ($el.hasClass('scale-img')) {
      const img = $el.next().next()
      return img[0]
    }
    if ($el.hasClass('is-video-container')) {
      const img = $el.next().children()[0]
      return img
    }
    if ($el.hasClass('img')) {
      const src = ($el.css('background').match(/url\((.*)\)/) || '')[1]
      if (src) {
        el.src = src.slice(1, -1)
        return el
      }
    }
  }
  // cantonfair
  if (plat === 'cantonfair') {
    if ($el.attr('data-set-raw-src')) {
      const src = $el.attr('data-set-raw-src')
      el.src = src
      return el
    }
  }

  // todo: 不应该有顺序之分
  if (el && el.nodeName === 'IMG') return el
  if (c && c.nodeName === 'IMG') return c
  if (n && n.nodeName === 'IMG') return n
  if (p && p.nodeName === 'IMG') return p
}

export default class Observe {
  constructor (plat, el = document.body) {
    this.getImgData()
    if (!plat) {
      return
    } else {
      this.searchImg()
    }
    // 加入搜索按钮
    this.plat = plat
    this.timer = null
    this.cur = null
    this.active = false
    this.createNode()
    /* mouseover 优先于 mouseenter 触发 */
    el.addEventListener('mouseover', e => {
      setTimeout(() => {
        if (this.active) return
        // 比如有遮罩层元素就需要查看左右元素是否是img，以及子元素的可能性，todo:使用background属性
        const p = find(e.target, plat)
        if (p && p !== this.cur) {
          this.timer = setTimeout(() => {
            this.show(p)
          }, 20)
        }
      }, 10)
    })
    /* mouseout 优先于 mouseleave 触发 */
    el.addEventListener('mouseout', e => {
      if (this.active) return
      setTimeout(() => {
        if (this.active) return
        clearTimeout(this.timer)
        this.hide()
      }, 10)
    })
  }

  show (target) {
    const { top, left, height, width } = target.getBoundingClientRect()
    if (height < 60 || width < 60) return
    if (height * width > 760 * 760) return
    this.cur = target
    this.height = height
    this.width = width
    // todo:不同平台的商品位置规则，特殊情况
    // 直行便规则
    if (this.plat === 'theckb') {
      if (target.dataset.goods ?? true) return
    }
    $('#_sniff_btn').css({
      display: 'block',
      left: left + window.scrollX,
      top: top + window.scrollY
    })
  }

  hide () {
    this.cur = null
    $('#_sniff_btn').css('display', 'none')
  }
}
