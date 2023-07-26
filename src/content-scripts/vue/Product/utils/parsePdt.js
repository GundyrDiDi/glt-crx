import $ from 'jquery'
import md5 from 'md5'

import { tmGoodsApi } from './useApi'
import { $async, getSrcWin, anagrams, getUrlParams, sliceImgUrl, until } from './useExt'

const PLATS = {
  taobao: 'taobao',
  tmall: 'tmall',
  ali88: '1688'
}

const ali88 = (
  product,
  skuMap,
  pkey,
  noSku
) => {
  // 1688需要点击sku弹窗
  const triggerClick = (close) => {
    if (close) return $('.order-has-select-button').trigger('click')
    return new Promise((resolve) => {
      if ($('.selected-list-wrapper .selected-item-wrapper').length) {
        resolve(1)
      } else {
        $('.order-has-select-button').trigger('click')
        setTimeout(() => {
          resolve(1)
        }, 100)
      }
    })
  }
  return {
    async getInsertDom () {
      const el = await $async('.order-button-children')
      el.css('display', 'block')
      return el
    },
    async parse () {
      const { skuModel, tempModel, images, orderParamModel } = await getSrcWin('__GLOBAL_DATA')
      product.productCode = `${pkey}-${tempModel.offerId}`
      product.productName = document.title
      product.productCate = tempModel.postCategoryId
      product.productMainImg = images
        ? images[0]?.fullPathImageURI
        : await until(() => $('.detail-gallery-img:only-child').attr('src'))
      product.shopName =
        (await $async('#hd_0_container_0 [title]')).attr('title') ?? ''
      product.minPrice = () =>
                skuModel.skuPriceScale?.split('-').shift().trim() || '0'
      skuModel.orderParamModel = orderParamModel
      product.skuModel = skuModel
    },
    createSku () {
      const map = product.skuModel?.skuInfoMap
      const props = product.skuModel?.skuProps
      const scalePrice = product.minPrice()
      if (map.length === 0) {
        const decode = product.productCode + '0'
        skuMap[noSku] = {
          decode,
          productSku: md5(decode),
          productPropertiesName: '规格:默认',
          productSkuImg: '',
          productSellPrice: scalePrice
        }
      } else {
        const propMap = {}
        props.forEach((item) => {
          const { prop, value } = item
          value.forEach((v) => {
            const { imageUrl, name } = v
            propMap[name] = `${prop}:${name}`
            if (imageUrl) {
              propMap[`img-${name}`] = imageUrl
            }
          })
        })
        Object.entries(map).forEach(([key, item]) => {
          const { skuId, discountPrice, price } = item
          const decode = `${product.productCode}${skuId}`
          const names = key.split('&gt;')
          skuMap[key] = {
            decode,
            productSku: md5(decode),
            productPropertiesName: names.map((v) => propMap[v]).join(';'),
            productSkuImg:
              names.reduce((acc, v) => acc || propMap[`img-${v}`], '') ?? '',
            productSellPrice: discountPrice || price || scalePrice
          }
        })
      }
      console.log(skuMap)
    },
    async matchSku () {
      await triggerClick()
      const orderList = []
      if (skuMap[noSku]) {
        const num = parseInt(
          ($('.total-count').html()?.match(/\d+/) || [''])[0]
        )
        orderList.push({
          ...skuMap[noSku],
          orderQuantity: num
        })
      } else {
        const trs = $('.selected-list-wrapper .selected-item-wrapper')
        trs.each((i, tr) => {
          const firstName = $(tr).find('.name').html()
          const lis = $(tr).find('.children-item .children-wrapper')
          lis.each((i, li) => {
            const names = [firstName]
            const name = $(li).find('span').attr('title')
            if (name) {
              names.push(name)
            }
            const skuKey = names.join('&gt;')
            if (skuMap[skuKey]) {
              orderList.push({
                ...skuMap[skuKey],
                orderQuantity: parseInt(
                  ($(li)
                    .find('span')
                    .text()
                    .match(/\((\d+)\)$/) ?? '')[1]
                )
              })
            }
          })
        })
      }
      triggerClick(true)
      return orderList
    }
  }
}

