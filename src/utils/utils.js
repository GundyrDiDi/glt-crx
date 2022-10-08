/* 数组 */

// 输出array
export function toArray () {
  return [].concat(...arguments)
}

// 数组删除某个值,不改变原数组
export function filterone (arr, val, ...other) {
  return arr
    .filter(v => (typeof val === 'function' ? !val(v) : v !== val))
    .concat(other)
}

// 数组删除某个值,改变原数组
export function spliceone (arr, val, ...other) {
  const i = arr.findIndex(typeof val === 'function' ? val : v => v === val)
  if (i > -1) {
    const del = arr[i]
    arr.splice(i, 1, ...other)
    return del
  } else if (other.length) {
    arr.push(...other)
  }
}

// array2object
// (['a','b','c'],[1,2,3]) => {a:1,b:2,c:3} 第二参数可以省略
export function array2object (
  proplist,
  valuelist,
  filter = v => v,
  propfn = v => v
) {
  return proplist.reduce((acc, v, i) => {
    acc[propfn(v)] = filter((valuelist || proplist)[i])
    return acc
  }, {})
}

// entries2object
export function entries2object (entries) {
  return array2object(
    entries,
    undefined,
    v => v[1],
    v => v[0]
  )
}

// 去重
export function unique (arr, prop) {}
/* 对象 */

// 是否是引用值，非null
export function isRefVal (obj) {
  return ['Object', 'Array'].includes(
    Object.prototype.toString.call(obj).slice(8, -1)
  )
}
// 深拷贝
export function deepcopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// object2array
export function object2array (
  obj,
  callback = (key, value) => ({ key, value }),
  desc
) {
  return Object.entries(obj).map(([k, v], i) => {
    return callback(k, v, i)
  })
}
// 根据children字段深度遍历函数
export function traverse (obj, callback, children = 'children') {
  if (Array.isArray(obj)) {
    obj.forEach(v => {
      traverse(v, callback, children)
    })
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(k => {
      if (k !== children) {
        callback(k, obj[k], obj)
      } else {
        traverse(obj[k], callback, children)
      }
    })
  }
}

// 从一棵树上取值作为对象
export function propFromTree ({
  tree,
  props,
  children = 'children',
  filter = v => v
}) {
  return props.split(/\.|\//).reduce((obj, prop) => {
    const { [children]: t, ...rest } = tree[prop]
    tree = t
    return {
      ...obj,
      ...filter(rest)
    }
  }, {})
}

// api模式的特殊树
export function propFromTreeLike ({ tree, props, filter = v => v }) {
  return props.split(/\.|\//).reduce((acc, prop) => {
    const { [prop]: child, ...rest } = tree
    tree = child
    return {
      ...acc,
      ...filter(rest)
    }
  }, {})
}

// 深度混入
export function mixin (obj1, obj2 = {}) {
  if (obj1 === obj2) return obj2
  return Object.entries(obj1).reduce((obj2, [key, value]) => {
    if (key in obj2) {
      if (isRefVal(obj1[key]) && isRefVal(obj2[key])) {
        obj2[key] = mixin(obj1[key], obj2[key])
      }
    } else {
      obj2[key] = value
    }
    return obj2
  }, obj2)
}

// 对比两个对象的原始值是否相等
export function isdeepsame (obj1, obj2) {
  let same = false
  if (typeof obj1 === typeof obj2) {
    if (isRefVal(obj1) && isRefVal(obj2)) {
      same = Object.entries(obj1).every(([k, v]) => {
        return isdeepsame(v, obj2[k])
      })
    } else {
      same = obj1 === obj2
    }
  }
  return same
}

// 深度合并
export function merge (obj1, obj2 = {}, callback = (a, b, k) => b[k]) {
  if (obj1 === obj2) return obj1
  return Object.entries(obj2).reduce((obj1, [key, value]) => {
    if (isRefVal(obj1[key]) && isRefVal(value)) {
      obj1[key] = merge(obj1[key], value, callback)
    } else {
      obj1[key] = callback(obj1, obj2, key)
    }
    return obj1
  }, obj1)
}

/* 数字 */

// 是否数字
export function notNum (num) {
  return Number.isNaN(Number(num))
}

// 小数转百分比
export function toPercent (num, wei = 2) {
  return (Number(num) * 100).toFixed(wei) + '%'
}

// 在toFixed的基础上，省略小数结尾零
export function toFixed (num) {
  return num.toFixed(2).replace(/\.0{2}|0$/, '')
}

