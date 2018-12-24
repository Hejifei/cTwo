<template>
  <div class="full-height d-flex flex-column">
    <div v-if="addresses.length ===0" class="flex-full text-gray text-12 flex-full ofy-auto mt-7 text-center">
      您还没有收货地址，快去添加收货地址吧！
    </div>
    <div v-else class="flex-full ofy-auto">
      <van-pull-refresh class="minh-100" v-model="isLoading" @refresh="onRefresh">
        <address-item @edit-click="goEdit" @set-default="setDefault" v-for="(item,i) in addresses" :key="i" :address-obj="item"></address-item>
      </van-pull-refresh>
    </div>
    <van-button v-if="addresses.length <1" class="add-address" @click="addAddress">
      新增地址
    </van-button>
  </div>
</template>
<script>
import addressItem from '../../components/addressItem.vue'

export default {
  name: 'addressList',
  data () {
    return {
      isLoading: false,
      addresses: []
    }
  },
  methods: {
    init () {
      this.getAddresses()
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    addAddress () {
      this.$router.push({path: '/address/add', query: {noBottom: true}})
    },
    setDefault (data) {
      if (data.isDefault) {
        this.addresses.forEach(item => {
          if (item.id === data.id) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
      }
      localStorage.setItem('addresses', JSON.stringify(this.addresses))
    },
    onRefresh () {
      setTimeout(() => {
        this.init()
        this.isLoading = false
      }, 500)
    },
    goEdit (data) {
      this.$router.push({name: 'addressAdd', query: {noBottom: true, editId: data.id}})
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'address-item': addressItem
  }
}
</script>
<style lang="scss" scoped>
  .add-address{
    background: rgb(0, 153, 67);
    width: 94%;
    margin: 0 auto 10px auto;
    height: 38px;
    border-radius: 50px;
    color: white;
    line-height: 38px;
  }
</style>
