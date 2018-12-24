/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//提交申请售后
export const submitAfterSale = function (sign, appid, orderId, cause) {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/nrcAS/saveNrcAS?sign=${sign}&appid=${appid}&orderId=${orderId}&cause=${cause}`)
}

//查看售后
export const seeAfterSale = function (id) {
  return $http(port.PORT_VIP).get(`/cloud-vip/tiens/nrcAS/queryById?id=${id}`)

}
