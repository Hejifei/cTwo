<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title"></tiens-header>
    <div class="mt-7 full-width">
      <div class="px-7">
        <div class="tiens-card-item">
          <div class="px-5 pb-5 border-bottom d-flex justify-content-between">
            <div class="text-15 text-default font-weight-bold">钱包</div>
            <div class="text-15 text-default-green-dark">已绑定</div>
          </div>
          <div class="px-5 py-12 border-bottom">
            <van-row>
              <van-col span="8">
                <div class="text-center">
                  <div class="text-gray text-12">积分</div>
                  <div class="mt-2 text-orange text-24">{{JSON.stringify(walletData) !== '{}' ? walletData.integral: '0'}}</div>
                </div>
              </van-col>
              <van-col span="8">
                <div class="text-center">
                  <div class="text-gray text-12">可提现余额</div>
                  <div class="mt-2 text-orange text-24">{{JSON.stringify(walletData) !== '{}' ? walletData.balance: '0.00'}}</div>
                </div>
              </van-col>
              <van-col span="8">
                <div class="text-center">
                  <div class="text-gray text-12">不可提现余额</div>
                  <div class="mt-2 text-orange text-24">{{JSON.stringify(walletData) !== '{}' ? walletData.freeezenBalance: '0.00'}}</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="px-5 pt-5">
            <div class="d-flex justify-content-between">
              <div class="text-14 text-default">账号</div>
              <div class="text-15 text-gray">{{JSON.stringify(walletData) !== '{}' ? walletData.mobile: '无'}}</div>
            </div>
            <div class="d-flex justify-content-between mt-5">
              <div class="text-14 text-default">级别</div>
              <div class="text-15 text-gray">{{JSON.stringify(walletData) !== '{}' ? walletData.memberLevel: '无'}}</div>
            </div>
          </div>
        </div>
        <div class="tiens-card-item">
          <div class="px-5 pb-5 border-bottom d-flex justify-content-between">
            <div class="text-15 text-default font-weight-bold">直销</div>
            <div v-if="JSON.stringify(B2CData) === '{}'" class="text-15 text-default-green-dark" @click="goBinding('zhixiao')">去绑定</div>
            <div v-else class="text-15 text-default-green-dark">已绑定</div>
          </div>
          <div class="px-5 pt-5">
            <div class="d-flex justify-content-between">
              <div class="text-14 text-default">卓越卡号</div>
              <div class="text-15 text-gray">{{JSON.stringify(B2CData) !== '{}' ? B2CData.custNo : '无'}}</div>
            </div>
            <div class="d-flex justify-content-between mt-5">
              <div class="text-14 text-default">级别</div>
              <div class="text-15 text-gray">{{JSON.stringify(B2CData) !== '{}' ? B2CData.memberLevel : '无'}}</div>
            </div>
          </div>
        </div>
        <div class="tiens-card-item">
          <div class="px-5 pb-5 border-bottom d-flex justify-content-between">
            <div class="text-15 text-default font-weight-bold">玛雅六月</div>
            <div v-if="JSON.stringify(mayaData) === '{}'" class="text-15 text-default-green-dark" @click="goBinding('maya')">去绑定</div>
            <div v-else class="text-15 text-default-green-dark">已绑定</div>
          </div>
          <div class="px-5 pt-5">
            <div class="d-flex justify-content-between">
              <div class="text-14 text-default">账号</div>
              <div class="text-15 text-gray">{{JSON.stringify(mayaData) !== '{}' ? mayaData.custNo : '无'}}</div>
            </div>
            <div class="d-flex justify-content-between mt-5">
              <div class="text-14 text-default">级别</div>
              <div class="text-15 text-gray">{{JSON.stringify(mayaData) !== '{}' ? mayaData.memberLevel : '无'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import _ from 'lodash'

export default {
  name: 'binding',
  data () {
    return {
      title: '绑定详情'
    }
  },
  methods: {
    goBinding (name) {
      this.$router.push({path: '/bindingAdd', query: {noBottom: true, type: name}})
    }
  },
  components: {
    'tiens-header': tiensHeader
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    },
    mayaData () {
      return _.find(this.memberData.list, {memberSource: 'MAYA'}) ? _.find(this.memberData.list, {memberSource: 'MAYA'}) : {}
    },
    B2CData () {
      return _.find(this.memberData.list, {memberSource: 'B2C'}) ? _.find(this.memberData.list, {memberSource: 'B2C'}) : {}
    },
    walletData () {
      return _.find(this.memberData.list, {memberSource: 'WALLET'}) ? _.find(this.memberData.list, {memberSource: 'WALLET'}) : {}
    }
  }
}
</script>
<style lang="scss" scoped>
  .tiens-card-item{
    background: white;
    border-radius: 3px;
    padding: 10px 0;
    margin-bottom: 15px;
    .border-bottom{
      border-bottom: 1px solid rgb(225, 225, 225);
    }
  }
  .text-orange{
    color: #E66700;
  }
</style>
