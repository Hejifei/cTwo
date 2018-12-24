<template>
  <div class="full-width">
    <div class="bg-white">
      <div class="d-flex px-7 py-5">
        <div class="size-2 d-flex flex-column justify-content-center mr-6">
          <img width="20" height="20" src="/static/images/shop_store.png" alt="">
        </div>
        <div class="text-13 text-default d-flex flex-column justify-content-center">
          <div class="text-truncate max-width-150 font-weight-bold">
            {{order.shop}}
          </div>
        </div>
      </div>
      <div class="default-bg d-flex py-5 px-7">
        <div class="size-9">
          <img width="100%" height="100%" :src="order.img" alt="">
        </div>
        <div class="ml-8 flex-full d-flex flex-column justify-content-between">
          <div class="text-12 text-default wb-break-all">{{order.name}}</div>
          <div class="text-11 text-gray wb-break-all">
            {{order.type}}
          </div>
          <div class="d-flex justify-content-between">
            <div class="text-11 text-red">{{`¥ ${order.price}`}}</div>
            <div class="text-11 text-gray">{{`x ${order.amount}`}}</div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between  height-4 line-height-40">
        <div class="ml-7 text-14 text-default">卓越卡</div>
        <div class="mr-7 text-14 text-default d-flex">
          <div class="mr-3">{{JSON.stringify(B2CData) !== '{}' ? B2CData.custNo : '无'}}</div>
          <!--<div class="d-flex flex-column justify-content-center">-->
            <!--<van-icon name="arrow" class="text-gray text-12"></van-icon>-->
          <!--</div>-->
        </div>
      </div>

    </div>
    <div class="bg-white mt-5">
      <van-cell-group>
        <van-cell v-if="!$router.currentRoute.query.real" class="orderDetail" title="运费" :value="`¥ ${order.freight?order.freight:0}`" />
        <van-cell class="orderDetail" title="商品合计" :value="`¥ ${order.totalAmount}`" />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'orderDetail',
  props: {
    order: {
      type: Object,
      require: true
    }
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    },
    B2CData () {
      return _.find(this.memberData.list, {memberSource: 'B2C'}) ? _.find(this.memberData.list, {memberSource: 'B2C'}) : {}
    }
  }
}
</script>
