<template>
    <div>
        <a-popover v-model="dropdown" trigger="click" placement="bottom" overlayClassName="sniff-crx-lang"
            :arrowPointAtCenter="true">
            <span class="rel" style="cursor: pointer; height: 10px; display: inline-flex">
                <svg-icon name="切换语言" style="font-size: 16px"></svg-icon>
                <span class="rel" style="line-height: 1; margin-left: 3px;position:relative;top:1px">
                    {{ langs.find((v) => v.value === lang).label }}
                </span>
                <svg-icon class="rel" name="展开" style="font-size: 9px; top: 2px; left: 2px"
                    :style="{ transform: `scale(${dropdown ? -1 : 1})` }"></svg-icon>
            </span>
            <a-menu slot="content" id="sniff-popover">
                <a-menu-item v-for="v in langs" :key="v.value" @click="setLang(v)">
                    {{ v.label }}
                </a-menu-item>
            </a-menu>
        </a-popover>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dropdown: false
    }
  },
  computed: mapState(['langs', 'lang']),
  methods: {
    setLang (v) {
      this.sendMessage('write', ['lang', v.value])
      this.dropdown = false
    }
  }
}
</script>
<style lang="scss" scoped>
#sniff-popover {
  border-radius: 4px;
}
#sniff-popover .ant-menu-item {
  width: 100px;
  padding: 0px 10px;
  margin: 0;
  line-height: 30px;
  height: 30px;
  font-size: 12px;
  &:hover,
  &.ant-menu-item-selected {
    background: #fffdfc;
    font-weight: 500;
    color: #f96113;
  }
}
</style>
