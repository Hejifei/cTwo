/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//查看玛雅权益码
export const seeRightsAndInterestsCodes = function (appid, sign, memberId, mayaBackOrderId) {
  return $http(port.PORT_CHANNEL).post(`/cloud-channel-ext/maya/queryVirtualOrderBarCode?appid=${appid}&sign=${sign}&memberId=${memberId}&mayaBackOrderId=${mayaBackOrderId}`)
}
