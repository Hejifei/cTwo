<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full ofy-auto position-relative">
      <scroller>
        <!--根据订单状态调整-->
        <div class="height-10 full-width bg-default-green-dark">
          <div class="px-12 d-flex justify-content-between full-height">
            <div class="d-flex flex-column justify-content-center">
              <div class="text-white">
                <div class="text-16">{{orderStatus}}</div>
                <div class="text-12 mt-1 wb-break-all" v-if="orderObj.orderList && orderObj.orderList.length > 0">
                  <span>订单编号： </span>
                  <span class="wb-break-all">{{orderObj.id}}</span>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column justify-content-center">
              <img v-if="orderStatus1 === 'W'" width="74" height="100" src="/static/images/order/shop_dfk.png" alt="">
              <img v-if="orderStatus1 === 'D'" width="74" height="100" src="/static/images/order/shop_dsh.png" alt="">
              <img v-if="orderStatus1 === 'S' && orderObj.deliveryType !== 'SELF'" width="74" height="100" src="/static/images/order/shop_dfh.png" alt="">
              <img v-if="orderStatus1 === 'S' && orderObj.deliveryType === 'SELF'" width="74" height="100" src="/static/images/order/shop_dqh.png" alt="">
            </div>
          </div>
        </div>
        <div class="full-width bg-white py-5 border border-bottom">
          <div v-if="orderObj.deliveryType !== 'SELF'" class="px-7">
            <order-address-detail :address-obj="addressesObj"></order-address-detail>
          </div>
          <div v-else class="px-7" @click="goMap">
            <div class="text-14 font-weight-bold text-default">您的订单需要到指定门店自提</div>
            <div class="mt-3 text-13 text-default wb-break-all">
              {{`自提门店： ${shopName}`}}
            </div>
            <div class="mt-3 text-13 text-default wb-break-all">
              {{`门店地址： ${shopLocation}`}}
            </div>
          </div>
        </div>
        <div class="full-width">
          <div class="bg-white">
            <div v-for="(item,i) in parentOrders" :key="i">
              <div class="d-flex px-7 py-5">
                <div class="d-flex flex-column justify-content-center">
                  <div class="size-2 d-flex flex-column justify-content-center mr-6">
                    <img width="20" height="20" src="/static/images/shop_store.png" alt="">
                  </div>
                </div>
                <div class="text-13 text-default d-flex justify-content-between full-width">
                  <div class="d-flex flex-column justify-content-center">
                    <div class="text-truncate max-width-150 font-weight-bold">
                      {{item.shopName}}
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="(order,i) in item.details" :class="{'mb-2': i !== item.details.length - 1}" :key="i">
                <div class="default-bg d-flex px-7 py-5">
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
                <div class="default-bg d-flex justify-content-end px-7">
                  <div class="pb-5" v-if="order.isVirtual === '1'" :class="{'mr-4': order.isVirtual !== '1' && i === (item.details.length - item.virticalCountNum - 1) && (item.status === 'T' || item.status === 'R' || item.status === 'D')}">
                    <div @click="goRights(order)" class="van-button text-13 px-5 order-button text-default">权益码</div>
                  </div>
                  <div class="pb-5" v-if="order.isVirtual !== '1' && i === (item.details.length - item.virticalCountNum - 1) && (item.status === 'T' || item.status === 'R' || item.status === 'D')">
                    <div v-if="item.asId" @click="seeAfterSale(item)"  class="van-button text-13 px-5 order-button text-default">查看售后</div>
                    <div v-else @click="goAfterSale(item)"  class="van-button text-13 px-5 order-button text-default">申请售后</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white">
            <van-cell-group>
              <van-cell title="卓越卡" :value="JSON.stringify(B2CData) !== '{}' ? B2CData.custNo : '无'" />
              <van-cell v-if="orderObj.deliveryType !== 'SELF'" class="orderDetail" title="运费" :value="`¥ ${freight?freight:0}`" />
              <van-cell class="orderDetail" title="商品合计" :value="`¥ ${totalAmount}`" />
              <van-cell v-if="totalJf" class="orderDetail" title="累计可获得积分" :value="totalJf" />
            </van-cell-group>
          </div>
        </div>
        <div v-if="orderObj.orderList && orderObj.orderList.length > 0" class="full-width bg-white mt-8 mb-4">
          <div class="px-7 py-5 text-13 text-gray">
            <div class="d-flex justify-content-between">
              <div>
                <span class="mr-2">订单编号：</span>
                <span>{{orderObj.id}}</span>
              </div>
              <div class="d-flex flex-column justify-content-center">
                <button v-clipboard="orderObj.id" @success="copyOrderNo" class="copy-btn bg-white van-button height-2 line-height-20 width-4 text-12 text-gray order-border-gary">复制</button>
              </div>
            </div>
            <div class="mt-4">
              <span class="mr-2">创建时间：</span>
              <span>{{orderObj.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <!--<div class="mt-3">-->
            <!--<span class="mr-2">付款时间：</span>-->
            <!--<span>{{orderObj.orderList[0].orderNo}}</span>-->
            <!--</div>-->
            <div v-if="orderObj.orderList[0].gmtDeliver" class="mt-4">
              <span class="mr-2">发货时间：</span>
              <span>{{orderObj.orderList[0].gmtDeliver | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div v-if="orderObj.orderList[0].gmtReceive" class="mt-4">
              <span class="mr-2">成交时间：</span>
              <span>{{orderObj.orderList[0].gmtReceive | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <div class="height-4 full-width bg-white d-flex justify-content-between">
      <div class="d-flex justify-content-center flex-column">
        <div class="pl-7">
          <span class="text-15 text-default mr-1">实付：</span>
          <span class="text-15 text-red">¥ {{payPrice}}</span>
        </div>
      </div>
      <div class="d-flex justify-content-center flex-column">
        <div class="pr-7">
          <!--<div v-if="(orderStatus1 === 'D' || orderStatus1 === 'R')&& orderObj.deliveryType !== 'SELF'" @click="goLogistics" class="van-button text-13 px-5 order-button text-default">查看物流</div>-->
          <!-- <div v-if="orderStatus1 === 'W' || orderStatus1 === 'I'" @click="goPay" class="van-button text-13 px-5 order-button text-default">去付款</div> -->
          <div v-if="orderStatus1 === 'W'" @click="goPay" class="van-button text-13 px-5 order-button text-default">去付款</div>
          <div v-if="orderStatus1 === 'D' && orderObj.deliveryType !== 'SELF' && hasNotVirtical" @click="confirmSH" class="van-button text-13 px-5 order-button text-default">确认收货</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import orderItem from '../../components/orderItem'
import orderDetail from '../../components/orderDetail'
import orderAddressDetail from '../../components/orderAddressDetail'
import {
  getOrderById,
  checkCanPay,
  confirmSH,
  getProvinceByCode,
  getCityByCode,
  getCountyByCode
} from '../../api/order/index'
import md5 from 'js-md5'
import _ from 'lodash'
import {payOrder} from '../../../static/js/maidian'
import axios from 'axios'

export default {
  name: 'orderDetail',
  data () {
    return {
      title: '订单详情',
      order: {},
      orderObj: {},
      merchant: {},
      shopName: '',
      shopLocation: '',
      addressesObj: {},
      payPrice: '',
      freight: '',
      shopId: '',
      orderStatus1: '',
      totalAmount: '',
      orders: [],
      resultAddress: '',
      parentOrders: [],
      totalJf: null,
      hasNotVirtical: false
    }
  },
  methods: {
    init () {
      this.parentOrders = []
      this.getOrderById()
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      this.getMerchant()
    },
    getOrderById () {
      getOrderById({
        parentOrderId: this.$router.currentRoute.params.id
      })
        .then(res => {
          if (res.data.success) {
            this.orderObj = res.data.data
            if (this.orderObj.deliveryType === 'SELF') {
              this.formatOrder(res.data.data)
            } else {
              this.formAddressLocation(res.data.data.orderList[0].nrcDeliverDomain, res.data.data)
            }
          }
        })
    },
    formatOrder (data) {
      this.hasNotVirtical = false
      this.totalJf = 0
      this.shopLocation = data.storeDomain.address
      this.shopName = data.storeDomain.name
      this.payPrice = data.paidAmount
      this.freight = data.freight
      this.shopId = data.merchantId
      this.orderStatus1 = data.status
      this.totalAmount = data.amount
      this.orders = []
      if (data.orderList && data.orderList.length > 0) {
        data.orderList.forEach(o => {
          this.totalJf += Number(o.orderJf)
          let obj = {
            shopName: o.nrcMerchantName,
            details: [],
            status: o.orderStatus,
            asId: o.asId,
            orderId: o.id,
            virticalCountNum: 0
          }
          o.detailList = _.orderBy(o.detailList, 'isVirtual', 'asc')
          o.detailList.forEach(item => {
            if (!item.isVirtual || item.isVirtual !== '1') {
              this.hasNotVirtical = true
            }
            if (item.isVirtual === '1') {
              obj.virticalCountNum++
            }
            let subObj = {
              name: item.skuName,
              type: item.skuStandard,
              price: item.amount,
              amount: item.qty,
              img: item.image,
              jf: item.detailJf,
              orderId: item.orderId,
              isVirtual: item.isVirtual,
              mayaSkuOrder: item.mayaSkuOrder ? item.mayaSkuOrder : ''
            }
            obj.details.push(subObj)
          })
          this.parentOrders.push(obj)
        })
      }
    },
    goLogistics () {
      this.$router.push({path: '/logistics', query: {noBottom: true}})
    },
    confirmSH () {
      let self = this
      this.$dialog.confirm({
        message: '是否确认收货',
        title: '提示'
      })
        .then(() => {
          let md5Key = this.$store.state.md5Key
          let requests = []
          this.orderObj.orderList.forEach(item => {
            requests.push(
              confirmSH(md5(md5Key), '10005', item.merchantId, item.outBizNo, 'R')
            )
          })
          axios.all(requests)
            .then(res => {
              let noError = true
              let errorMsg = ''
              for (let i = 0; i < res.length; i++) {
                if (!res[i].data.success) {
                  noError = false
                  errorMsg = res[i].data.description
                  break
                }
              }
              if (noError) {
                self.$toast('确认收货成功')
                setTimeout(() => {
                  self.$router.back(-1)
                }, 500)
              } else {
                self.$toast(errorMsg)
              }
            })
        })
    },
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
              // limitTime: '',
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
              // window.location.href = 'http://localhost:3000/tiens-wallet/demo/html/pay_page.html?from=sdk&back=c2'
              window.location.href = 'https://' + location.host + '/tiens-h5/html/pay_page.html?from=sdk&back=c2'
              return false
            } else {
              if (this.isIOS) {
                obj.returnUrl = location.href + '&payback=h5&code=0&backurl=personal&nouse=1'
                sessionStorage.setItem('payInfo', JSON.stringify(obj))
                window.webkit.messageHandlers.onSelectPayType.postMessage(JSON.stringify(obj))
              }
              if (this.isAndroid) {
                obj.returnUrl = location.href + '&payback=h5&code=0&backurl=personal&statusBarHeight=' + sessionStorage.getItem('statusBarHeight') + '&nouse=1'
                sessionStorage.setItem('payInfo', JSON.stringify(obj))
                window.android.onSelectPayType(JSON.stringify(obj))
              }
            }
          } else {
            this.$toast(res.data.description)
          }
        })
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    },
    formAddressLocation (data, parent) {
      this.resultAddress = ''
      let requests = [
        getProvinceByCode(data.provinceId),
        getCityByCode(data.cityId),
        getCountyByCode(data.districtId)
      ]
      axios.all(requests)
        .then(res => {
          if (res[0].data.success) {
            this.resultAddress += res[0].data.data.provinceName + ' / '
          }
          if (res[1].data.success) {
            this.resultAddress += res[1].data.data.cityName + ' / '
          }
          if (res[2].data.success) {
            this.resultAddress += res[2].data.data.countyName + ' / '
          }
          this.resultAddress += data.addr
          this.addressesObj = {
            name: this.orderObj.orderList[0].nrcDeliverDomain.customerName,
            phone: this.orderObj.orderList[0].nrcDeliverDomain.callNum,
            location: this.resultAddress
          }
          this.formatOrder(parent)
        })
    },
    // 支付成功的回调
    onSelectPayTypeResult (orderNum, code, message, payMethod, parFee) {
      // let query = {
      //   noBottom: true
      // }
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
      // this.$router.push({name: 'orderDetail', params: {id: orderNum}, query: query})
      if (code === '0') {
        this.init()
      }
    },
    goMap () {
      this.$store.commit('SET_NEARESTMERCHANT', {data: this.orderObj.storeDomain, dis: ''})
      this.$router.push({name: 'location', query: {noBottom: true}})
    },
    copyOrderNo () {
      this.$toast('复制成功')
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
      }
    },
    goRights (order) {
      let query = {
        img: order.img,
        name: order.name,
        num: order.amount,
        price: order.price,
        noBottom: true,
        mayaSkuOrder: order.mayaSkuOrder,
        orderId: order.orderId
      }
      this.$router.push({name: 'RightsAndInterests', query: query})
    },
    goAfterSale (order) {
      this.$router.push({name: 'afterSale', params: {id: order.orderId}, query: {noBottom: true}})
    },
    seeAfterSale (order) {
      this.$router.push({name: 'seeAfterSale', params: {id: order.asId}, query: {noBottom: true}})
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
      if (this.$router.currentRoute.query.orderStatus) {
        if (this.isAndroid) {
          window.android.isShowSubTitle(false)
        } else if (this.isIOS) {
          window.webkit.messageHandlers.isShowSubTitle.postMessage(false)
        }
        // 小通分期
        if (this.$router.currentRoute.query.orderStatus === '1006') {
          let code = this.$router.currentRoute.query.code
          let payInfo = JSON.parse(sessionStorage.payInfo)
          this.onSelectPayTypeResult(payInfo.orderNO, code, '', '5', payInfo.parFee)
        }
      } else if (this.$router.currentRoute.query.orderStatus === undefined) {
        let code = this.$router.currentRoute.query.code
        let payMethod = this.$router.currentRoute.query.payMethod
        let payInfo = JSON.parse(sessionStorage.payInfo)
        this.onSelectPayTypeResult(payInfo.orderNO, code, '', payMethod, payInfo.parFee)
      }
    }
  },
  components: {
    'tiens-header': tiensHeader,
    'order-item': orderItem,
    'order-detail': orderDetail,
    'order-address-detail': orderAddressDetail
  },
  computed: {
    orderStatus () {
      let result
      switch (this.orderStatus1) {
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
      this.parentOrders.forEach((item, i) => {
        item.details.forEach((subItem, j) => {
          result += `${subItem.name};`
        })
      })
      return result
    },
    memberData () {
      return this.$store.state.memberData
    },
    B2CData () {
      return _.find(this.memberData.list, {memberSource: 'B2C'}) ? _.find(this.memberData.list, {memberSource: 'B2C'}) : {}
    },
    payback () {
      return this.$router.currentRoute.query.payback
    }
  }
}
</script>
<style lang="scss" scoped>
  .order-button{
    height: 27px;
    line-height: 27px;
    border: 1px solid #232323 !important;
  }
  .order-border-gary{
    border: 1px solid #848484;
  }
</style>
