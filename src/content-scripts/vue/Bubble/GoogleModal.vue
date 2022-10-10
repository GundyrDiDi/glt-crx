<template>
  <a-modal
    :visible="visible"
    title="Basic Modal"
    :zIndex="111111111111"
    :footer="null"
    :width="480"
    centered
    @cancel="$emit('hide', false)"
  >
    <div class="sniff-crx-modal">
      <div class="sniff-crx-modal-title">{{ $t("绑定谷歌表") }}</div>
      <div>
        <div style="margin: 50px 0;">
          <a-input v-model="url"></a-input>
        </div>
        <div>
          <a-button
            type="primary"
            shape="round"
            :block="true"
            :loading="loading"
            @click="bind"
            >{{ $t("绑定") }}</a-button
          >
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
  model: {
    prop: 'visible',
    event: 'hide'
  },
  props: ['visible'],
  data () {
    return {
      origin: '',
      url: '',
      loading: false
    }
  },
  computed: mapState(['lang', 'user']),
  methods: {
    bind () {
      this.$emit('hide', false)
    }
  },
  created () {
    this.url = this.origin = this.lang
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
  }
  .ant-btn{
    height: 50px;
    border-radius: 30px;
    font-size: 20px;
  }
}
</style>
