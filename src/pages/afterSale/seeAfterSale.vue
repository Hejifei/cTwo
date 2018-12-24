<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title"></tiens-header>
    <div class="mt-2 full-width" v-if="loadingEnded">
      <div v-if="afterSaleObj" class="text-gray text-14 bg-white">
        <div class="py-8 px-7 wb-break-all border border-bottom">
          <span>手机号：</span>
          <span>{{afterSaleObj.mobile}}</span>
        </div>
        <div class="py-8 px-7 wb-break-all border border-bottom">
          <span>申请状态：</span>
          <span>{{afterSaleStatu}}</span>
        </div>
        <div class="py-8 px-7 wb-break-all border border-bottom">
          <span>申请时间：</span>
          <span>{{afterSaleObj.gmtModify | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </div>
        <div class="py-8 px-7 wb-break-all border border-bottom">
          <span>申请原因：</span>
          <span>{{afterSaleObj.cause}}</span>
        </div>
        <div v-if="afterSaleObj.information" class="py-8 px-7 wb-break-all border border-bottom">
          <span>系统回复：</span>
          <span>{{afterSaleObj.information}}</span>
        </div>
      </div>
      <div v-else class="px-7 text-gray text-14">
        <div class="mt-7 text-14 text-center text-gray">
          暂无售后详情
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import { seeAfterSale } from '../../api/afterSale/index'
export default {
  name: 'seeAfterSale',
  data () {
    return {
      title: '售后详情',
      afterSaleObj: null,
      loadingEnded: false
    }
  },
  methods: {
    init () {
      this.loadingEnded = false
      seeAfterSale(this.$router.currentRoute.params.id)
        .then(res => {
          if (res.data.success) {
            this.afterSaleObj = res.data.data
          } else {
            this.$toast(res.data.description)
          }
        })
        .finally(() => {
          this.loadingEnded = true
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    afterSaleStatu () {
      let result = ''
      switch (this.afterSaleObj.status) {
        case 'P':
          result = '已通过'
          break
        case 'A':
          result = '拒绝'
          break
        case 'I':
          result = '初始化'
          break
      }
      return result
    }
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
