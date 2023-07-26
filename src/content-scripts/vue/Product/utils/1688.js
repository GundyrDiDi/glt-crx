import $ from 'jquery'

export default () => {
  const map = window.$detail.skuMap ?? {}
  const skuList = []
  const trs = $('.selected-list-wrapper .selected-item-wrapper')
  trs.each((i, tr) => {
    const prop = $(tr)
      .find('.name')
      .html()
    const lis = $(tr).find('.children-item .children-wrapper')
    lis.each((i, li) => {
      const name = $(li)
        .find('span')
        .attr('title')
      let skuName = prop
      if (name) {
        skuName += '&gt;' + name
      }
      const amount = $(li)
        .find('span')
        .html()
        .match(/\((\d+)\)/)[1]
      const buyAmount = parseInt(amount)
      if (map[skuName]) {
        skuList.push({
          ...map[skuName],
          id: map[skuName]?.skuId,
          buyAmount
        })
      }
    })
  })
  if (map.length === 0) {
    const amount = ($('.total-count').html()?.match(/\d+/) || [])[0]
    if (amount) {
      skuList.push({
        id: 'noskuId',
        specAttrs: '-',
        buyAmount: amount
      })
    }
  }
  skuList.forEach((v) => {
    v.propName = v.specAttrs?.replace(/&gt;/g, ',')
    v.photoUrl = window.$detail?.skuPropImgs[v?.firstProp] || ''
  })
  return skuList
}

const formatOp = (str) => str.replace(/—/g, '&mdash;')

export const query1688Rule2 = () => {
  // const map = sku.sku ?? {}
  const map = window.$detail.skuMap ?? {}
  const skuList = []
  const trs = $('.list-info .table-list tr')
  if (trs.length) {
    trs.each((i, tr) => {
      const prop = tr.dataset.name
      const ul = $(tr).find('.desc li')
      ul.each((i, li) => {
        const name = $(li).find('.name').html()
        let skuName = prop
        if (name) {
          skuName += '&gt;' + name
        }
        // todo: 如果图片需要是 sku 的图片
        const amount = $(li).find('.value').html()
        skuName = formatOp(skuName)
        const buyAmount = parseInt(amount)
        skuList.push({
          ...map[skuName],
          id: map[skuName]?.skuId,
          buyAmount
        })
      })
    })
  } else {
    // 无sku情况
    // const buyAmount = parseInt($('.amount-input')[0].value)
    // const { skuName, skuId } = this.sku
    // if (skuName && buyAmount > 0) {}
  }
  return skuList
}
