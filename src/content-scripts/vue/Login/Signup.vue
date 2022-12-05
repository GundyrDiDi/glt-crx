<template>
  <div v-show="show" class="sniff-crx-login" ref="signup">
    <agree-modal :show="showAgreement" @close="(showAgreement = false)"></agree-modal>
    <div class="abs-wrap" @click="show = false"></div>
    <div class="abs sniff-crx-login-content">
      <div class="abs sniff-crx-login-close" @click="show = false">
        <svg-icon style="font-size: 22px" name="关闭"></svg-icon>
      </div>
      <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true">
        <div class="sniff-modal--title">{{ $t('注册会员') }}</div>
        <a-form-model-item prop="langcode" key="langcode">
          <a-select class="hollow" v-model="form.langcode" name="sniff_login_langcode"
            :getPopupContainer="() => this.$refs.signup" :showArrow="false" size="large">
            <a-select-option v-for="v in langs" :key="v.value" :value="v.value">
              {{ v.label }}
            </a-select-option>
          </a-select>
          <a-input class="hollow" :value="langs.find(v => v.value === form.langcode).label"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="切换语言"></svg-icon>
          </span>
          <span class="abs sniff-crx-expand" style="line-height:44px;right: 20px; font-size: 12px; cursor: pointer">
            <svg-icon name="展开2"></svg-icon>
          </span>
          <div class="ant-tooltip ant-tooltip-placement-topLeft abs" style="top: -40px;left: 8px;">
            <div class="ant-tooltip-content">
              <div class="ant-tooltip-arrow"></div>
              <div role="tooltip" class="sniff-tooltip-inner">
                {{ $t('谷歌表语言') }}
              </div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item prop="loginName" key="loginName">
          <a-input class="hollow" v-model="form.loginName" :placeholder="$t('请输入账号')" :maxLength="18"
            name="sniff_login_loginName"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="账号"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="password" key="password">
          <a-input class="hollow" :type="ptype ? 'password' : 'text'" v-model="form.password" :placeholder="$t('请输入密码')"
            :maxLength="32" name="sniff_login_password"></a-input>
          <span class="abs sniff-crx-login-icon">
            <svg-icon name="密码"></svg-icon>
          </span>
          <span class="abs" @click="(ptype = !ptype)"
            style="line-height:44px;right: 20px; font-size: 20px; cursor: pointer">
            <svg-icon :name="ptype ? '闭眼' : '睁眼'"></svg-icon>
          </span>
        </a-form-model-item>
        <a-form-model-item prop="repassword" key="repassword">
          <a-input class="hollow" :type="ptype1 ? 'password' : 'text'" v-model="form.repassword" :maxLength="32"
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
        <span class="sniff-link--2" :class="{ blink }" style="margin-left:5px;" @click="(showAgreement = true)">
          {{ $t('同意此项条款') }}
        </span>
      </div>
      <a-button type="black" shape="round" :block="true" :loading="loading" @click="signup">
        {{ $t("注册会员") }}
      </a-button>
      <div class="flex sniff-path--linkgroup">
        <span class="sniff-link" @click="$emit('toLogin')">{{ $t('已有帐户去登录') }}</span>
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
      show: false,
      agreed: process.env.NODE_ENV === 'development',
      form: {
        loginName: process.env.NODE_ENV === 'development' ? 'testApi' + Math.random().toString().slice(3, 7) : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        repassword: process.env.NODE_ENV === 'development' ? '123456' : '',
        customerEmail: process.env.NODE_ENV === 'development' ? '502121489@qq.com' : '',
        verificationCode: process.env.NODE_ENV === 'development' ? '4285' : '',
        langcode: '',
        customerName: process.env.NODE_ENV === 'development' ? '9067' : ''
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
        repassword: useRules({ key: 'plain' }).concat({
          validator: (rule, val, c) => {
            if (val) {
              if (val !== this.form.password) {
                c('※ ' + this.$t('两次密码不一致'))
              } else {
                c()
              }
            } else {
              c()
            }
          },
          trigger: 'blur'
        }),
        customerEmail: useRules({ key: 'email' }),
        verificationCode: useRules({ key: 'plain' }),
        customerName: useRules({ key: 'noblank' })
      },
      loading: false,
      blink: false,
      count: 0,
      ptype: true,
      ptype1: true,
      showAgreement: false
    }
  },
  computed: mapState(['langs', 'lang']),
  watch: {
    lang: {
      handler (v) {
        this.form.langcode = v
      },
      immediate: true
    }
  },
  methods: {
    signup () {
      if (!this.agreed) {
        this.blink = true
        console.log(this.blink)
        setTimeout(() => {
          this.blink = false
        }, 1200)
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const data = {
            ...this.form,
            password: md5(this.form.password)
          }
          const token = await this.sendMessage('request', [
            'signup',
            data
          ]).then(
            (res) => {
              if (res.data.uuid) {
                return this.sendMessage('request', ['setDefault', { uuid: res.data.uuid, systemSource: 1 }]).then(res => {
                  console.log(res)
                  return res.data.token
                })
              }
            },
            (res) => {
              this.$msg(res.data.msg, 'error')
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
$asd: inset 0px 5px 8px 0px #F9EBE4, inset 0px -1px 0px 0px #ffffff,
  inset 0px 0px 0px 0px #F9EBE4;

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
    height: 720px;
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

  .ant-select {
    position: absolute;
    left: 0;
    opacity: 0;
    z-index: 1;
    height: 44px;

    &-open {
      +input {
        box-shadow: $asd;
      }

      ~.sniff-crx-login-icon {
        color: var(--cl-primary);
      }

      ~.sniff-crx-expand {
        transform: scaleY(-1)
      }
    }
  }

  .sniff-tooltip-inner {
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    font-size: 12px;
    padding: 0 10px;
    color: var(--cl-primary);
    text-align: left;
    text-decoration: none;
    word-wrap: break-word;
    background-color: #fff;
    box-shadow: 0px 3px 6px 0px #EFEAE7;
  }

  .ant-tooltip-arrow::before {
    background: #fff;
  }

  .ant-form-item {
    margin-bottom: 30px;
  }

  .ant-input {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    padding-left: 56px;

    &:focus {
      box-shadow: $asd;

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
    box-shadow: inset 0px 5px 8px 0px #F9EBE4, inset 0px -1px 0px 0px #ffffff,
      inset 0px 0px 0px 0px #F9EBE4;
  }

  .sniff-link--2.blink {
    transition: all .2s;
    animation: blink .8s linear 2;
  }

  @keyframes blink {
    0% {
      color: var(--cl-primary);
      transform: scale(1);
    }

    25% {
      color: #f5222d;
      transform: scale(1.05);
    }

    50% {
      color: var(--cl-primary);
      transform: scale(1);
    }

    75% {
      color: #f5222d;
      transform: scale(1.05);
    }

    100% {
      color: var(--cl-primary);
      transform: scale(1);
    }
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
