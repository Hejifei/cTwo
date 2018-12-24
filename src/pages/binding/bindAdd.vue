<template>
  <div class="full-height d-flex flex-column default-bg">
    <tiens-header :title="title+'卡绑定'"></tiens-header>
    <div class="text-gray pl-8 mt-3 text-12">{{`请绑定${title}卡以获得更多折扣`}}</div>
    <form>
      <van-cell-group class="mt-3">
        <van-field
          v-model="cardNum"
          placeholder="请输入卡号"/>
        <van-field
          v-model="cardPwd"
          type="password"
          placeholder="请输入密码"
        />
      </van-cell-group>
    </form>
    <div class="mt-12 px-7">
      <div @click="doBind" class="van-button height-5 line-height-50 full-width bg-default-green-dark text-15 text-white text-center">绑定</div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
import {bindCard, getMemberByPhone} from '../../api/binding/index'
import md5 from 'js-md5'

export default {
  name: 'bindingAdd',
  data () {
    return {
      title: '',
      cardNum: '',
      cardPwd: ''
    }
  },
  methods: {
    init () {
      if (this.$router.currentRoute.query.type === 'zhixiao') {
        this.title = '直销'
      } else if (this.$router.currentRoute.query.type === 'maya') {
        this.title = '玛雅'
      }
    },
    doBind () {
      if (!this.cardNum) {
        this.$toast('请输入卡号')
        return false
      }
      if (!this.cardPwd) {
        this.$toast('请输入密码')
        return false
      }
      let md5Key = this.$store.state.md5Key
      bindCard('10005', md5(md5Key), JSON.parse(localStorage.c2MemberPhone), this.cardNum, this.cardPwd)
        .then(res => {
          if (res.data.success) {
            getMemberByPhone(JSON.parse(localStorage.c2MemberPhone))
              .then(res => {
                this.$store.commit('SET_MEMBERDATA', res.data.data)
                this.$router.back(-1)
              })
          } else {
            this.$toast(res.data.message)
          }
        })
    }
  },
  mounted () {
    this.init()
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
