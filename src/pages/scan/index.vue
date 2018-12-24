<template>
  <div class="full-height d-flex flex-column bg-white">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full full-width default-bg"></div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'

export default {
  name: 'scan',
  data () {
    return {
      title: '扫一扫'
    }
  },
  methods: {
    init () {
      if (this.isIOS) {
        window.webkit.messageHandlers.onScanQrCode.postMessage(null)
      }
      if (this.isAndroid) {
        window.android.onScanQrCode()
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    isIOS () {
      return this.$store.state.isIOS
    },
    isAndroid () {
      return this.$store.state.isAndroid
    }
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
