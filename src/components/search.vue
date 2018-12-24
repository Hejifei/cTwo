<template>
  <div class="full-width">
    <van-field @focus="goSearch" class="tiens-search-input my-5 py-3" left-icon="search" v-model="searchModel" :placeholder="placeholderText" />
  </div>
</template>

<script>
export default {
  name: 'tiensSearch',
  props: {
    searchModel: {
      type: String,
      required: false
    },
    placeholderText: {
      type: String,
      required: false
    }
  },
  methods: {
    goSearch () {
      let query = {
        noBottom: true,
        code: this.$router.currentRoute.query.code,
        id: this.$router.currentRoute.query.id,
        searchParentId: this.$router.currentRoute.params.id,
        searchValue: '',
        real: this.$router.currentRoute.query.real,
        zhixiao: this.$router.currentRoute.query.zhixiao,
        maya: this.$router.currentRoute.query.maya
      }
      if (this.$router.currentRoute.query.category) {
        query = Object.assign(query, {category: true})
      }
      if (this.$router.currentRoute.query.merchant) {
        query = Object.assign(query, {merchant: true})
      }
      if (this.$router.currentRoute.query.c) {
        query = Object.assign(query, {c: true})
      }
      this.$router.push({path: '/search', query: query})
    }
  }
}
</script>
<style lang="scss" scoped>
  .tiens-search-input{
    border-radius: 5px;
    background: #f4f4f4;
  }
</style>
