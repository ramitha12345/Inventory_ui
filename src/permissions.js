export const Admin = [
  {
    icon: 'fa-chart-line',

    text: 'Dashboard',
    path: '/dashboard',
    // children: [
    //     { text: "Create a user", path: "/user" },
    //     { text: "View and update users", path: "/userList" },
    // ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'User',
    children: [
      { text: 'Create a user', path: '/user' },
      { text: 'View and update users', path: '/userList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Category',
    children: [
      { text: 'Create a Category', path: '/category' },
      { text: 'View and update Categories', path: '/categoryList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Product',
    children: [
      { text: 'Create a Product', path: '/product' },
      { text: 'View and update Products', path: '/productList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Supplier',
    children: [
      { text: 'Create a Supplier', path: '/supplier' },
      { text: 'View and update suppliers', path: '/supplierList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Customer',
    children: [
      { text: 'Create a Customer', path: '/customer' },
      { text: 'View and update Customers', path: '/customerList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Good Received Note',
    children: [
      { text: 'Create GRN', path: '/grn' },
      { text: 'View GRNs', path: '/grnList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Purchase return',
    children: [
      { text: 'Create PR', path: '/pr' },
      // { text: "View GRNs", path: "/grnList" },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Invoice',
    children: [
      { text: 'Create Invoice', path: '/invoice' },
      // { text: "View GRNs", path: "/grnList" },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Report',
    children: [
      // { text: 'Reorder Level Report', path: '/report' },
      {
        text: 'Staff report',
        path: '/staff_report',
      },
      { text: 'Category Report', path: '/category-report' },
      {
        text: 'Product report',
        path: '/product_report',
      },

      {
        text: 'Customer report',
        path: '/customer_report',
      },
      {
        text: 'Supplier report',
        path: '/supplier_report',
      },
      {
        text: 'GRN report',
        path: '/grn_report',
      },
      {
        text: 'Purchase return report',
        path: '/pr_report',
      },
      {
        text: 'Invoice report',
        path: '/invoice_report',
      },
      {
        text: 'Sales return report',
        path: '/sr_report',
      },
      {
        text: 'Stock report',
        path: '/stock-report',
      },
      // {
      //   text: 'Daily transactions',
      //   path: '/daily-transaction',
      // },
    ],
  },
];
export const Manager = [
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Category',
    children: [
      { text: 'Create a Category', path: '/category' },
      { text: 'View and update Categories', path: '/categoryList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Product',
    children: [
      { text: 'Create a Product', path: '/product' },
      { text: 'View and update Products', path: '/productList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Customer',
    children: [
      { text: 'Create a Customer', path: '/customer' },
      { text: 'View and update Customers', path: '/customerList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Good Received Note',
    children: [
      { text: 'Create GRN', path: '/grn' },
      { text: 'View GRNs', path: '/grnList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Invoice',
    children: [
      { text: 'Create Invoice', path: '/invoice' },
      // { text: "View GRNs", path: "/grnList" },
    ],
  },
];
export const Staff = [
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Good Received Note',
    children: [
      { text: 'Create GRN', path: '/grn' },
      { text: 'View GRNs', path: '/grnList' },
    ],
  },
  {
    icon: 'fa-angle-up',
    'icon-alt': 'fa-angle-down',
    text: 'Invoice',
    children: [
      { text: 'Create Invoice', path: '/invoice' },
      // { text: "View GRNs", path: "/grnList" },
    ],
  },
];
