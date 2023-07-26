import $ from 'jquery'
import { wait } from '@/utils/utils'
/**
 * content-script 获取内部环境的全局对象
 * @param props
 * @param count
 * @returns
 */
export const getSrcWin = (props, count = 10) => {
  const postID = Math.random()
  return new Promise((resolve) => {
    const success = (value) => {
      resolve(value)
      btn.remove()
      window.removeEventListener('message', cb)
    }
    const cb = (res) => {
      const { value, id } = res.data
      if (id === postID) {
        if (--count !== 0 && value === undefined) {
          wait(100).then(() => btn.trigger('click'))
        } else {
          success(value)
        }
      }
    }
    window.addEventListener('message', cb)
    const btn = $(`<div onclick="
            window.postMessage({id:${postID},value:${props}})
        "></div>`)
    $('body').append(btn)
    requestAnimationFrame(() => {
      btn.trigger('click')
    })
  })
}

export const until = async (fn, interval = 100, count = 1) => {
  const res = await fn(count)
  // eslint版本过低导致
  if (
    res === null ||
  res === undefined ||
  (typeof res === 'object' && 'length' in res && res.length === 0)
  ) {
    return wait(interval).then(() => until(fn, interval, count + 1))
  }
  return res
}

/**
 *
 * @param selector
 * @returns
 */
export const $async = (selector) => until(() => $(selector))

export const anagrams = (arr) => {
  if (arr.length <= 2) return arr.length === 1 ? [arr] : [arr, [arr[1], arr[0]]]
  return arr.reduce((acc, item, i) => {
    anagrams([...arr.slice(0, i), ...arr.slice(i + 1)]).forEach((s) =>
      acc.push([item, ...s])
    )
    return acc
  }, [])
}

export const getUrlParams = (raw) => {
  const paramsStr = location.search.slice(1)
  return paramsStr.split('&').reduce((obj, item) => {
    const [k, v] = item.split('=')
    try {
      obj[k] = raw ? v : decodeURIComponent(v)
    } catch (err) {
      obj[k] = v
    }
    return obj
  }, {})
}

export const sliceImgUrl = (str) => str?.replace(/_\d+x\d+.*?\..*$/, '')
