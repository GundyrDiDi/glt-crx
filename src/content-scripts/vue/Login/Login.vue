<template>
  <div v-show="show" class="sniff-crx-login">
    <div class="abs-wrap" @click="show = false"></div>
    <div class="abs sniff-crx-login-content">
      <lang-btn class="rel" style="left:-28px;top:2px;"></lang-btn>
      <div class="flex-center" style="margin-top:-20px;">
        <svg-icon style="font-size: 120px" name="THECKB"></svg-icon>
      </div>
      <div class="abs sniff-crx-login-close" @click="show = false">
        <svg-icon style="font-size: 22px" name="关闭"></svg-icon>
      </div>
      <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true">
        <div class="flex-bwn sniff-crx-login-enter" style="margin-bottom: 20px">
          <span class="sniff-enter--active">{{
              $t(tunels[enter === 0 ? 0 : 1])
          }}</span>
          <span @click="(enter = enter === 1 ? 0 : 1)">{{
              $t(tunels[enter === 0 ? 1 : 0])
          }}</span>
        </div>
        <template v-if="!enter">
          <a-form-model-item prop="nameOrEmail" key="nameOrEmail">
            <a-input class="hollow" v-model="form.nameOrEmail" :placeholder="$t('请输入账号')"
              name="sniff_login_nameOrEmail"></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="账号"></svg-icon>
            </span>
          </a-form-model-item>
          <a-form-model-item prop="password" key="password">
            <a-input class="hollow" :type="ptype ? 'password' : 'text'" v-model="form.password" :maxLength="32"
              :placeholder="$t('请输入密码')" name="sniff_login_password" @keyup.enter="signin"></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="密码"></svg-icon>
            </span>
            <span class="abs" @click="ptype = !ptype"
              style="line-height:50px;right: 20px; font-size: 20px; cursor: pointer">
              <svg-icon :name="ptype ? '闭眼' : '睁眼'"></svg-icon>
            </span>
          </a-form-model-item>
        </template>
        <template v-else>
          <a-form-model-item prop="customerEmail" key="customerEmail">
            <a-input class="hollow" v-model="form.customerEmail" :placeholder="$t('请输入邮箱')"
              name="sniff_login_customerEmail"></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="邮箱"></svg-icon>
            </span>
          </a-form-model-item>
          <a-form-model-item prop="verificationCode" key="verificationCode">
            <a-input class="hollow" v-model="form.verificationCode" :placeholder="$t('请输入验证码')"
              name="sniff_login_verificationCode" @keyup.enter="signin"></a-input>
            <span class="abs sniff-crx-login-icon">
              <svg-icon name="验证码"></svg-icon>
            </span>
            <a-button class="abs sniff-verify--btn" type="black-const" :disabled="count > 0" @click="getCode">
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
      <a-button type="black" shape="round" :block="true" :loading="loading" @click="signin">
        {{ $t("登录") }}
      </a-button>
      <div class="flex sniff-path--linkgroup">
        <a class="sniff-link" :href="(forgoturl + lang)" target="_blank">{{ $t('忘记密码') }}</a>
        <span>|</span>
        <span class="sniff-link" @click="$emit('toSignup')">{{ $t('注册会员') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from 'md5'
import useRules from '@/utils/useRules'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      forgoturl: process.env.VUE_APP_HOST + 'login/findpwd?lang=',
      show: false,
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
      ptype: true,
      tunels: ['账号密码登录', '邮箱验证码登录']
    }
  },
  computed: mapState(['lang']),
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
            { customerEmail: this.form.customerEmail, langcode: this.lang }
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
  mounted () {
    if (!localStorage.__sniff_firstload__) {
      // this.show = true
      process.env.NODE_ENV === 'production' && (
        localStorage.__sniff_firstload__ = 1
      )
    }
  }
}
</script>
<style lang="scss" scoped>
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
    height: 520px;
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

    span {
      cursor: pointer;
      transform-origin: center right;
      transform: scale(.9);
      color: var(--cl-info);
    }

    .sniff-enter--active {
      transform-origin: center left;
      transform: scale(1.15);
      color: #232323;
      cursor: default;
    }
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

  .ant-form-item {
    margin-bottom: 48px;
  }

  .ant-input {
    width: 100%;
    height: 55px;
    border-radius: 55px;
    padding-left: 44px;
    caret-color: var(--cl-primary);

    &:focus {
      box-shadow: inset 0px 5px 8px 0px #F9EBE4, inset 0px -1px 0px 0px #ffffff,
        inset 0px 0px 0px 0px #F9EBE4;

      +span {
        color: var(--cl-primary);
      }
    }
  }

  &-icon {
    left: 18px;
    pointer-events: none;
    color: var(--cl-dark);
    line-height: 50px;
    font-size: 18px;
  }

  :deep(.ant-form-explain) {
    font-size: 12px;
    position: absolute;
    left: 20px;
    padding-top: 3px;
  }

  .ant-btn {
    height: 50px;
    border-radius: 30px;
  }

  .sniff-verify--btn {
    height: 30px;
    font-size: 12px;
    min-width: 120px;
    top: -7px;
    right: 7px;
  }

  .has-error .ant-input:hover {
    border-color: transparent;
  }

  .has-error .ant-input:focus {
    border-color: transparent;
    box-shadow: inset 0px 5px 8px 0px #F9EBE4, inset 0px -1px 0px 0px #ffffff,
      inset 0px 0px 0px 0px #F9EBE4;
  }

  .sniff-path--linkgroup {
    float: right;
    padding: 8px 0;

    span:nth-child(2) {
      margin: 0 12px;
    }
  }
}
</style>
