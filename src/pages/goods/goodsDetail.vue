<template>
  <div class="full-height d-flex flex-column">
    <div class="full-width flex-full d-flex flex-column ofy-auto detail-main position-relative">
      <scroller ref="scroll">
        <div class="position-relative full-width same-height">
          <div class="goods-detail-back">
            <img width="100%" height="100%" @click="back()" src="/static/images/goods/back.png" alt="">
            <!--<van-icon class="font-weight-bold text-white mr-1 " name="arrow-left" @click="back()"></van-icon>-->
          </div>
          <div v-if="imgs && imgs.length>0" class="goods-detail-indicators">
            <span>{{currentImgIndex + 1}}</span>
            <span>/</span>
            <span>{{imgs.length}}</span>
          </div>
          <van-swipe v-if="imgs && imgs.length>0"
                     :autoplay="3000" class="same-height" :show-indicators="false" :initial-swipe="currentImgIndex" @change="changeEnd">
            <van-swipe-item v-for="(item, i) in imgs" :key="i">
              <img width="100%" height="100%" :src="item" alt="">
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="full-width flex-full">
          <div class="px-7">
            <div class="mt-7">
              <div class="wb-break-all text-14 text-default">{{goodsName}}</div>
            </div>
            <div class="mt-2">
              <div class="wb-break-all text-12 text-gray">{{description}}</div>
            </div>
            <div class="mt-5">
              <div class="wb-break-all text-red">
                <span class="mr-1 text-14">¥</span>
                <span class="text-16">{{price}}</span>
                <span v-if="goodsJf" class="mr-2 text-8 text-default-green-dark">
                  赠{{goodsJf}}积分
                </span>
              </div>
            </div>
            <div class="mt-13 d-flex justify-content-between" @click="openSpec()">
              <div class="text-gray text-13">
                <span class="mr-1">规格</span>
                <span class="text-default">
              {{type}}
            </span>
              </div>
              <div class="text-gray">
                <van-icon class="text-13" name="arrow"></van-icon>
              </div>
            </div>
          </div>
          <div class="mt-7">
            <div class="default-bg text-center text-15 text-default py-4">商品描述</div>
            <div class="full-width">
              <!--<div class="px-7" v-html="introduce"></div>-->
              <div v-if="introduce && introduce.length" class="px-7">
                <img v-for="(item,i) in introduce" :key="i" :src="item" width="100%" alt="">
              </div>
              <div v-else class="text-center text-gray text-12 py-10">
                暂无描述
              </div>
            </div>
          </div>
          <div class="mt-2">
            <div class="default-bg text-center text-15 text-default py-4">猜你喜欢</div>
            <div class="flex-full full-width ofy-auto">
              <div class="d-flex flex-wrap">
                <div style="width: 50%" class="d-flex justify-content-center" v-for="(item,i) in likeGoods" :key="i">
                  <div class="mb-7 px-5">
                    <goods-item :goods-data="item" @goods-click="goDetail"></goods-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <van-popup style="background: transparent !important;" v-model="showSpec" position="bottom" :overlay="true">
      <div class="full-width height-9 position-relative">
        <div class="full-width bg-white height-6 position-absolute bottom-0"></div>
        <div class="size-9 position-absolute bg-white bottom-0 left-15">
          <img width="100%" height="100%" :src="specImg" alt="">
        </div>
        <div class="spec-text-container">
          <div class="d-flex flex-column justify-content-between full-height">
            <div class="full-width text-truncate text-default text-14 mt-5">{{specName}}</div>
            <div class="full-width text-truncate text-red text-15 mb-2">
              <span>¥ </span>
              <span>{{specPrice}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column bg-white">
        <div class="full-width">
          <div v-if="specs && specs.length > 0">
            <div v-for="(item,i) in specs" :key="i" class="px-7" :class="{'mt-5': i ===0}">
              <div class="text-13 text-default">{{item.label}}</div>
              <div class="mt-5 clearfix">
                <div class="fl" v-for="(subItem,i) in item.values" :key="i">
                  <div class="spec-item border border-default-dark text-default-green-dark"
                       :class="{'goods-detail-btn-disabled':subItem.disabled,'choosed':subItem.choosed}"
                       @click="chooseSpec(subItem,item)">
                    {{subItem.name}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="full-width">
          <div class="px-7 d-flex justify-content-between">
            <div class="d-flex flex-column justify-content-center">
              <span class="text-default text-13">数量</span>
            </div>
            <div class="d-flex goods-detail-count d-flex justify-content-around text-12">
              <div class="width-2 text-center" @click="reduceNum">-</div>
              <div class="flex-full text-center">{{num}}</div>
              <div class="width-2 text-center" @click="plusNum">+</div>
            </div>
          </div>
        </div>
        <div class="mb-2 mt-12">
          <div class="px-7">
            <van-button class="confirm-spec" @click="confirmSpec">
              确定
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <div v-if="canBuy && !hideBtns" class="height-5 d-flex text-14">
      <div class="flex-full full-height line-height-50 text-default">
        <div class="d-flex justify-content-between px-7 full-height" @click="goShoppingCart">
          <div class="position-relative d-flex flex-column full-height justify-content-center">
            <div class="tiens-badge" v-if="shoppingCartNum > 0">{{shoppingCartNum}}</div>
            <img width="34" height="34" src="/static/images/tab_gwc2.png" alt="">
          </div>
          <div>购物车</div>
        </div>
      </div>
      <div class="width-13 full-height line-height-50 text-center text-white bg-add-cart" @click="addShoppingCart">加入购物车</div>
      <div class="width-13 full-height line-height-50 text-center text-white bg-buy-now" @click="goSettlement">立即购买</div>
    </div>
    <div @click="goFormatUrl" v-if="!canBuy" class="height-5 full-width text-14 line-height-50 text-center text-default-green-dark foot-shadow">
      {{formatUrl ? '查看业态' : '暂无业态详情'}}
    </div>
  </div>
</template>
<script>
import goodsItem from '../../components/goodsItem'
import {
  getGoodsDetailById,
  placeOrder
} from '../../api/goods'
import md5 from 'js-md5'
import _ from 'lodash'
import {goodsDeatil} from '../../../static/js/maidian'

export default {
  name: 'goodsDetail',
  data () {
    return {
      showSpec: false,
      canBuy: false,
      description: '',
      deviceWidth: document.documentElement.clientWidth,
      currentImgIndex: 0,
      imgs: null,
      likeGoods: null,
      storeSkuList: [],
      standardList: [],
      specs: null,
      num: 1,
      introduce: null,
      goodsName: '',
      img: '',
      pickShoppingCart: null,
      expressShoppingCart: null,
      type: '',
      price: '',
      shoppingCartNum: 0,
      goodsObj: {},
      specPrice: 0,
      specName: '',
      specImg: '',
      choosedValue: [],
      goodsSuk: null,
      addresses: [],
      goodsDetail: null,
      merchant: {},
      formatUrl: '',
      goodsInterVal: null,
      browsetime: 0,
      goodsJf: null,
      hideBtns: true
    }
  },
  methods: {
    init () {
      if (this.goodsInterVal) {
        clearInterval(this.goodsInterVal)
        this.goodsInterVal = null
        this.browsetime = 1
      }
      this.goodsInterVal = setInterval(() => {
        this.browsetime++
      }, 1000)
      setTimeout(() => {
        this.$refs.scroll.scrollTo(0, 0, true)
      }, 100)
      this.goodsObj = {}
      this.imgs = null
      this.likeGoods = null
      this.currentImgIndex = 0
      this.introduce = null
      this.type = ''
      this.specs = []
      this.choosedValue = []
      this.formatUrl = ''
      this.goodsJf = null
      this.getGoodsDetail()
      if (!localStorage.pickShoppingCart) {
        this.setPickShoppingCart()
      }
      if (!localStorage.expressShoppingCart) {
        this.setExpressShoppingCart()
      }
      if (!localStorage.addresses) {
        this.setAdress()
      }
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      this.getMerchant()
      this.getAddresses()
      this.getShoppingCart()
      this.getShoppingCartNum()
    },
    back () {
      this.$router.back(-1)
    },
    changeEnd (i) {
      this.currentImgIndex = i
    },
    goDetail (data) {
      let query = this.$router.currentRoute.query
      this.$router.push({name: 'goodsDetail', params: {id: data.id}, query: query})
    },
    confirmSpec () {
      this.showSpec = false
      let result = ''
      this.specs.forEach((item, i) => {
        if (this.choosedValue[i]) {
          result += `${item.label}:${this.choosedValue[i]};`
        }
      })
      this.type = result
    },
    reduceNum () {
      if (this.num > 1) {
        this.num--
      }
    },
    plusNum () {
      this.num++
    },
    goSettlement () {
      // 立即购买
      if (!this.goodsSuk) {
        let flag = false
        for (let i = 0; i < this.choosedValue.length; i++) {
          if (!this.choosedValue[i]) {
            flag = true
            break
          }
        }
        // 有规格一定要选择规格，否则不要选择
        if (flag) {
          this.$toast('请选择规格')
          return false
        } else {
          this.$toast('库存不足')
          return false
        }
      }
      if (!this.goodsSuk.cntNum && this.specs.length !== 0) {
        this.$toast('库存不足')
        return false
      }
      let keyId = this.goodsSuk.id
      // 有库存 没规格 的时候 传
      if (!this.goodsSuk.cntNum && this.specs.length === 0) {
        keyId = this.storeSkuList[0].id
      }
      let formData = {
        detailMap: {[keyId]: this.num},
        deviceId: 0,
        memberId: this.memberData.id ? this.memberData.id : '',
        storeId: this.$router.currentRoute.query.real ? this.goodsSuk.storeId : 124,
        storeCode: this.$router.currentRoute.query.real ? this.merchant.code : 'TiensB2C',
        userId: '0',
        deliveryType: this.$router.currentRoute.query.real ? 'SELF' : 'MERCHANT'
      }
      if (!this.$router.currentRoute.query.real) {
        if (this.addresses.length === 0) {
          this.$toast('您还没有收货地址，请先添加收货地址')
          setTimeout(() => {
            this.$router.push({name: 'addressAdd', query: {noBottom: true, from: this.$router.currentRoute.name}})
          }, 800)
          return false
        } else {
          formData = Object.assign(formData, {
            addr: _.last(this.addresses[0].location.split(' / ')),
            cityId: (this.addresses[0].cityCode).substr(0, this.addresses[0].cityCode.length - 2),
            districtId: this.addresses[0].areaCode,
            provinceId: (this.addresses[0].proCode).substr(0, this.addresses[0].proCode.length - 4)
          })
        }
      }
      let md5Key = this.$store.state.md5Key
      placeOrder('10005', md5(md5Key), formData)
        .then(res => {
          if (res.data.success) {
            if (res.data.status === 'I') {
              this.$toast('下单失败')
              return false
            }
            let query = {
              noBottom: true,
              ids: res.data.data.id
            }
            if (this.$router.currentRoute.query.real) {
              query = Object.assign(query, {
                real: this.$router.currentRoute.query.real
              })
            }
            this.$router.push({name: 'settlement', query: query})
          } else {
            this.$toast(res.data.description)
          }
        })
    },
    goShoppingCart () {
      this.$router.push({path: '/shoppingCart'})
    },
    getGoodsDetail () {
      getGoodsDetailById({
        spuId: this.$router.currentRoute.params.id,
        storeCode: this.$router.currentRoute.query.code ? this.$router.currentRoute.query.code : this.$router.currentRoute.query.zhixiao ? 'TiensB2C' : '10385'
      })
        .then(res => {
          if (res.data.success) {
            this.goodsObj = res.data.data
            this.formatGoodsDetailData(res.data.data)
          } else {
            this.$toast(res.data.description)
          }
        })
    },
    formatGoodsDetailData (data) {
      this.goodsDetail = data
      this.goodsJf = data.domain.jf
      if (data.domain.extension) {
        this.formatUrl = (JSON.parse(data.domain.extension)).qrCodeUrl
      }
      this.goodsName = data.domain.spuName
      this.description = ''
      this.canBuy = data.domain.status === 'NORMAL' ? 1 : 0
      this.price = data.domain.mallPrice
      this.img = data.domain.imagePath
      if (data.storeSkuList) {
        this.storeSkuList = data.storeSkuList
        this.judgeShowBtns(this.storeSkuList)
      }
      if (data.standardList && data.standardList.length > 0) {
        this.standardList = data.standardList
        this.formatSpec()
      } else {
        this.goodsSuk = this.goodsDetail.domain
      }
      this.imgs = []
      if (data.domain.imagePathList) {
        this.imgs = data.domain.imagePathList.split(';')
        this.imgs = _.dropRight(this.imgs)
      } else {
        this.imgs.push(data.domain.imagePath)
      }
      let guessYouLike = data.guessYouLike
      if (data.domain.description) {
        this.introduce = data.domain.description.split(';')
      }
      this.likeGoods = []
      if (guessYouLike && guessYouLike.length > 0) {
        guessYouLike.forEach(item => {
          let obj = {
            name: item.spuName,
            price: item.mallPrice,
            img: item.imagePath,
            id: item.id,
            jf: item.jf
          }
          this.likeGoods.push(obj)
        })
      }
    },
    addShoppingCart () {
      // 加入购物车
      if (!this.goodsSuk) {
        let flag = false
        for (let i = 0; i < this.choosedValue.length; i++) {
          if (!this.choosedValue[i]) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$toast('请选择规格')
          return false
        } else {
          this.$toast('库存不足')
          return false
        }
      }
      if (!this.goodsSuk.cntNum && this.specs.length !== 0) {
        this.$toast('库存不足')
        return false
      }
      let obj = {
        name: this.goodsSuk.skuName || this.goodsSuk.spuName,
        id: this.goodsDetail.domain.id,
        price: this.goodsSuk.price ? this.goodsSuk.price : this.goodsSuk.mallPrice,
        type: this.type,
        typeId: this.goodsSuk.id,
        num: this.num,
        merchantName: this.merchantName,
        merchantId: this.goodsDetail.domain.merchantId,
        checked: false,
        pick: this.$router.currentRoute.query.real,
        img: this.goodsSuk.image ? this.goodsSuk.image : this.goodsSuk.imagePath,
        storeId: this.$router.currentRoute.query.real ? this.goodsSuk.storeId : 124,
        storeCode: this.$router.currentRoute.query.real ? this.merchant.code : 'TiensB2C',
        routeQuery: this.$router.currentRoute.query,
        jf: this.goodsJf
      }
      // 有库存 没规格 的时候传
      if (!this.goodsSuk.cntNum && this.specs.length === 0) {
        obj.typeId = this.storeSkuList[0].id
      }
      if (this.$router.currentRoute.query.real) {
        let index = _.findIndex(this.pickShoppingCart, {typeId: obj.typeId})
        if (index > -1) {
          this.pickShoppingCart[index].num += obj.num
        } else {
          this.pickShoppingCart.push(obj)
        }
        localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
      } else {
        let index = _.findIndex(this.expressShoppingCart, {typeId: obj.typeId})
        if (index > -1) {
          this.expressShoppingCart[index].num += obj.num
        } else {
          this.expressShoppingCart.push(obj)
        }
        localStorage.setItem('expressShoppingCart', JSON.stringify(this.expressShoppingCart))
      }
      this.getShoppingCartNum()
      this.$toast('加入购物车成功')
    },
    setExpressShoppingCart () {
      localStorage.setItem('expressShoppingCart', JSON.stringify([]))
    },
    setPickShoppingCart () {
      localStorage.setItem('pickShoppingCart', JSON.stringify([]))
    },
    getShoppingCart () {
      this.expressShoppingCart = JSON.parse(localStorage.expressShoppingCart)
      this.pickShoppingCart = JSON.parse(localStorage.pickShoppingCart)
    },
    getShoppingCartNum () {
      this.shoppingCartNum = 0
      if (this.$router.currentRoute.query.real) {
        // this.pickShoppingCart.forEach(item => {
        //   this.shoppingCartNum += item.num
        // })
        this.shoppingCartNum = this.pickShoppingCart.length
      } else {
        // this.expressShoppingCart.forEach(item => {
        //   this.shoppingCartNum += item.num
        // })
        this.shoppingCartNum = this.expressShoppingCart.length
      }
    },
    formatSpec () {
      let hasDefaultSku = false
      this.specs = []
      this.type = ''
      let self = this
      this.standardList.forEach((item, i) => {
        if (item.itemList && item.itemList.length > 0) {
          let obj = {
            id: 'k' + String(i),
            label: item.standardName,
            values: []
          }
          item.itemList.forEach((subItem, j) => {
            if (subItem.chooseStatus) {
              hasDefaultSku = true
              self.type += `${item.standardName}:${subItem.itemName};`
            }
            obj.values.push({
              id: 'k' + String(i) + '_v' + String(j),
              name: subItem.itemName,
              choosed: subItem.chooseStatus,
              disabled: false,
              matchIndex: i
            })
          })
          this.specs.push(obj)
        }
      })
      for (let i = 0; i < this.specs.length; i++) {
        if (_.findIndex(this.specs[i].values, {choosed: true}) > -1) {
          let j = _.findIndex(this.specs[i].values, {choosed: true})
          this.choosedValue.push(this.specs[i].values[j].name)
        } else {
          this.choosedValue.push(null)
        }
      }
      if (hasDefaultSku && this.storeSkuList && this.storeSkuList.length > 0) {
        let self = this
        this.storeSkuList.forEach(item => {
          if (item.standardItems) {
            let flag = true
            item.standardItems.forEach(subItem => {
              if (subItem) {
                if (self.choosedValue.indexOf(subItem) === -1) {
                  flag = false
                }
              }
            })
            if (flag) {
              self.goodsSuk = item
            }
          }
        })
      }
    },
    judgeShowBtns (data) {
      let index = _.findIndex(data, 'cntNum')
      if (index > -1) {
        this.hideBtns = false
      } else {
        this.hideBtns = true
      }
    },
    chooseSpec (data, parent) {
      // 所有匹配的单品sku
      let matchArr = []
      let matchResultArr = []
      this.specs.forEach(item => {
        matchResultArr.push([])
      })
      if (!data.disabled) {
        data.choosed = !data.choosed
        if (data.choosed) {
          parent.values.forEach(item => {
            if (item.id !== data.id) {
              item.choosed = false
            }
          })
          this.choosedValue[data.matchIndex] = data.name
        } else {
          this.choosedValue[data.matchIndex] = null
        }
      }
      this.storeSkuList.forEach(item => {
        if (item.standardItems && item.standardItems.length > 0) {
          let hasItem = false
          item.standardItems.forEach((subItem, i) => {
            if (subItem) {
              hasItem = true
              item = Object.assign(item, {hasItem: hasItem})
            }
          })
        }
      })
      this.storeSkuList.forEach(item => {
        let self = this
        let isMatched = true
        if (item.hasItem) {
          item.standardItems.forEach((subItem, i) => {
            if (subItem) {
              if (self.choosedValue[i]) {
                if (self.choosedValue[i] !== subItem) {
                  isMatched = false
                }
              } else {
                isMatched = false
              }
            }
          })
          if (isMatched) {
            matchArr.push(item)
          }
        }
      })
      // 重置规格按钮是否可选
      if (matchArr.length === 1) {
        this.specName = `${matchArr[0].skuName}`
        this.specPrice = matchArr[0].price
        this.specImg = matchArr[0].image
        this.goodsSuk = matchArr[0]
      } else {
        this.specName = this.goodsName
        this.specPrice = this.price
        this.specImg = this.img
        this.goodsSuk = null
      }
    },
    openSpec () {
      this.showSpec = true
      if (!this.goodsSuk) {
        this.specName = this.goodsName
        this.specPrice = this.price
        this.specImg = this.img
      } else {
        this.specName = this.goodsSuk.skuName ? this.goodsSuk.skuName : this.goodsName
        this.specPrice = this.goodsSuk.price ? this.goodsSuk.price : this.price
        this.specImg = this.goodsSuk.image ? this.goodsSuk.image : this.img
      }
    },
    setAdress () {
      localStorage.setItem('addresses', JSON.stringify([]))
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    },
    goFormatUrl () {
      if (this.formatUrl) {
        this.$router.push({name: 'formatIframe', query: {iframeSrc: this.formatUrl, noBottom: true}})
      } else {
        return false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  components: {
    'goods-item': goodsItem
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    },
    merchantName () {
      let result = ''
      if (this.$router.currentRoute.query.real) {
        if (this.$router.currentRoute.query.zhixiao) {
          result = '直销B2B'
        } else {
          result = '玛雅线下'
        }
      } else {
        if (this.$router.currentRoute.query.zhixiao) {
          result = '直销B2C'
        } else {
          result = '玛雅线上'
        }
      }
      return result
    }
  },
  beforeDestroy () {
    goodsDeatil(window.clab_tracker, {
      'contentName': '电子钱包体验店',
      'date': new Date().toISOString(),
      'targetId': 'Tiens_ewallet_store',
      'targetName': '电子钱包体验店',
      'channelname': '体验店',
      'storename': this.merchant.name,
      'cateName1': '',
      'cateName2': '',
      'cateName3': this.goodsObj.domain.categoryId,
      'brandName': '',
      'productId': this.goodsObj.domain.id,
      'productName': this.goodsObj.domain.spuName,
      'browsetime': this.browsetime,
      'identityType': 'c_exstore_member',
      'identityValue': this.memberData.id
    })
    clearInterval(this.goodsInterVal)
    this.goodsInterVal = null
    this.browsetime = 0
  },
  watch: {
    '$route' (newValue, oldValue) {
      if (newValue.name === 'goodsDetail') {
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .same-height{
    height: 100vw !important;
  }
  .goods-detail-back{
    background-clip: padding-box;
    position: absolute;
    width: 30px;
    height: 30px;
    top: 30px;
    left: 15px;
    /*border-radius: 50%;*/
    /*opacity: 0.4;*/
    /*background-color: rgba(0, 0, 0, 1);*/
    /*line-height: 35px;*/
    /*text-align: center;*/
    z-index: 999;
  }
  .goods-detail-indicators{
    position: absolute;
    padding: 0 10px;
    height: 20px;
    border-radius: 45px;
    bottom: 10px;
    right: 15px;
    opacity: 0.4;
    background-color: rgba(0, 0, 0, 1);
    z-index: 999;
    color: white;
    text-align: center;
    line-height: 22px;
  }
  .bg-add-cart{
    background: #F69A43;
  }
  .bg-buy-now{
    background: #009943;
  }
  .tiens-badge{
    width: 16px;
    height: 16px;
    background: red;
    color: white;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: -5px;
    line-height: 16px;
    text-align: center;
    font-size: 12px;
  }
  .van-button--bottom-action{
    background-color: #F69A43 !important;
  }
  .spec-item{
    font-size: 11px;
    border-radius: 2px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 4px 10px;
    width: auto;
    height: auto;
    line-height: 13px !important;
  }
  .goods-detail-btn-disabled {
    background: #E1E1E1 !important;
    border: 1px solid #E1E1E1 !important;
    color: #666 !important;
  }
  .choosed {
    color: white !important;
    background: #009943 !important;
  }
  .goods-detail-count{
    width: 85px;
    height: 25px;
    line-height: 25px;
    border: 0.5px solid rgba(204, 204, 204, 1);
    color: #666;
  }
  .goods-detail-img{
    position: absolute;
    top: -20px;
  }
  .confirm-spec{
    background: rgb(0, 153, 67);
    width: 100%;
    height: 38px;
    border-radius: 50px;
    color: white;
    line-height: 38px;
  }
  .bottom-0{
    bottom: 0;
  }
  .left-15{
    left: 15px;
  }
  .spec-text-container{
    position: absolute;
    right: 15px;
    bottom: 0;
    height: 60px;
    width: calc(100vw - 135px);
  }
  .foot-shadow {
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
  }
</style>
