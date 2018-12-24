<template>
  <div class="d-flex flex-column full-height">
    <tiens-header :title="title"></tiens-header>
    <div class="full-width">
      <div class="px-5">
        <tiens-search :search-model="searchValue" placeholder-text="商品搜索"></tiens-search>
      </div>
    </div>
    <div class="flex-full full-width d-flex">
      <div class="classification-left full-height ofy-auto" v-if="classifies && classifies.length>0">
        <div v-for="(item,i) in classifies" :key="i" class="classify-item text-center text-13 position-relative" :class="{'active':activeClassify === item.id}" @click="showGoods(item)">
          <div class="wb-break-all full-height">
            <div class="d-flex flex-column justify-content-center full-height">{{item.name}}</div>
          </div>
          <div v-if="activeClassify === item.id" class="active-bar"></div>
        </div>
      </div>
      <div class="flex-full full-height ofy-auto position-relative">
        <scroller ref="scroll" :on-refresh="onRefresh">
          <div v-if="activeClassifyContent && activeClassifyContent.length >0">
            <div v-for="(item,i) in activeClassifyContent" :class="{'mt-13':i>0}" :key="i">
              <div class="text-center text-15 mb-10">{{item.name}}</div>
              <div class="van-row px-13">
                <van-col class="mb-8" v-for="(subItem,i) in item.contents" :key="i" span="8">
                  <div class="text-center text-13">
                    <div class="full-width d-flex justify-content-center mb-2">
                      <div class="rounded-circle border round-size" @click="goGoodsList(subItem, item)">
                        <img width="100%" height="100%" class="rounded-circle" v-lazy="subItem.img">
                      </div>
                    </div>
                    {{subItem.name}}
                  </div>
                </van-col>
              </div>
            </div>
          </div>
          <div v-else class="text-12 text-center text-gray">
            暂无商品
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'
import tiensSearch from '../../components/search.vue'
import {
  getClassificationByMerchantId
} from '../../api/classification/index'
import _ from 'lodash'
import {clickCategory} from '../../../static/js/maidian'

export default {
  name: 'classification',
  data () {
    return {
      title: '商品分类',
      searchValue: '',
      activeClassify: null,
      isLoading: false,
      classifies: null,
      activeClassifyContent: null,
      resData: null,
      merchant: {}
    }
  },
  methods: {
    init () {
      if (!localStorage.merchant) {
        this.setMerchant()
      }
      this.getMerchant()
      getClassificationByMerchantId({
        merchantId: this.$router.currentRoute.params.id
      })
        .then(res => {
          this.resData = res.data.data
          this.formatClassifies(res.data.data)
        })
        .finally(() => {
          // this.isLoading = false
          this.$refs.scroll.finishPullToRefresh()
        })
    },
    showGoods (data) {
      this.activeClassify = data.id
      this.formatCliaaifyList()
    },
    goGoodsList (data, parent) {
      let query = {
        noBottom: true,
        zhixiao: this.$router.currentRoute.query.zhixiao,
        maya: this.$router.currentRoute.query.maya
      }
      if (this.$router.currentRoute.query.real) {
        query = Object.assign(query, {
          real: true
        })
      }
      let params = {
        id: data.id
      }
      if (this.$router.currentRoute.query.code) {
        query = Object.assign(query, {
          id: this.$router.currentRoute.query.id,
          code: this.$router.currentRoute.query.code,
          merchant: this.$router.currentRoute.query.merchant,
          categoryId: data.id
        })
        params.id = this.$router.currentRoute.params.id
      }
      clickCategory(window.clab_tracker, {
        'source': '电子钱包体验店',
        'contentName': '电子钱包体验店',
        'date': new Date().toISOString(),
        'targetId': 'Tiens_ewallet_store',
        'targetName': '电子钱包体验店',
        'channelname': '体验店',
        'storename': this.merchant.name,
        'cateName1': this.$router.currentRoute.params.id,
        'cateName2': parent.id,
        'cateName3': data.id,
        'identityType': 'c_exstore_member',
        'identityValue': this.memberData.id
      })
      this.$router.push({name: 'goodsList', params: params, query: query})
    },
    onRefresh () {
      let self = this
      this.formatCliaaifyList()
      setTimeout(() => {
        self.$refs.scroll.finishPullToRefresh()
      }, 1000)
    },
    formatClassifies (data) {
      this.classifies = []
      if (data && data.length > 0) {
        data.forEach(item => {
          let obj = {
            name: item.name,
            id: item.id
          }
          this.classifies.push(obj)
        })
        this.activeClassify = this.classifies[0].id
        this.formatCliaaifyList()
      }
    },
    formatCliaaifyList () {
      let parentObj = _.find(this.resData, {id: this.activeClassify})
      this.activeClassifyContent = []
      if (parentObj && parentObj.childList && parentObj.childList.length > 0) {
        parentObj.childList.forEach(item => {
          if (item.childList && item.childList.length > 0) {
            let obj = {
              name: item.name,
              id: item.id,
              contents: []
            }
            item.childList.forEach(subItem => {
              obj.contents.push({
                name: subItem.name,
                img: subItem.categoryImage,
                id: subItem.id
              })
            })
            this.activeClassifyContent.push(obj)
          }
        })
      }
    },
    getMerchant () {
      this.merchant = JSON.parse(localStorage.merchant)
    },
    setMerchant () {
      localStorage.setItem('merchant', JSON.stringify({}))
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    memberData () {
      return this.$store.state.memberData
    }
  },
  components: {
    'tiens-header': tiensHeader,
    'tiens-search': tiensSearch
  }
}
</script>
<style lang="scss" scoped>
  .classification-left{
    width: 85px;
    background: #f2f2f2;
  }
  .classify-item{
    width: 100%;
    height: 78px;
  }
  .active{
    background: white;
  }
  .active-bar{
    width: 4px;
    height: 44px;
    background: #009943;
    position: absolute;
    left: 0;
    top: 17px;
  }
  .round-size{
    width: 55px;
    height: 55px;
  }
  .calc-height{
    height: calc(100vh - 152px);
  }
</style>
