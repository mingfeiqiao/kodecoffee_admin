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
import DeveloperSettings from "../page/website-pages/developer-settings.vue";
import paymentChannelSettings from "../page/website-pages/payment-channel-settings.vue";
import paySubscriptionLayout from "../page/website-pages/pay-subscription-layout.vue";
import payAllOrderLayout from "../page/website-pages/pay-all-order-layout.vue";

import extensionLogin from '../page/extension/extension-login.vue';
import extensionPayManage from "../page/extension/extension-pay-manage.vue";
import extensionPayStatus from "../page/extension/extension-pay-status.vue";
import extensionSessionExpiredPrompt from "../page/extension/extension-session-expired-prompt.vue";
import userLayout from "../page/website-pages/user-layout.vue";
import userDetail from "../page/website-pages/user-detail.vue";
import guide from "../page/website-pages/guide.vue";
import extensionValidateEmail from "../page/extension/extension-validate-email.vue";
import ShareRedirect from "../page/extension/share-redirect.vue";
import extensionWelcome from "../page/extension/extension-welcome.vue";
import shareExtension from "../page/website-pages/share-extension.vue";
import chosenPayment from "../page/extension/chosen-payment.vue";
import extensionCommission from "../page/website-pages/extension-commission.vue";
import extensionPay from "../page/extension/extension-pay.vue";
import extensionPaySuccess from "../page/extension/extension-pay-success.vue";

Vue.use(Router);
const routes = [
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
        path: 'orders',
        component: payAllOrderLayout,
        name: 'orders',
        meta: { breadcrumbLabel: 'Orders' },
        children: [
          {
            path: '/',
            component: payAllOrder,
          },
          {
            path: 'detail/:id',
            component: OrderDetail,
            name: 'orders-detail',
            meta: { breadcrumbLabel: 'Order Detail' }
          },
        ]
      },
      {
        path: 'subscriptions',
        component: paySubscriptionLayout,
        name: 'subscriptions',
        meta: { breadcrumbLabel: 'Subscriptions' },
        children: [
          {
            path: '/',
            component: paySubscription,
          },
          {
            path: 'detail/:id',
            name: 'subscriptions-detail',
            component: subscriptionDetail,
            meta: { breadcrumbLabel: 'Subscription Detail' }
          },
        ]
      },
      {
        path: 'customers',
        component: userLayout,
        name: 'customers',
        meta: { breadcrumbLabel: 'Customers' },
        children: [
          {
            path: '/',
            component: userList,
          },
          {
            path: 'detail/:id',
            name: 'customer-detail',
            component: userDetail,
            meta: { breadcrumbLabel: 'Customer Detail' }
          },
        ]
      },
      {
        path: 'extensions',
        component: pluginList,
        name: 'extensions',
        meta: { breadcrumbLabel: 'Extensions' }
      },
      {
        path:'extension-commission',
        component: extensionCommission,
        name: 'extension-commission',
        meta: { breadcrumbLabel: 'Extension Commission' }
      },
      {
        path:'extension-virality',
        component: shareExtension,
        name: 'extension-virality',
        meta: { breadcrumbLabel: 'Extension Virality' }
      },
      {
        path: 'plans',
        component: productList,
        name: 'plans',
        meta: { breadcrumbLabel: 'Plans' }
      },
      {
        path: 'balance-settings',
        component: balanceSettings,
        name: 'balance-settings',
        meta: { breadcrumbLabel: 'Balance Settings' }
      },
      {
        path: 'developer-settings',
        component: DeveloperSettings,
        name: 'developer-settings',
        meta: { breadcrumbLabel: 'Developer Settings' }
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
    path: '/extension/email-validate',
    component: extensionValidateEmail
  },
  {
    path: '/extension/pay-manage',
    component: extensionPayManage
  },
  {
    path: '/extension/pay-status',
    component: extensionPayStatus
  },
  {
    path:'/share-redirect',
    component: ShareRedirect
  },
  {
    path: '/ext-welcome',
    component: extensionWelcome
  },
  {
    path: '/extension/payment-choose',
    component: chosenPayment
  },
  {
    path: '/extension/session-expired-prompt-page',
    component: extensionSessionExpiredPrompt
  },
  {
    path:'/extension/extension-pay',
    component: extensionPay,
  },
  {
    path:'/extension/extension-pay-success',
    component: extensionPaySuccess,
  },
 
];

const router = new Router({
  routes,
  strict: process.env.NODE_ENV !== 'production',
});
export default router;