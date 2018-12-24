<template>
  <div class="full-height d-flex flex-column">
    <tiens-header :title="title"></tiens-header>
    <div class="flex-full full-width position-relative">
      <baidu-map class="full-height full-width"
                 ref="map"
                 @ready="mapReady"
                 :center="center"
                 :zoom="zoom"
                 :scroll-wheel-zoom="scrollWheelZoom">
        <bm-marker :position="{lng: mapCenter.lnt, lat: mapCenter.lat}"></bm-marker>
        <!--定位-->
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false" :autoLocation="true"></bm-geolocation>
      </baidu-map>
      <!--<div class="location-reset">-->
        <!--<img @click="resetCenter" width="30" height="30" src="/static/images/location/main_lbs.png" alt="">-->
      <!--</div>-->
    </div>
    <div class="height-5 bg-white full-width">
      <div class="px-7 d-flex justify-content-between full-height">
        <div class="d-flex full-height flex-column justify-content-center">
          <div>
            <div class="width-14 text-16 text-default">
              {{nearMerchant.data.name}}
            </div>
            <div class="text-11 text-gray">
              {{nearMerchant.data.address}}
            </div>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-center full-height">
          <img width="45" height="45" src="/static/images/location/main_lbs1.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
export default {
  name: 'location',
  data () {
    return {
      title: '位置信息',
      map: null,
      center: {lng: null, lat: null},
      zoom: 0,
      scrollWheelZoom: true,
      locationName: '天津大悦城分店',
      locationAddress: '天津市XX区XX路XX号'
    }
  },
  methods: {
    mapReady ({BMap, map}) {
      this.center.lng = this.mapCenter.lnt
      this.center.lat = this.mapCenter.lat
      this.zoom = 15
      this.scrollWheelZoom = true
    },
    resetCenter () {
      this.center.lng = this.mapCenter.lnt
      this.center.lat = this.mapCenter.lat
    }
  },
  mounted () {},
  components: {
    'tiens-header': tiensHeader
  },
  computed: {
    mapCenter () {
      return this.$store.state.realTimeLocation
    },
    nearMerchant () {
      return this.$store.state.nearestMerchant
    }
  }
}
</script>
<style lang="scss" scoped>
  .location-reset{
    position: absolute;
    right: 13px;
    bottom: 65px;
    /*width: 45px;*/
    /*height: 45px;*/
    /*border: 0.5px solid rgba(225, 225, 225, 1);*/
    /*background: white;*/
    /*text-align: center;*/
    /*line-height: 45px;*/
  }
</style>
