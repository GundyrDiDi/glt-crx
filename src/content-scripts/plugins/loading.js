import $ from 'jquery'
class Loading {
  constructor (props) {
    // eslint-disable-next-line constructor-super
    // super(props)
    this.timeout = 10000
  }

  service (options) {
    const { text } = options
    let div = $('<div></div>')
    div.css({
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      background: 'rgba(255,255,255,.7)',
      top: '0',
      left: '0',
      zIndex: '999999',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': '20px',
      color: '#409eff'
    })
    div.html(text)
    $('body').append(div)
    return {
      close () {
        $('body').remove(div)
        div = null
      }
    }
  }
}
export default new Loading()
