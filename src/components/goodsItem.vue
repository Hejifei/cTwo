<template>
  <div class="full-width">
    <div class="size-17" @click="handleGoodClick(goodsData)">
      <img width="100%" height="100%" :src="goodsData.img" alt="">
    </div>
    <div class="text-14 text-default mt-2 width-17 text-truncate">{{goodsData.name}}</div>
    <div class="mt-1 d-flex justify-content-between">
      <div class="mt-1 text-red">
        <span class="mr-1 text-14">¥</span>
        <span class="text-14">{{goodsData.price}}</span>
      </div>
      <div v-if="goodsData.jf" class="text-8 text-default-green-dark">
        赠{{goodsData.jf}}积分
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'goodsItem',
  props: {
    goodsData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleGoodClick (item) {
      this.$emit('goods-click', item)
    }
  }
}
</script>
