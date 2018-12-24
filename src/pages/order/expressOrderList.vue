<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title"></tiens-header>
    <div class="border border-bottom d-flex justify-content-around bg-white">
      <div class="text-14 text-default py-4 tab-item"
           v-for="(item,i) in tabs" :key="i"
           :class="{'active':activeTab.index === i}" @click="setActiveTab(item)">
        {{item.name}}
      </div>
    </div>
    <div class="flex-full full-width ofy-auto position-relative">
      <scroller :on-refresh="onRefresh" ref="scroll">
        <div v-if="orders && orders.length > 0">
          <order-item v-for="(item,i) in orders" :key="i" :order-obj="item" @confirm-SH="confirmSH" @cancel-order="cancelOrder" @see-afterSale="seeAfterSale" @do-afterSale="goAfterSale"></order-item>
        </div>
        <div v-else class="text-12 text-center text-gray pt-8">
          没有符合条件的订单
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import orderItem from '../../components/orderItem'
import {getAllOrdersByCondations, cancelOrder, confirmSH} from '../../api/order/index'
import _ from 'lodash'
import axios from 'axios'
import md5 from 'js-md5'

export default {
  name: 'liftOrderList',
  data () {
    return {
      isLoading: false,
      title: '配送订单',
      tabs: [
        {
          name: '全部订单',
          status: '',
          index: 0
        },
        {
          name: '待付款',
          status: 'W',
          index: 1
        },
        {
          name: '待发货',
          status: 'S',
          index: 2
        },
        {
          name: '待收货',
          status: 'D',
          index: 3
        }
      ],
      activeTab: {},
      orders: null
    }
  },
  methods: {
    init () {
      this.setInitActiveTab()
      if (this.memberData.id) {
        this.getAllOrdersByCondations(this.activeTab.status)
      }
    },
    setInitActiveTab () {
      if (!localStorage.getItem('activeOrderTab')) {
        this.activeTab = {
          name: '全部订单',
          status: '',
          index: 0
        }
        localStorage.setItem('activeOrderTab', JSON.stringify(this.activeTab))
      } else {
        this.activeTab = JSON.parse(localStorage.getItem('activeOrderTab'))
      }
    },
    setActiveTab (data) {
      if (!this.isLoading) {
        localStorage.setItem('activeOrderTab', JSON.stringify(data))
        this.activeTab = data
        this.getAllOrdersByCondations(data.status)
      }
    },
    onRefresh () {
      this.init()
    },
    getAllOrdersByCondations (payStatus = '') {
      this.isLoading = true
      getAllOrdersByCondations({
        memberId: this.memberData.id,
        mobile: '',
        payStatus: payStatus,
        deliveryType: 'MERCHANT'
      })
        .then(res => {
          if (res.data.data && res.data.data.length > 0) {
            this.formatOrders(res.data.data)
          } else {
            this.orders = null
          }
        })
        .finally(() => {
          this.$refs.scroll.finishPullToRefresh()
          this.isLoading = false
        })
    },
    formatOrders (data) {
      this.orders = []
      data.forEach(item => {
        let obj = {
          state: item.status,
          id: item.id,
          items: [],
          deliveryType: item.deliveryType,
          totalPayPrice: item.paidAmount,
          totalAmount: 0
        }
        if (item.orderList && item.orderList.length > 0) {
          item.orderList.forEach(orderItem => {
            let orderObj = {
              shopName: orderItem.nrcMerchantName,
              // payPrice: orderItem.paidAmount,
              // totalAmount: orderItem.qty,
              details: [],
              merchantId: orderItem.merchantId,
              storeId: orderItem.storeId,
              status: orderItem.orderStatus,
              asId: orderItem.asId,
              orderId: orderItem.id,
              virticalCountNum: 0,
              outBizNo: orderItem.outBizNo
            }
            obj.totalAmount += orderItem.qty
            if (orderItem.detailList && orderItem.detailList.length > 0) {
              orderItem.detailList = _.orderBy(orderItem.detailList, 'isVirtual', 'asc')
              orderItem.detailList.forEach(detailItem => {
                if (detailItem.isVirtual === '1') {
                  orderObj.virticalCountNum++
                }
                let detailObj = {
                  img: detailItem.image ? detailItem.image : '',
                  type: detailItem.skuStandard,
                  name: detailItem.skuName,
                  amount: detailItem.qty,
                  price: detailItem.amount,
                  jf: detailItem.detailJf,
                  orderId: detailItem.orderId,
                  isVirtual: detailItem.isVirtual,
                  mayaSkuOrder: detailItem.mayaSkuOrder ? detailItem.mayaSkuOrder : ''
                }
                orderObj.details.push(detailObj)
              })
            }
            obj.items.push(orderObj)
          })
        }
        this.orders.push(obj)
      })
    },
    cancelOrder (order) {
      let self = this
      this.$dialog.confirm({
        message: '是否确定取消订单',
        title: '提示'
      })
        .then(() => {
          cancelOrder(order.id)
            .then(res => {
              if (res.data.success) {
                self.$toast('取消成功')
                setTimeout(() => {
                  self.init()
                }, 500)
              } else {
                self.$toast(res.data.description)
              }
            })
        })
    },
    goAfterSale (order) {
      this.$router.push({name: 'afterSale', params: {id: order.orderId}, query: {noBottom: true}})
    },
    seeAfterSale (order) {
      this.$router.push({name: 'seeAfterSale', params: {id: order.asId}, query: {noBottom: true}})
    },
    confirmSH (orders) {
      let self = this
      this.$dialog.confirm({
        message: '是否确认收货',
        title: '提示'
      })
        .then(() => {
          let md5Key = this.$store.state.md5Key
          let requests = []
          orders.items.forEach(item => {
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
                  self.init()
                }, 500)
              } else {
                self.$toast(errorMsg)
              }
            })
        })
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    }
  },
  components: {
    'tiens-header': tiensHeader,
    'order-item': orderItem
  },
  watch: {
    'memberData' () {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-item{
    border-bottom: 2px solid transparent;
  }
  .active{
    color: #009943 !important;
    border-bottom: 2px solid #009943 !important;
  }
  .calc-height{
    height: calc(100vh - 101px);
  }
</style>
