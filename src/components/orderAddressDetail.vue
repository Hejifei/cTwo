<template>
  <div class="full-width d-flex justify-content-between">
    <div class="d-flex flex-column justify-content-center">
      <img width="19" height="19" src="/static/images/shop_loc.png" alt="">
    </div>
    <div v-if="addressObj" class="ml-5 flex-full text-13 default-text">
      <div class="d-flex justify-content-between">
        <div class="d-flex">
          <div class="mr-2">收货人：</div>
          <div class="text-truncate max-width-11">{{addressObj.name}}</div>
          <div v-if="addressObj.isDefault" class="text-11 ml-3 border border-default-dark text-default-green-dark px-5 bdr-3 line-height-17">默认</div>
        </div>
        <div class="d-flex flex-column justify-content-center">{{addressObj.phone}}</div>
      </div>
      <div class="wb-break-all mt-3">
        收货地址： {{addressObj.location}}
      </div>
    </div>
    <div v-else class="ml-7 flex-full text-default text-13" @click="goAddreddAdd">
      请添加收货地址
    </div>
  </div>
</template>
<script>
export default {
  name: 'orderAddressDetail',
  props: {
    addressObj: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      isDefaultAddress: true
    }
  },
  methods: {
    goAddreddAdd () {
      this.$router.push({name: 'addressAdd', query: {noBottom: true, from: this.$router.currentRoute.name}})
    }
  }
}
</script>
<style lang="scss" scoped>
  .max-width-11{
    max-width: 110px;
  }
  .bdr-3{
    border-radius: 3px;
  }
  .line-height-17{
    line-height: 17px;
  }
</style>
