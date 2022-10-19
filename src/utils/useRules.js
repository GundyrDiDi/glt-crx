import { t as $t } from '@/content-scripts/main/vue'
const t = (text) => new Error('※ ' + $t(text))

const rules = {
  plainEn (rule, val, callback) {
    if (/^[a-zA-Z\s-]+$/.test(val.trim())) {
      callback()
    } else {
      callback(t('仅限输入英文字符'))
    }
  },
  plain (rule, val, callback) {
    if (/^[\da-zA-Z\s-]+$/.test(val.trim())) {
      callback()
    } else {
      callback(t('仅限输入英文和数字字符'))
    }
  },
  noblank (rule, val, callback) {
    if (val.trim() === '') {
      callback(t('无效内容'))
    } else {
      callback()
    }
  },
  phone (rule, val, callback) {
    if (/^[\d-]{6,20}$/.test(val)) {
      callback()
    } else {
      callback(t('无效的手机号码'))
    }
  },
  address (rule, val, callback) {
    // // 去除空格
    // const text = val.replace(/\s/g, '')
    // // 不能只有数字
    // if (/^\d+$/.test(text)) { return callback(t('无效的地址')) }
    // // 只能是数字、英文、中日文
    // if (!(new RegExp(`^[${zhjaReg}|a-z|A-Z|\\d]{4,}$`)).test(text)) { return callback(t('无效的地址')) }
    // // 中日文必须大于4字符？
    // const words = text.match(new RegExp(`[${zhjaReg}]{1}`, 'g'))
    // if (!words || words.length < 4) {
    //   return callback(t('无效的地址'))
    // }
    // return callback()
    if (val.trim() === '') {
      callback(t('无效内容'))
    } else {
      callback()
    }
  },
  email (rule, val, callback) {
    if (!/[\d\w]+\b@([a-zA-ZA-z0-9-]+\.)+[a-z]+/.test(val)) {
      callback(t('无效邮箱'))
    } else {
      callback()
    }
  },
  postalCode (rule, val, callback) {
    if (/^[\d-]{5,10}$/.test(val)) {
      callback()
    } else {
      callback(t('无效的邮编'))
    }
  },
  postal (rule, val, callback) {
    if (/(^\d{3}-?\d{4}$)|(^\d{7}$)/.test(val)) {
      callback()
    } else {
      callback(t('无效的邮编'))
    }
  },
  url (rule, val, callback) {
    const isUrl = () => true
    if (isUrl(val)) {
      callback()
    } else {
      callback(t('无效的URL'))
    }
  },
  deliver (rule, val, callback) {
    // const words = val.trim().split(/\b\s+\b/)
    // const text = words.join('')
    // // 整个字段空格大于1且空格不连续
    // if (words.length > 2) { return callback(t('无效内容')) }
    // // 收件人名带有“株”或者“LTD”字样时报错
    // if (val.match(/株|LTD/i)) { return callback(t('无效内容')) }
    // // 只能是英文且...?
    // if (/^[a-zA-Z]{1,10}$/.test(text)) { return callback() }
    // // 只能是中日文且...?
    // if ((new RegExp(`^[${zhjaReg}]{1,6}$`)).test(text)) { return callback() }
    // //
    // return callback(t('无效内容'))
    if (val.trim() === '') {
      callback(t('无效内容'))
    } else {
      callback()
    }
  }
}

export const useRule = (key, trigger = 'blur') => {
  const validator = (rule, val, callback) => {
    if (!val) {
      callback()
    } else {
      if (typeof key === 'string') {
        rules[key](rule, val, callback)
      }
    }
  }
  return [
    {
      validator,
      trigger
    }
  ]
}

export const useMust = (message = '※ ' + $t('必填内容'), trigger = 'blur') => {
  return [{ required: true, message, trigger }]
}

export default (key, trigger = 'blur') => {
  return useMust(key.message, trigger).concat(useRule(key.key, trigger))
}

// 符合N个条件即可通过
export const atleast = (fns, least = 1) => {
  let num = 0
  fns = Array.isArray(fns) ? fns : [fns]
  return fns.some((v) => {
    if (v()) num++
    return num >= least
  })
}
export const useLeast = (options, trigger = 'blur') => {
  const { fns, msg } = options
  return [
    {
      validator (rule, val, callback) {
        if (atleast(fns)) {
          callback()
        } else {
          callback(msg)
        }
      },
      trigger
    }
  ]
}

//
export const pipe = (oks, fail) => {
  return oks
    .reduce((acc, fn) => {
      return acc.then(() => {
        const res = fn()
        if (!res) throw new Error('')
      })
    }, Promise.resolve())
    .catch(fail)
}
