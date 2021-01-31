import Vue from 'vue';
import VueRouter from 'vue-router';

//category
import createCategory from '../components/category/createCategory.vue';
import categoryList from '../components/category/categoryList.vue';

//customer
import createCustomer from '../components/customer/createCustomer.vue';
import customerList from '../components/customer/customerList.vue';

//supplier
import createSupplier from '../components/supplier/createSupplier.vue';
import supplierList from '../components/supplier/supplierList.vue';

//product
import createProduct from '../components/product/createProduct.vue';
import productList from '../components/product/productList.vue';

//user
import createUser from '../components/user/createUser.vue';
import userList from '../components/user/userList.vue';

//common
import welcome from '../components/common/welcome.vue';

//report
import reorderLevelReport from '../components/report/reorderLevelReport.vue';
// import categoryReport from '../components/report/categoryReport.vue'

//grn
import createGrn from '../components/grn/createGrn.vue';
import grnList from '../components/grn/grnList.vue';

//invoice
import createInvoice from '../components/invoice/createInvoice.vue';

// dashboard
import dashboard from '../components/dashboard/dashboard.vue';

//purchase return
import createPR from '../components/pr/createPR.vue';

//reports
import categoryReport from '../components/reports/category-report.vue';
import staff_report from '../components/reports/staff-report.vue';
import subcategory_report from '../components/reports/subcategory-report.vue';
import product_report from '../components/reports/product-report.vue';
import customer_report from '../components/reports/customer-report.vue';
import supplier_report from '../components/reports/supplier-report.vue';
import grn_report from '../components/reports/grn-report.vue';
import pr_report from '../components/reports/pr-report.vue';
import invoice_report from '../components/reports/invoice-report.vue';
import sr_report from '../components/reports/sr-report.vue';
import stockReport from '../components/reports/stock-report.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: welcome,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  //category
  {
    path: '/category',
    component: createCategory,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  {
    path: '/categoryList',
    component: categoryList,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  //customer
  {
    path: '/customer',
    component: createCustomer,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  {
    path: '/customerList',
    component: customerList,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  //supplier
  {
    path: '/supplier',
    component: createSupplier,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  {
    path: '/supplierList',
    component: supplierList,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  //product
  {
    path: '/product',
    component: createProduct,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  {
    path: '/productList',
    component: productList,
    meta: { permissions: ['Admin', 'Manager'] },
  },
  //user
  {
    path: '/user',
    component: createUser,
    meta: { permissions: ['Admin'] },
  },
  {
    path: '/userList',
    component: userList,
    meta: { permissions: ['Admin'] },
  },
  //report
  {
    path: '/report',
    component: reorderLevelReport,
    meta: { permissions: ['Admin'] },
  },
  {
    path: '/category-report',
    component: categoryReport,
    meta: { permissions: ['Admin'] },
  },

  //grn
  {
    path: '/grn',
    component: createGrn,
    meta: { permissions: ['Admin', 'Manager', 'Staff'] },
  },
  {
    path: '/grnList',
    component: grnList,
    meta: { permissions: ['Admin', 'Manager', 'Staff'] },
  },
  //invoice
  {
    path: '/invoice',
    component: createInvoice,
    meta: { permissions: ['Admin', 'Manager', 'Staff'] },
  },
  {
    path: '/dashboard',
    component: dashboard,
    meta: { permissions: ['Admin', 'Manager', 'Staff'] },
  },
  {
    path: '/pr',
    component: createPR,
    meta: { permissions: ['Admin', 'Manager', 'Staff'] },
  },
  {
    path: '/staff_report',
    component: staff_report,
    name: 'Staff report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/subcategory_report',
    component: subcategory_report,
    name: 'Subcategory report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/product_report',
    component: product_report,
    name: 'Product report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/customer_report',
    component: customer_report,
    name: 'Customer report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/supplier_report',
    component: supplier_report,
    name: 'Supplier report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/grn_report',
    component: grn_report,
    name: 'GRN report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/pr_report',
    component: pr_report,
    name: 'PR report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/invoice_report',
    component: invoice_report,
    name: 'Invoice report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/sr_report',
    component: sr_report,
    name: 'SR report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  {
    path: '/stock-report',
    component: stockReport,
    name: 'Stock report',
    meta: { requiresAuth: true, tag: 'Reports' },
  },
  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

import store from '../store';

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.permissions)) {
    //protected route
    if (store.state['token']) {
      if (to.meta.permissions.includes(store.state['role'])) {
        next();
      } else {
        store.dispatch('onLogout');
        next('/');
      }
    } else {
      store.dispatch('onLogout');
      next('/');
    }
  } else {
    next();
  }
});

export default router;
