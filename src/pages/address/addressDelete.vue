<template>
  <div class="full-height d-flex flex-column">
    <div v-if="addresses.length === 0" class="text-gray text-12 flex-full ofy-auto mt-7 text-center">
      您还没有收货地址，快去添加收货地址吧！
    </div>
    <div v-else class="flex-full ofy-auto">
      <van-pull-refresh class="minh-100" v-model="isLoading" @refresh="onRefresh">
        <address-item @choose-delete="chooseDelete" v-for="(item,i) in addresses" :key="i" :address-obj="item" :is-delete="true"></address-item>
      </van-pull-refresh>
    </div>
    <van-button class="add-address" @click="deleteAddress">
      删除
    </van-button>
  </div>
</template>
<script>
import addressItem from '../../components/addressItem.vue'
import _ from 'lodash'

export default {
  name: 'addressDelete',
  data () {
    return {
      isLoading: false,
      addresses: [],
      deletes: []
    }
  },
  methods: {
    init () {
      this.getAddresses()
    },
    getAddresses () {
      this.addresses = JSON.parse(localStorage.addresses)
    },
    chooseDelete (data, flag) {
      if (flag) {
        this.deletes.push(data.id)
      } else {
        let i = this.deletes.indexOf(data.id)
        if (i > -1) {
          this.deletes.splice(i, 1)
        }
      }
    },
    deleteAddress () {
      if (this.deletes.length > 0) {
        this.$dialog.confirm({
          message: '是否确定删除收货地址',
          title: '提示'
        })
          .then(() => {
            this.deletes.forEach(item => {
              this.addresses.splice(_.findIndex(this.addresses, {id: item}), 1)
            })
            localStorage.setItem('addresses', JSON.stringify(this.addresses))
            this.$router.back(-1)
          })
      } else {
        this.$toast('请选择需要删除的地址')
      }
    },
    onRefresh () {
      setTimeout(() => {
        this.init()
        this.isLoading = false
      }, 500)
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
