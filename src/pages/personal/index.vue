<template>
  <div class="full-height default-bg ofx-hidden">
    <div class="personal-header">
      <div class="header text-center d-flex justify-content-between">
        <div class="width-5 mt-2">
          <van-icon class="font-weight-bold" name="arrow-left" @click="goBack()"></van-icon>
        </div>
        <div>
          {{title}}
        </div>
        <div class="width-5 mt-2"></div>
      </div>
      <div class="mt-5 content d-flex">
        <div class="full-height d-flex flex-column justify-content-center ml-8">
          <div class="size-6">
            <img width="100%" height="100%" class="rounded-circle" :src="memberData.imgPath?memberData.imgPath:'/static/images/personal/defaultdehead.png'" alt="">
          </div>
        </div>
        <div class="flex-full d-flex flex-column justify-content-center mr-8 ml-5">
          <div>
            <div class="text-15">
              <span>{{memberData.cnName}}</span>
              <span class="ml-4 text-default-green-dark">编辑</span>
            </div>
            <div class="text-12 mt-2">
              <span class="text-gray">{{memberData.mobile | phoneEncrypt}} </span>
              <span class="ml-1 bg-default-green-dark text-white py-2 px-5" @click="goBinding">查看积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 bg-white mx-7">
      <div class="px-15">
        <van-row>
          <van-col v-for="(item,i) in menus" :key="i" span="12">
            <div class="d-flex justify-content-center py-11" @click="go(item)" :class="{'personal-border-right': i ===0 || i ===2,'personal-border-top': i ===2 || i ===3}">
              <div class="text-center">
                <div class="position-relative">
                  <div v-if="item.badge" class="tiens-badge">{{item.badge}}</div>
                  <img width="42" height="42" :src="item.icon" alt="">
                </div>
                <div class="mt-2 text-gray text-13">{{item.name}}</div>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'

import {
  getAllPickOrdersByMember,
  getAllExpressOrdersByMember
} from '../../api/personal'
import axios from 'axios'

export default {
  name: 'personal',
  data () {
    return {
      title: '个人中心',
      // profile: 'http://pic.58pic.com/58pic/14/62/50/62558PICxm8_1024.jpg',
      menus: [
        {
          name: '自提订单',
          icon: '/static/images/personal/personal_ztdd.png',
          path: '/liftOrderList?noBottom=true&real=true',
          badge: 0
        },
        {
          name: '配送订单',
          icon: '/static/images/personal/personal_psdd.png',
          path: '/expressOrderList?noBottom=true',
          badge: 0
        },
        {
          name: '收货地址',
          icon: '/static/images/personal/personal_shdz.png',
          path: '/address?noBottom=true'
        },
        {
          name: '绑定详情',
          icon: '/static/images/personal/personal_bdxq.png',
          path: '/binding?noBottom=true'
        }
      ],
      pickShoppingCart: null,
      expressShoppingCart: null
    }
  },
  methods: {
    init () {
      if (this.memberData.id) {
        let requests = [
          getAllPickOrdersByMember(this.memberData.id),
          getAllExpressOrdersByMember(this.memberData.id)
        ]
        axios.all(requests)
          .then(res => {
            if (res[0].data.success) {
              if (res[0].data.data.length > 99) {
                this.menus[0].badge = '99+'
              } else {
                this.menus[0].badge = res[0].data.data.length
              }
            } else {
              this.menus[0].badge = 0
            }
            if (res[1].data.success) {
              if (res[1].data.data.length > 99) {
                this.menus[1].badge = '99+'
              } else {
                this.menus[1].badge = res[1].data.data.length
              }
            } else {
              this.menus[1].badge = 0
            }
          })
      }
    },
    goBack () {
      this.$router.back(-1)
    },
    go (item) {
      if (item.name === '自提订单' || item.name === '配送订单') {
        localStorage.setItem('activeOrderTab', JSON.stringify({
          name: '全部订单',
          status: '',
          index: 0
        }))
      }
      this.$router.push({path: item.path})
    },
    goBinding () {
      this.$router.push({path: '/binding', query: {noBottom: true}})
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader
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
  }
}
</script>
<style lang="scss" scoped>
  .personal-border-top {
    border-top: 1px solid #E1E1E1;
  }
  .personal-border-right {
    border-right: 1px solid #E1E1E1;
  }
  .tiens-badge{
    width: 20px;
    height: 20px;
    background: red;
    color: white;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: 4px;
    line-height: 22px;
    text-align: center;
    font-size: 11px;
  }
  .personal-header{
    height: 200px;
    position: relative;
    /*background: rgb(0, 153, 67);*/
    .header{
      height: 50px;
      width: 100%;
      font-size: 17px;
      color: white;
      line-height: 50px;
      position: relative;
      z-index: 2;
    }
    .content{
      width: 94%;
      height: 100px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      position: relative;
      z-index: 2;
    }
  }
  .personal-header:after{
    width: 260%;
    height: 200px;
    position: absolute;
    left: -80%;
    top: 0;
    z-index: 1;
    content: '';
    border-radius: 0 0 50% 50%;
    background: rgb(0, 153, 67);
  }
</style>
