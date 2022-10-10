import $ from 'jquery'

const formatOp = (str) => str.replace(/—/g, '&mdash;')

export default () => {
  const sku = window.$detail.skuMap
  const selected = $('.J_Prop .tb-selected')
  const [names, values] = [[], []]
  let img = ''
  selected.each((i, v) => {
    names.push(
      $(v)
        .find('span')
        .html()
    )
    const url = $('a', v).css('background')
    if (url.includes('url')) {
      img = url.match(/url\("(.*)"\)/)[1].replace(/_\d+x\d+\..*$/, '')
    }
    if (v.dataset.value) {
      values.push(v.dataset.value)
    }
  })
  const skuName = formatOp(names.join('&gt;'))
  const reverse = [...values].reverse()
  const skuValue = sku[`;${values.join(';')};`] || sku[`;${reverse.join(';')};`]

  if (!skuValue) return []
  skuValue.id = skuValue.skuId

  const buyAmount = parseInt($('#J_IptAmount').val())

  return [{
    photoUrl: img,
    propName: skuName.replace(/&gt;/g, ','),
    skuName,
    values,
    ...skuValue,
    buyAmount
  }]
}
