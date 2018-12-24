/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//绑定B2C
export const bindCard = function (sign,appid,mobile,custNo,password) {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/member/bindingB2CMember?sign=${sign}&appid=${appid}&mobile=${mobile}&custNo=${custNo}&password=${password}`)
}

export const getMemberByPhone = function (phone) {
  return $http(port.PORT_VIP).post(`/cloud-vip/tiens/member/queryMemberDomainByWxCodeMobile?mobile=${phone}`)
}
