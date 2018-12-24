import addressManager from '../../pages/address/index'
import addressList from '../../pages/address/addressList'
import addressAdd from '../../pages/address/addressAdd'
import addressDelete from '../../pages/address/addressDelete'

const addressRoute = [
  {
    path: '/address',
    name: 'address',
    component: addressManager,
    children: [
      {
        path: '/',
        redirect: 'list'
      },
      {
        path: '/address/list',
        name: 'addressList',
        component: addressList
      },
      {
        path: '/address/add',
        name: 'addressAdd',
        component: addressAdd
      },
      {
        path: '/address/delete',
        name: 'addressDelete',
        component: addressDelete
      }
    ]
  }
]

export default addressRoute
