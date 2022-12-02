<template>
  <a-modal
    :get-container="()=>$root.$el"
    :visible="show"
    :zIndex="200000001"
    :footer="null"
    :width="700"
    centered
    @cancel="$emit('close')"
  >
    <div slot="closeIcon">
      <svg-icon style="font-size:22px;" name="关闭"></svg-icon>
    </div>
    <div class="sniff-crx-modal">
      <!-- <div class="sniff-crx-modal-title">{{ $t("利用规约") }}</div> -->
      <div v-html="html[lang]"></div>
    </div>
  </a-modal>
</template>
<script>
import { mapState } from 'vuex'
import html from '../static/html'

export default {
  props: ['show'],
  data () {
    return {
      html,
      origin: '',
      url: '',
      loading: false
    }
  },
  computed: mapState(['lang'])
}
</script>
<style lang="scss" scoped>
.sniff-crx-modal {
  box-sizing: border-box;
  width: 700px;
  height: 800px;
  background: #fdfdfd;
  border-radius: 12px;
  padding: 40px;
  overflow: auto;
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
