const Cookies = {
  getAll () {
    const t = document.cookie
    if (!t) return {}
    return (this.data = t.split(';').reduce((obj, c) => {
      const [k = '', v = ''] = c.split('=')
      if (k && v) {
        return {
          [k.trim()]: v.trim(),
          ...obj
        }
      } else {
        return obj
      }
    }, {}))
  },
  get (k) {
    return this.getAll()[k]
  },
  data: {}
}
export default Cookies
