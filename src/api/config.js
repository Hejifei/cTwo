import axios from 'axios'

import {
  Toast
} from 'vant'
// import store from '@/store'

const $http = function (port) {
  const http = axios.create({
    timeout: 30000,
    // 测试环境
    baseURL: 'https://o2otest.tiens.com'
    // 正式环境
    // baseURL: 'https://o2o.tiens.com'
  })

  // 请求拦截
  http.interceptors.request.use(config => {
    Toast.loading({
      duration: 0,
      forbidClick: false,
      loadingType: 'circular'
    })
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    // if (store.getters.token) {
    //   config.headers['token'] = store.getters.token
    // }
    return config
  }, error => {
    Promise.reject(error)
  })
  // 响应拦截
  http.interceptors.response.use(res => {
    Toast.clear()
    return res
  }, error => {
    Toast.clear()
    Toast({
      message: error.message,
      type: 'fail',
      duration: 3000
    })
    return Promise.reject(error)
  })
  return http
}

export default $http
