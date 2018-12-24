export default {
  user: '',
  name: '',
  token: localStorage.getItem('token'),
  noBottom: false,
  isIOS: false,
  isAndroid: false,
  isH5: false,
  h5Url: '',
  realTimeLocation: {
    lat: '',
    lnt: ''
  },
  memberData: {},
  h5Location: '',
  hasBg: false,
  nearestMerchant: {},
  activeShoppingCartTab: 0,
  loginState: false,
  resetShoppingCart: false,
  md5Key: '',
  notifyUrl: '',
  merchantId: ''
}
