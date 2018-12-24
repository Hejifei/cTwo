<template>
  <div class="full-width bg-white mb-5">
    <!--订单状态-->
    <div class="full-width">
      <div v-for="(item,i) in orderObj.items" :key="i" @click="goOrderDetail(orderObj)">
        <div class="py-5 px-7 d-flex justify-content-between">
          <div class="d-flex">
            <div class="size-2 d-flex flex-column justify-content-center mr-6">
              <img width="20" height="20" src="/static/images/shop_store.png" alt="">
            </div>
            <div class="text-13 text-default d-flex flex-column justify-content-center">
              <div class="text-truncate max-width-150">
                {{item.shopName}}
              </div>
            </div>
          </div>
          <div v-if="i === 0" class="text-13 text-default-green-dark">{{orderStatus}}</div>
        </div>
        <div v-for="(detail,j) in item.details" :class="{'mb-2': j !== item.details.length - 1}" :key="j">
          <div class="default-bg d-flex py-5 px-7">
            <div class="size-9">
              <img width="100%" height="100%" :src="detail.img" alt="">
            </div>
            <div class="ml-8 flex-full d-flex flex-column justify-content-between">
              <div class="text-12 text-default wb-break-all text-clamp-1">{{detail.name}}</div>
              <div class="text-11 text-gray wb-break-all text-clamp-2">
                {{detail.type}}
              </div>
              <div class="d-flex justify-content-between">
                <div>
                  <span class="text-14 text-red">{{`¥ ${detail.price}`}}</span>
                  <span v-if="detail.jf" class="text-8 text-default-green-dark">赠{{detail.jf}}积分</span>
                </div>
                <div class="text-11 text-gray">{{`x ${detail.amount}`}}</div>
              </div>
            </div>
          </div>
          <div v-if="detail.isVirtual !== '1' && j === (item.details.length - item.virticalCountNum - 1) && (item.status === 'T' || item.status === 'R' || item.status === 'D')" class="default-bg d-flex justify-content-end pb-5 px-7">
            <div v-if="item.asId" @click.stop="seeAfterSale(item)" class="van-button text-13 px-5 order-button text-default">查看售后</div>
            <div v-else @click.stop="doAfterSale(item)" class="van-button text-13 px-5 order-button text-default">申请售后</div>
          </div>
        </div>
      </div>
      <div class="text-12 text-default text-right py-5 px-7 border border-bottom">
        <span>{{`共${orderObj.totalAmount}件商品`}}</span>
        <span class="ml-2">实付：</span>
        <span class="ml-2 text-red">{{`¥ ${orderObj.totalPayPrice}`}}</span>
      </div>
      <div v-if="orderObj.state ==='I' || orderObj.state ==='W' || orderObj.state === 'D'" class="full-width bg-white">
        <div class="py-5 px-7">
          <div class="d-flex flex-row-reverse">
            <div class="d-flex">
              <div @click="cancelOrder(orderObj)" v-if="orderObj.state === 'W' || orderObj.state === 'I'" class="van-button text-13 px-5 order-button mr-5 text-default">取消订单</div>
              <div @click="goPay(orderObj)" v-if="orderObj.state === 'W'" class="van-button text-13 px-5 order-button text-default">去付款</div>
              <!-- <div @click="goPay(orderObj)" v-if="orderObj.state === 'W' || orderObj.state === 'I'" class="van-button text-13 px-5 order-button text-default">去付款</div> -->
              <div @click="goSH(orderObj)" v-if="orderObj.state === 'D' && orderObj.deliveryType !== 'SELF' && hasNotVirtical" class="van-button text-13 px-5 order-button text-default">确认收货</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {checkCanPay} from '../api/order/index'
import md5 from 'js-md5'
import {payOrder} from '../../static/js/maidian'
import _ from 'lodash'

