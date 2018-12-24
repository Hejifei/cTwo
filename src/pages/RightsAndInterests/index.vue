<template>
  <div class="full-height d-flex flex-column bg-white">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full full-width default-bg position-relative">
      <scroller ref="scroll">
        <div v-if="qrs && qrs.length > 0">
          <div class="RightsAndInterests-bg">
            <img class="RightsAndInterests-bg-img" :src="img" alt="">
          </div>
          <div class="mt-3 text-center">
            <div class="text-17">{{name}}</div>
            <div class="mt-3 text-12 text-gray">{{orderId}}</div>
            <div class="mt-3 width-9 mx-auto clearfix">
              <div class="text-12 text-red fl">
                <span class="mr-1">¥</span>
                <span class="text-14">{{price}}</span>
              </div>
              <div class="text-13 text-default fr">
                <span class="mr-1">x</span>
                <span>{{num}}</span>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <!--repeat-->
            <div v-for="(item,i) in qrs" :key="i" class="mb-15 d-flex justify-content-center full-width">
              <div class="d-flex flex-column">
                <div class="size-20 bg-white qr-shadow">
                  <div class="p-6">
                    <qrcode class="full-width full-height" :value="item.barCode"></qrcode>
                  </div>
                </div>
                <div class="mt-4 d-flex">
                  <div class="qr-item-tab">{{formatQrStatu(item.barCodeStatus)}}</div>
                  <div class="text-14 text-default mt-2 ml-3">{{item.barCode}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-center text-gray text-14 mt-7">
            暂无权益码
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'
import {seeRightsAndInterestsCodes} from '../../api/RightsAndInterests/index'
import md5 from 'js-md5'
import Qrcode from '@xkeshi/vue-qrcode'

export default {
  name: 'RightsAndInterests',
  data () {
    return {
      qrs: [],
      title: '权益码',
      name: '',
      price: '',
      num: '',
      img: '',
      orderId: ''
    }
  },
  methods: {
    init () {
      if (this.memberData.id) {
        let md5Key = this.$store.state.md5Key
        seeRightsAndInterestsCodes('10005', md5(md5Key), this.memberData.id, this.$router.currentRoute.query.mayaSkuOrder)
          .then(res => {
            if (res.data.success) {
              if (res.data.data) {
                this.qrs = JSON.parse(res.data.data).result
                let routerQuery = this.$router.currentRoute.query
                this.img = routerQuery.img
                this.name = routerQuery.name
                this.price = routerQuery.price
                this.num = routerQuery.num
                this.orderId = routerQuery.orderId
              }
            } else {
              this.$toast(res.data.description)
            }
          })
      }
    },
    formatQrStatu (code) {
      let result = ''
      switch (parseInt(code)) {
        case 0:
          result = '未核销'
          break
        case 1:
          result = '已核销'
          break
        case 2:
          result = '线下已退'
          break
      }
      return result
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    }
  },
  watch: {
    'memberData' () {
      this.init()
    }
  },
  components: {
    'tiens-header': tiensHeader,
    'qrcode': Qrcode
  }
}
</script>
<style>
  .RightsAndInterests-bg{
    width: 100%;
    height: 160px;
    background-image: url("/static/images/RightsAndInterests/RightsAndInterests_bg.png");
    background-size: 100% 100%;
    position: relative;
  }
  .RightsAndInterests-bg-img{
    position: absolute;
    width: 90px;
    height: 90px;
    bottom: 20px;
    left: 50%;
    margin-left: -45px;
  }
  .qr-shadow{
    box-shadow: 0px 0px 12px 6px rgba(31, 31, 31, 0.21);
  }
  .qr-item-tab{
    width: 60px;
    height: 22px;
    border-radius: 12px;
    background-color: rgba(0, 153, 67, 1);
    color: white;
    font-size: 13px;
    line-height: 23px;
    text-align: center;
  }
</style>
