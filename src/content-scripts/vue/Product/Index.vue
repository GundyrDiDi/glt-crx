<template>
  <div id="_sniff_crx_product_" class="sniff-crx-product" :class="'sniff-crx--' + $platform">
    <a
      href="#"
      @click.prevent="e=>$emit('after',()=>buy(e))"
      class="flex ant-btn-black"
      :class="{ requesting }"
    >
      <template>
        {{ $t("我要代购") }}
      </template>
    </a>
  </div>
</template>
<script>
import $ from 'jquery'
import query1688, { query1688Rule2 } from './hook/1688'
import queryTb from './hook/taobao'
import queryTm from './hook/tmall'
import { forTable } from '@/content-scripts/main/detailData'
import { wait } from '@/utils/utils'

export default {
  props: ['user'],
  data () {
    return {
      imgs: [],
      requesting: false,
      canBuy: true,
      ckbSkuMap: {}
    }
  },
  methods: {
    record () {
      if (this.user?.customerId) {
        this.sendMessage('record', {
          customerId: this.user.customerId,
          platformType: this.$platType,
          productDetailUrl: location.href
        })
      }
    },
    trigger (close) {
      if (close) return $('.order-has-select-button').trigger('click')
      return new Promise((resolve) => {
        if ($('.selected-list-wrapper .selected-item-wrapper').length) {
          resolve()
        } else {
          $('.order-has-select-button').trigger('click')
          setTimeout(() => {
            resolve()
          }, 100)
        }
      })
    },
    findPlat () {
      const dep = {
        '1688-new': query1688,
        1688: query1688Rule2,
        taobao: queryTb,
        tmall: queryTm
      }
      return dep[this.$platform]
    },
    async buy (e) {
      if (this.requesting) return
      this.requesting = true
      await this.trigger()
      setTimeout(() => {
        this.trigger(true)
      }, 50)
      const query = this.findPlat()
      const skuList = query()
      console.log(skuList)
      //
      if (!skuList.length) {
        this.$msg('未选择商品规格', 'error')
        this.requesting = false
      } else {
        const data = forTable(skuList)
        const { left, top, height, width } = $('.sniff-crx-bubble-icon')[0].getBoundingClientRect()
        this.$store.commit('setParabola', {
          src: (skuList.length > 1 ? window.$detail.productImg : skuList[0].photoUrl) || window.$detail.productImg,
          p1: [e.x, e.y],
          p3: [left + width / 2, top + height / 2]
        })
        const list = this.$store.state.sheetData
        await wait(1000, this.sendMessage('updateSheetData', { addItems: data })).then(() => {
          this.$msg('写入成功')
          this.sendMessage('write', ['sheetData', list.concat(data)])
        }, e => {
          this.$msg('写入失败', 'error')
        })
        this.requesting = false
      }
    }
  },
  mounted () {
    this.record()
    $(
      '#detail .tb-summary .tb-item-info .tb-item-info-r .tb-property .tb-wrap'
    ).css('padding-left', '30px')
  }
}
</script>
<style lang="scss" scoped>

#_sniff_crx_product_.sniff-crx-product {
  margin-top: 15px;
  float: left;
  margin-bottom: 23px;

  > a {
    text-decoration: none;
    display: block;
    margin-right: 21px;
    overflow: hidden;
    width: 200px;
    height: 38px;
    line-height: 38px;
    border-radius: 4px;
    color:#fff;
    font-size: 16px;
    text-align: center;
    transition: background .2s;

    &.requesting {
      pointer-events: none;
      border-color: #f2f2f2;
      background: #ddd !important;
    }
  }

  .icon {
    height: 16px;
    margin-right: 5px;
    position: relative;
    top: -2px;
  }
}
</style>
