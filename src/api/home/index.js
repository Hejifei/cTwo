/* eslint-disable */
import $http from '../config'
import * as port from '../prot'
import qs from 'qs'

//post demo
export const postDemo = (data) => {
  return $http(port.PORT_MIMS).post('',qs.stringify(data))
}

// 查询制定商户的可用的门店
export const getAllShops = (data) => {
  return $http(port.PORT_MIMS).get('/cloud-mims/store/queryStoresPage', {params: data})
}

// 扫描
export const getGoodsDetailByScan  = (data) => {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcSku/queryNrcSkuDomainByICCode', {params: data})
}

// 根据库存id查询商品
export const getGoodsBySkuId = (skuId) => {
  return $http(port.PORT_VIP).get(`/cloud-vip/tiens/nrcSku/queryNrcSkuDomainBySkuId?skuId=${skuId}`)
}

// 下单
export const placeOrder = function (appid,sign,bodyData) {
  return $http(port.PORT_CHANNEL).post(`/cloud-channel-ext/tiens/nrcOrder/acquireOrder?appid=${appid}&sign=${sign}`, bodyData)
}

//根据手机号查询会员信息
export const getMemberByPhone = function (phone) {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/member/queryMemberDomainByWxCodeMobile?mobile=${phone}`)
}
