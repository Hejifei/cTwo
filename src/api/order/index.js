/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//获取指定用户的所有自提订单列表
export const getAllOrdersByCondations = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcOrder/queryOrderByMemberId', {params: data})
}

//获取指定id的订单
export const getOrderById = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcOrder/queryOrderDetailByParentOrderNo', {params: data})
}

//支付前调用验证接口是否可支付口
export const checkCanPay = (appid,sign,orderId) => {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/nrcOrder/verificationPay?appid=${appid}&sign=${sign}&orderId=${orderId}`)
}

//确认收货
export const confirmSH = (sign, appid, merchantId, outBizNo, status) => {
  return $http().post(`/cloud-channel-ext/tiens/syncOrderStatus?sign=${sign}&appid=${appid}&merchantId=${merchantId}&outBizNo=${outBizNo}&status=${status}`)
}

//取消订单
export const cancelOrder = (orderId) => {
  return $http().post(`/cloud-channel-ext/tiens/nrcOrder/cancelOrder?parentOrderId=${orderId}`)
}

// 获取省份信息
export const getProvinceByCode = (id) => {
  return $http().get(`/cloud-vip/tiens/province/queryProvinceByCode?provinceCode=&dntProvinceId=${id}`)
}

// 获取市区信息
export const getCityByCode = (id) => {
  return $http().get(`/cloud-vip/tiens/city/queryCityByCode?cityCode=&dntCityId=${id}`)
}

// 获取县城信息
export const getCountyByCode = (id) => {
  return $http().get(`/cloud-vip/tiens/county/queryCountyByCode?countyCode=&dntCountyId=${id}`)
}
