<template>
  <div :id="$crxId">
    <AttachImage :user="user"/>
    <template v-if="$platType">
      <Login ref="login" v-if="!user"/>
      <Bubble ref="bubble" v-if="platType" :user="user" @toLogin="$refs.login.show=true"/>
      <Product v-if="!!$product" ref="product" :user="user"/>
    </template>
  </div>
</template>
<script>
import Login from './Login/Login.vue'
import Bubble from './Bubble/Index.vue'
import AttachImage from './Attach/AttachImage.vue'
import Product from './Product/Index.vue'
import $ from 'jquery'
export default {
  data () {
    return {
      plat: this._platform,
      platType: this.$platType
    }
  },
  components: {
    Login,
    Bubble,
    AttachImage,
    Product
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    if (this.$product) {
      $(this.$product).append(this.$refs.product.$el)
    }
  }
}
</script>
<style lang="scss"></style>
