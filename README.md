# 需求拆分

## [22/11/23 支持英韩泰3国语言登录注册](https://devops.aliyun.com/projex/project/221441d8bff64eda1bf499a01d/sprint/2b4d01d82a4475b12df98c0e49#activeTab=Workitem&viewIdentifier=e23185c964cbf9606c3dca943a&openWorkitemIdentifier=1c15c39372c7f9d6bc96daf55c)

### 全局修改
1. 提取语言切换组件 ✔
2. 样式调整  ✔
3. 主题色修改 ✔

### 登录页修改
1. 添加选择语言下拉框  ✔
2. 添加注册锚点  ✔
3. 添加忘记密码锚点  ✔
4. 验证码请求添加langCode参数 ✔

### 新增注册页  
1. 功能与client注册页大致相同  ✔
2. 新增用户语言选择，注册接口相应增加参数  ✔
3. 利用规约  ✔

### 谷歌表相关接口添加语言参数  
1. langCode 取用户信息内的语言  ✔

### 主页面修改
1. 新增退出按钮 ✔
2. 新增退出弹框 ✔
3. 主页面语言切换的选项文字改为固定的 ✔

# 技术指南
入门 https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html  
热更新 https://zhuanlan.zhihu.com/p/103072251  
迁移MV3 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/  
preset模板 https://github.com/Kocal/vue-web-extension-vue3  

# 结构设计

## 概述
background 内做事件处理  
service/store 作为主进程的状态管理，支持本地储存  
service/fetch 主进程发的请求接口，原则上约束所有请求都通过主进程来发起  

content-script 内通过postmessage获取网页内部window的值  
根据内部window的值创建不同的Vue实例，统一挂载到 [id=__sniff_v1_crx__] 上  
__sniff_v1_crx__ 元素作为注入到页面的根组件，所有其他视图和功能一般都放在元素内部  

图搜功能作为工具函数引入，分为保存图片文件和调取平台图搜接口  

其他 assets、directives、i18n、plugins等文件和web项目结构一样作为公共目录

## 主进程

### background
onMessage事件参数，第一个参数是send的传入值，约束传入值为 {cmd:string,data:any} 类型，cmd作为派发的方法名，data作为方法的传入参数。  

dispatch内定义所有的派发方法。

几种通用的方法：
1. read 读取本地数据
2. write 数据写入到本地
3. request 发起 fetch 请求

全局的状态管理逻辑与发起请求逻辑都会放在内。

### store
定义了本地初始值。  
封装了 chrome.storage 的读取写入方法，统一改为异步返回。  
封装了保存图片方法。

### fetch
由于 service worker 内只允许 fetch 方式的请求，所以简单封装了fetch，行为类似于axios的 http 对象。

暴露出的 apis 对象内定义所有的请求。

## content-script
content-script 目录下，结构上尽量设计得与普通业务项目一样。

主要分为4块组件，登录，浮窗，图搜按钮，加购按钮。

```sh
    |-- content-script.js         // 执行入口
    |-- components
    |   |-- SvgIcon.vue
    |-- main                      // 在加载时执行的事件
    |   |-- always.js             // 所有tab加载后都会执行，目前只有搜图
    |   |-- detailData.js         // 工具函数，匹配商详页数据
    |   |-- listen.js             // 监听到传输内部window的数据时，执行
    |   |-- match.js              // 匹配tab页内数据，传输到listen
    |   |-- store.js              // 当前tab页内的状态数据
    |   |-- vue.js                // 
    |-- vue                   // vue视图
        |-- Crx.vue           // 根组件
        |-- Attach
        |   |-- AttachImage.vue    // 图搜按钮
        |-- Bubble
        |   |-- Index.vue          // 浮窗根组件
        |   |-- GoogleModal.vue    // 谷歌表编辑弹窗
        |   |-- Pocket.vue         // 谷歌表的商品列表
        |   |-- Search.vue         // 搜索商品名
        |-- Login
        |   |-- Login.vue          //
        |-- Product
            |-- Index.vue          // 加购按钮
            |-- Parabola.vue       // 抛物线动画
            |-- hook
                |-- 1688.js        // 加购时匹配sku的方法
                |-- taobao.js      // ..
                |-- tmall.js       // ..
```

### main


### 浮窗

### 加购

### 图搜

## search-image

# 代码流程
业务代码逻辑
