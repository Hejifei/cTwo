// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import store from './store'
// import 'vant/lib/vant-css/index.css'
import 'vant/lib/index.css';
import 'lib-flexible'
import 'scssTool/index.scss'
import * as types from './store/mutation-types'
import BaiduMap from 'vue-baidu-map'
import moment from 'moment'
import VueScroller from 'vue-scroller'
import VueClipboards from 'vue-clipboards'
import {
  Toast
} from 'vant'
// require('../static/js/vconsole.js')
require('../static/js/maidian.js')
require("babel-polyfill");
import { Lazyload } from 'vant'

// options 为可选参数，无则不传
Vue.use(Lazyload, {
  loading: '/static/images/tiens-default.png',
  error: '/static/images/tiens-default.png',
  attempt: 1
});

Vue.use(VueClipboards)

Vue.use(VueScroller)

Vue.use(Vant)
Vue.use(BaiduMap, {
  ak: 'bcCZEZkRcGlzO8GLNKpHFOUismi3Qu9e'
})
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.filter('phoneEncrypt', function (str) {
  let result = str ? str.substr(0, 3) + '****' + str.substr(7) : str
  return result
})

Vue.prototype.calculateDistanct = function (lat1,lng1,lat2,lng2){
  var result;
  if (lat1 !== lat2 && lng1 !== lng2) {
    var f = (lat1 + lat2) / 2 * Math.PI / 180.0
    var g = (lat1 - lat2) / 2 * Math.PI / 180.0
    var l = (lng1 - lng2) / 2 * Math.PI / 180.0

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s,c,w,r,d,h1,h2;
    var a = 6378137.0;
    var fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;
    result = ((d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg))) / 1000).toFixed(2);
  } else {
    result = 0
  }
  return result
}

Vue.config.productionTip = false

//判断 Android or iOS
var u = navigator.userAgent
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
store.commit(types.SET_ISANDROID, isAndroid)
store.commit(types.SET_ISIOS, isiOS)
if (localStorage.getItem('fromWhere') === 'h5') {
  store.commit(types.SET_ISH5, true)
}
if (localStorage.getItem('h5Url') !== undefined ) {
  store.commit(types.SET_H5URL, localStorage.getItem('h5Url'))
}
// 测试环境
var md5Key = '10005TIENS-C2'
var notifyUrl = 'http://192.168.3.22:8080/tiens-console/get/common/consumeBackUrl'
var merchantId = 'experienceshop001'
// 正式环境
// var md5Key = '10005WALLETKZ976X47'
// var notifyUrl = 'https://wallet.pointswin.com/tiens-console/get/common/consumeBackUrl'
// var merchantId = '10001'

store.commit(types.SET_MD5KEY, md5Key)
store.commit(types.SET_NOTIFYURL, notifyUrl)
store.commit(types.SET_MERCHANTID, merchantId)


router.beforeEach((to, from, next) => {
  if (from.name) {
    if (!store.state.loginState) {
      Toast.clear()
      Toast({
        message: '登录过期，请重新登录',
        duration: 500
      })
      setTimeout(() => {
        if (store.state.isIOS) {
          window.webkit.messageHandlers.onClosePage.postMessage(null)
        }
        if (store.state.isAndroid) {
          window.android.onClosePage()
        }
      }, 500)
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
