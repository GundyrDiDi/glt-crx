import dayjs from 'dayjs'
let appid
const version = '6'
const cache = {
  init (val) {
    appid = val + '_'
    if (localStorage.__VERSION !== version) {
      localStorage.clear()
      localStorage.__VERSION = version
    }
  },
  set (k, val, expire) {
    if (typeof val === 'function') {
      val = {
        $fn: true,
        val: val.toString(),
        expire: expire || null
      }
    } else {
      val = {
        val,
        expire: expire || null
      }
    }
    localStorage[appid + k] = JSON.stringify(val)
  },
  get (k) {
    const { expire, val, $fn } = JSON.parse(localStorage[appid + k] || '{}')
    if (expire && dayjs(expire).isBefore(dayjs())) {
      this.delete(k)
    } else {
      if ($fn) {
        // return (new Function('', 'return ' + val)())
      } else {
        return val
      }
    }
  },
  delete (k) {
    delete localStorage[appid + k]
  },
  getAll () {
    const reg = new RegExp('^' + appid)
    return Object.keys(localStorage)
      .filter((k) => reg.test(k))
      .map(k => [(k = k.replace(appid, '')), this.get(k)])
  }
}
export default cache
