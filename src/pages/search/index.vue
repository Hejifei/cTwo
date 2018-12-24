<template>
  <div class="full-height d-flex flex-column">
    <div class="full-width full-height d-flex flex-column">
      <div class="px-5 d-flex justify-content-between">
        <form action="#" onsubmit="return false;" class="flex-full">
          <van-field
            ref="search"
            type="search"
            class="flex-full tiens-search-input my-5 py-3"
            v-model="searchValue"
            :placeholder="placeholderText"
            @search="onSearch"/>
        </form>
        <div class="width-3 ml-5 d-flex flex-column justify-content-center">
          <div class="text-14 text-default" @click="back">取消</div>
        </div>
      </div>
      <div v-if="showGoods" class="flex-full full-width ofy-auto position-relative">
        <scroller ref="scroll" :on-refresh="onRefresh" :on-infinite="onLoad">
          <van-row>
            <van-col span="12" class="mb-7" v-for="(item,i) in goods" :key="i">
              <div class="px-5">
                <goods-item :goods-data="item" @goods-click="goDetail"></goods-item>
              </div>
            </van-col>
          </van-row>
        </scroller>
      </div>
      <div v-else class="mt-5 px-5">
        <div class="d-flex justify-content-between">
          <div class="text-13 text-default">历史搜索</div>
          <div class="text-14 search-icon d-flex flex-column justify-content-center" @click="deleteSearcheds">
            <van-icon name="delete" />
          </div>
        </div>
        <div class="mt-6 d-flex flex-wrap">
          <div v-for="(item,i) in searched" @click="setSearchValue(item)" :key="i" class="searched-item text-truncate">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import goodsItem from '../../components/goodsItem'
import _ from 'lodash'
import {getGoodsByCondations} from '../../api/search/index'
import {searchKeyWords} from '../../../static/js/maidian'

export default {
  name: 'search',
  data () {
    return {
      moreloading: false,
      loadedAll: false,
      offset: 30,
      showGoods: false,
      isLoading: false,
      searchValue: '',
      placeholderText: '请输入商品',
      searched: [],
      goods: null,
      pageNum: 1,
      pageSize: 10,
      defaultQuery: null
    }
  },
  methods: {
    init () {
      this.defaultQuery = _.cloneDeep(this.$router.currentRoute.query)
      this.searchValue = this.$router.currentRoute.query.searchValue ? this.$router.currentRoute.query.searchValue : ''
      this.goods = []
      this.pageNum = 1
      if (!localStorage.searched) {
        this.setSearched()
      }
      this.getSearched()
      if (this.searchValue) {
        this.onSearch()
      }
    },
    setSearchValue (data) {
      this.searchValue = data.name
      this.onSearch()
    },
    back () {
      this.$router.back(-1)
      setTimeout(() => {
        if (this.$router.currentRoute.name === 'search') {
          this.back()
        }
      }, 10)
    },
    deleteSearcheds () {
      this.$dialog.confirm({
        message: '是否确定删除历史记录',
        title: '提示'
      })
        .then(() => {
          this.searchValue = ''
          this.searched = []
          localStorage.setItem('searched', JSON.stringify(this.searched))
        })
    },
    goDetail (data) {
      let query = {
        noBottom: true,
        searchValue: this.searchValue,
        real: this.$router.currentRoute.query.real,
        code: this.$router.currentRoute.query.code,
        zhixiao: this.$router.currentRoute.query.zhixiao,
        maya: this.$router.currentRoute.query.maya
      }
      this.$router.push({name: 'goodsDetail', params: {id: data.id}, query: query})
    },
    onRefresh () {
      this.goods = []
      this.pageNum = 1
      this.loadedAll = false
      this.getGoodsByCondations()
    },
    onSearch () {
      if (this.searchValue) {
        this.searched.push({name: this.searchValue})
        this.searched = _.uniqBy(this.searched, 'name')
        localStorage.setItem('searched', JSON.stringify(this.searched))
        this.showGoods = true
        this.goods = []
        this.pageNum = 1
        let copyQuery = _.cloneDeep(this.$router.currentRoute.query)
        if (copyQuery.searchValue) {
          copyQuery.searchValue = this.searchValue
        } else {
          copyQuery = Object.assign(copyQuery, {searchValue: this.searchValue})
        }
        this.$router.push({query: copyQuery})
        this.getGoodsByCondations()
        searchKeyWords(window.clab_tracker, {
          'source': '电子钱包体验店',
          'contentName': '电子钱包体验店',
          'date': new Date().toISOString(),
          'targetId': 'Tiens_ewallet_store',
          'targetName': '电子钱包体验店',
          'keywords': this.searchValue,
          'identityType': 'c_exstore_member',
          'identityValue': this.memberData.id
        })
      } else {
        this.showGoods = false
      }
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
    setSearched () {
      localStorage.setItem('searched', JSON.stringify([]))
    },
    getSearched () {
      this.searched = JSON.parse(localStorage.searched)
    },
    getGoodsByCondations () {
      let self = this
      getGoodsByCondations({
        merchantId: self.$router.currentRoute.query.merchant ? self.$router.currentRoute.query.searchParentId ? self.$router.currentRoute.query.searchParentId : 'noMerchant' : 29,
        categoryId: self.$router.currentRoute.query.category ? self.$router.currentRoute.query.searchParentId : '',
        storeCode: self.$router.currentRoute.query.code,
        spuName: self.searchValue,
        pageSize: self.pageSize,
        pageNum: self.pageNum
      })
        .then(res => {
          self.formatGoodsList(res.data.data)
        })
        .finally(() => {
          // this.isLoading = false
          // this.moreloading = false
          self.$refs.scroll.finishPullToRefresh()
        })
    },
    onLoad () {
      this.pageNum++
      this.getGoodsByCondations()
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
    'goods-item': goodsItem
  }
}
</script>
<style lang="scss" scoped>
  .tiens-search-input{
    border-radius: 5px;
    background: #f4f4f4;
  }
  .search-icon{
    color: #848484;
  }
  .searched-item{
    height: 25px;
    line-height: 25px;
    padding: 0px 12px;
    background-color: #e1e1e1;
    color: #444;
    font-size: 12px;
    border-radius: 50px;
    margin-bottom: 16px;
    margin-right: 15px;
    max-width: 100%;
  }
  .calc-height{
    height: calc(100vh - 73px);
  }
</style>
