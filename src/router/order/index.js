import liftOrderList from '../../pages/order/liftOrderList'
import expressOrderList from '../../pages/order/expressOrderList'
import orderDetail from '../../pages/order/orderDetail'

const orderRoute = [
  {
    path: '/liftOrderList',
    name: 'liftOrderList',
    component: liftOrderList,
    children: []
  },
  {
    path: '/expressOrderList',
    name: 'expressOrderList',
    component: expressOrderList,
    children: []
  },
  {
    path: '/orderDetail/:id',
    name: 'orderDetail',
    component: orderDetail
  }
]

export default orderRoute