const taobao = (
  product,
  skuMap,
  pkey,
  noSku
) => {
  const getInsertDom = async () => {
    return $async('.tb-skin')
  }

  const parse = async () => {
    product.productCode = `${pkey}-${getUrlParams().id}`
    const cate = ((
      await until(() => $('script[exparams]').attr('exparams'))
    ).match(/category=item(.+?)&/) ?? [])[1].replace(/%.{2}/, '')
    product.productCate = cate
    product.productName = document.title.replace(/-淘宝网$/, '')
    const img = await until(() => $('.tb-pic img').attr('src'))
    product.productMainImg = sliceImgUrl(img) ?? ''
    product.minPrice = () =>
      ($('#J_PromoPriceNum').text() || $('.tb-rmb-num').text() || '0')
        .split('-')
        .shift()
        .trim()
    product.shopName = await until(
      () =>
        $('.shop-name-title[title]').attr('title') ||
        $('.tb-shop-name [title]').attr('title')
    )
    product.skuModel = (await getSrcWin('Hub?.config?.config?.sku?.valItemInfo')).skuMap
  }

  const createSku = async () => {
    const map = product.skuModel
    if (!map) {
      const decode = product.productCode + '0'
      skuMap[noSku] = {
        decode,
        productSku: md5(decode),
        productPropertiesName: '规格:默认',
        productSkuImg: '',
        productSellPrice: product.minPrice()
      }
    } else {
      const props = []
      $('[data-property]').each((i, v) => {
        const prop = []
        const name = $(v).attr('data-property')
        $('li', v).each((i, v2) => {
          const value = $(v2).attr('data-value')
          const nameValue = $('a span', v2).html()
          const a = ($('a', v2)
            .css('background')
            .match(/url\("(.*)"\)/) ?? [])[1]
          prop.push({
            value,
            propName: `${name}:${nameValue}`,
            img: sliceImgUrl(a)
          })
        })
        props.push(prop)
      })
      const t = assemble(props)
      assort(
        product,
        skuMap,
        t,
        map,
        (v) => `;${v};`,
        (skuId, propValue) => propValue.join(';')
      )
    }
  }
  const matchSku = async () => {
    const num = parseInt($('#J_IptAmount').val())
    if (skuMap[noSku]) {
      return [
        {
          ...skuMap[noSku],
          orderQuantity: num
        }
      ]
    }
    const selected = [...$('.J_Prop .tb-selected')]
    const key = selected.map((v) => $(v).attr('data-value')).join(';')
    if (skuMap[key]) {
      return [
        {
          ...skuMap[key],
          productSellPrice:
            $('#J_PromoPriceNum').text() || $('.tb-rmb-num').text(),
          orderQuantity: num
        }
      ]
    }
    return []
  }

  return {
    getInsertDom,
    parse,
    createSku,
    matchSku
  }
}

