<template>
  <div class="d-flex full-height justify-content-between">
    <div v-if="showCart" class="d-flex flex-column full-height justify-content-center ml-5">
      <div class="bottom-img-container">
        <div v-if="hasShoppingCart" class="full-width full-height position-relative" @click="shoppingCartClick">
          <div class="tiens-badge">{{shopCartTotalNum}}</div>
          <img class="rounded-circle" width="100%" height="100%" src="/static/images/home/main_gwc1.png" alt="">
        </div>
        <img @click="shoppingCartClick" v-else class="rounded-circle" width="100%" height="100%" src="/static/images/home/main_gwc2.png" alt="">
      </div>
    </div>
    <div v-if="showCheckbox" class="d-flex flex-column full-height justify-content-center ml-5">
      <div class="position-relative">
        <div @click="changeCheckedState" class="position-absolute height-3 width-8" style="top: 0;left: 0;z-index: 100;background-color: transparent"></div>
        <van-checkbox @click.stop="null" v-model="checkedAllValue">
          <span class="text-gray text-14">全选</span>
        </van-checkbox>
      </div>
    </div>
    <div class="d-flex full-height">
      <div class="mr-4">
        <div>
          <span class="text-15 mr-3">合计：</span>
          <span class="text-13 text-red mr-1">¥</span>
          <span class="text-13 text-red">{{total}}</span>
        </div>
        <div class="text-gray mt-1 ml-4">
          <span class="text-12 mr-3">优惠：</span>
          <span class="text-12 mr-1">- ¥</span>
          <span class="text-12">{{discount}}</span>
        </div>
      </div>
      <div class="width-10 full-height">
        <van-button class="full-width full-height" @click="settlement" type="primary">结算</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settlement',
  data () {
    return {
      checkedAllValue: this.isCheckedAll
    }
  },
  props: {
    showCart: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    isCheckedAll: {
      type: Boolean,
      default: false
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: String,
      required: false,
      default: '0'
    },
    hasShoppingCart: {
      type: Boolean,
      required: false
    },
    shopCartTotalNum: {
      type: Number,
      required: false
    }
  },
  methods: {
    settlement () {
      this.$emit('settlement', 'settlement')
    },
    changeCheckedState () {
      this.checkedAllValue = !this.checkedAllValue
      this.$emit('check-all', this.checkedAllValue, true)
    },
    shoppingCartClick () {
      this.$emit('shop-cart-click')
    }
  },
  watch: {
    isCheckedAll (newVal) {
      this.checkedAllValue = newVal
    }
  }
}
</script>
<style lang="scss" scoped>
  .bottom-img-container{
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  .tiens-badge{
    width: 16px;
    height: 16px;
    background: red;
    color: white;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    right: -5px;
    line-height: 16px;
    text-align: center;
    font-size: 12px;
  }
</style>
