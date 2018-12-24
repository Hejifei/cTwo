<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title"></tiens-header>
    <van-field
      v-model.trim="reason"
      type="textarea"
      placeholder="请尽量描述申请售后原因"
      rows="1"
      :autosize="{maxHeight:200,minHeight:200}"
    />
    <div class="full-width d-flex justify-content-center mt-8">
      <van-button class="confirm-afterSale" @click="confirmAfterSale">
        提交
      </van-button>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import { submitAfterSale } from '../../api/afterSale/index'
import md5 from 'js-md5'
export default {
  name: 'afterSale',
  data () {
    return {
      title: '申请售后',
      reason: ''
    }
  },
  methods: {
    confirmAfterSale () {
      let self = this
      let md5Key = this.$store.state.md5Key
      submitAfterSale(md5(md5Key), '10005', this.$router.currentRoute.params.id, this.reason)
        .then(res => {
          if (res.data.success) {
            this.$toast('提交成功')
            setTimeout(() => {
              self.$router.back(-1)
            }, 500)
          } else {
            this.$toast(res.data.description)
          }
        })
    }
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
<style lang="scss" scoped>
  .confirm-afterSale{
    background: rgb(0, 153, 67);
    width: 94%;
    height: 38px;
    border-radius: 50px;
    color: white;
    line-height: 38px;
  }
</style>
