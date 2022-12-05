<template>
  <div class="sniff-v1-crx">
    <AttachImage v-if="user" />
    <template v-if="platType">
      <Login ref="login" v-if="!user" @toSignup="changeSignin(false)" />
      <Signup ref="signup" v-if="!user" @toLogin="changeSignin(true)" />
      <Bubble ref="bubble" v-if="platType" @after="afterLogin" />
      <Product ref="product" v-if="!!$product" @after="beforeBuy" />
      <Parabola />
    </template>
  </div>
</template>
<script>
import Login from './Login/Login.vue'
import Signup from './Login/Signup.vue'
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
    Signup,
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
    changeSignin (val) {
      this.$refs.login.show = val
      this.$refs.signup.show = !val
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
  .ant-message {
    z-index: calc(200000000 + 1) !important;
  }
}

:root {
  --cl-default: #232323;
  --cl-info: #007AFF;
  --cl-primary: #F96113;
  --cl-dark: #232323;
}

.sniff-v1-crx {
  font-family: 'PingFangSC-Semibold', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;

  // 自定义类
  .sniff_btn {
    cursor: pointer;
  }

  .sniff-active--1:hover {
    color: var(--cl-info)
  }

  .sniff_color--info {
    color: var(--cl-info)
  }

  .sniff_color--primary {
    color: var(--cl-primary)
  }

  .sniff_color--dark {
    color: var(--cl-dark)
  }

  .sniff-link {
    cursor: pointer;
    color: var(--cl-default);

    &:hover,
    &:focus,
    &:active {
      color: var(--cl-primary)
    }
  }

  .sniff-link--2 {
    cursor: pointer;
    color: var(--cl-primary)
  }

  .sniff-modal--title {
    text-align: center;
    font-weight: 600;
    color: #333333;
    font-size: 20px;
    line-height: 28px;
  }

  // 输入框
  input{
    &:autofill {
      background: #fff;// 支持火狐
    }
    // 支持chrome
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 50000s ease-in-out 0s;
      -webkit-text-fill-color: #232323 !important;
    }
  }

  .ant-input {
    height: 30px;
    border-radius: 15px;
    border: 1px solid #898989;
    transition: all .2s linear;
    font-size: 12px;
    caret-color: var(--cl-primary);
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

  .ant-input.hollow,
  .ant-input:focus {
    border-color: transparent;
  }

  // checkbox
  .ant-checkbox {
    .ant-checkbox-input:focus+.ant-checkbox-inner {
      border-color: #BABABA;
    }

    &:hover .ant-checkbox-inner {
      border-color: #BABABA;
    }
  }

  .ant-checkbox-checked {
    .ant-checkbox-inner {
      background-color: var(--cl-dark);
      border-color: var(--cl-dark);
    }

    .ant-checkbox-input:focus+.ant-checkbox-inner {
      border-color: var(--cl-dark);
    }

    &:after {
      border-color: var(--cl-dark);
    }
  }
  // select
  .ant-select-dropdown-menu-item-selected{
    font-weight: 400;
    color:var(--cl-primary);
    background-color:#FFFDFC;
  }

  .ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled),
  .ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #FFFDFC;
  }
  // 按钮
  .ant-btn-black {
    background: #232323;
    border-color: #232323;
    color: #fff;

    &:hover,
    &:focus,
    &:active {
      color: #fff;
      border-color: var(--cl-primary);
      background: var(--cl-primary);
      box-shadow: 0px 5px 10px 0px #F2C6AF;
      // border-color:#333;
      // background: linear-gradient(270deg, #232323 0%, #000000 100%);
    }
  }

  .ant-btn-plain {
    color: #232323 !important;
    border: 2px solid #CCCCCC !important;
  }
}
</style>
