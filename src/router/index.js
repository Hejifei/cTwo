import Vue from 'vue'
import Router from 'vue-router'
import homeRoute from './home/index'
import classificationRoute from './classification/index'
import personalRoute from './personal/index'
import shoppingCartRoute from './shoppingCart/index'
import goodsRoute from './goods/index'
import formatsRoute from './formats'
import addressRoute from './address'
import bindingRoute from './binding'
import orderRoute from './order'
import settlementRoute from './settlement'
import payRoute from './pay'
import searchRoute from './search'
import logisticsRoute from './logistics'
import locationRoute from './location'
import scanRoute from './scan'
import formatIframeRoute from './formatIframe'
import RightsAndInterestsRoute from './RightsAndInterests'
import afterSaleRoute from './afterSale'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    ...homeRoute,
    ...classificationRoute,
    ...personalRoute,
    ...shoppingCartRoute,
    ...goodsRoute,
    ...formatsRoute,
    ...addressRoute,
    ...bindingRoute,
    ...orderRoute,
    ...settlementRoute,
    ...payRoute,
    ...searchRoute,
    ...logisticsRoute,
    ...locationRoute,
    ...scanRoute,
    ...formatIframeRoute,
    ...RightsAndInterestsRoute,
    ...afterSaleRoute
  ]
})
