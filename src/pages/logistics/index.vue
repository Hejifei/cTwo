<template>
  <div class="full-height d-flex flex-column bg-white">
    <tiens-header :title="title"></tiens-header>
    <div class="mt-2 px-7">
      <div class="d-flex" v-for="(item,i) in logistics" :key="i">
        <div class="d-flex">
          <div class="full-height d-flex flex-column" :class="{'justify-content-end':i===0}">
            <div class="logistics-line" :class="{'full-height':i !==0 && i!==logistics.length-1,'height-50p': i===0 || i === logistics.length-1}"></div>
          </div>
          <div class="full-height d-flex flex-column justify-content-center">
            <div class="logistics-point" :class="{'bg-default-green-dark':item.state}"></div>
          </div>
        </div>
        <div class="border border-bottom py-5 ml-6 full-width text-13" :class="{'text-default-green-dark':item.state,'text-gray':!item.state}">
          <div class="mb-2">{{item.time}}</div>
          <div class="wb-break-all">{{item.info}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tiensHeader from '../../components/header'
export default {
  name: 'logistics',
  data () {
    return {
      title: '物流详情',
      logistics: [
        {
          time: '2018年1月3日 下午1:27:57',
          info: '签收',
          state: 1
        },
        {
          time: '2018年1月3日 下午1:27:57',
          info: '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字',
          state: 0
        },
        {
          time: '2018年1月3日 下午1:27:57',
          info: '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字',
          state: 0
        }
      ]
    }
  },
  components: {
    'tiens-header': tiensHeader
  }
}
</script>
<style lang="scss" scoped>
  .logistics-line{
    width: 1px;
    background: #e1e1e1;
  }
  .logistics-point{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #8d8d8d;
    position: relative;
    left: -4px;
  }
  .height-50p{
    height: 50%;
  }
</style>
