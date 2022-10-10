<template>
  <div v-if="user" class="sniff-crx-product" :class="'sniff-crx-product-' + _platform">
    <a
      href="#"
      @click.prevent="() => buy()"
      class="flex"
      :class="{ loading, requesting }"
    >
      <template v-if="loading">
        <span v-if="canBuy">{{ $t("商品同步中") }}</span>
        <span v-else="">{{ $t("不支持采购") }}</span>
      </template>
      <template v-else>
        <img class="icon" src="@/assets/cart.png" alt="" />
        {{ $t("添加商品") }}
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
export default {
  props: ['user'],
  data () {
    return {
      imgs: [],
      loading: false,
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
      return dep[this._platform]
    },
    async buy () {
      if (this.loading) return
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
        const googleUrl = this.user.googleUrl ?? 'https://docs.google.com/spreadsheets/d/1IUgN7BqlmovmhOjKcro1uPN_D83hg2vjEFmRhZB04OY/edit#gid=568775841'
        console.log({ googleUrl, data })
        await this.sendMessage('test', { googleUrl, data }).then((res) => {
          this.$msg('写入成功')
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
.sniff-crx-product {
  &-tmall {
    margin-left: 65px;
  }
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
    background: #fff;
    border-radius: 4px;
    border: 1px solid #fa6400;
    color: #fa6400 !important;
    font-size: 16px;
    text-align: center;

    &:hover:not(.loading) {
      background: #fffbf0;
      box-shadow: 0 1px 3px 0 #e19d299e;
    }

    &:active:not(.loading) {
      background: #fffbf0;
    }

    &.loading {
      font-size: 12px;
      color: #ccc;
      cursor: not-allowed;
    }
    &.requesting {
      pointer-events: none;
      border-color: #f2f2f2;
      color: #ddd !important;
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
