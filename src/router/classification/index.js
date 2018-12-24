import classification from '../../pages/classification/index'

const classificationRoute = [
  {
    path: '/classification/:id',
    name: 'classification',
    component: classification,
    children: []
  }
]

export default classificationRoute
