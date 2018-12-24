<template>
  <div class="d-flex flex-column full-height">
    <tiens-header :title="title" :tip="tip"></tiens-header>
    <div class="flex-full ofy-auto">
      <router-view/>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header.vue'

export default {
  name: 'addressManager',
  data () {
    return {
      title: '收货地址',
      tip: {
        label: '管理',
        path: '/address/delete',
        query: {noBottom: true}
      },
      addresses: []
    }
  },
  methods: {
    init () {
      if (!localStorage.addresses) {
        this.setAdress()
      }
      this.getAddresses()
      if (this.addresses.length !== 0) {
        this.tip = {
          label: '管理',
          path: '/address/delete',
          query: {noBottom: true}
        }
      } else {
        this.tip = {
          label: '',
          path: '',
          query: {}
        }
      }
    },
    // 在localStorage中创建收货地址
    setAdress () {
      localStorage.setItem('addresses', JSON.stringify([]))
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader
  },
  watch: {
    '$route' (newValue, oldValue) {
      if (newValue.name === 'addressDelete') {
        this.tip = {
          label: '取消',
          path: '/address/list',
          query: {noBottom: true}
        }
      } else if (newValue.name === 'addressList') {
        this.init()
        if (this.addresses.length !== 0) {
          this.tip = {
            label: '管理',
            path: '/address/delete',
            query: {noBottom: true}
          }
        } else {
          this.tip = {
            label: '',
            path: '',
            query: {}
          }
        }
      } else if (newValue.name === 'addressAdd') {
        this.tip = {
          label: '',
          path: '',
          query: {}
        }
      }
    }
  }
}
</script>
