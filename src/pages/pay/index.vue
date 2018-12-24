<template>
  <div class="full-height">
    <div class="pay-header">
      <div class="header text-center d-flex justify-content-between">
        <div class="width-5 mt-2">
          <van-icon class="font-weight-bold" name="arrow-left" @click="goBack()"></van-icon>
        </div>
        <div>
          {{title}}
        </div>
        <div class="width-5 mt-2"></div>
      </div>
      <div class="mt-15 text-center text-white text-truncate width-25 mx-auto">{{name}}</div>
      <div class="text-white text-center mt-1">
        <div class="d-flex justify-content-center">
          <div class="d-flex full-height flex-column justify-content-start">
            <span class="text-18 mt-1">¥ </span>
          </div>
          <div class="text-30 ml-1">88888</div>
        </div>
      </div>
      <div class="mt-3 width-12 height-3 line-height-30 px-8 bg-white text-default-green-dark mx-auto text-center">
        <span>剩余支付时间：</span>
        <span>{{`${this.leftMinutes} : ${formatTime(this.leftSeconds)}`}}</span>
      </div>
    </div>
    <div class="px-7">
      <div v-for="(item,i) in payWays" :key="i" class="py-5 d-flex justify-content-between" :class="{'border border-bottom': i !==0}">
        <div class="d-flex">
          <div class="size-3">
            <img width="100%" height="100%" :src="item.img" alt="">
          </div>
          <div class="text-15 ml-7 d-flex flex-column justify-content-center" :class="{'text-default':!item.disabled,'text-gray':item.disabled}">
            {{item.name}}
          </div>
        </div>
        <div class="d-flex flex-column justify-content-center">
          <van-checkbox v-model="item.choosed" :disabled="item.disabled"></van-checkbox>
        </div>
      </div>
      <div class="mt-12 van-button border border-default-dark height-5 line-height-50 full-width text-center text-default-green-dark">立即付款</div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'personal',
  data () {
    return {
      title: '确认支付',
      name: '飞利浦type-c扩展坞USB3.0分线器你值的拥有的分线器',
      leftMinutes: 30,
      leftSeconds: 0,
      timeInterval: null,
      payWays: [
        {
          name: '消费积分',
          choosed: false,
          disabled: true,
          img: '/static/images/pay/shop_xfjf.png'
        },
        {
          name: '余额',
          choosed: false,
          disabled: false,
          img: '/static/images/pay/shop_yue.png'
        },
        {
          name: '支付宝',
          choosed: false,
          disabled: false,
          img: '/static/images/pay/shop_alipay.png'
        },
        {
          name: '微信',
          choosed: false,
          disabled: false,
          img: '/static/images/pay/shop_vx.png'
        },
        {
          name: '快捷支付',
          choosed: false,
          disabled: false,
          img: '/static/images/pay/shop_kjzf.png'
        }
      ]
    }
  },
  methods: {
    init () {
      this.timeInterval = setInterval(() => {
        if (this.leftSeconds === 0) {
          this.leftSeconds = 60
          if (this.leftMinutes > 0) {
            this.leftMinutes--
          }
        }
        this.leftSeconds--
        if (this.leftMinutes === 0 && this.leftSeconds === 0) {
          clearInterval(this.timeInterval)
        }
      }, 1000)
    },
    formatTime (val) {
      return val < 10 ? '0' + val : val
    },
    goBack () {
      this.$router.back(-1)
    }
  },
  mounted () {
    this.init()
  },
  components: {},
  computed: {},
  beforeDestroy () {
    clearInterval(this.timeInterval)
  }
}
</script>
<style lang="scss" scoped>
  .tiens-badge{
    width: 16px;
    height: 16px;
    background: red;
    color: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    right: 8px;
    line-height: 16px;
    text-align: center;
    font-size: 12px;
  }
  .pay-header{
    height: 200px;
    background: rgb(0, 153, 67);
    .header{
      height: 50px;
      width: 100%;
      font-size: 17px;
      color: white;
      line-height: 50px;
    }
    .content{
      width: 94%;
      height: 100px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
    }
  }
</style>
