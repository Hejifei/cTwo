/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//获取所有省
export const getAllpro = function () {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/province/queryAllProvince')
}

//获取指定省的所有市
export const getCityByProCode = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/city/queryAllCityByProvince', {params: data})
}

//获取指定市的所有区县
export const getCountryByCityCode = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/county/queryAllCountyByCity', {params: data})
}
