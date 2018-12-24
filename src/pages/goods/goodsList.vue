<template>
  <div class="d-flex full-height flex-column">
    <tiens-header :title="title" :show-right-pop="showRightPop"></tiens-header>
    <div class="full-width">
      <div class="px-5">
        <tiens-search :search-model="searchValue" placeholder-text="商品搜索"></tiens-search>
      </div>
    </div>
    <div class="flex-full full-width ofy-auto position-relative">
      <scroller ref="scroll" :on-refresh="onRefresh" :on-infinite="onLoad">
        <div class="d-flex flex-wrap">
          <div style="width: 50%" v-for="(item,i) in goods" :key="i">
            <div class="d-flex justify-content-center full-width">
              <div class="mb-7 px-5">
                <goods-item :goods-data="item" @goods-click="goDetail"></goods-item>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import tiensSearch from '../../components/search'
import goodsItem from '../../components/goodsItem'
import {
  getGoodsByCondations
} from '../../api/goods/index'

export default {
  name: 'goodsList',
  data () {
    return {
      refreshLoading: false,
      moreloading: false,
      loadedAll: false,
      showRightPop: false,
      title: '商品列表',
      searchValue: '',
      goods: null,
      pageNum: 1,
      pageSize: 10
    }
  },
  methods: {
    init () {
      this.goods = []
      this.pageNum = 1
      this.loadedAll = false
      if (this.$router.currentRoute.query.fromFormats) {
        this.title = '所有商品'
        this.showRightPop = true
      }
      this.getGoods()
    },
    goDetail (data) {
      let query = {
        noBottom: true,
        real: this.$router.currentRoute.query.real,
        code: this.$router.currentRoute.query.code,
        zhixiao: this.$router.currentRoute.query.zhixiao,
        maya: this.$router.currentRoute.query.maya
      }
      this.$router.push({name: 'goodsDetail', params: {id: data.id}, query: query})
    },
    async getGoods () {
      let formData = {
        storeCode: this.$router.currentRoute.query.code,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.$router.currentRoute.query.merchant) {
        formData = Object.assign(formData, {
          merchantId: this.$router.currentRoute.params.id,
          categoryId: this.$router.currentRoute.query.categoryId
        })
      } else {
        formData = Object.assign(formData, {
          merchantId: 29,
          categoryId: this.$router.currentRoute.params.id
        })
      }
      getGoodsByCondations(formData)
        .then(res => {
          this.formatGoodsList(res.data.data)
        })
        .finally((res) => {
          this.$refs.scroll.finishPullToRefresh()
        })
    },
    formatGoodsList (data) {
      if (data && data.length > 0) {
        data.forEach(item => {
          let obj = {
            name: item.spuName,
            price: item.mallPrice,
            img: item.imagePath,
            id: item.id,
            jf: item.jf
          }
          this.goods.push(obj)
        })
        if (data.length < this.pageSize) {
          this.$refs.scroll.finishInfinite(true)
        } else {
          this.$refs.scroll.finishInfinite(false)
        }
      } else {
        this.$refs.scroll.finishInfinite(true)
      }
    },
    onRefresh () {
      this.init()
    },
    onLoad () {
      this.pageNum++
      this.getGoods()
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader,
    'tiens-search': tiensSearch,
    'goods-item': goodsItem
  }
}
</script>
<style scoped lang="scss">
  .calc-height{
    height: calc(100vh - 130px);
  }
</style>
