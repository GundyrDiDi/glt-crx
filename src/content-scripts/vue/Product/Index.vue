<template>
  <div id="_sniff_crx_product_" class="sniff-crx-product" :class="'sniff-crx--' + $platform">
    <a href="#" @click.prevent="(e) => $emit('after', () => addCart(e))" class="flex" :class="{ requesting }">
      {{ $t('加购到直行便') }}
    </a>
    <a href="#" @click.prevent="(e) => $emit('after', () => buy(e))" class="flex" :class="{ requesting }">
      <template>
        <svg-icon class="sniff-crx-product-logo" name="编组16"></svg-icon>
        {{ $t("我要代购") }}
      </template>
    </a>
  </div>
</template>
<script>
import $ from 'jquery'
import query1688, { query1688Rule2 } from './utils/1688'
import queryTb from './utils/taobao'
import queryTm from './utils/tmall'
import { forTable } from '@/content-scripts/main/detailData'
import { wait } from '@/utils/utils'
import { mapState } from 'vuex'
import { createPdt } from './utils/parsePdt'

export default {
  data () {
    return {
      imgs: [],
      requesting: false,
      canBuy: true,
      ckbSkuMap: {},
      product: {},
      matchSku: () => {}
    }
  },
  computed: mapState(['sheetData', 'user']),
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
      if (this.sheetData.length >= 999) return
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
        const { left, top, height, width } = $(
          '.sniff-crx-bubble-icon'
        )[0].getBoundingClientRect()
        const imgSrc = skuList[0].photoUrl || window.$detail.productImg
        this.$store.commit('setParabola', {
          src: imgSrc,
          p1: [e.x, e.y],
          p3: [left + width / 2, top + height / 2]
        })
        console.log(data)
        const list = this.$store.state.sheetData
        await wait(
          1000,
          this.sendMessage('updateSheetData', { addItems: data })
        ).then(
          () => {
            this.$msg('写入成功')
            this.sendMessage('write', ['sheetData', list.concat(data)])
          },
          (e) => {
            this.$msg('写入失败', 'error')
            this.sendMessage('updateSheetData')
          }
        )
        this.requesting = false
      }
    },
    async addCart (e) {
      if (this.requesting) return
      if (this.sheetData.length >= 999) return
      this.requesting = true
      await this.trigger()
      setTimeout(() => {
        this.trigger(true)
      }, 50)
      // todo: 验证 orderList
      const orderList = this.matchSku()
      console.log(orderList)
      //
      if (!orderList.length) {
        this.$msg('未选择商品规格', 'error')
        this.requesting = false
      } else {
        // 加购动画
        const { left, top, height, width } = $(
          '.sniff-crx-bubble-icon'
        )[0].getBoundingClientRect()
        const imgSrc = window.$detail.productImg
        this.$store.commit('setParabola', {
          src: imgSrc,
          p1: [e.x, e.y],
          p3: [left + width / 2, top + height / 2]
        })
        // todo:调取加购接口
        this.requesting = false
      }
    }
  },
  async mounted () {
    this.record()
    $(
      '#detail .tb-summary .tb-item-info .tb-item-info-r .tb-property .tb-wrap'
    ).css('padding-left', '30px')
    const pdt = createPdt(this.$platform.replace(/-.*$/, ''), this.product, {})
    await pdt.parse()
    await pdt.createSku()
    this.matchSku = pdt.matchSku
    console.log(this.product)
  }
}
</script>
<style lang="scss" scoped>
#_sniff_crx_product_ {
  // &.sniff-crx--1688,&.sniff-crx--1688-new{
  //   >a{
  //     width:180px !important;
  //   }
  // }
  // &.sniff-crx--tmall{
  //   >a{
  //     width:180px !important;
  //   }
  // }
}

#_sniff_crx_product_ {
  margin-top: 15px;
  display: flex;
  float: left;
  margin-bottom: 23px;

  >a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 21px;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background: #232323;
    border-color: #232323;
    border-radius: 40px;
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.2s;
    overflow: hidden;

    &.requesting {
      pointer-events: none;
      border-color: #f2f2f2;
      background: #ddd !important;

      .sniff-crx-product-logo {
        opacity: .2;
      }
    }

    .sniff-crx-product-logo {
      font-size: 28px;
      margin-right: 10px;
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
