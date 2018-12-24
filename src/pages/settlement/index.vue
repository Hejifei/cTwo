<template>
  <div class="full-height d-flex default-bg flex-column">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full full-width ofy-auto position-relative">
      <scroller>
        <div class="bg-white border border-bottom pt-5 pb-6">
          <div v-if="orderObj.deliveryType !== 'SELF'" class="px-7">
            <order-address-detail :address-obj="addresses.length>0?addresses[0]:{}"></order-address-detail>
          </div>
          <div v-else class="px-7" @click="goMap">
            <div class="text-14 font-weight-bold text-default">您的订单需要到指定门店自提</div>
            <div class="mt-3 text-13 text-default wb-break-all">
              {{`自提门店： ${merchant.name}`}}
            </div>
            <div class="mt-3 text-13 text-default wb-break-all">
              {{`门店地址： ${merchant.address}`}}
            </div>
          </div>
        </div>
        <div class="full-width">
          <div class="bg-white">
            <div v-for="(item,i) in parentOrders" :key="i">
              <div class="d-flex px-7 py-5">
                <div class="size-2 d-flex flex-column justify-content-center mr-6">
                  <img width="20" height="20" src="/static/images/shop_store.png" alt="">
                </div>
                <div class="text-13 text-default d-flex flex-column justify-content-center">
                  <div class="text-truncate max-width-150 font-weight-bold">
                    {{item.shopName}}
                  </div>
                </div>
              </div>
              <div v-for="(order,i) in item.details" :key="i">
                <div class="default-bg d-flex py-5 px-7">
                  <div class="size-9">
                    <img width="100%" height="100%" :src="order.img" alt="">
                  </div>
                  <div class="ml-8 flex-full d-flex flex-column justify-content-between">
                    <div class="text-12 text-default wb-break-all text-clamp-1">{{order.name}}</div>
                    <div class="text-11 text-gray wb-break-all text-clamp-2">
                      {{order.type}}
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>
                        <span class="text-14 text-red">{{`¥ ${order.price}`}}</span>
                        <span v-if="order.jf" class="text-8 text-default-green-dark">赠{{order.jf}}积分</span>
                      </div>
                      <div class="text-11 text-gray">{{`x ${order.amount}`}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white mt-5">
            <van-cell-group>
              <van-cell class="orderDetail" title="卓越卡" :value="JSON.stringify(B2CData) !== '{}' ? B2CData.custNo : '无'" />
              <van-cell v-if="orderObj.deliveryType !== 'SELF'" class="orderDetail" title="运费" :value="`¥ ${freight?freight:0}`" />
              <van-cell class="orderDetail" title="商品合计" :value="`¥ ${totalAmount}`" />
              <van-cell v-if="totalJf" class="orderDetail" title="累计可获得积分" :value="totalJf" />
            </van-cell-group>
          </div>
        </div>
      </scroller>
    </div>
    <div class="height-5 bg-white foot-shadow">
      <div class="d-flex justify-content-between full-height">
        <div class="d-flex flex-column justify-content-center ml-7">
          <div class="text-15">
            <span class="text-default">实付：</span>
            <span class="text-red">¥ {{payPrice}}</span>
          </div>
        </div>
        <div class="van-button text-13 line-height-50 full-height width-10 bg-default-green-dark text-white text-center" @click="goPay">
          支付订单
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import orderDetail from '../../components/orderDetail'
import orderAddressDetail from '../../components/orderAddressDetail'
import md5 from 'js-md5'
import {
  getOrderById,
  checkCanPay
} from '../../api/settlement/index'
import _ from 'lodash'
import {payOrder} from '../../../static/js/maidian'
// import { parse } from 'path'

export default {
  name: 'settlement',
  data () {
    return {
      title: '订单结算',
      addresses: [],
      addressObj: {},
      merchant: {},
      orders: [],
      shopName: '',
      payPrice: '',
      freight: '',
      shopId: '',
      orderStatus: '',
      totalAmount: '',
      limitTime: '',
      orderObj: {},
      parentOrders: [],
      totalJf: null
    }
  },
  methods: {
    goPay () {
      let md5Key = this.$store.state.md5Key
      checkCanPay('10005', md5(md5Key), this.orderObj.id)
        .then(res => {
          if (res.data.success) {
            // 调用app支付
            let obj = {
              payType: 'c2AppPay',
              // 实付金额
              payFee: this.payPrice,
              // 折扣后的金额（可能没有，非必传
              salePayFee: this.payPrice,
              // 支付倒计时时间 数值类型，时间戳
              // limitTime: this.limitTime,
              // 订单号
              orderNO: this.orderObj.id,
              // 订单描述
              orderDesc: this.payName,
              returnUrl: '',
              // 订单支付成功后的回调页面（支付宝、微信等的回调处理）
              notifyUrl: this.$store.state.notifyUrl,
              merchantId: this.$store.state.merchantId
            }
            if (this.isH5) {
              obj.totalAmount = this.payPrice
              obj.totalIntegral = 0
              obj.productDesc = this.payName
              obj.productTradeNO = this.orderObj.id
              obj.returnUrl = location.href
              // obj.token = ''
              sessionStorage.setItem('payInfo', JSON.stringify(obj))
              // window.location.href = 'https://picture.tiens.com/tiens-h5/html/pay_page.html?from=sdk&back=c2'
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
    init () {
      if (!localStorage.addresses) {
        this.setAdress()
      }
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      this.getMerchant()
      this.getAddresses()
      this.getOrderById()
    },
    setAdress () {
      localStorage.setItem('addresses', JSON.stringify([]))
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    getOrderById () {
      getOrderById({
        parentOrderId: this.$router.currentRoute.query.ids
      })
        .then(res => {
          if (res.data.success) {
            this.orderObj = res.data.data
            this.formatOrder(res.data.data)
          }
        })
    },
    formatOrder (data) {
      this.totalJf = 0
      this.shopName = data.storeDomain ? data.storeDomain.name : ''
      this.payPrice = data.paidAmount
      this.freight = data.freight
      this.shopId = data.merchantId
      this.orderStatus = data.status
      this.totalAmount = data.amount
      this.limitTime = data.gmtCreate
      this.orders = []
      if (data.orderList && data.orderList.length > 0) {
        data.orderList.forEach(o => {
          this.totalJf += Number(o.orderJf)
          let obj = {
            shopName: o.nrcMerchantName,
            details: []
          }
          o.detailList.forEach(item => {
            let subObj = {
              name: item.skuName,
              type: item.skuStandard,
              price: item.amount,
              amount: item.qty,
              img: item.image,
              jf: item.detailJf
            }
            obj.details.push(subObj)
          })
          this.parentOrders.push(obj)
        })
      }
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    },
    // 支付成功的回调
    onSelectPayTypeResult (orderNum, code, message, payMethod, parFee) {
      // 支付成功
      // if (code === '0') {
      //   this.$router.push()
      // } else if (code === '-2') { // 支付取消
      //   this.$router.push()
      // }
      let query = {
        noBottom: true,
        fromSettlement: true,
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
    goMap () {
      this.$store.commit('SET_NEARESTMERCHANT', {data: this.orderObj.storeDomain, dis: ''})
      this.$router.push({name: 'location', query: {noBottom: true}})
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
  components: {
    'tiens-header': tiensHeader,
    'order-detail': orderDetail,
    'order-address-detail': orderAddressDetail
  },
  computed: {
    isIOS () {
      return this.$store.state.isIOS
    },
    isAndroid () {
      return this.$store.state.isAndroid
    },
    isH5 () {
      return this.$store.state.isH5
    },
    memberData () {
      return this.$store.state.memberData
    },
    B2CData () {
      return _.find(this.memberData.list, {memberSource: 'B2C'}) ? _.find(this.memberData.list, {memberSource: 'B2C'}) : {}
    },
    payName () {
      let result = ''
      this.parentOrders.forEach(item => {
        item.details.forEach(subItem => {
          result += `${subItem.name};`
        })
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
  .foot-shadow {
    box-shadow: 0px 0px 2px 0px rgba(155, 155, 155, 0.5);
  }
</style>