const tmall = (
  product,
  skuMap,
  pkey,
  noSku
) => {
  // 前置，如果v1需要到v2，直接跳转
  product.version = location.href.includes('item.htm') ? 2 : 1
  const upt = product.version === 2
  //
  const getInsertDom = async () => {
    return until(() =>
      upt ? $('[class*="BasicContent--itemInfo"]') : $('.tb-sku .tb-action')
    )
  }

  const parse = async () => {
    const cate = ((
      await until(() => $('script[exparams]').attr('exparams'))
    ).match(/category=item(.+?)&/) ?? [])[1].replace(/%.{2}/, '')

    product.productCate = cate
    if (upt) {
      product.productMainImg = await until(() =>
        $('[class*="PicGallery--thumbnail"] img').attr('src')
      )
    } else {
      product.productMainImg = await until(() =>
        $('#J_UlThumb img').attr('src')
      )
      product.shopName = await until(() => $('.shopLink').html())
    }
    product.minPrice = () =>
      (
        $('[class*="Price--extraPriceText"]').html() ||
        $('[class*="Price--priceText"]').html() ||
        '0'
      )
        .split('-')
        .shift()
        .trim()
    product.skuModel = {}
    product.productCode = `${pkey}-${getUrlParams().id}`
    product.productName = document.title.replace(/-tmall.*$/, '')
  }

  const createSku = async () => {
    const { props, skus, shopName } = await tmGoodsApi()
    product.shopName = product.shopName || shopName
    console.log(props, skus)
    if (skus?.length === 0) {
      const decode = product.productCode + '0'
      skuMap[noSku] = {
        decode,
        productSku: md5(decode),
        productPropertiesName: '规格:默认',
        productSkuImg: '',
        productSellPrice: product.minPrice()
      }
    } else if (props && skus) {
      const map = skus.reduce(
        (acc, { propPath, skuId }) => {
          acc[propPath] = { skuId }
          return acc
        },
        {}
      )
      const tmProps = []
      props.forEach((v) => {
        const { pid, name, values } = v
        const prop = []
        values.forEach((v) => {
          const { name: nameValue, vid, image } = v
          prop.push({
            value: pid + ':' + vid,
            propName: `${name}:${nameValue}`,
            img: image
          })
        })
        tmProps.push(prop)
      })
      const t = assemble(tmProps)
      assort(product, skuMap, t, map)
      console.log(skuMap)
      return true
    } else {
      // msg.error('读取商品sku失败')
      return false
    }
  }

  const matchSku = async () => {
    const orderQuantity = parseInt($('input.countValueForPC').val())
    if (skuMap[noSku]) {
      return [
        {
          ...skuMap[noSku],
          orderQuantity
        }
      ]
    }
    const key = getUrlParams().skuId
    if (skuMap[key]) {
      return [
        {
          ...skuMap[key],
          productSellPrice:
            $('[class*="Price--extraPriceText"]').html() ||
            $('[class*="Price--priceText"]').html() ||
            '0',
          orderQuantity
        }
      ]
    }
    return []
  }

  return {
    getInsertDom,
    parse,
    createSku,
    matchSku
  }
}

/** 通过规格组合排列skuList */
const assemble = (props) => {
  return props.reduce(
    (acc, v) => {
      const res = []
      acc.forEach((v2) => {
        v.forEach((v3) => {
          res.push({
            value: v2.value.concat(v3.value),
            propName: v2.propName.concat(v3.propName),
            img: v2.img ?? v3.img
          })
        })
      })
      return res
    },
    [{ value: [], propName: [] }]
  )
}

/** 通过 skuList 创建 skuMap */
const assort = (
  product,
  skuMap,
  t,
  map,
  temp = (v) => v,
  keyback = (skuId) => skuId
) => {
  console.log(t)
  console.log(map)
  t.forEach((v) => {
    const { value, propName, img } = v
    const keys = anagrams(v.value)
    keys.some((v) => {
      const key = temp(v.join(';'))
      if (map[key]) {
        const { skuId } = map[key]
        const decode = `${product.productCode}${skuId}`
        // 用value保证prop的顺序一致 从上到下
        skuMap[keyback(skuId, value, propName)] = {
          decode,
          productSku: md5(decode),
          productPropertiesName: propName.join(';'),
          productSkuImg: img,
          productSellPrice: '0'
        }
        return true
      }
      return false
    })
  })
}

/** 商品方法入口，根据plat匹配 */
export const createPdt = (plat, product, skuMap) => {
  /** 平台对应我们系统的code */
  const pkey = {
    [PLATS.ali88]: 'AM',
    [PLATS.taobao]: 'TB',
    [PLATS.tmall]: 'TM'
  }[plat]
  /** 作为无sku商品的key名 */
  const noSku = 'noSku'
  return {
    [PLATS.ali88]: ali88,
    [PLATS.taobao]: taobao,
    [PLATS.tmall]: tmall
  }[plat](product, skuMap, pkey, noSku)
}
