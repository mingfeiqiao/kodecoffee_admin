import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
        path: '/',
        component: () => import('@/views/Layout.vue'),
        name: 'layout',
        children: [
          {
            path: 'home',
            component:  () => import('@/views/HomePage.vue'),
            name: 'homePage',
            meta: { breadcrumbLabel: 'HomePage' }
          },
          {
            path: 'payCoffee',
            component:  () => import('@/views/PayCoffee.vue'),
            name: 'payCoffee',
            meta: { breadcrumbLabel: 'PayCoffee' }
          }
        ]
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminLayout.vue'),
    name: 'admin',
    redirect: 'admin/dashboard',
    children: [
      {
        path: 'dashboard',
        component:  () => import('@/page/website-pages/dashboard.vue'),
        name: 'dashboard',
        meta: { breadcrumbLabel: 'Dashboard' },
      },
      {
        path: 'order',
        component:  () => import('@/page/website-pages/pay-all-order.vue'),
        name: 'order',
        meta: { breadcrumbLabel: 'All Orders' },
      },
      {
        path: 'order/detail/:id',
        component:  () => import('@/page/website-pages/order-detail.vue'),
        name: 'orders-detail',
        meta: { breadcrumbLabel: 'Order Detail' }
      },
     {
        path: 'customers',
        component:  () => import('@/page/website-pages/user-list.vue'),
        name: 'customers',
        meta: { breadcrumbLabel: 'Customers' },
      },
      {
        path: 'customer/detail/:id',
        name: 'customer-detail',
        component:  () => import('@/page/website-pages/user-detail.vue'),
        meta: { breadcrumbLabel: 'Customer Detail' }
      },
      {
        path: 'plans',
        component:  () => import('@/page/website-pages/plan-list.vue'),
        name: 'plans',
        meta: { breadcrumbLabel: 'Plans' }
      },
      {
        path: 'balance-settings',
        component:  () => import('@/page/website-pages/balance-settings.vue'),
        name: 'balance-settings',
        meta: { breadcrumbLabel: 'Balance Settings' }
      }
    ]
  },
]

const router = new Router({
  mode: 'history',
  routes,
  strict: process.env.NODE_ENV !== 'production',
});
export default router;