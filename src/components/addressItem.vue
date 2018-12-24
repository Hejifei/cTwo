<template>
  <div class="full-width">
    <div class="pt-8 justify-content-between d-flex">
      <div :class="{'d-flex':isDelete}" class="full-width border-bottom pb-8">
        <div v-if="isDelete" class="full-height d-flex flex-column justify-content-center mr-8 px-5">
          <van-checkbox class="mt-2" v-model="addressObj.deleteChoose" @change="chooseDelete(addressObj)" ></van-checkbox>
        </div>
        <div class="px-5" :class="{'flex-full':isDelete}">
          <div class="d-flex height-2 justify-content-between">
            <div class="d-flex">
              <div class="text-truncate mr-6 text-13 font-weight-bold line-height-20 max-width-120">{{addressObj.name}}</div>
              <div v-if="addressObj.isDefault" class="text-11 mr-6 border border-default-dark line-height-20 text-default-green-dark px-5 is-default-address">默认</div>
            </div>
            <div class="text-13 line-height-20">{{addressObj.phone}}</div>
          </div>
          <div class="mt-3 text-gray text-12 wb-break-all">{{addressObj.location}}</div>
          <div v-if="!isDelete" class="mt-3 d-flex">
            <van-checkbox class="mt-2 small" v-model="addressObj.isDefault" @change="changeDefault(addressObj)"></van-checkbox>
            <span class="text-11 ml-4 margin-top-3">设为默认</span>
          </div>
        </div>
      </div>
      <div v-if="!isDelete" class="d-flex flex-column justify-content-center px-5 border-bottom" @click="editClick(addressObj)">
        <img src="/static/images/address/shop_edit.png" width="25" height="25" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addressItem',
  props: {
    addressObj: {
      type: Object,
      required: false
    },
    isDelete: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    changeDefault (obj) {
      this.$emit('set-default', obj)
    },
    chooseDelete (obj) {
      if (obj.deleteChoose) {
        this.$emit('choose-delete', obj, true)
      } else {
        this.$emit('choose-delete', obj, false)
      }
    },
    editClick (obj) {
      this.$emit('edit-click', obj)
    }
  }
}
</script>
<style lang="scss" scoped>
  .is-default-address{
    border-radius: 5px;
  }
  .max-width-120{
    max-width: 120px !important;
  }
  .margin-top-3{
    margin-top: 3px !important;
  }
</style>
