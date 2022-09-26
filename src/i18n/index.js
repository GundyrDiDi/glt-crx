const message = {
  商品同步中: {
    ja: '商品データ同期中...',
    ko: '상품 동기화 중'
  },
  不支持采购: {
    ja: '購買はサポートされていません',
    ko: '구매가 지원되지 않습니다'
  },
  添加商品: {
    ja: '直行便カートに追加',
    ko: '상품추가'
  },
  添加商品成功: {
    ja: 'カートに追加しました',
    ko: '상품 추가 성공'
  },
  添加商品失败: {
    ja: '追加に失敗しました',
    ko: '상품 추가 실패'
  },
  未选择商品规格: {
    ja: 'まだ商品選択していません',
    ko: '미선택상품 규격'
  },
  请先登录系统: {
    ja: 'KAERUアイコンをクリックして \n THE直行便システムにログインして下さい',
    ko: '먼저 시스템에 접속해 주세요.'
  },
  搜索商品名或店舗名: {
    ja: '商品名/店舗名（日本語と中国語で検索可能）',
    ko: '상품명이나 가게 이름 검색.'
  },
  确定: {
    ja: '確定',
    ko: '확인'
  }
}

const create = (langs) => {
  const locale = langs.reduce((acc, v) => ({ [v]: {}, ...acc }), {})
  Object.entries(message).forEach(([key, v]) => {
    langs.forEach((lang) => {
      if (lang !== 'zh') {
        locale[lang][key] = v[lang]
      } else {
        locale[lang][key] = key
      }
    })
  })
  return locale
}

export default create(['ja', 'ko'])
