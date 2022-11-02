<template>
  <a-modal
    :visible="showModal"
    :zIndex="111111111111"
    :footer="null"
    :width="480"
    centered
    @cancel="$store.commit('showModal',false)"
  >
    <div slot="closeIcon">
      <svg-icon style="font-size:22px;" name="关闭"></svg-icon>
    </div>
    <div class="sniff-crx-modal">
      <div class="sniff-crx-modal-title">{{ $t("绑定谷歌表") }}</div>
      <div>
        <div class="rel flex-ter" style="margin: 50px 0;">
          <a-input v-model="url" :placeholder="$t('请输入谷歌表链接')"></a-input>
          <span v-show="url" class="sniff-input-clear" @click="url=''">
            <svg-icon name="关闭圆"></svg-icon>
          </span>
        </div>
        <div>
          <a-button
            type="black"
            shape="round"
            :block="true"
            :loading="loading"
            :disabled="url===origin"
            @click="bind"
            >{{ $t('确定') }}</a-button
          >
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { mapState } from 'vuex'

const isUrl = (url) => /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/.test(url)

export default {
  data () {
    return {
      origin: '',
      url: '',
      loading: false
    }
  },
  computed: mapState(['lang', 'user', 'showModal']),
  watch: {
    showModal (v) {
      if (v) {
        this.url = this.origin = this.user.googleUrl
      }
    }
  },
  methods: {
    async bind () {
      const googleUrl = this.url
      this.loading = true
      await this.sendMessage('request', ['setGoogleSheet', {
        googleUrl,
        customerId: this.user.customerId
      }]).then(res => {
        this.sendMessage('updateUserData', {})
        this.$store.commit('showModal', false)
        this.$msg('绑定成功')
      }, res => {})
      this.loading = false
    }
  },
  created () {
    this.url = this.origin = this.user.googleUrl
  }
}
</script>
<style lang="scss">
.sniff-crx-modal {
  box-sizing: border-box;
  width: 480px;
  height: 320px;
  background: #fdfdfd;
  border-radius: 12px;
  padding: 40px;
  &-title {
    text-align: center;
    font-weight: 600;
    color: #333333;
    font-size: 20px;
    line-height: 28px;
  }
  .ant-input {
    height: 44px;
    width:100%;
    border-radius:22px;
    padding-right:40px;
  }
  .ant-btn{
    height: 50px;
    border-radius: 30px;
    font-size: 20px;
  }
}
.sniff-input-clear{
    position: absolute;
    right: 12px;
    font-size: 22px;
    color: #aaa;
    cursor: pointer;
    transition:all .2s linear;
    &:hover{
        color:#333;
    }
}
</style>
