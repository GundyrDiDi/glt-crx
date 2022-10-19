<template>
  <div class="sniff-v1-crx">
    <AttachImage v-if="user" />
    <template v-if="platType">
      <Login ref="login" v-if="!user" />
      <Bubble ref="bubble" v-if="platType" @after="afterLogin" />
      <Product
        ref="product"
        v-if="!!$product"
        :user="user"
        @after="beforeBuy"
      />
      <Parabola/>
    </template>
  </div>
</template>
<script>
import Login from './Login/Login.vue'
import Bubble from './Bubble/Index.vue'
import AttachImage from './Attach/AttachImage.vue'
import Product from './Product/Index.vue'
import Parabola from './Product/Parabola.vue'
import $ from 'jquery'
export default {
  data () {
    return {
      plat: this.$platform,
      platType: this.$platType
    }
  },
  components: {
    Login,
    Bubble,
    AttachImage,
    Product,
    Parabola
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    afterLogin (callback) {
      this.user ? callback() : (this.$refs.login.show = true)
    },
    beforeBuy (callback) {
      this.afterLogin(() => {
        this.user?.googleUrl ? callback() : this.$store.commit('showModal', true)
      })
    }
  },
  mounted () {
    if (this.$product) {
      $(this.$product).append(this.$refs.product.$el)
    }
  }
}
</script>
<style lang="scss">
body {
  .sniff-v1-crx{
    font-family: 'PingFangSC-Semibold','Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,sans-serif;
  }
  .ant-btn-black{
    background:#333;
    border-color:#333;
    color:#fff;
    &:hover,&:focus,&:active{
      color:#fff;
      border-color:#333;
      background:#000;
    }
  }
  .ant-message {
    z-index: calc( 200000000 + 1) !important;
  }
  .ant-input {
    width: 170px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #898989;
    transition: all .2s linear;
    font-size:12px;
    caret-color: #F96113;
  }
  .ant-input.hollow,
  .ant-input:focus,
  .ant-input:hover {
    background: #FAFAFA;
    box-shadow: inset 0px 5px 8px 0px #EFEFEF, inset 0px -1px 0px 0px #ffffff, inset 0px -3px 0px 0px #FFFFFF;
  }
  .ant-input:hover {
    border: 1px solid #898989;
  }
  .ant-input.hollow,.ant-input:focus {
    border-color: transparent;
  }
}
</style>
