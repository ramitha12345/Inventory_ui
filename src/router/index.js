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
    meta: { permissions: ['admin', 'manager'],},
  },
  {
    path: '/categoryList',
    component: categoryList,
    meta: { permissions: ['admin', 'manager'],},
  },
  //customer
  {
    path: '/customer',
    component: createCustomer,
    meta: { permissions: ['admin', 'manager'],},
  },
  {
    path: '/customerList',
    component: customerList,
    meta: { permissions: ['admin', 'manager'],},
  },
  //product
  {
    path: '/product',
    component: createProduct,
    meta: { permissions: ['admin', 'manager'],},
  },
  {
    path: '/productList',
    component: productList,
    meta: { permissions: ['admin', 'manager'],},
  },
  //user
  {
    path: '/user',
    component: createUser,
    meta: { permissions: ['admin', 'manager'],},
  },
  {
    path: '/userList',
    component: userList,
    meta: { permissions: ['admin', 'manager'],},
  },
  //report
  {
    path: '/report',
    component: reorderLevelReport,
    meta: { permissions: ['admin', 'manager'],},
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

import store from '../store';

router.beforeEach((to, from, next) => {
  
  if (to.matched.some(record => record.meta.permissions)) {
    //protected route
    if (store.state['token']) {
      if (to.meta.permissions.includes(store.state['role'])) {
        next()
      } else {
        store.dispatch('onLogout')
        next('/')
      }
    } else {
      store.dispatch('onLogout')
      next('/');
    }
  } else {
    next();
  }
})

export default router
