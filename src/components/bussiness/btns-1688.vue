<template>
  <div id="sniff-1688" class="flex" :class="plat + '-sniff'">
    <template>
      <a
        href="#"
        @click.prevent="() => buy()"
        class="flex"
        :class="{ loading }"
      >
        <template v-if="loading">
          <span v-if="canBuy">{{ $t("商品同步中") }}</span>
          <span v-else="">{{ $t("不支持采购") }}</span>
        </template>
        <template v-else>
          <img class="icon" src="../../assets/cart.png" alt="" />
          {{ $t("添加商品") }}
        </template>
      </a>
    </template>
  </div>
</template>

<script>
import $ from 'jquery'
import query1688, { query1688Rule2 } from '@/hook/1688'
import queryTb from '@/hook/taobao'
import queryTm from '@/hook/tmall'
export default {
  name: 'btns-1688',
  props: ['user', 'plat'],
  data () {
    return {
      sku: null,
      config: null,
      imgs: [],
      error: false,
      stared: false,
      loading: true,
      canBuy: true,
      ckbMap: {}
    }
  },
  watch: {
    user (v, o) {
      if (!o && v) {
        if (Object.keys(this.ckbMap).length === 0) {
          this.getDetail(1)
          this.record()
        }
      }
    }
  },
  methods: {
    record () {
      if (this.user.customerId) {
        const platformType = {
          1688: 'AM',
          '1688-new': 'AM',
          taobao: 'TB',
          tmall: 'TM'
        }[this.plat]
        this.sendMessage('record', {
          customerId: this.user.customerId,
          platformType,
          productDetailUrl: location.href
        })
      }
    },
    getDetail (n) {
      const platformType = ['1688', 'taobao', 'tmall'].find((v) =>
        this.plat.includes(v)
      )
      const data = {
        1688: {
          cookie: document.cookie,
          url: location.href,
          sti: this._content.detailData
        },
        taobao: {
          cookie: document.cookie,
          url: location.href
        },
        tmall: {
          cookie: document.cookie,
          url: location.href
        }
      }[platformType]
      this.sendMessage('getDetail', { platformType, data }).then((res) => {
        if (res.success && res.data?.length) {
          this.loading = false
          res.data.forEach((v) => {
            const { skuId } = v
            this.ckbMap[skuId] = v
          })
        } else {
          if (res.code === '24100004' || res.code === '24130002') {
            this.canBuy = false
          } else {
            if (n < 20) {
              this.getDetail(n + 1)
            } else {
              this.canBuy = false
            }
          }
        }
      })
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
      return dep[this.plat]
    },
    async buy () {
      if (this.loading) return
      await this.trigger()
      const query = this.findPlat()
      const skuList = query(this.sku)
      console.log(skuList)
      //
      if (!skuList.length) {
        this.$msg(this.$t('未选择商品规格'), 'error')
      } else {
        const commonProductItemList = skuList.map((v) => {
          return {
            productSku: this.ckbMap[v.id]?.productSku,
            orderQuantity: v.buyAmount,
            cartAdditionList: []
          }
        })
        console.log(commonProductItemList)
        this.sendMessage('addCart', {
          addCartSource: 2,
          commonProductItemList
        }).then((res) => {
          if (res.success) {
            this.$msg(this.$t('添加商品成功'))
          } else {
            this.$msg('添加失败', 'error')
          }
        })
      }
      setTimeout((e) => {
        this.trigger(true)
      }, 100)
    }
  },
  created () {
    this.detailData = this._content.detailData
    this.sku = this._content.sku
    if (this.plat === 'tmall') {
      this.sku = JSON.parse(
        [...$('script:not([src])')]
          .map((v) => $(v).html())
          .find((v) => v.includes('TShop.Setup'))
          .match(/TShop\.Setup\(((.|\n)*)\);\n\}\)\(\);/)[1]
      )?.valItemInfo.skuMap
    }
    console.log(this.sku)
  },
  mounted () {
    this.getDetail(1)
    this.record()
    $(
      '#detail .tb-summary .tb-item-info .tb-item-info-r .tb-property .tb-wrap'
    ).css('padding-left', '30px')
  }
}
</script>
<style lang="scss" scoped>
.tmall-sniff {
  margin-left: 65px;
}

#sniff-1688 {
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
    color: #fa6400;
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
  }

  .icon {
    height: 16px;
    margin-right: 5px;
    position: relative;
    top: -2px;
  }
}
</style>
