import Vue from 'vue';
import Router from 'vue-router';
import dashboard from '../page/website-pages/dashboard.vue';
import payAllOrder from '../page/website-pages/pay-all-order.vue';
import paySubscription from '../page/website-pages/pay-subscription.vue';
import pluginList from '../page/website-pages/plugin-list.vue';
import productList from '../page/website-pages/product-list.vue';
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
Vue.use(Router);
const routes = [
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
        path: 'pay-all-order',
        component: payAllOrderLayout,
        name: 'pay-all-order',
        meta: { breadcrumbLabel: 'Pay All Order' },
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
        meta: { breadcrumbLabel: 'Pay Subscription' },
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
        component: userList,
        name: 'user-list',
        meta: { breadcrumbLabel: 'User List' }
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
    path: '/vendor',
    redirect: '/',
  },
  {
    path: '/vendor-sandbox',
    redirect: '/',
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
// // 在全局导航守卫中处理切换按钮的点击事件
// router.beforeEach((to, from, next) => {
//   if (Vue.prototype.$mode === Vue.prototype.MODECONFIG.PRODUCTION.mode) {
//     const basePath = Vue.prototype.MODECONFIG.PRODUCTION.basePath;
//     if (window.location.pathname.startsWith(basePath) || to.path.startsWith(basePath)) {
//       next();
//     } else {
//       next(basePath + to.fullPath);
//     }
//   } else {
//     const basePath = Vue.prototype.MODECONFIG.SANDBOX.basePath;
//     if (window.location.pathname.startsWith(basePath) || to.path.startsWith(basePath)) {
//       next();
//     } else {
//       next(basePath + to.fullPath);
//     }
//   }
// });
export default router;