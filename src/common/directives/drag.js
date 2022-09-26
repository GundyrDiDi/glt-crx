import $ from 'jquery'
export default {
  inserted (el, { arg, value }) {
    let down = false
    let deltaX = 0
    let deltaY = 0
    let transition = ''
    let animation = ''
    const { can, onDrag } = value
    el.addEventListener('mousedown', e => {
      if (!can()) return
      down = true
      deltaX = e.offsetX
      deltaY = e.offsetY
      transition = el.style.transition
      animation = el.style.animation
      el.style.transition = 'none'
      el.style.animation = 'none'
    })
    document.body.addEventListener('mousemove', e => {
      if (down) {
        onDrag(true)
        $(el).css({
          right: 'auto',
          left: e.x - deltaX + 'px',
          top: e.y - deltaY + 'px'
        })
      }
    })
    el.addEventListener('mouseup', e => {
      if (!can()) return
      down = false
      el.style.transition = transition
      el.style.animation = animation
      const width = parseFloat($('body').css('width'))
      // console.log(window.innerWidth)
      // console.log(e.x - deltaX)
      if ((e.x - deltaX) > width / 2) {
        $(el).css({
          right: width - (e.x - deltaX + el.getBoundingClientRect().width) + 'px',
          left: 'auto'
        })
      }
      setTimeout(e => {
        onDrag(false)
      }, 0)
    })
  }
}
