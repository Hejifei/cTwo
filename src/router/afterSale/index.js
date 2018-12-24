import afterSale from '../../pages/afterSale/index'
import seeAfterSale from '../../pages/afterSale/seeAfterSale'

const afterSaleRoute = [
  {
    path: '/afterSale/:id',
    name: 'afterSale',
    component: afterSale,
    children: []
  },
  {
    path: '/seeAfterSale/:id',
    name: 'seeAfterSale',
    component: seeAfterSale,
    children: []
  }
]

export default afterSaleRoute
