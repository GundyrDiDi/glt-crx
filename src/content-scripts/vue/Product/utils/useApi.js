/* eslint-disable camelcase */

import md5 from 'md5'

// 尝试使用universal-cookie替换
import Cookies from '@/plugins/cookie'

import http from 'axios'
import { getUrlParams } from './useExt'

export const tbSign = (obj) => {
  const data = JSON.stringify(obj)
  const token = (Cookies.get('_m_h5_tk') ?? '').split('_')[0]
  const t = Date.now()
  const appKey = 12574478
  return {
    jsv: '2.6.1',
    appKey,
    t,
    sign: md5(`${token}&${t}&${appKey}&${data}`),
    api: 'mtop.taobao.pcdetail.data.get',
    v: '1.0',
    isSec: 0,
    encode: 0,
    dataType: 'json',
    valueType: 'string',
    ttid: '2022@taobao_litepc_9.17.0',
    AntiFlood: true,
    AntiCreep: true,
    preventFallback: true,
    type: 'json',
    data,
    fromSniff: true
  }
}

/**
 * 调取淘宝商品接口，获取商品信息
 * @returns
 */
export const tmGoodsApi = () => {
  const urlPrams = getUrlParams()
  // const api = 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/' 失败
  const api = 'https://h5api.m.tmall.com/h5/mtop.taobao.pcdetail.data.get/1.0/'
  const detail_v = '3.3.2'
  const domain = 'https://detail.tmall.com'
  const path_name = 'item.htm'
  const queryParams = location.search.slice(1)
  const obj = {
    id: urlPrams.id,
    detail_v,
    exParams: JSON.stringify({
      ...urlPrams,
      queryParams,
      domain,
      path_name
    })
  }
  const params = tbSign(obj)
  console.log(params)
  return http.get(api, { params }).then((res) => {
    const { props, skus } = res.data?.data?.skuBase ?? {}
    const { shopName } = res.data?.data?.seller ?? {}
    return { props, skus, shopName }
  })
}

// const data = {
//   id: '598265939499',
//   detail_v: '3.3.2',
//   exParams: {
//     de_count: '1',
//     id: '598265939499',
//     pvid: '07478e57-f53b-46ba-8a1d-f7566a47af95',
//     scm: '1007.40986.275655.0',
//     spm: 'a21bo.jianhua.201876.2.5af911d9YvSDvH',
//     queryParams: 'de_count=1&id=598265939499&pvid=07478e57-f53b-46ba-8a1d-f7566a47af95&scm=1007.40986.275655.0&spm=a21bo.jianhua.201876.2.5af911d9YvSDvH',
//     domain: 'https://detail.tmall.com',
//     path_name: '/item.htm'
//   }
// }
