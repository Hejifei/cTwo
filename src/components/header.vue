<template>
  <div class="header text-center d-flex justify-content-between bg-white">
    <div class="mt-2 width-5">
      <van-icon class="font-weight-bold" name="arrow-left" @click="goBack()"></van-icon>
    </div>
    <div>
      {{title}}
    </div>
    <div class="mt-2 width-5">
      <div v-if="showScan" class="d-flex flex-column justify-content-center full-height text-center">
        <img width="28" height="28" @click="doScan" src="/static/images/home/main_sys.png" alt="">
      </div>
      <div v-if="tip.label" class="d-flex flex-column justify-content-center full-height text-center">
        <span @click="go(tip)" class="text-14 font-weight-normal">{{tip.label}}</span>
      </div>
      <div v-if="showRightPop" class="d-flex flex-column justify-content-center full-height text-center position-relative offset-classification">
        <img width="48" height="44"  @click="goClassifications" src="/static/images/general_menu.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'tiensHeader',
  props: {
    title: {
      type: String
    },
    showScan: {
      type: Boolean,
      default: false
    },
    showRightPop: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: true
    },
    tip: {
      type: Object,
      required: false,
      default: () => {
        return {
          label: '',
          path: '',
          query: ''
        }
      }
    }
  },
  data () {
    return {
      hasBack: this.showBack
    }
  },
  methods: {
    goBack () {
      if (this.$router.currentRoute.name === 'home') {
        if (this.isH5) {
          window.location.href = JSON.parse(this.h5Url)
        } else {
          if (this.isIOS) {
            window.webkit.messageHandlers.onClosePage.postMessage(null)
          }
          if (this.isAndroid) {
            window.android.onClosePage()
          }
        }
      } else if (this.$router.currentRoute.query.backurl) {
        this.$router.push({name: this.$router.currentRoute.query.backurl})
      } else if (this.$router.currentRoute.query.fromSettlement) {
        this.$router.back(-1)
        setTimeout(() => {
          this.$router.back(-1)
        }, 10)
      } else {
        this.$router.back(-1)
      }
    },
    goClassifications () {
      let query = {
        code: this.$router.currentRoute.query.code,
        id: this.$router.currentRoute.query.id,
        merchant: true,
        zhixiao: this.$router.currentRoute.query.zhixiao,
        maya: this.$router.currentRoute.query.maya
      }
      if (this.$router.currentRoute.query.code) {
        query = Object.assign(query, {real: true})
      }
      this.$router.push({name: 'classification', params: {id: this.$router.currentRoute.params.id}, query: query})
    },
    go (obj) {
      if (obj.path) {
        if (obj.label === '取消') {
          this.$router.back(-1)
        } else {
          this.$router.push({path: obj.path, query: obj.query, history: false})
        }
      } else {
        this.$emit('tip-click')
      }
    },
    doScan () {
      this.$emit('do-scan')
    }
  },
  watch: {
    '$route' (newValue, oldValue) {
      if (newValue.name === 'addressDelete') {
        this.hasBack = false
      } else {
        this.hasBack = true
      }
    }
  },
  computed: {
    isIOS () {
      return this.$store.state.isIOS
    },
    isAndroid () {
      return this.$store.state.isAndroid
    },
    isH5 () {
      return this.$store.state.isH5
    },
    h5Url () {
      return this.$store.state.h5Url
    }
  }
}
</script>
<style lang="scss" scoped>
  .header{
    height: 50px;
    width: 100%;
    font-size: 17px;
    color: #232323;
    font-weight: bolder;
    line-height: 50px;
    border-bottom: 1px solid #ededed;
  }
  .offset-classification{
    top: -3px;
  }
</style>
