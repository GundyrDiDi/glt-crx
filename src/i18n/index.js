const message = {
  未选择商品规格: {
    en: 'Please check Product SKU has been selected',
    ko: '미선택상품 규격'
  },
  搜索商品名或店舗名: {
    en: 'Enter product name or shop name',
    ko: '상품명이나 가게 이름 검색.'
  },
  确定: {
    en: 'OK',
    ko: '확인'
  },
  登录: {
    en: 'Sign in',
    ko: '로그인'
  },
  账号密码登录: {
    en: 'By Username',
    ko: ''
  },
  邮箱验证码登录: {
    en: 'By Email',
    ko: ''
  },
  请输入账号: {
    en: 'Your username'
  },
  请输入密码: {
    en: 'Your password'
  },
  请输入邮箱: {
    en: 'Your email address'
  },
  请输入验证码: {
    en: 'Verification code'
  },
  获取验证码: {
    en: 'Verify'
  },
  发送中: {
    en: 'Waiting'
  },
  验证码已发送: {
    en: 'The Verification Code has been send to your email'
  },
  账号或密码错误: {
    en: 'Incorrect username or password'
  },
  邮箱或验证码错误: {
    en: 'Incorrect email or code'
  },
  '此邮箱未注册,请先注册': {
    en: 'The email address has\'t been registered yet.Please contact our service staff'
  },
  忘记密码: {
    en: 'Forgot password'
  },
  注册会员: {
    en: 'Sign up'
  },
  无效内容: {
    en: 'Invalid content'
  },
  仅限输入英文和数字字符: {},
  无效邮箱: {
    en: 'Invalid email address'
  },
  必填内容: {
    en: 'Invalid content'
  },
  英语: {
    en: 'English'
  },
  韩语: {
    en: 'Korean'
  },
  绑定谷歌表: {
    en: 'Bind Your Google Sheet'
  },
  查看谷歌表: {
    en: 'My List'
  },
  请输入谷歌表链接: {
    en: 'Enter the google sheet url'
  },
  绑定: {
    en: 'Bind'
  },
  解绑: {
    en: 'Unbind'
  },
  绑定成功: {
    en: ''
  },
  数量: {
    en: 'Qty'
  },
  件: {
    en: ''
  },
  我要代购: {
    en: 'Want To Buy'
  },
  写入成功: {},
  写入失败: {},
  $: {}
}

const create = (langs) => {
  const locale = langs.reduce((acc, v) => ({ [v]: {}, ...acc }), {})
  Object.entries(message).forEach(([key, v]) => {
    langs.forEach((lang) => {
      locale[lang][key] = v[lang] ?? key
    })
  })
  return locale
}

export default create(['en', 'ko', 'zh'])
