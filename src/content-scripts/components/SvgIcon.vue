<template>
  <svg class="sniff-svg-icon">
    <use :xlink:href="'#' + name" />
  </svg>
</template>

<script >
const importAll = (requireContext) => requireContext.keys().forEach(requireContext)
importAll(require.context('@/assets/icons', true, /\.svg$/))
export default {
  props: ['name']
}
</script>

<style lang="scss" scoped>
.sniff-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  color: inherit;
  fill: currentColor;
  overflow: hidden;
}
</style>
