<template>
  <div class="home-container full-height d-flex flex-column">
    <tiens-header :title="title" :showScan="true" @do-scan="doScan"></tiens-header>
    <div class="local d-flex" @click="goLocation">
      <div class="ml-4">
        <div class="mt-1">
          <img width="10" height="15" src="/static/images/home/main_loc.png" alt="">
        </div>
      </div>
      <div class="text-14 ml-2">{{h5Location}}</div>
      <div class="ml-2 mt-1">
        <van-icon name="arrow" class="font-weight-bold"></van-icon>
      </div>
    </div>
    <div class="flex-full ofy-auto ofx-hidden position-relative" v-if="isReady">
      <scroller :on-refresh="onRefresh" ref="scroll">
        <div v-if="!openDingwei">
          <img class="mb-2" v-if="!openDingwei" width="100%" :height="deviceWidth * imgRatio" src="/static/images/dingwei.png" alt="">
          <img @click="goFormats(imgs[0])" width="100%" :height="deviceWidth * imgRatio" :src="imgs[0].src" alt="">
        </div>
        <div v-else class="position-relative mb-2" v-for="(item,i) in imgs" :key="i" @click="goFormats(item)">
          <img width="100%" :height="deviceWidth * imgRatio" :src="item.src" alt="">
          <div class="text-white text-12 home-text">
            <span class="mr-1">{{item.position}}</span>
            <span v-if="item.distance">{{item.distance}} km</span>
          </div>
        </div>
      </scroller>
    </div>
    <div class="height-5" v-if="isReady">
      <settlement :show-cart="true" :shop-cart-total-num="shopCartTotalNum" :has-shopping-cart="hasShoppingCart" :total="totalMoney" :discount="discount" @settlement="doSettlement" @shop-cart-click="goShoppingCart"></settlement>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'
import settlement from '../../components/settlement.vue'
import axios from 'axios'
import {
  getAllShops,
  getGoodsDetailByScan,
  getGoodsBySkuId,
  placeOrder
} from '../../api/home'
import _ from 'lodash'
import md5 from 'js-md5'
import {enterShop} from '../../../static/js/maidian'
// 导入百度地图
import {MP} from '../../../static/js/map.js'

