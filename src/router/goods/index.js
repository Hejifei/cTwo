import goodsDetail from '../../pages/goods/goodsDetail'
import goodsList from '../../pages/goods/goodsList'
const goodsRoute = [
  {
    path: '/goodsList/:id',
    name: 'goodsList',
    component: goodsList,
    children: []
  },
  {
    path: '/goodsDetail/:id',
    name: 'goodsDetail',
    component: goodsDetail,
    children: []
  }
]

export default goodsRoute
