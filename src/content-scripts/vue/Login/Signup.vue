<template>
  <div v-show="show" class="sniff-crx-login">
    <agree-modal :show="showAgreement" @close="(showAgreement=false)"></agree-modal>
    <div class="abs-wrap" @click="show = false"></div>
    <div class="abs sniff-crx-login-content">
      <div class="abs sniff-crx-login-close" @click="show = false">
        <svg-icon style="font-size: 22px" name="关闭"></svg-icon>
      </div>
      <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true">
        <div class="sniff-modal--title">{{ $t('注册会员') }}</div>
        <a-form-model-item prop="loginName" key="loginName">
          <a-input class="hollow" v-model="form.loginName" :placeholder="$t('请输入账号')"
            :maxlength="18"
            name="sniff_login_loginName"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="账号"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="password" key="password">
          <a-input class="hollow" :type="ptype ? 'password' : 'text'" v-model="form.password" :placeholder="$t('请输入密码')"
            name="sniff_login_password"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="密码"></svg-icon>
          </span>
          <span class="abs" @click="(ptype = !ptype)"
            style="line-height:44px;right: 20px; font-size: 20px; cursor: pointer">
            <svg-icon :name="ptype ? '闭眼' : '睁眼'"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="repassword" key="repassword">
          <a-input class="hollow" :type="ptype1 ? 'password' : 'text'" v-model="form.repassword"
            :placeholder="$t('请再次输入密码')" name="sniff_login_repassword"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="确认密码"></svg-icon>
          </span>
          <span class="abs" @click="(ptype1 = !ptype1)"
            style="line-height:44px;right: 20px; font-size: 20px; cursor: pointer">
            <svg-icon :name="ptype1 ? '闭眼' : '睁眼'"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="customerEmail" key="customerEmail">
          <a-input class="hollow" v-model="form.customerEmail" :placeholder="$t('请输入邮箱')"
            name="sniff_login_customerEmail"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="邮箱"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="verificationCode" key="verificationCode">
          <a-input class="hollow" v-model="form.verificationCode" :placeholder="$t('请输入验证码')"
            name="sniff_login_verificationCode"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="验证码"></svg-icon>
          </span>
          <a-button class="abs sniff-verify--btn" type="black" :disabled="count > 0 || !form.customerEmail.trim()"
            @click="getCode">
            <template v-if="count > 0">
              {{ $t("发送中") }}
              ({{ count }})
            </template>
            <template v-else>
              {{ $t("获取验证码") }}
            </template>
          </a-button>
        </a-form-model-item>
        <a-form-model-item prop="customerName" key="customerName">
          <a-input class="hollow" v-model="form.customerName" :placeholder="$t('请输入您的名称')"
            name="sniff_login_customerName"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="联系人姓名"></svg-icon>
          </span>
        </a-form-model-item>
      </a-form-model>
      <div class="flex-ter" style="transform: translateY(-12px);">
        <a-checkbox v-model="agreed" style="transform:translateY(1px)">
        </a-checkbox>
        <span class="sniff-link--2" style="margin-left:5px;" @click="(showAgreement = true)">
          {{ $t('同意此项条款') }}
        </span>
      </div>
      <a-button type="black" shape="round" :block="true" :loading="loading" @click="signup">
        {{ $t("注册会员") }}
      </a-button>
      <div class="flex sniff-path--linkgroup">
        <span class="sniff-link" @click="$emit('toLogin')">{{$t('已有帐户去登录')}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from 'md5'
import useRules from '@/utils/useRules'
import { mapState } from 'vuex'
import AgreeModal from './modal/AgreeModal.vue'
export default {
  components: {
    AgreeModal
  },
  data () {
    return {
      show: true,
      form: {
        loginName: process.env.NODE_ENV === 'development' ? 'testApi' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        repassword: process.env.NODE_ENV === 'development' ? '123456' : '',
        customerEmail: '',
        verificationCode: '',
        langcode: '',
        customerName: ''
      },
      rules: {
        loginName: useRules({ key: 'noblank' }).concat({
          validator: (rule, val, c) => {
            if (val) {
              this.sendMessage('request', ['checkLoginName', { loginName: val }]).then(() => c()).catch((err) => {
                c('※ ' + this.$t('该用户名已被注册'))
                console.log(err)
              })
            } else {
              c()
            }
          },
          trigger: 'blur'
        }),
        password: useRules({ key: 'plain' }),
        repassword: useRules({ key: 'plain' }),
        customerEmail: useRules({ key: 'email' }),
        verificationCode: useRules({ key: 'plain' }),
        customerName: useRules({ key: 'noblank' })
      },
      loading: false,
      agreed: false,
      count: 0,
      ptype: true,
      ptype1: true,
      showAgreement: false
    }
  },
  computed: mapState(['lang']),
  methods: {
    signup () {
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
            'getSignupCode',
            { customerEmail: this.form.customerEmail, langcode: this.lang }
          ]).then(
            () => {
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
    height: 700px;
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

    span {
      transform: scale(.9);
    }

    .sniff_color--info {
      transform: scale(1.15);
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

  .sniff-modal--title {
    margin-bottom: 30px;
  }

  .ant-form-item {
    margin-bottom: 40px;
  }

  .ant-input {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    padding-left: 56px;
    caret-color: var(--cl-primary);

    &:focus {
      box-shadow: inset 0px 5px 8px 0px #F9EBE4, inset 0px -1px 0px 0px #ffffff,
        inset 0px 0px 0px 0px #d2f4ed;

      +span {
        color: var(--cl-primary);
      }
    }
  }

  &-icon {
    left: 20px;
    color: #bababa;
    pointer-events: none;
    top: -11px;
    font-size: 18px;

    &::after {
      content: "*";
      color: #232323;
      display: inline-block;
      transform: translate(8px, 4px);
    }
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
    // background: #008060;
  }

  .sniff-verify--btn {
    height: 30px;
    font-size: 12px;
    width: 120px;
    top: -7px;
    right: 7px;
  }

  .has-error .ant-input:hover {
    border-color: transparent;
  }

  .has-error .ant-input:focus {
    border-color: transparent;
    box-shadow: inset 0px 5px 8px 0px #dbf2ec, inset 0px -1px 0px 0px #ffffff,
      inset 0px 0px 0px 0px #d2f4ed;
  }

  .sniff-path--linkgroup{
    float:right;
    padding:8px 0;
    span:nth-child(2){
      margin: 0 12px;
    }
  }
}
</style>
