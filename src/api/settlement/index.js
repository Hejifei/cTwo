/* eslint-disable */
import $http from '../config'
import * as port from '../prot'
import qs from 'qs'

// 获取订单详情
export const getOrderById = (data) => {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcOrder/queryOrderDetailByParentOrderNo', {params: data})
}

//支付前调用验证接口是否可支付口
export const checkCanPay = (appid,sign,orderId) => {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/nrcOrder/verificationPay?appid=${appid}&sign=${sign}&orderId=${orderId}`)
}
