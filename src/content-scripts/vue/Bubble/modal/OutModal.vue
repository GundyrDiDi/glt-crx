<template>
  <a-modal
    :get-container="()=>$root.$el"
    :visible="outModal"
    :zIndex="200000001"
    :footer="null"
    :width="440"
    centered
    @cancel="$store.commit('outModal',false)"
  >
    <div slot="closeIcon">
      <svg-icon style="font-size:22px;" name="关闭"></svg-icon>
    </div>
    <div class="sniff-crx-modal">
      <div class="sniff-crx-modal-title">{{ $t("您确定退出登录吗") }}</div>
      <div class="sniff_info--1">{{$t('退出登录后进货袋内的商品信息保留')}}</div>
      <div class="sniff_btn--group">
        <a-button type="plain" shape="round"
        @click="$store.commit('outModal',false)"
        >{{ $t('取消') }}</a-button>
        <a-button type="black" shape="round"
        @click="$store.commit('outModal',false);sendMessage('write', ['userData', {}])"
        >{{ $t('确定') }}</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: mapState(['outModal']),
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
  }
}
</script>
<style lang="scss" scoped>
.sniff-crx-modal {
  box-sizing: border-box;
  width: 440px;
  height: 300px;
  background: #fdfdfd;
  border-radius: 12px;
  padding: 40px;
  &-title {
    text-align: center;
    font-weight: 600;
    color: #333333;
    font-size: 20px;
    line-height: 28px;
    margin-top:40px;
  }
  .sniff_info--1{
    margin-top:20px;
    color: #565656;
    line-height: 22px;
    text-align: center;
  }
  .sniff_btn--group{
    margin-top:50px;
    button{
      width: 170px;
      height: 50px;
    }
    button+button{
      margin-left:20px;
    }
  }
}
</style>