export default {
  name: 'orderItem',
  props: {
    orderObj: {
      type: Object,
      required: true
    }
  },
  methods: {
    init () {
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      this.getMerchant()
    },
    goOrderDetail (data) {
      this.$router.push({name: 'orderDetail', params: {id: data.id}, query: {noBottom: true}})
    },
    goPay (data) {
      let md5Key = this.$store.state.md5Key
      checkCanPay('10005', md5(md5Key), data.id)
        .then(res => {
          if (res.data.success) {
            // 调用app支付
            let obj = {
              payType: 'c2AppPay',
              // 实付金额
              payFee: data.totalPayPrice,
              // 折扣后的金额（可能没有，非必传
              salePayFee: data.totalPayPrice,
              // 支付倒计时时间 数值类型，时间戳
              // limitTime: '',
              // 订单号
              orderNO: data.id,
              // 订单描述
              orderDesc: this.payName,
              returnUrl: '',
              // 订单支付成功后的回调页面（支付宝、微信等的回调处理）
              notifyUrl: this.$store.state.notifyUrl,
              merchantId: this.$store.state.merchantId
            }
            if (this.isH5) {
              obj.totalAmount = data.totalPayPrice
              obj.totalIntegral = 0
              obj.productDesc = this.payName
              obj.productTradeNO = this.orderObj.id
              obj.returnUrl = location.href
              // obj.token = ''
              sessionStorage.setItem('payInfo', JSON.stringify(obj))
              // window.location.href = 'https://picture.tiens.com/tiens-h5/html/pay_page.html?from=sdk&back=c2'
              // window.location.href = 'http://localhost:3000/tiens-wallet/demo/html/pay_page.html?from=sdk&back=c2'
              window.location.href = 'https://' + location.host + '/tiens-h5/html/pay_page.html?from=sdk&back=c2'
              return false
            } else {
              if (this.isIOS) {
                obj.returnUrl = 'https://' + location.host + '/#/orderDetail/' + obj.orderNO + '?noBottom=true&payback=h5&code=0&backurl=personal&nouse=1'
                sessionStorage.setItem('payInfo', JSON.stringify(obj))
                window.webkit.messageHandlers.onSelectPayType.postMessage(JSON.stringify(obj))
              }
              if (this.isAndroid) {
                obj.returnUrl = 'https://' + location.host + '/#/orderDetail/' + obj.orderNO + '?noBottom=true&payback=h5&code=0&backurl=personal&statusBarHeight=' + sessionStorage.getItem('statusBarHeight') + '&nouse=1'
                sessionStorage.setItem('payInfo', JSON.stringify(obj))
                window.android.onSelectPayType(JSON.stringify(obj))
              }
            }
          } else {
            this.$toast(res.data.description)
          }
        })
    },
    cancelOrder (order) {
      this.$emit('cancel-order', order)
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    },
    // 支付成功的回调
    onSelectPayTypeResult (orderNum, code, message, payMethod, parFee) {
      let query = {
        noBottom: true,
        backurl: 'personal'
      }
      payOrder(window.clab_tracker, {
        'source': '电子钱包体验店',
        'contentName': '电子钱包体验店',
        'date': new Date().toISOString(),
        'targetId': 'Tiens_ewallet_store',
        'targetName': '电子钱包体验店',
        'channelname': '体验店',
        'storename': this.merchant.name,
        'paymentMethod': this.switchPayMethod(payMethod),
        'paymentAmount': parFee,
        'identityType': 'c_exstore_member',
        'identityValue': this.memberData.id
      })
      if (code === '0') {
        setTimeout(() => {
          this.$router.push({name: 'orderDetail', params: {id: orderNum}, query: query})
        }, 800)
      }
    },
    switchPayMethod (method) {
      switch (method) {
        case '0':
          return '支付宝'
        case '1':
          return '微信'
        case '2':
          return '快捷支付'
        case '3':
          return '余额'
        case '4':
          return '赢粉宝'
        case '5':
          return '小通分期'
      }
    },
    doAfterSale (order) {
      this.$emit('do-afterSale', order)
    },
    seeAfterSale (order) {
      this.$emit('see-afterSale', order)
    },
    goSH (data) {
      this.$emit('confirm-SH', data)
    }
  },
  mounted () {
    var isPageHide = false
    // 兼容ios返回不刷新的问题
    window.addEventListener('pageshow', () => {
      if (isPageHide) {
        window.location.reload()
      }
    })
    window.addEventListener('pagehide', () => {
      isPageHide = true
    })
    // 隐藏webview顶部菜单
    if (this.isH5) {
    } else {
      if (this.isIOS) {
        window.webkit.messageHandlers.isShowSubTitle.postMessage(false)
      }
      if (this.isAndroid) {
        window.android.isShowSubTitle(false)
      }
    }
    this.init()
    window.onSelectPayTypeResult = this.onSelectPayTypeResult
    if (this.payback === 'h5') {
      let code = this.$router.currentRoute.query.code
      let payMethod = this.$router.currentRoute.query.payMethod
      let payInfo = JSON.parse(sessionStorage.payInfo)
      this.onSelectPayTypeResult(payInfo.orderNO, code, '', payMethod, payInfo.parFee)
    }
  },
  computed: {
    orderStatus () {
      let result
      switch (this.orderObj.state) {
        case 'I':
          result = '初始化'
          break
        case 'W':
          result = '待付款'
          break
        case 'S':
          result = this.orderObj.deliveryType === 'SELF' ? '待取货' : '待发货'
          break
        case 'D':
          result = '待收货'
          break
        case 'C':
          result = '订单取消'
          break
        case 'T':
          result = '已提货'
          break
        case 'F':
          result = '支付失败'
          break
        case 'R':
          result = '已收货'
          break
      }
      return result
    },
    isH5 () {
      return this.$store.state.isH5
    },
    isIOS () {
      return this.$store.state.isIOS
    },
    isAndroid () {
      return this.$store.state.isAndroid
    },
    payName () {
      let result = ''
      this.orderObj.items.forEach((item, i) => {
        item.details.forEach(subItem => {
          result += `${subItem.name};`
        })
      })
      return result
    },
    memberData () {
      return this.$store.state.memberData
    },
    hasNotVirtical () {
      let result = false
      this.orderObj.items.forEach(item => {
        let index = _.findIndex(item.details, (o) => {
          return !o.isVirtual || o.isVirtual !== '1'
        })
        if (index > -1) {
          result = true
        }
      })
      return result
    },
    payback () {
      return this.$router.currentRoute.query.payback
    }
  }
}
</script>
<style lang="scss" scoped>
  .max-width-150{
    max-width: 150px !important;
  }
  .order-button{
    height: 27px;
    line-height: 27px;
    border: 1px solid #232323 !important;
  }
</style>
