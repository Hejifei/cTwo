<template>
  <div class="full-height d-flex flex-column">
    <tiens-header :title="title" :tip="tip" @tip-click="deleteData"></tiens-header>
    <div class="d-flex flex-column flex-full">
      <div class="mt-5">
        <div class="px-5">
          <div class="border border-default text-16">
            <van-row>
              <van-col v-for="(item,i) in tabs" :key="i" span="12">
                <div class="tab-item" :class="{'active':activeTab ===i}" @click="change(item,i)">{{item.name}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <div class="flex-full mt-5 full-width ofy-auto position-relative">
        <scroller :on-refresh="onRefresh" ref="scroll">
          <div v-if="lists && lists.length>0">
            <div v-for="(item,i) in lists" :key="i">
              <van-checkbox class="mb-5 px-4" v-model="item.checked" @change="changeItem(item)">
                <span class="text-13 text-default">{{item.name}}</span>
              </van-checkbox>
              <van-checkbox-group v-model="item.checkedArr" @change="changeSub(item.checkedArr,item)">
                <div v-for="(subItem, i) in item.contents" :key="i" class="d-flex list-item flex-column justify-content-center default-bg">
                  <div class="d-flex">
                    <div class="d-flex height-9 flex-column justify-content-center ml-4">
                      <van-checkbox :name="subItem.typeId"></van-checkbox>
                    </div>
                    <div class="d-flex flex-full ml-4" @click="goGoodsDetail(subItem,item)">
                      <div class="width-9 height-9">
                        <img width="100%" height="100%" :src="subItem.img" alt="">
                      </div>
                      <div class="mx-4 flex-full d-flex flex-column justify-content-between">
                        <div class="default-text text-14 wb-break-all text-clamp-1">
                          {{subItem.name}}
                        </div>
                        <div class="text-gray text-13 wb-break-all text-clamp-2">
                          {{subItem.type}}
                        </div>
                        <div class="d-flex full-width justify-content-between">
                          <div class="d-flex flex-column justify-content-center">
                            <div>
                              <span class="text-red text-13">¥{{subItem.price}}</span>
                              <span v-if="subItem.jf" class="text-8 text-default-green-dark">赠{{subItem.jf}}积分</span>
                            </div>
                          </div>
                          <div class="border count text-gray-dark d-flex justify-content-between text-14">
                            <div @click.stop="reduceNum(subItem)" class="d-flex full-height flex-column justify-content-center width-2 text-center border-right">-</div>
                            <div class="text-13 d-flex full-height flex-column justify-content-center text-center">{{subItem.num}}</div>
                            <div @click.stop="plusNum(subItem)" class="d-flex full-height flex-column justify-content-center width-2 text-center border-left">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </van-checkbox-group>
            </div>
          </div>
          <div v-else class="text-12 text-center text-gray">
            购物车里空空如也，快去添加商品吧
          </div>
        </scroller>
      </div>
    </div>
    <div class="cart-foot">
      <settlement :show-checkbox="true" :is-checked-all="isCheckedAll" :total="totalMoney" :discount="discount" @check-all="chooseAll" @settlement="doSettlement"></settlement>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'
import settlement from '../../components/settlement.vue'
import _ from 'lodash'
import md5 from 'js-md5'
import {placeOrder} from '../../api/shoppingCart/index'
import {shopCart} from '../../../static/js/maidian'

export default {
  name: 'shoppingCart',
  data () {
    return {
      tip: {
        label: '删除'
      },
      isLoading: false,
      title: '购物车',
      tabs: [
        {
          name: '到店自提',
          type: ''
        },
        {
          name: '物流配送',
          type: ''
        }
      ],
      lists: [],
      checkeds: [],
      checkedsIds: [],
      shoppingCart: [],
      pickShoppingCart: null,
      expressShoppingCart: null,
      totalMoney: '0',
      settlementArr: [],
      addresses: [],
      discount: 0
    }
  },
  methods: {
    init () {
      this.$toast.loading({
        duration: 0,
        forbidClick: false,
        loadingType: 'circular'
      })
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
      this.setShowCart()
      setTimeout(() => {
        this.$toast.clear()
        // this.isLoading = false
        this.$refs.scroll.finishPullToRefresh()
      }, 800)
      shopCart(window.clab_tracker, {
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
    },
    change (item, index) {
      this.$store.commit('SET_ACTIVESHOPPINGCARTTAB', index)
      this.setShowCart()
    },
    goGoodsDetail (obj, parent) {
      // let query = {
      //   noBottom: true
      // }
      // if (this.activeTab === 0) {
      //   query = Object.assign(query, {
      //     real: true,
      //     code: this.merchant.code
      //     // noBottom: true,
      //     // real: this.$router.currentRoute.query.real,
      //     // code: this.$router.currentRoute.query.code,
      //     // zhixiao: this.$router.currentRoute.query.zhixiao,
      //     // maya: this.$router.currentRoute.query.maya
      //   })
      // }
      this.$router.push({name: 'goodsDetail', params: {id: obj.id}, query: obj.routeQuery})
    },
    changeItem (obj) {
      if (obj.checked) {
        obj.checkedArr = obj.contentsIds
        this.checkeds.push(obj.id)
      } else {
        obj.checkedArr = obj.checkedArr.length === obj.contentsIds.length ? [] : obj.checkedArr
        this.checkeds.splice(this.checkeds.indexOf(obj.id), 1)
      }
    },
    changeSub (value, parent) {
      let checkedCount = value.length
      parent.checked = checkedCount === parent.contentsIds.length
      this.countTotal()
    },
    chooseAll (value, state) {
      if (this.lists && this.lists.length > 0) {
        if (value) {
          this.lists.forEach(item => {
            item.checkedArr = item.contentsIds
          })
        } else {
          if (state) {
            this.lists.forEach(item => {
              item.checkedArr = []
            })
          }
        }
      }
    },
    doSettlement (data) {
      this.settlementArr = []
      if (this.lists && this.lists.length > 0) {
        this.lists.forEach(item => {
          if (item.checkedArr.length > 0) {
            this.settlementArr = [...item.checkedArr, ...this.settlementArr]
          }
        })
      }
      if (this.settlementArr.length > 0) {
        let detailMapObj = {}
        let storeId
        this.lists.forEach(item => {
          item.contents.forEach(subItem => {
            if (!storeId) {
              storeId = subItem.storeId
            }
            if (this.settlementArr.indexOf(subItem.typeId) > -1) {
              detailMapObj = Object.assign(detailMapObj, {[subItem.typeId]: subItem.num})
            }
          })
        })
        let formData = {
          detailMap: detailMapObj,
          deviceId: 0,
          memberId: this.memberData.id ? this.memberData.id : '',
          storeCode: this.activeTab === 0 ? this.merchant.code : 'TiensB2C',
          storeId: storeId,
          userId: '0',
          deliveryType: this.activeTab === 0 ? 'SELF' : 'MERCHANT'
        }
        if (this.activeTab === 1) {
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
              if (this.activeTab === 0) {
                query = Object.assign(query, {
                  real: true
                })
              }
              // 在购物车中删除选中的商品
              if (this.activeTab === 0) {
                this.settlementArr.forEach(item => {
                  this.pickShoppingCart = _.filter(this.pickShoppingCart, (o) => {
                    return o.typeId !== item
                  })
                })
                localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
              } else {
                this.settlementArr.forEach(item => {
                  this.expressShoppingCart = _.filter(this.expressShoppingCart, (o) => {
                    return o.typeId !== item
                  })
                })
                localStorage.setItem('expressShoppingCart', JSON.stringify(this.expressShoppingCart))
              }
              this.$router.push({name: 'settlement', query: query})
            } else {
              this.$toast(res.data.description)
            }
          })
      } else {
        if (!this.lists || this.lists.length === 0) {
          this.$toast('您还没有添加商品哦，快去添加商品吧')
        } else {
          this.$toast('请选择商品')
        }
      }
    },
    reduceNum (item) {
      if (item.num > 1) {
        item.num--
        this.countTotal()
        this.setShopCartData(item)
      } else {
        this.$toast('商品不能再减少了')
      }
    },
    plusNum (item) {
      item.num++
      this.countTotal()
      this.setShopCartData(item)
    },
    onRefresh () {
      this.init()
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
    setShowCart () {
      if (this.activeTab === 0) {
        this.formatShopCartData(this.pickShoppingCart)
      } else {
        this.formatShopCartData(this.expressShoppingCart)
      }
    },
    formatShopCartData (data) {
      this.lists = []
      if (data && data.length > 0) {
        data.forEach(item => {
          if (_.findIndex(this.lists, {id: item.merchantId}) === -1) {
            let obj = {
              name: item.merchantName,
              id: item.merchantId,
              checked: false,
              contents: [
                {
                  name: item.name,
                  type: item.type,
                  price: item.price,
                  num: item.num,
                  id: item.id,
                  img: item.img,
                  typeId: item.typeId,
                  storeId: item.storeId,
                  routeQuery: item.routeQuery,
                  jf: item.jf
                }
              ],
              checkedArr: [],
              contentsIds: [item.typeId]
            }
            this.lists.push(obj)
          } else {
            let obj = _.find(this.lists, {id: item.merchantId})
            obj.contents.push({
              name: item.name,
              type: item.type,
              price: item.price,
              num: item.num,
              id: item.id,
              img: item.img,
              typeId: item.typeId,
              storeId: item.storeId,
              routeQuery: item.routeQuery,
              jf: item.jf
            })
            obj.contentsIds.push(item.typeId)
          }
        })
        this.checkedsIds = []
        this.lists.forEach(item => {
          this.checkedsIds.push(item.id)
        })
      } else {
        this.lists = null
      }
      this.countTotal()
    },
    countTotal () {
      this.totalMoney = '0'
      if (this.lists && this.lists.length > 0) {
        this.lists.forEach(item => {
          item.contents.forEach(subItem => {
            if (item.checkedArr.indexOf(subItem.typeId) > -1) {
              let money = Number(this.totalMoney)
              money += Number(subItem.price) * Number(subItem.num)
              this.totalMoney = String((money).toFixed(2))
            }
          })
        })
      }
    },
    setShopCartData (item) {
      if (this.activeTab === 0) {
        let index = _.findIndex(this.pickShoppingCart, {id: item.id})
        this.pickShoppingCart[index].num = item.num
        localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
      } else {
        let index = _.findIndex(this.expressShoppingCart, {id: item.id})
        this.expressShoppingCart[index].num = item.num
        localStorage.setItem('expressShoppingCart', JSON.stringify(this.expressShoppingCart))
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
    deleteData () {
      this.settlementArr = []
      if (this.lists && this.lists.length > 0) {
        this.lists.forEach(item => {
          if (item.checkedArr.length > 0) {
            this.settlementArr = [...item.checkedArr, ...this.settlementArr]
          }
        })
      }
      if (this.settlementArr.length > 0) {
        this.$dialog.confirm({
          message: '是否确定删除商品',
          title: '提示'
        })
          .then(() => {
            if (this.activeTab === 0) {
              this.settlementArr.forEach(item => {
                this.pickShoppingCart = _.filter(this.pickShoppingCart, (o) => {
                  return o.typeId !== item
                })
              })
              localStorage.setItem('pickShoppingCart', JSON.stringify(this.pickShoppingCart))
            } else {
              this.settlementArr.forEach(item => {
                this.expressShoppingCart = _.filter(this.expressShoppingCart, (o) => {
                  return o.typeId !== item
                })
              })
              localStorage.setItem('expressShoppingCart', JSON.stringify(this.expressShoppingCart))
            }
            this.init()
          })
      } else {
        this.$toast('请选择需要删除的商品')
      }
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader,
    'settlement': settlement
  },
  computed: {
    isCheckedAll () {
      return this.checkeds.length > 0 && this.checkeds.length === this.checkedsIds.length
    },
    memberData () {
      return this.$store.state.memberData
    },
    activeTab () {
      return this.$store.state.activeShoppingCartTab
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-item{
    height: 35px;
    line-height: 35px;
    text-align: center;
  }
  .active{
    background: #009943;
    color: white;
  }
  .cart-foot{
    height: 50px;
    width: 100%;
  }
  .list-item{
    height: 90px;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  .van-submit-bar{
    position: relative !important;
  }
  .count{
    width: 85px;
    height: 25px;
  }
  .calc-height{
    height: calc(100vh - 204px);
  }
</style>
