<template>
  <div class="d-flex flex-column full-height">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full ofy-auto full-width d-flex flex-column">
      <div class="full-width position-relative">
        <div class="height-8 width-16 mx-auto">
          <img width="100%" height="100%" src="/static/images/formats/yetai_1.png" alt="">
        </div>
        <div class="d-flex justify-content-center">
          <div class="col-line height-2"></div>
        </div>
        <div class="text-white bg-default-green width-13 text-center rounded py-1 text-14 formats-title">天狮业态TOP</div>
      </div>
      <div class="flex-full d-flex justify-content-center mb-10">
        <div class="width8">
          <div v-for="(item, i) in formats" :key="i" class="d-flex" :class="{'flex-row-reverse': i % 2 !==0}">
            <div class="width8">
              <div class="full-width d-flex justify-content-center">
                <div class="col-line"></div>
              </div>
              <div class="point"></div>
            </div>
            <div class="d-flex position-relative" :class="{'flex-row-reverse': i % 2 !==0}">
              <div class="row-line align-self-end position-relative" style="top: -5px" :class="{'ml-1':i % 2 ===0,'mr-1':i % 2 !==0}"></div>
              <div class="position-absolute" :class="{'offset-right':i % 2 ===0,'offset-left':i % 2 !==0}">
                <div class="round-size rounded-circle" @click="goGoodsList(item)">
                  <img width="100%" height="100%" :src="item.img" class="rounded-circle" alt="">
                </div>
                <div class="text-center mt-1">{{item.name}}</div>
              </div>
            </div>
          </div>
          <div class="col-line mt-1 margin-left-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'

export default {
  name: 'formats',
  data () {
    return {
      title: '业态',
      formats: [
        {
          name: '直销业务',
          img: '/static/images/formats/yetai_3.png',
          merchantId: ''
        },
        {
          name: '泰济生医疗',
          img: '/static/images/formats/yetai_4.png',
          categoryId: 35777
        },
        {
          name: '玛雅电商',
          img: '/static/images/formats/yetai_5.png',
          merchantId: ''
        },
        {
          name: '盛世创元教育',
          img: '/static/images/formats/yetai_6.png',
          categoryId: 35776
        },
        {
          name: '奥蓝际德旅游',
          img: '/static/images/formats/yetai_7.png',
          categoryId: 35754
        },
        {
          name: '奥蓝际德酒店',
          img: '/static/images/formats/yetai_8.png',
          categoryId: 35753
        }
      ]
    }
  },
  methods: {
    init () {
      if (this.$router.currentRoute.query.real) {
        this.formats[0].merchantId = 28
        this.formats[2].merchantId = 31
      } else {
        this.formats[0].merchantId = 30
        this.formats[2].merchantId = 29
      }
    },
    goGoodsList (obj) {
      let query = {
        noBottom: true,
        real: this.$router.currentRoute.query.real
      }
      if (obj.categoryId) {
        query = Object.assign(query, {category: true})
      } else {
        query = Object.assign(query, {merchant: true, fromFormats: true, c: true})
        if (obj.name === '直销业务') {
          query = Object.assign(query, {zhixiao: true})
        } else {
          query = Object.assign(query, {maya: true})
        }
      }
      if (this.$router.currentRoute.query.id) {
        query = Object.assign(query, {id: this.$router.currentRoute.query.id, code: this.$router.currentRoute.query.code})
      }
      this.$router.push({
        name: 'goodsList',
        params: {id: obj.merchantId ? obj.merchantId : obj.categoryId},
        query: query
      })
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
<style lang="scss" scoped>
  .formats-top{
    width: 125px;
    height: 125px;
    background: black;
    border-radius: 50%;
  }
  .round-size{
    width: 70px;
    height: 70px;
  }
  .row-line{
    height: 2px;
    width: 60px;
    background: black;
  }
  .col-line{
    width: 2px;
    height: 60px;
    background: black;
  }
  .point{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: black;
    margin: 2px 0;
  }
  .offset-right{
    top: 28px;
    right: -74px;
  }
  .offset-left{
    top: 28px;
    left: -74px;
  }
  .border-width-2{
    border-width: 2px !important;
  }
  .width8{
    width: 8px !important;
  }
  .top-m5{
    top: -5px !important;
  }
  .margin-left-3{
    margin-left: 3px;
  }
  .formats-title{
    box-shadow: 0 0 5px 2px white;
    position: absolute;
    margin-left: -65px;
    left: 50%;
    top: 95px;
  }
</style>