// 添加数字分隔符
export function toLocalNum (num) {
  return toFixed(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // 内置函数 return num.toLocaleString('en-us'); // 只能是数字类型，自动保留3位小数
}

// 添加数字单位，省略小数两位
export function addNumberUnit (
  num,
  units = [
    { value: '万', wei: 4 },
    { value: '亿', wei: 8 }
  ],
  exceed = 1
) {
  if (notNum(num)) return '-'
  num = Number(num)
  // 整数部分值
  const str = num.toFixed()
  const unit = units.reverse().find(v => {
    return str.slice(exceed).length / v.wei >= 1
  })
  if (unit) {
    return toFixed(num / 10 ** unit.wei) + unit.value
  } else {
    return toFixed(num)
  }
}

// 组合
export function formatNumber (num) {
  return toLocalNum(addNumberUnit(num))
}

// 取值不超过最小最大
export function numberRange (val, min = -Infinity, max = Infinity) {
  return Math.max(min, Math.min(val, max))
}

// 随机数
export function rdnumber (max, min = 0) {
  return parseInt(min + Math.random() * (max - min))
}

// 随机code
export function rdcode (length = 8, index = 16) {
  return (
    Math.random()
      .toString(index)
      .slice(2) +
    Math.random()
      .toString(index)
      .slice(2) +
    Math.random()
      .toString(index)
      .slice(2)
  ).slice(0, length)
}

/* 字符串 */

export function split () {}

export function patch () {}

/* 工具 */

// 节流
export function throttle (fn, time = 300) {
  let exec = true
  return function (...rest) {
    if (exec) {
      fn.call(this, ...rest)
      exec = false
      setTimeout(e => {
        exec = true
      }, time)
    }
  }
}
// 防抖
export function debounce (fn, time = 300) {
  let timer
  return function (...rest) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(e => {
      fn.call(this, ...rest)
    }, time)
  }
}

// 序列化
export function serize (params = '', url = '') {
  return Object.entries(params)
    .reduce((acc, [k, v]) => {
      return acc + (k + '=' + v) + '&'
    }, url + '?')
    .slice(0, -1)
}

// 反序列化
export function serizeR (str, op = ['?', '&', '='], call = v => v) {
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

// rgb2hex
export function colorRGBtoHex (rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(v => parseInt(v))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// 首字母大写
export function capitalFirst (str) {
  // return str.slice(0, 1).toUpperCase() + str.slice(1)
  return str.replace(/^\w/g, char => char.toUpperCase())
}

// 下划线或连词符转驼峰
export function underline2hump (str, u = '_') {
  return str.replace(new RegExp(`${u}([a-z])`, 'g'), ($0, $1) => {
    return $1.toUpperCase()
  })
}

// 驼峰转下划线
export function hump2underline (str, u = '_') {
  return str.replace(new RegExp('[A-Z]', 'g'), ($0, $1) => {
    return u + $1.toLowerCase()
  })
}

/* 异步功能 */

// 必须返回一个 Promise
export async function promisfy (...rest) {
  return rest.length === 1 ? Promise.resolve(rest[0]) : Promise.all(rest)
}

// 至少等待 x 秒后返回
export function wait (time = 1000, promise) {
  let delay = new Promise(resolve => {
    setTimeout(e => {
      resolve()
    }, time)
  })
  if (promise instanceof Promise) {
    delay = Promise.all([promise, delay]).then(res => res[0])
  }
  return delay
}

// 列表异步串行
export async function listsync (list, callback) {
  return list.reduce((promise, v) => {
    return promise.then(res => callback(v, res))
  }, Promise.resolve())
}

// 预加载图片
export function loadimg (src, localSrc) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(src)
    }
    img.onerror = () => {
      resolve(localSrc)
    }
    setTimeout(() => {
      resolve(src)
    }, 5000)
  })
}

// 限制请求
export function limitRequest (ajax, apis, limit = 10) {
  const head = apis.slice(0, limit)
  const rest = apis.slice(limit)
  const fn = res => {
    if (rest.length > 0) {
      return ajax(rest.shift()).then(fn)
    } else {
      return res
    }
  }
  return Promise.all(head.map(api => ajax(api).then(fn)))
}
// 高级限制请求，返回原排序的结果
export function limitRequestAc (ajax, apis, limit = 10) {
  const head = apis.slice(0, limit)
  const rest = apis.slice(limit)
  const result = []
  let start = limit
  const fn = (i, res) => {
    result[i] = res
    if (rest.length > 0) {
      return ajax(rest.shift()).then(res => fn(start++, res))
    }
  }
  return Promise.all(
    head.map((api, i) => ajax(api).then(res => fn(i, res)))
  ).then(() => result)
}

/* HTML API 封装 */

// 模拟鼠标事件
export function trigger (dom, type = 'click') {
  return new Promise(resolve => {
    const evt = document.createEvent('MouseEvents')
    evt.initEvent(type, true, true)
    const fn = evt => {
      requestAnimationFrame(e => {
        resolve(evt)
      })
      dom.removeEventListener('click', fn)
    }
    dom.addEventListener(type, fn)
    dom.dispatchEvent(evt)
  })
}

// 复制到剪切板
export function copyToClip (content) {
  var aux = document.createElement('input')
  aux.setAttribute('value', content)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
}
