/* eslint-disable */
import $http from '../config'
import * as port from '../prot'
import qs from 'qs'

//下单
export const placeOrder = function (appid,sign,bodyData) {
  return $http(port.PORT_CHANNEL).post(`/cloud-channel-ext/tiens/nrcOrder/acquireOrder?appid=${appid}&sign=${sign}`, bodyData)
}
