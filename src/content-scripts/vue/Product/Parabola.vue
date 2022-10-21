<template>
  <div class="sniff-crx-parabola" v-if="parabola" :style="{transform}">
    <img :src="parabola.src" alt="" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import bezier from '@/utils/bezier'
export default {
  data () {
    return { transform: '' }
  },
  computed: mapState(['parabola']),
  watch: {
    parabola (v) {
      if (v) {
        const { p1, p3 } = v
        const delta = (p1[0] - p3[0]) / 3
        const x2 = p1[1] < p3[1] ? p1[0] - delta : p3[0] + delta
        const y2 = Math.min(p1[1], p3[1]) - 200
        const step = 60
        const dots = bezier([v.p1, [x2, y2], v.p3], step)
        //
        let i = 0
        this.transform = `translate(${p1[0]}px,${p1[1]}px)`
        const timer = setInterval(() => {
          if (i === step) {
            clearInterval(timer)
            this.$store.commit('setParabola', null)
          } else {
            this.transform = `translate(${dots[i][0]}px,${dots[i++][1]}px)`
          }
        }, 1000 / step)
      }
    }
  }
}
</script>
<style lang="scss">
.sniff-crx-parabola{
    position:fixed;
    top:0;
    left:0;
    z-index:calc( 200000000 - 1);
    // transition: all 1s linear;
    img{
        height:30px !important;
        width:30px !important;
        transform:translate(-50%,-50%);
        border-radius:50%;
        opacity: .8;
    }
}
</style>
