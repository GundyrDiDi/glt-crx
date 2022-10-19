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
            <!-- <template #label> nameOrEmail </template> -->
            <a-input
              class="hollow"
              v-model="form.nameOrEmail"
              :placeholder="$t('请输入账号')"
              name="sniff_login_nameOrEmail"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item prop="password" key="password">
            <!-- <template #label> password </template> -->
            <a-input
              class="hollow"
              type="password"
              v-model="form.password"
              :placeholder="$t('请输入密码')"
              name="sniff_login_password"
            ></a-input>
          </a-form-model-item>
        </template>
        <template v-else>
          <a-form-model-item prop="customerEmail" key="customerEmail">
            <!-- <template #label> customerEmail </template> -->
            <a-input
              class="hollow"
              v-model="form.customerEmail"
              :placeholder="$t('请输入邮箱')"
              name="sniff_login_customerEmail"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item prop="verificationCode" key="verificationCode">
            <!-- <template #label> verificationCode </template> -->
            <a-input
              class="hollow"
              style="width:240px;"
              v-model="form.verificationCode"
              :placeholder="$t('请输入验证码')"
              name="sniff_login_verificationCode"
            ></a-input>
            <a-button type="primary"
            style="height:40px;margin-left:15px;font-size:12px;width:100px;"
            >{{$t('获取验证码')}}</a-button>
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
      loading: false,
      enter: 0
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
            'loginByPwd',
            data
          ]).then((res) => res.data.token)
          await this.sendMessage('setUserData', { token })
          await this.sendMessage('updateUserData')
          this.loading = false
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
    width: 480px;
    padding: 20px 40px;
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
    padding-left: 40px;
  }
  .ant-form-explain {
    font-size: 12px;
  }
  .ant-btn {
    height: 50px;
    border-radius: 30px;
    // background: #008060;
  }
}
</style>
