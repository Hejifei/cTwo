/* eslint-disable */
import $http from '../config'
import * as port from '../prot'
import qs from 'qs'

// 根据查询条件筛选商品
export const getGoodsByCondations = (data) => {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/nrcSpu/queryHotNrcSpusPage', {params: data})
}
