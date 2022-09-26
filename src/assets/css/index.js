// 加载css文件列表
const includes = []
const requireComponent = require.context('./', true, /\.(c|sa|sc)ss$/)
requireComponent.keys().forEach((fileName) => {
  if (includes.length) {
  } else {
    requireComponent(fileName)
  }
})
