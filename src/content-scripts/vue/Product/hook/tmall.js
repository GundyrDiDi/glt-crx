import $ from 'jquery'

const formatOp = (str) => str.replace(/—/g, '&mdash;')

export default () => {
  const sku = window.$detail.skuMap
  const selected = $('.tm-sale-prop .tb-selected')
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
      img = url.match(/url\("(.*)"\)/)[1]
    }
    if (v.dataset.value) {
      values.push(v.dataset.value)
    }
  })
  const skuName = formatOp(names.join('&gt;'))
  const reverse = [...values].reverse()
  let skuValue
  if (sku) {
    skuValue = sku[`;${values.join(';')};`] || sku[`;${reverse.join(';')};`]
  } else {
    skuValue = serizeR(location.href)
  }

  if (!skuValue) return []
  skuValue.id = skuValue.skuId

  const buyAmount = parseInt($('#J_Amount input').val())

  return [{
    photoUrl: img,
    propName: skuName.replace(/&gt;/g, ','),
    skuName,
    values,
    ...skuValue,
    buyAmount
  }]
}

function serizeR (str, op = ['?', '&', '='], call = v => v) {
  const [t, y, eq] = op
  return str
    .slice(str.indexOf(t) + 1)
    .split(y)
    .reduce((acc, s) => {
      const [k, v] = s.split(eq)
      acc[k] = call(v)
      return acc
    }, {})
}
