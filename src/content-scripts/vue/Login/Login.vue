<template>
  <div v-show="show" class="sniff-crx-login">
    <div class="abs-wrap" @click="show = false"></div>
    <div class="abs sniff-crx-login-content">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item prop="nameOrEmail">
          <template #label> nameOrEmail </template>
          <a-input v-model="form.nameOrEmail"></a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <template #label> password </template>
          <a-input type="password" v-model="form.password"></a-input>
        </a-form-model-item>
        <a-form-model-item prop="customerEmail">
          <template #label> customerEmail </template>
          <a-input v-model="form.customerEmail"></a-input>
        </a-form-model-item>
        <a-form-model-item prop="verificationCode">
          <template #label> verificationCode </template>
          <a-input v-model="form.verificationCode"></a-input>
        </a-form-model-item>
      </a-form-model>
      <a-button
        type="primary"
        shape="round"
        :block="true"
        :loading="loading"
        @click="signin"
      >
        {{ $t("登录") }}
      </a-button>
      <a @click="$jump('login/findpwd')">{{ $t("忘记密码") }}</a>
      <a @click="$jump('signup')">{{ $t("注册会员") }}</a>
    </div>
  </div>
</template>
<script>
import md5 from 'md5'
import useRules, { useMust } from '@/utils/useRules'
export default {
  props: ['user'],
  data () {
    return {
      show: true,
      form: {
        nameOrEmail: 'testApi',
        password: '123456',
        customerEmail: '1@1.c',
        verificationCode: '1111'
      },
      rules: {
        nameOrEmail: useMust(),
        password: useRules({ key: 'plain' }),
        customerEmail: useRules({ key: 'email' }),
        verificationCode: useRules({ key: 'plain' })
      },
      loading: false
    }
  },
  methods: {
    signin () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const data = {
            ...this.form,
            password: md5(this.form.password)
          }
          await this.sendMessage('request', ['loginByPwd', data]).then(res => {
            const userData = { token: res.data.token, user: res.data, curShop: res.data.customerShopList[0]?.customerShopId }
            this.sendMessage('setUserData', userData)
          })
          setTimeout(e => {
            this.loading = false
          }, 2000)
        }
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.sniff-crx-login {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 200000000;

  .abs-wrap {
    background: rgba(0, 0, 0, 0.2);
  }

  &-content {
    height: 400px;
    width: 400px;
    background: #fff;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
}
</style>
