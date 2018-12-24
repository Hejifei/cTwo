import * as types from './mutation-types'

export default {
  [types.SET_TOKEN]: (state, token) => {
    state.token = token
  },
  [types.SET_BOTTOM]: (state, value) => {
    state.noBottom = value
  },
  [types.SET_ISIOS]: (state, value) => {
    state.isIOS = value
  },
  [types.SET_ISANDROID]: (state, value) => {
    state.isAndroid = value
  },
  [types.SET_ISH5]: (state, value) => {
    state.isH5 = value
  },
  [types.SET_H5URL]: (state, value) => {
    state.h5Url = value
  },
  [types.SET_REALTIMELOCATION]: (state, value) => {
    state.realTimeLocation = value
  },
  [types.SET_MEMBERDATA]: (state, value) => {
    state.memberData = value
  },
  [types.SET_H5LOCATION]: (state, value) => {
    state.h5Location = value
  },
  [types.SET_HASBG]: (state, value) => {
    state.hasBg = value
  },
  [types.SET_NEARESTMERCHANT]: (state, value) => {
    state.nearestMerchant = value
  },
  [types.SET_ACTIVESHOPPINGCARTTAB]: (state, value) => {
    state.activeShoppingCartTab = value
  },
  [types.SET_LOGINSTATE]: (state, value) => {
    state.loginState = value
  },
  [types.SET_RESETSHOPPINGCART]: (state) => {
    state.resetShoppingCart = !state.resetShoppingCart
  },
  [types.SET_MD5KEY]: (state, value) => {
    state.md5Key = value
  },
  [types.SET_NOTIFYURL]: (state, value) => {
    state.notifyUrl = value
  },
  [types.SET_MERCHANTID]: (state, value) => {
    state.merchantId = value
  }
}
