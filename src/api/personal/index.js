/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//获取指定用户的所有自提订单列表
export const getAllPickOrdersByMember = function (id) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcOrder/queryOrderByMemberId', {params: {
      memberId: id,
      mobile: '',
      payStatus: '',
      deliveryType: 'SELF'
    }})
}

//获取指定用户的所有配送订单列表
export const getAllExpressOrdersByMember = function (id) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcOrder/queryOrderByMemberId', {params: {
      memberId: id,
      mobile: '',
      payStatus: '',
      deliveryType: 'MERCHANT'
    }})
}
