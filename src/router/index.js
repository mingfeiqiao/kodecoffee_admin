import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const routes = [
  {
    path: '/',
    component: () => import('@/views/AdminLayout.vue'),
    name: 'vendors',
    redirect: 'dashboard',
    children: [
      {
        path: 'guide-step',
        component:  () => import('@/page/website-pages/guide-step.vue'),
        name: 'guideStep',
        meta: { breadcrumbLabel: 'Guide Step' },
      },
      {
        path: 'creator-info',
        component:  () => import('@/page/website-pages/plugin-list.vue'),
        name: 'creatorInfo',
        meta: { breadcrumbLabel: 'Creator Info' },
      },
      {
        path: 'dashboard',
        component:  () => import('@/page/website-pages/dashboard.vue'),
        name: 'dashboard',
        meta: { breadcrumbLabel: 'Dashboard' },
      },
      {
        path: 'orders',
        component:  () => import('@/page/website-pages/user-layout.vue'),
        name: 'order',
        meta: { breadcrumbLabel: 'All Orders' },
        children: [
            {
              path: '',
              component:  () => import('@/page/website-pages/pay-all-order.vue'),
            },
            {
              path: 'detail/:id',
              component:  () => import('@/page/website-pages/order-detail.vue'),
              name: 'orders-detail',
              meta: { breadcrumbLabel: 'Order Detail' }
            },
        ]
      },
     {
        path: 'customers',
        component:  () => import('@/page/website-pages/user-layout.vue'),
        name: 'customers',
        meta: { breadcrumbLabel: 'Customers' },
        children: [
          {
            path: '',
            component:  () => import('@/page/website-pages/user-list.vue'),

          },
          {
            path: 'detail/:id',
            name: 'customer-detail',
            component:  () => import('@/page/website-pages/user-detail.vue'),
            meta: { breadcrumbLabel: 'Customer Detail' }
          },
        ]
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
  {
    path: '/extension/login',
    component:  () => import('@/page/extension/extension-login.vue'),
  },
  {
    path: '/extension/email-validate',
    component:  () => import('@/page/extension/extension-validate-email.vue'),
  },
  {
    path: '/extension/pay-manage',
    component:  () => import('@/page/extension/extension-pay-manage.vue'),
  },
  {
    path: '/extension/pay-status',
    component:  () => import('@/page/extension/extension-pay-status.vue'),
  },
  {
    path:'/share-redirect',
    component:  () => import('@/page/extension/share-redirect.vue'),
  },
  {
    path: '/ext-welcome',
    component:  () => import('@/page/extension/extension-welcome.vue'),
  },
  {
    path: '/extension/payment-choose',
    component:  () => import('@/page/extension/chosen-payment.vue'),
  },
  {
    path: '/extension/session-expired-prompt-page',
    component:  () => import('@/page/extension/extension-session-expired-prompt.vue'),
  },
  {
    path:'/extension/extension-pay',
    component:  () => import('@/page/extension/extension-pay.vue'),
  },
  {
    path:'/extension/extension-pay-success',
    component:  () => import('@/page/extension/extension-pay-success.vue'),
  },
  {
    path: '',
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
]

const router = new Router({
  mode: 'history',
  base: '/vendors/',
  routes,
  strict: process.env.NODE_ENV !== 'production',
});
export default router;