/* eslint-disable */
import $http from '../config'
import * as port from '../prot'

//获取指定商户下的所有分类
export const getClassificationByMerchantId = function (data) {
  return $http(port.PORT_SPUMS).get('/cloud-spums/category/queryAllCategoryByNoSpu', {params: data})
}

//获取指定商户和指定父分类下的所有子分类
export const getSubClassificationByMerchantIdAndParentId = function (data) {
  return $http(port.PORT_VIP).get('/cloud-vip/tiens/category/queryCategoryListByParentId', {params: data})
}
