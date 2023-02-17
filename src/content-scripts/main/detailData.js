import $ from 'jquery'
import dayjs from 'dayjs'

const _w = window

export default (plat, [sku]) => {
  if (!sku) return
  const data = _w.$detail = {
    productUrl: location.href
  }
  if (plat.includes('1688')) {
    data.productImg = $('.preview-img').attr('src') || $('.detail-gallery-img').attr('src')
    data.productName = document.title
    data.skuMap = sku.skuInfoMap ?? []
    data.productProps = sku.skuProps ?? []
    data.skuPropImgs = sku.skuProps.reduce((acc, v) => {
      v.value.forEach(item => {
        if (item.imageUrl) {
          acc[item.name] = item.imageUrl
        }
      })
      return acc
    }, {})
  }
  if (plat === 'taobao') {
    data.productImg = $('.tb-pic img').attr('src').replace(/_\d+x\d+.*?\..*$/, '')
    data.productName = document.title
    data.skuMap = sku.skuMap
    data.productProps = sku.propertyMemoMap ?? []
  }
  if (plat === 'tmall') {
    const par = location.href.replace('item.htm', 'item_o.htm')
    if (par !== location.href) {
      location.replace(par)
    }
    data.productName = document.title.replace(/-tmall.*$/, '')
    data.productImg = $('.tb-thumb-content img').attr('src').replace(/_\d+x\d+.*?\..*$/, '')
    data.skuMap = JSON.parse(
      [...$('script:not([src])')]
        .map((v) => $(v).html())
        .find((v) => v.includes('TShop.Setup'))
        .match(/TShop\.Setup\(((.|\n)*)\);\n\}\)\(\);/)[1]
    )?.valItemInfo.skuMap
  }
}

export const forTable = (skuList) => {
  return skuList.map(v => {
    return {
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      photoUrl: v.photoUrl.replace(/_\d+x\d+.*?\..*$/, '') || _w.$detail.productImg,
      productName: _w.$detail.productName,
      productUrl: _w.$detail.productUrl,
      productSpecification: v.propName
    }
  })
}
