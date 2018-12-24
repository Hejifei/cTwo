<template>
  <div id="app">
    <div class="full-width" :style="topStyle" :class="{'hasBg':hasBg}"></div>
    <div class="main" :style="showBottom?hasBottomStyle:noBottomStyle">
      <router-view/>
    </div>
    <div v-if="showBottom" class="foot">
      <div class="d-flex full-height full-width justify-content-around">
        <div class="d-flex flex-column justify-content-between text-center"
             :class="{'active':activeTab === i}"
             v-for="(item,i) in bottomTabs" :key="i"
             @click="goTab(item,i)">
          <img width="26" height="26" :src="activeTab ===i?item.activeIcon:item.icon" :class="{'ml-2': i === 2}" alt="">
          <div class="mb-1 text-13">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMemberByPhone
} from '../src/api/home'
export default {
  name: 'App',
  data () {
    return {
      showBottom: true,
      activeTab: 0,
      bottomTabs: [
        {
          name: '首页',
          icon: '/static/images/tab_main2.png',
          activeIcon: '/static/images/tab_main1.png',
          pathName: 'home'
        },
        {
          name: '分类',
          icon: '/static/images/tab_fenlei2.png',
          activeIcon: '/static/images/tab_fenlei1.png',
          pathName: 'classification',
          params: {id: null},
          query: {code: null, real: true, merchant: true},
          real: true
        },
        {
          name: '购物车',
          icon: '/static/images/tab_gwc2.png',
          activeIcon: '/static/images/tab_gwc1.png',
          pathName: 'shoppingCart'
        },
        {
          name: '我的',
          icon: '/static/images/tab_wode2.png',
          activeIcon: '/static/images/tab_wode1.png',
          pathName: 'personal'
        }
      ]
    }
  },
  methods: {
    goTab (item, index) {
      this.activeTab = index
      if (item.real) {
        this.$router.push({name: item.pathName, params: item.params, query: item.query})
      } else {
        this.$router.push({name: item.pathName, params: item.params})
      }
    },
    init () {
      if (this.nearestMerchant.data) {
        this.bottomTabs[1].params.id = this.nearestMerchant.data.merchantId
        this.bottomTabs[1].query.code = this.nearestMerchant.data.code
      }
      if (this.$router.currentRoute.query.noBottom) {
        this.showBottom = false
      } else {
        this.showBottom = true
      }
      this.initTab()
    },
    initTab () {
      this.bottomTabs.forEach((item, i) => {
        if (item.pathName === this.$router.currentRoute.name) {
          this.activeTab = i
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
      if (this.memberPhone) {
        this.$store.commit('SET_LOGINSTATE', true)
        if (localStorage.c2MemberPhone) {
          if (this.memberPhone !== JSON.parse(localStorage.c2MemberPhone)) {
            // 切换账号清空购物车
            this.$store.commit('SET_RESETSHOPPINGCART')
          }
        }
        localStorage.setItem('c2MemberPhone', JSON.stringify(this.memberPhone))
        getMemberByPhone(JSON.parse(localStorage.c2MemberPhone))
          .then(res => {
            if (res.data.success) {
              this.$store.commit('SET_MEMBERDATA', res.data.data)
            }
          })
      } else {
        if (!localStorage.c2MemberPhone) {
          this.$store.commit('SET_LOGINSTATE', false)
        } else {
          this.$store.commit('SET_LOGINSTATE', true)
          getMemberByPhone(JSON.parse(localStorage.c2MemberPhone))
            .then(res => {
              if (res.data.success) {
                this.$store.commit('SET_MEMBERDATA', res.data.data)
              }
            })
        }
      }
    })
  },
  created () {
    if (this.fromWhere === 'h5') {
      localStorage.setItem('fromWhere', 'h5')
      localStorage.setItem('h5Url', JSON.stringify(decodeURI(this.h5Url)))
      this.$store.commit('SET_ISH5', true)
      this.$store.commit('SET_H5URL', JSON.stringify(decodeURI(this.h5Url)))
    } else if (this.fromWhere === 'app') {
      localStorage.setItem('fromWhere', 'app')
      localStorage.setItem('h5Url', '')
    }
  },
  computed: {
    statusBarHeight () {
      if (this.$router.currentRoute.query.statusBarHeight) {
        sessionStorage.statusBarHeight = this.$router.currentRoute.query.statusBarHeight
      }
      return this.$router.currentRoute.query.statusBarHeight ? Number(this.$router.currentRoute.query.statusBarHeight) : 0
    },
    noBottomStyle () {
      return {height: `calc(100vh - ${(this.statusBarHeight / 75).toFixed(4)}rem)`}
    },
    hasBottomStyle () {
      return {height: `calc(100vh - ${((this.statusBarHeight + 90) / 75).toFixed(4)}rem)`}
    },
    topStyle () {
      return {height: `${(this.statusBarHeight / 75).toFixed(4)}rem`}
    },
    memberPhone () {
      return this.$router.currentRoute.query.phone ? this.$router.currentRoute.query.phone : ''
    },
    h5Url () {
      return this.$router.currentRoute.query.h5 ? this.$router.currentRoute.query.h5 : ''
    },
    hasBg () {
      return this.$store.state.hasBg
    },
    nearestMerchant () {
      return this.$store.state.nearestMerchant
    },
    fromWhere () {
      return this.$router.currentRoute.query.from
    }
  },
  watch: {
    '$route' (newValue, oldValue) {
      if (newValue.query.noBottom) {
        this.showBottom = false
      } else {
        this.showBottom = true
      }
      if (newValue.name === 'personal') {
        this.$store.commit('SET_HASBG', true)
      } else {
        this.$store.commit('SET_HASBG', false)
      }
      this.initTab()
    },
    'nearestMerchant' (newValue) {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}
.main {
  width: 100%;
  background: white;
}
.reduce-full-height{
  height: calc(100vh - 100px);
}
.reduce-height{
  height: calc(100vh - 145px);
}
.foot {
  height: 45px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: white;
  color: #8e8e8e;
  box-shadow: 0 0 2px 0 #A6A6A6;
}
.active{
  color: #6dc392;
}
.hasBg{
  background: rgb(0, 153, 67);
}
</style>
