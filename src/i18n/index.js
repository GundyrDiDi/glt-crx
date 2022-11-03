const message = {
  未选择商品规格: {
    en: 'No product SKU has been selected',
    ko: '상품규격 미선택'
  },
  搜索商品名或店舗名: {
    en: 'Enter a product or shop',
    ko: '상품명이나 가게명 검색.'
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
    en: 'By Password',
    ko: '아이디 비밀번호 로그인'
  },
  邮箱验证码登录: {
    en: 'By Email',
    ko: '이메일 로그인'
  },
  请输入账号: {
    en: 'Your username',
    ko: '아이디를 입력해주세요'
  },
  请输入密码: {
    en: 'Your password',
    ko: '비밀번호를 입력해주세요'
  },
  请输入邮箱: {
    en: 'Your email address',
    ko: '이메일을 입력해주세요'
  },
  请输入验证码: {
    en: 'Verification code',
    ko: '인증번호를 입력해주세요'
  },
  获取验证码: {
    en: 'Verify',
    ko: '인증번호 발송'
  },
  发送中: {
    en: 'Waiting',
    ko: '인증번호 발송중'
  },
  验证码已发送: {
    en: 'The Verification Code has been send to your email',
    ko: '인증번호가 이미 발송되었습니다'
  },
  账号或密码错误: {
    en: 'Incorrect username or password',
    ko: '아이디 또는 비밀번호가 틀렸습니다.'
  },
  邮箱或验证码错误: {
    en: 'Incorrect email or code',
    ko: '이메일 혹은 인증번호가 틀렸습니다.'
  },
  '此邮箱未注册,请先注册': {
    en: 'The email address has\'t been registered yet.Please contact our service staff',
    ko: '아직 등록되지않은 이메일입니다. 회원가입을 해주세요'
  },
  忘记密码: {
    en: 'Forgot password',
    ko: '비밀번호를 잃어버렸습니다'
  },
  注册会员: {
    en: 'Sign up',
    ko: '회원가입'
  },
  无效内容: {
    en: 'Invalid content',
    ko: '잘못된 내용'
  },
  仅限输入英文和数字字符: {
    en: 'English Characters and Numbers Only',
    ko: '영문이나 숫자만 입력할 수 있습니다.'
  },
  无效邮箱: {
    en: 'Invalid email address',
    ko: '존재하지 않는 이메일입니다.'
  },
  必填内容: {
    en: 'Invalid content',
    ko: '반드시 입력'
  },
  英语: {
    en: 'English',
    ko: '영어'
  },
  韩语: {
    en: 'Korean',
    ko: '한국어'
  },
  绑定谷歌表: {
    en: 'Edit Your Google Sheets',
    ko: 'Google 시트 연동'
  },
  查看谷歌表: {
    en: 'My Sheets',
    ko: '내 구글 시트보기'
  },
  请输入谷歌表链接: {
    en: 'Enter the google sheet URL',
    ko: 'Google 시트 URL을 입력해 주세요'
  },
  谷歌表: {
    en: 'the Google sheets',
    ko: 'Google 시트'
  },
  绑定X后即可选购商品: {
    en: 'You can buy products after binding X',
    ko: 'X 연동후 상품을 선택할 수 있습니다.'
  },
  绑定: {
    en: 'Bind',
    ko: '연동'
  },
  解绑: {
    en: 'Unbind',
    ko: '연동해제'
  },
  绑定成功: {
    en: 'Bind succeeded',
    ko: '연동 성공'
  },
  数量: {
    en: 'Qty',
    ko: '수량'
  },
  我要代购: {
    en: 'I Want To Buy',
    ko: '상품구매하러 가기'
  },
  写入成功: {
    en: 'Entered succeeded',
    ko: '가져오기 성공'
  },
  写入失败: {
    en: 'Entered Failed',
    ko: '가져오기 실패'
  },
  删除失败: {
    en: 'Delete failed',
    ko: '삭제 실패'
  },
  登录状态失效: {
    en: 'Login status is invalid',
    ko: '로그인 상태 비활성화'
  },
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
