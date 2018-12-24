import * as types from './mutation-types'
export default {
  // 最近门店
  nearestMerchantAction ({commit}, value) {
    commit(types.SET_NEARESTMERCHANT, value)
  }
}