export default {
  name: 'home',
  data () {
    return {
      isReady: false,
      isLoading: false,
      showCart: true,
      deviceWidth: document.documentElement.clientWidth,
      title: '天狮智能体验店',
      imgs: [
        {
          src: '/static/images/home/main_stpic3.png',
          position: '',
          distance: '',
          real: false,
          data: {id: 'tiensOnline'}
        },
        {
          src: '',
          position: '',
          distance: '',
          real: true
        },
        {
          src: '',
          position: '',
          distance: '',
          real: true
        }
      ],
      pickShoppingCart: null,
      expressShoppingCart: null,
      totalMoney: '0',
      shopCartTotalNum: 0,
      hasShoppingCart: false,
      merchant: {},
      discount: 0,
      addresses: [],
      distanceArr: [],
      shopArrs: [],
      shopSetArr: [],
      scanObj: {},
      allShops: [],
      openDingwei: false
    }
  },
  methods: {
    init () {
      this.shopArrs = []
      this.shopSetArr = []
      if (!localStorage.pickShoppingCart) {
        this.setPickShoppingCart()
      }
      if (!localStorage.expressShoppingCart) {
        this.setExpressShoppingCart()
      }
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      if (!localStorage.addresses) {
        this.setAdress()
      }
      this.getAddresses()
      this.getMerchant()
      this.getShoppingCart()
      this.setSettlement()
      let requests = [
        getAllShops({merchantId: 28, pageSize: 0})
      ]
      axios.all(requests)
        .then(res => {
          let data = res[0].data.data.list
          this.allShops = res[0].data.data.list
          data.forEach(item => {
            if (item.positionX) {
              this.shopArrs.push(item)
            }
          })
          if (Number(this.realLocation.lat)) {
            this.openDingwei = true
            this.setInitMerchants()
          } else {
            this.openDingwei = false
          }
        })
        .finally(() => {
          this.isReady = true
          this.isLoading = false
          if (this.$refs.scroll) {
            this.$refs.scroll.finishPullToRefresh()
          }
        })
      // 获取位置
      if (!this.h5Location || this.h5Location === 'Location Failed' || this.h5Location === '定位失败') {
        // h5进入还是APP进入
        if (localStorage.getItem('h5Url')) {
          this.getH5Location()
        } else {
          if (this.isIOS) {
            window.webkit.messageHandlers.onRequestLocation.postMessage(null)
          }
          if (this.isAndroid) {
            window.android.onRequestLocation()
          }
        }
      }
    },
    goFormats (data) {
      let query = {
        noBottom: true
      }
      if (data.real) {
        query = Object.assign(query, {real: true})
      }
      if (data.id) {
        query = Object.assign(query, {id: data.id, code: data.code})
      }
      if (this.merchant.id !== data.data.id) {
        this.merchant = data.data
        localStorage.setItem('merchant', JSON.stringify(this.merchant))
        // 切换门店 清空购物车
        this.setPickShoppingCart()
        this.setExpressShoppingCart()
      }
      enterShop(window.clab_tracker, {
        'source': '电子钱包体验店',
        'contentName': '电子钱包体验店',
        'date': new Date().toISOString(),
        'targetId': 'Tiens_ewallet_store',
        'targetName': '电子钱包体验店',
        'channelname': '体验店',
        'storename': this.merchant.name,
        'identityType': 'c_exstore_member',
        'identityValue': this.memberData.id
      })
      this.$router.push({path: '/formats', query: query})
    },
    doSettlement (data) {
      if (this.pickShoppingCart.length === 0) {
        this.$toast('您还没有添加商品哦，快去添加商品吧')
        return false
      }
      let detailMap = {}
      let storeId = ''
      this.pickShoppingCart.forEach(item => {
        if (!storeId) {
          storeId = item.storeId
        }
        let obj = {[item.typeId]: item.num}
        detailMap = Object.assign(detailMap, obj)
      })
      let formData = {
        detailMap: detailMap,
        deviceId: 0,
        memberId: this.memberData.id ? this.memberData.id : '',
        storeCode: this.merchant ? this.merchant.code : '',
        storeId: storeId,
        userId: '0',
        deliveryType: 'SELF'
      }
      let md5Key = this.$store.state.md5Key
      placeOrder('10005', md5(md5Key), formData)
        .then(res => {
          if (res.data.success) {
            let query = {
              noBottom: true,
              ids: res.data.data.id,
              real: true
            }
            this.pickShoppingCart = []
            localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
            this.$router.push({name: 'settlement', query: query})
          } else {
            this.$toast(res.data.description)
          }
        })
    },
    onRefresh () {
      this.isLoading = true
      this.init()
    },
    goLocation () {
      if (Number(this.realLocation.lat)) {
        this.$router.push({path: '/location', query: {noBottom: true}})
      } else {
        this.$toast('请开启定位')
      }
    },
    setExpressShoppingCart () {
      localStorage.setItem('expressShoppingCart', JSON.stringify([]))
    },
    setPickShoppingCart () {
      localStorage.setItem('pickShoppingCart', JSON.stringify([]))
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    },
    goShoppingCart () {
      this.$router.push({path: 'shoppingCart'})
    },
    getShoppingCart () {
      this.expressShoppingCart = JSON.parse(localStorage.expressShoppingCart)
      this.pickShoppingCart = JSON.parse(localStorage.pickShoppingCart)
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setSettlement () {
      if (this.pickShoppingCart.length === 0) {
        this.hasShoppingCart = false
        this.shopCartTotalNum = 0
      } else {
        this.hasShoppingCart = true
        this.shopCartTotalNum = this.pickShoppingCart.length
        let money = 0
        this.pickShoppingCart.forEach(item => {
          money += item.num * item.price
        })
        this.totalMoney = String((money).toFixed(2))
      }
    },
    doScan () {
      if (this.isH5) {
        this.$toast('暂不支持扫一扫功能')
      } else {
        if (this.isIOS) {
          window.webkit.messageHandlers.onScanQrCode.postMessage(null)
        }
        if (this.isAndroid) {
          window.android.onScanQrCode()
        }
      }
    },
    // 扫码之后的回调
    onScanQrCodeResult (result) {
      let self = this
      if (result.indexOf('http') > -1) {
        this.scanObj = JSON.parse((result.split('&')[1]).split('=')[1])
        if (this.scanObj.goods.length > 0) {
          let requests = []
          this.scanObj.goods.forEach(item => {
            requests.push(getGoodsBySkuId(item.id))
          })
          axios.all(requests)
            .then(res => {
              let flag = true
              res.forEach((item, i) => {
                if (item.data.success) {
                  let data = item.data.data
                  let obj = {
                    name: data.skuName,
                    id: data.spuId,
                    price: data.price,
                    type: this.formScanType(data.standard),
                    typeId: data.id,
                    num: 1,
                    merchantName: data.storeName,
                    merchantId: data.merchantId,
                    checked: false,
                    pick: true,
                    img: data.image,
                    storeId: this.scanObj.storeId,
                    storeCode: this.scanObj.storeCode,
                    routeQuery: {noBottom: true, real: true, code: this.scanObj.storeCode}
                  }
                  if (this.scanObj.deliveryType === 'SELF') {
                    let index = _.findIndex(this.pickShoppingCart, {typeId: obj.typeId})
                    if (index > -1) {
                      this.pickShoppingCart[index].num += obj.num
                    } else {
                      this.pickShoppingCart.push(obj)
                    }
                  } else {
                    let index = _.findIndex(this.expressShoppingCart, {typeId: obj.typeId})
                    if (index > -1) {
                      this.expressShoppingCart[index].num += obj.num
                    } else {
                      this.expressShoppingCart.push(obj)
                    }
                  }
                } else {
                  this.$toast(item.data.description)
                  flag = false
                }
              })
              if (flag) {
                if (this.scanObj.storeCode !== this.merchant.code) {
                  this.merchant = _.find(this.allShops, {code: this.scanObj.storeCode})
                  localStorage.setItem('merchant', JSON.stringify(this.merchant))
                  this.setPickShoppingCart()
                  this.setExpressShoppingCart()
                }
                setTimeout(() => {
                  localStorage.setItem('pickShoppingCart', JSON.stringify(self.pickShoppingCart))
                  localStorage.setItem('expressShoppingCart', JSON.stringify(self.expressShoppingCart))
                  self.setSettlement()
                  self.$toast('添加购物车成功')
                }, 200)
              } else {
                this.$toast('无法识别当前二维码')
              }
            })
        }
      } else {
        getGoodsDetailByScan({
          storeCode: '',
          icCode: result
        })
          .then(res => {
            if (res.data.success) {
              this.addShoppingCart(res.data.data)
            } else {
              this.$toast('无法识别当前二维码')
            }
          })
      }
    },
    // 扫码添加购物车
    addShoppingCart (data) {
      data.forEach(item => {
        let obj = {
          name: item.skuName,
          id: item.spuId,
          price: item.price,
          type: this.formScanType(item.standard),
          typeId: item.id,
          num: 1,
          merchantName: item.storeName,
          merchantId: item.merchantId,
          checked: false,
          pick: true,
          img: item.image,
          storeId: item.storeId,
          // 最近的门店
          storeCode: this.merchant.code,
          routeQuery: {noBottom: true, real: true, code: this.merchant.code}
        }
        let index = _.findIndex(this.pickShoppingCart, {typeId: obj.typeId})
        if (index > -1) {
          this.pickShoppingCart[index].num += obj.num
        } else {
          this.pickShoppingCart.push(obj)
        }
      })
      localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
      this.setSettlement()
      this.$toast('添加购物车成功')
    },
    // 获取位置回调
    onRequestLocationResult (lat, lnt, address) {
      this.$store.commit('SET_REALTIMELOCATION', {
        lat: lat,
        lnt: lnt
      })
      if (address) {
        this.$store.commit('SET_H5LOCATION', address)
      } else {
        this.$store.commit('SET_H5LOCATION', '定位失败')
      }
      if (Number(lat)) {
        this.openDingwei = true
        this.setInitMerchants()
      } else {
        this.openDingwei = false
      }
    },
    // app登录失效回调
    transferUserC2 (userId, token, phone) {
      localStorage.setItem('c2MemberPhone', JSON.stringify(phone))
      this.init()
    },
    setAdress () {
      localStorage.setItem('addresses', JSON.stringify([]))
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    formScanType (obj) {
      let result = ''
      for (let k in obj) {
        if (obj[k]) {
          result += `${k}:${obj[k]};`
        }
      }
      return result
    },
    setInitMerchants () {
      // 计算距离 取最近两条
      this.shopArrs.forEach(item => {
        let dis = this.calculateDistanct(Number(item.positionX), Number(item.positionY), Number(this.realLocation.lat), Number(this.realLocation.lnt))
        if (this.shopSetArr.length < 2) {
          this.shopSetArr.push({
            data: item,
            dis: parseInt(dis)
          })
        } else {
          this.shopSetArr = _.orderBy(this.shopSetArr, 'dis', 'asc')
          if (parseInt(dis) < this.shopSetArr[0].dis) {
            this.shopSetArr[0] = {data: item, dis: parseInt(dis)}
          } else if (dis > this.shopSetArr[0].dis && dis < this.shopSetArr[1].dis) {
            this.shopSetArr[1] = {data: item, dis: parseInt(dis)}
          }
        }
      })
      this.shopSetArr = _.orderBy(this.shopSetArr, 'dis', 'asc')
      this.$store.dispatch('nearestMerchantAction', this.shopSetArr[0])
      if (!this.merchant.id) {
        this.merchant = this.shopSetArr[0].data
        localStorage.setItem('merchant', JSON.stringify(this.merchant))
      }
      if ((this.shopSetArr[0].data.address).indexOf('天津') > -1) {
        this.imgs[1].src = '/static/images/home/main_stpic2.png'
        this.imgs[2].src = '/static/images/home/main_stpic1.png'
      } else {
        this.imgs[1].src = '/static/images/home/main_stpic1.png'
        this.imgs[2].src = '/static/images/home/main_stpic2.png'
      }
      this.imgs[1] = Object.assign(this.imgs[1], {id: this.shopSetArr[0].data.id, code: this.shopSetArr[0].data.code, data: this.shopSetArr[0].data})
      this.imgs[1].position = this.shopSetArr[0].data.address
      this.imgs[1].distance = this.shopSetArr[0].dis
      this.imgs[2] = Object.assign(this.imgs[2], {id: this.shopSetArr[1].data.id, code: this.shopSetArr[1].data.code, data: this.shopSetArr[1].data})
      this.imgs[2].position = this.shopSetArr[1].data.address
      this.imgs[2].distance = this.shopSetArr[1].dis
    },
    getH5Location () {
      this.$store.commit('SET_H5LOCATION', '定位中...')
      setTimeout(() => {
        if (this.h5Location === '定位中...') {
          this.$toast('定位失败，请刷新页面重试')
          return false
        }
      }, 3000)
      let self = this
      MP()
        .then(BMap => {
          new BMap.Geolocation().getCurrentPosition(function (result) {
            if (this.getStatus() === 0) {
              self.onRequestLocationResult(result.latitude, result.longitude, `${result.address.province}(${result.address.city})`)
            }
          })
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
      window.onScanQrCodeResult = this.onScanQrCodeResult
      window.onRequestLocationResult = this.onRequestLocationResult
      window.transferUserC2 = this.transferUserC2
    })
  },
  components: {
    'tiens-header': tiensHeader,
    'settlement': settlement
  },
  computed: {
    imgRatio: () => {
      return 0.4
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
    memberData () {
      return this.$store.state.memberData
    },
    h5Location () {
      return this.$store.state.h5Location
    },
    realLocation () {
      return this.$store.state.realTimeLocation
    },
    resetShoppingCart () {
      return this.$store.state.resetShoppingCart
    }
  },
  watch: {
    'resetShoppingCart' (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.setPickShoppingCart()
        this.setExpressShoppingCart()
        this.getShoppingCart()
        this.setSettlement()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .home-container{
    overflow-x: hidden;
  }
  .local{
    height: 40px;
    line-height: 40px;
    width: 100%;
    color: #232323;
  }
  .home-text{
    position: absolute;
    bottom: 10px;
    right: 5px;
  }
</style>
