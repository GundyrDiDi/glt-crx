# 需求拆分

## [22/11/23 支持英韩泰3国语言登录注册](https://devops.aliyun.com/projex/project/221441d8bff64eda1bf499a01d/sprint/2b4d01d82a4475b12df98c0e49#activeTab=Workitem&viewIdentifier=e23185c964cbf9606c3dca943a&openWorkitemIdentifier=1c15c39372c7f9d6bc96daf55c)

### 登录页修改
1. 添加选择语言下拉框  
2. 添加注册锚点  
3. 添加忘记密码锚点  

### 新增注册页  
1. 功能与client注册页大致相同  
2. 新增用户语言选择，注册接口相应增加参数  

### 谷歌表相关接口添加语言参数  
1. langCode 取用户信息内的语言  

### 主页面新增退出登录按钮
   
### 主页面语言切换修改文字

# 技术指南
入门 https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html  
热更新 https://zhuanlan.zhihu.com/p/103072251  
迁移MV3 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/  
preset模板 https://github.com/Kocal/vue-web-extension-vue3  

# 结构设计
background 内做事件处理
service/store 作为主进程的状态管理，支持本地储存
service/fetch 主进程发的请求接口，约束所有请求都通过主进程来发起

content-script 内通过postmessage获取内部window的值


图搜功能作为工具函数引入

# 代码流程