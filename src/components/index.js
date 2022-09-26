import Vue from 'vue'
const requireComponent = require.context(
  '.',
  true,
  /\.vue$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.match(/([^/]*).vue/)[1]
  Vue.component(componentName, componentConfig.default || componentConfig)
})
