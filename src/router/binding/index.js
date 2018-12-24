import binding from '../../pages/binding/index'
import bindingAdd from '../../pages/binding/bindAdd'

const bindingRoute = [
  {
    path: '/binding',
    name: 'binding',
    component: binding,
    children: []
  },
  {
    path: '/bindingAdd',
    name: 'bindingAdd',
    component: bindingAdd,
    children: []
  }
]

export default bindingRoute
