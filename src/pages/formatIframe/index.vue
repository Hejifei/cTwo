<template>
  <div class="full-height d-flex flex-column of-hidden">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full full-width">
      <iframe class="full-height full-width" :src="iframeSrc" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'

export default {
  name: 'formatIframe',
  data () {
    return {
      title: '业态详情',
      iframeSrc: ''
    }
  },
  methods: {
    init () {
      this.iframeSrc = this.$router.currentRoute.query.iframeSrc
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
