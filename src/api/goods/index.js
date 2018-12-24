/* eslint-disable */
import $http from '../config'
import * as port from '../prot'
import qs from "qs";

//获取指定分类下的所有商品列表
export const getGoodsByCategoryId  = function(data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcSpu/queryHotNrcSpusPage',{params: data})
}

//获取指定商家下的所有商品列表
export const getGoodsByMerchantId  = function(data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcSpu/queryNrcSpuByMerchantId',{params: data})
}

//获取符合条件的商品列表
export const getGoodsByCondations = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcSpu/queryHotNrcSpusPage',{params: data})
}

//获取指定商品的信息
export const getGoodsDetailById = function (data) {
  return $http(port.PORT_SPUMS).get('/cloud-spums/nrcSpu/querySpuDetailDomainBySpuIdStoreCode',{params: data})
}

//下单
export const placeOrder = function (appid,sign,bodyData) {
  return $http(port.PORT_CHANNEL).post(`/cloud-channel-ext/tiens/nrcOrder/acquireOrder?appid=${appid}&sign=${sign}`, bodyData)
}
