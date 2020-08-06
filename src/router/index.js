import Vue from 'vue'
import VueRouter from 'vue-router'

//category
import createCategory from '../components/category/createCategory.vue'
import categoryList from '../components/category/categoryList.vue'

//customer
import createCustomer from '../components/customer/createCustomer.vue'
import customerList from '../components/customer/customerList.vue'

//product
import createProduct from '../components/product/createProduct.vue'
import productList from '../components/product/productList.vue'

//user
import createUser from '../components/user/createUser.vue'
import userList from '../components/user/userList.vue'

//common
import welcome from '../components/common/welcome.vue'

//report
import reorderLevelReport from '../components/report/reorderLevelReport.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: welcome
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  //category
  {
    path: '/category',
    component: createCategory,
  },
  {
    path: '/categoryList',
    component: categoryList,
  },
  //customer
  {
    path: '/customer',
    component: createCustomer,
  },
  {
    path: '/customerList',
    component: customerList,
  },
  //product
  {
    path: '/product',
    component: createProduct,
  },
  {
    path: '/productList',
    component: productList,
  },
  //user
  {
    path: '/user',
    component: createUser,
  },
  {
    path: '/userList',
    component: userList,
  },
  //report
  {
    path: '/report',
    component: reorderLevelReport,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
