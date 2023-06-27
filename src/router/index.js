import Vue from 'vue';
import Router from 'vue-router';
import dashboard from '../page/website-pages/dashboard.vue';
import payAllOrder from '../page/website-pages/pay-all-order.vue';
import paySubscription from '../page/website-pages/pay-subscription.vue';
import pluginList from '../page/website-pages/plugin-list.vue';
import productList from '../page/website-pages/plan-list.vue';
import userList from '../page/website-pages/user-list.vue';
import mainMenu from "../page/main-menu.vue";
import subscriptionDetail from "../page/website-pages/subscription-detail.vue";
import OrderDetail from "../page/website-pages/order-detail.vue";
import balanceSettings from "../page/website-pages/balance-settings.vue";
import eventCallbackSettings from "../page/website-pages/event-callback-settings.vue";
import paymentChannelSettings from "../page/website-pages/payment-channel-settings.vue";
import paySubscriptionLayout from "../page/website-pages/pay-subscription-layout.vue";
import payAllOrderLayout from "../page/website-pages/pay-all-order-layout.vue";

import extensionLogin from '../page/extension/extension-login.vue';
import extensionPayManage from "../page/extension/extension-pay-manage.vue";
import extensionPayStatus from "../page/extension/extension-pay-status.vue";
import userLayout from "../page/website-pages/user-layout.vue";
import userDetail from "../page/website-pages/user-detail.vue";

import guide from "../page/website-pages/guide.vue";
Vue.use(Router);
const routes = [
  {
    path: '/vendors',
    redirect: '/',
  },
  {
    path: '/sandbox-vendors',
    redirect: '/',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: mainMenu,
    children: [
      {
        path: 'dashboard',
        component: dashboard,
        name: 'dashboard',
        meta: { breadcrumbLabel: 'Dashboard' }
      },
      {
        path: 'guide',
        component: guide,
        name: 'guide',
        meta: { breadcrumbLabel: 'Guide' }
      },
      {
        path: 'pay-all-order',
        component: payAllOrderLayout,
        name: 'pay-all-order',
        meta: { breadcrumbLabel: 'Orders' },
        children: [
          {
            path: '/',
            component: payAllOrder,
          },
          {
            path: 'detail/:id',
            component: OrderDetail,
            name: 'pay-all-order-detail',
            meta: { breadcrumbLabel: 'Order Detail' }
          },
        ]
      },
      {
        path: 'pay-subscription',
        component: paySubscriptionLayout,
        name: 'pay-subscription',
        meta: { breadcrumbLabel: 'Payments' },
        children: [
          {
            path: '/',
            component: paySubscription,
          },
          {
            path: 'detail/:id',
            name: 'pay-subscription-detail',
            component: subscriptionDetail,
            meta: { breadcrumbLabel: 'Subscription Detail' }
          },
        ]
      },
      {
        path: 'user-list',
        component: userLayout,
        name: 'user-list',
        meta: { breadcrumbLabel: 'User List' },
        children: [
          {
            path: '/',
            component: userList,
          },
          {
            path: 'detail/:id',
            name: 'user-detail',
            component: userDetail,
            meta: { breadcrumbLabel: 'User Detail' }
          },
        ]
      },
      {
        path: 'plugin-list',
        component: pluginList,
        name: 'plugin-list',
        meta: { breadcrumbLabel: 'Plugin List' }
      },
      {
        path: 'product-list',
        component: productList,
        name: 'product-list',
        meta: { breadcrumbLabel: 'Product List' }
      },
      {
        path: 'balance-settings',
        component: balanceSettings,
        name: 'balance-settings',
        meta: { breadcrumbLabel: 'Balance Settings' }
      },
      {
        path: 'event-callback-settings',
        component: eventCallbackSettings,
        name: 'event-callback-settings',
        meta: { breadcrumbLabel: 'Event Callback Settings' }
      },
      {
        path: 'payment-channel-settings',
        component: paymentChannelSettings,
        name: 'payment-channel-settings',
        meta: { breadcrumbLabel: 'Payment Channel Settings' }
      }
    ]
  },
  {
    path: '/extension/login',
    component: extensionLogin
  },
  {
    path: '/extension/pay-manage',
    component: extensionPayManage
  },
  {
    path: '/extension/pay-status',
    component: extensionPayStatus
  }
];

const router = new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production',
});
export default router;