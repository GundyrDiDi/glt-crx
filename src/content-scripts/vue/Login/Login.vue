<template>
  <div v-show="show" class="sniff-crx-login">
    <div class="abs-wrap" @click="show = false"></div>
    <div class="abs sniff-crx-login-content">
      <div class="flex-cen" style="margin-top: 10px">
        <img src="@/assets/theckb.jpg" alt="" />
      </div>
      <div class="abs sniff-crx-login-close" @click="show = false">
        <svg-icon style="font-size: 22px" name="关闭"></svg-icon>
      </div>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :hideRequiredMark="true"
      >
        <div class="flex-ard sniff-crx-login-enter" style="margin-bottom: 20px">
          <span :class="{ 'enter--active': enter === 0 }" @click="enter = 0">{{
            $t("账号密码登录")
          }}</span>
          <span :class="{ 'enter--active': enter === 1 }" @click="enter = 1">{{
            $t("邮箱验证码登录")
          }}</span>
        </div>
        <template v-if="!enter">
          <a-form-model-item prop="nameOrEmail" key="nameOrEmail">
            <a-input
              class="hollow"
              v-model="form.nameOrEmail"
              :placeholder="$t('请输入账号')"
              name="sniff_login_nameOrEmail"
            ></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="账号"></svg-icon>
            </span>
          </a-form-model-item>
          <a-form-model-item prop="password" key="password">
            <a-input
              class="hollow"
              :type="ptype ? 'password' : 'text'"
              v-model="form.password"
              :placeholder="$t('请输入密码')"
              name="sniff_login_password"
            ></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="密码"></svg-icon>
            </span>
            <span
              class="abs"
              @click="ptype = !ptype"
              style="right: 20px; font-size: 20px; cursor: pointer"
            >
              <svg-icon :name="ptype ? '闭眼' : '睁眼'"></svg-icon>
            </span>
          </a-form-model-item>
        </template>
        <template v-else>
          <a-form-model-item prop="customerEmail" key="customerEmail">
            <a-input
              class="hollow"
              v-model="form.customerEmail"
              :placeholder="$t('请输入邮箱')"
              name="sniff_login_customerEmail"
            ></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="邮箱"></svg-icon>
            </span>
          </a-form-model-item>
          <a-form-model-item prop="verificationCode" key="verificationCode">
            <a-input
              class="hollow"
              v-model="form.verificationCode"
              :placeholder="$t('请输入验证码')"
              name="sniff_login_verificationCode"
            ></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="密码"></svg-icon>
            </span>
            <a-button
              class="abs"
              type="black"
              style="
                height: 30px;
                font-size: 12px;
                width: 120px;
                top: -5px;
                right: 7px;
              "
              :disabled="count > 0 || !form.customerEmail.trim()"
              @click="getCode"
            >
              <template v-if="count > 0">
                {{ $t("发送中") }}
                ({{ count }})
              </template>
              <template v-else>
                {{ $t("获取验证码") }}
              </template>
            </a-button>
          </a-form-model-item>
        </template>
      </a-form-model>
      <div class="flex"></div>
      <a-button
        type="primary"
        shape="round"
        :block="true"
        :loading="loading"
        @click="signin"
      >
        {{ $t("登录") }}
      </a-button>
    </div>
  </div>
</template>
<script>
import md5 from 'md5'
import useRules from '@/utils/useRules'
export default {
  props: ['user'],
  data () {
    return {
      show: true,
      form: {
        nameOrEmail: process.env.NODE_ENV === 'development' ? 'testApi' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        customerEmail: '',
        verificationCode: ''
      },
      rules: {
        nameOrEmail: useRules({ key: 'noblank' }),
        password: useRules({ key: 'plain' }),
        customerEmail: useRules({ key: 'email' }),
        verificationCode: useRules({ key: 'plain' })
      },
      loading: false,
      enter: 0,
      count: 0,
      ptype: true
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
          const token = await this.sendMessage('request', [
            this.enter === 0 ? 'loginByPwd' : 'loginByCode',
            data
          ]).then(
            (res) => res.data.token,
            () => {
              this.$msg(
                this.enter === 0 ? '账号或密码错误' : '邮箱或验证码错误',
                'error'
              )
            }
          )
          if (token) {
            await this.sendMessage('setUserData', { token })
            await this.sendMessage('updateUserData')
          }
          this.loading = false
        }
      })
    },
    async getCode () {
      await this.$refs.form.validateField('customerEmail', (msg) => {
        if (!msg) {
          this.count = 60
          const fn = () =>
            setTimeout(() => {
              if (--this.count) fn()
            }, 1000)
          fn()
          this.sendMessage('request', [
            'getLoginCode',
            { customerEmail: this.form.customerEmail }
          ]).then(
            (res) => {
              this.$msg('验证码已发送')
            },
            (err) => {
              this.$msg(err.res.msg, 'error')
              this.count = 0
            }
          )
        }
      })
    }
  },
  mounted () {}
}
</script>
<style lang="scss">
.sniff-crx-login {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: calc(200000000 + 1);

  .abs-wrap {
    background: rgba(0, 0, 0, 0.2);
  }

  &-content {
    height: 500px;
    width: 500px;
    padding: 20px 50px;
    background: #fdfdfd;
    border-radius: 12px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  &-enter {
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  &-close {
    right: 20px;
    top: 20px;
    color: #aaa;
    cursor: pointer;
    transition: all 0.1s linear;
    &:hover {
      color: #333;
    }
  }
  .enter--active {
    color: #008060;
  }
  .ant-form-item {
    margin-bottom: 48px;
  }
  .ant-input {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    padding-left: 44px;
    caret-color: #008060;
    &:focus {
      box-shadow: inset 0px 5px 8px 0px #dbf2ec, inset 0px -1px 0px 0px #ffffff,
        inset 0px 0px 0px 0px #d2f4ed;
      + span {
        color: #008060;
      }
    }
  }
  &-icon {
    left: 20px;
    pointer-events: none;
    top: -11px;
    font-size:18px;
  }
  .ant-form-explain {
    font-size: 12px;
    position: absolute;
    left: 20px;
    padding-top: 3px;
  }
  .ant-btn {
    height: 50px;
    border-radius: 30px;
    // background: #008060;
  }
  .has-error .ant-input:hover {
    border-color: transparent;
  }
  .has-error .ant-input:focus {
    border-color: transparent;
    box-shadow: inset 0px 5px 8px 0px #dbf2ec, inset 0px -1px 0px 0px #ffffff,
      inset 0px 0px 0px 0px #d2f4ed;
  }
}
</style>
