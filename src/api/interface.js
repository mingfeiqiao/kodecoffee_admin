import Vue from "vue";
import axios from "axios";
import qs from "qs";
import config from '../configs/config';
let baseURL = baseURL = config.MODECONFIG.PRODUCTION.apiURL;
// 创建一个axios实例
const instance = axios.create({
  baseURL: baseURL, // 设置API的基础URL
  timeout: 10 * 60 * 1000, // 请求超时时间
});
// 响应拦截器
instance.interceptors.response.use(
    response => {
      const token = response.headers['x-auth-token']; // 获取响应中的Token
      const applicationKey = response.headers['x-application-key']; // 获取响应中的Token
      if (applicationKey) {
        localStorage.setItem(Vue.prototype.$mode + 'applicationKey', applicationKey);
      }
      if (token) {
        localStorage.setItem(Vue.prototype.$mode + 'token', token);
      }
      return response;
    },
    error => {
      // 如果用户token已经过期，那么我需要重定向到登录页面
      if (error.response && error.response.status === 401) { // 这里是token过期
        Vue.prototype.$alert(error.response.data.message);
        setTimeout(() => {
          document.cookie = '';
          localStorage.removeItem(Vue.prototype.$mode + 'applicationKey');
          localStorage.removeItem(Vue.prototype.$mode + 'userInfo')
          localStorage.removeItem(Vue.prototype.$mode + 'token');
          // window.location.href = 'https://kodecoffee.com/user/login';
        }, 5000);
      }
      return Promise.reject(error);
    }
);
// 请求拦截器
instance.interceptors.request.use(
    config => {
      let token = localStorage.getItem(Vue.prototype.$mode + 'token');
      let select_language = localStorage.getItem('selected_language');
      if (select_language) {
        config.headers['language'] = select_language;
      }
      if (token) {
        config.headers.Authorization = token;
        config.headers['application-key']= localStorage.getItem(Vue.prototype.$mode + 'applicationKey');
      }
      return config;
    },
    error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
);

export const getOptions = () => {
  return fetch('https://kodepay-cdn.oss-us-west-1.aliyuncs.com/config/options.json');
};
export const zbUserInfo = () => {
  return instance.get('https://kodecoffee.com/user/v2/userinfo');
};
export const postUserInfo = data => {
  const formData = qs.stringify(data);
  return instance.post('/account/login', formData);
};
export const loginOut = () => instance.post('/account/login-out');
export const uploadFile = data => {
  const formData = new FormData();
  // 使用for循环，将对象中的每个属性都添加到formData中
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return instance.post('/upload/upload-icon', formData);
};
// plugin 相关
export const addPlugin = data =>  instance.post('/plugin/add-plugin', data);
export const updatePlugin = data => instance.post('/plugin/update-plugin', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const pluginList = () => instance.post('/plugin/plugin-list');
// plan 相关
export const addPlan = data => instance.post('/product/save', data);
export const planList = data => {
  data = JSON.stringify(data);
  return instance.post('/product/list', data, {headers: {'Content-Type' : 'application/json'}});
}
export const priceList = data => {
  data = JSON.stringify(data);
  return instance.post('/extension/product/list', data, {headers: {'Content-Type' : 'application/json'}});
}
export const exportBillApi = data => instance.post('/app/bill/export-bill', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const planFilterListApi = data =>instance.post('/product/plan-filter-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const updatePlan = (id, data) => instance.post(`/product/save/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 订单相关
export const orderList = (data) => instance.post('/app/bill/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 订单退款
export const refundApi = (data) => instance.post(`/app/bill/refund`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
//反驳争议
export const refutedisputeStripe = (id,data) => instance.post(`/app/bill/dispute/stripe/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
//接受争议
export const acceptDisputeStripe = (id) => instance.post(`/app/bill/dispute/stripe/${id}/close`, '', {headers: {'Content-Type' : 'application/json'}});
export const acceptDisputePaypal = (id) => instance.post(`/app/bill/dispute/paypal/${id}/close`, '', {headers: {'Content-Type' : 'application/json'}});
// 争议列表
export const disputeList = (data) => instance.post(`/app/bill/dispute`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
//争议详情
export const disputeDetails = (id) => instance.post(`app/bill/dispute/${id}`, '', {headers: {'Content-Type' : 'application/json'}});

export const subscriptionList = (data) => instance.post('/app/subscription/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const orderDetailApi = (id,data) => instance.post(`/app/bill/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 订阅相关
export const subscriptionDetailApi = (id,data) => instance.post(`/app/subscription/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 取消订阅
export const unsubscriptionDetailApi = (data) => instance.post(`/app/subscription/cancel-subscription`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

// 客户相关
export const customerListApi = (data) => instance.post('/app/customers/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const customerDetailApi = (id,data) => instance.post(`/app/customers/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const dashBoardApi = (data) => instance.post('/dashboard/dashboard', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

//支付
//获取套餐信息
export const paymentListApi = (key, id) => instance.post(`/extension/bill/retrieve/${id}`, JSON.stringify(id), {headers: {'Content-Type' : 'application/json', 'Client-Key': key}});

// 插件端相关
export const addWithdrawInfoApi = data => instance.post('/withdraw/add_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const accountWithdrawInfoApi = data => instance.post('/withdraw/account_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const updateWithdrawInfoApi = data => instance.post('/withdraw/update_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const accountWithdrawInfoListApi = data => instance.post('/withdraw/account_withdraw_info_apply_list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const withdrawRateApi = data => instance.post('/withdraw/search_withdraw_exchange_rate', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const searchWithdrawAmountApi = data => instance.post('/withdraw/search_real_amount_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const applyWithdrawApi = data => instance.post('/withdraw/apply_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const checkWithdrawApi = data => instance.post('/withdraw/search_allow_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const setPaymentChannelApi = data => instance.post('/settings/set-payment-channel', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getPaymentChannelApi = data => instance.post('/settings/get-payment-channel-setting', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getSymmetricListApi = data => instance.post('/settings/get-symmetric-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const addSymmetricKeyApi = data => instance.post('/settings/create-symmetric-key', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getSupportSymClientsApi = data => instance.post('/settings/sym-support-clients',JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const addCommissionApi = data => instance.post('/extension-commission/commission-add', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getCommissionListApi = data => instance.post('/extension-commission/commission-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getCommissionExtensionListApi = data => instance.post('/extension-commission/commission-extension-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getAllCommissionListApi = data => instance.post('/extension-commission/all-commission-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getPromoterListApi = data => instance.post('/extension-commission/promoter-list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const getWebHookEventTypesApi = () => instance.get('/notifications/webhooks-event-types')
export const getWebHookEventListApi = () => instance.get('/notifications/webhooks')
export const addWebHookEventApi = data => instance.post('/notifications/webhooks', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const updateWebHookEventApi = (id,data) => instance.post(`/notifications/webhooks/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const deleteWebHookEventApi = (id) =>  instance.post(`/notifications/delete-webhooks/${id}`, null, {headers: {'Content-Type' : 'application/json'}})
export const getWebHookEventLogsApi = data => instance.post('/notifications/webhooks-logs', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const setGuideStepApi = data => instance.post('/guide-step/update-guide-step', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}})
export const makeOrderApi = (headers, data) => instance.post('/api/extension/make-order',data,{headers})
export const extensionCancelSubscription = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/cancel-order', data, {headers ,method: 'POST'});
}
//下单接口
export const placeOrderApi = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/extension/bill/confirm', data, {headers ,method: 'POST'});
}
export const extensionUserInfo = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/user-info', data, {headers ,method: 'POST'});
}
export const extensionPayRecordList = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/pay-record', data, {headers ,method: 'POST'});
}
export const extensionLogin = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/login', data, {headers ,method: 'POST'});
}
export const extensionGetSupportPaymentsApi = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/get-support-payments', data, {headers ,method: 'POST'});
}
export const extensionGetPaymentLinkApi = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/get-payment-link', data, {headers ,method: 'POST'});
}
export const extensionGoogleLoginApi = (headers, data) =>  {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/google-login', data, {headers ,method: 'POST'});
}
// 取消订阅接口
export const getUserInfo = () => instance.get('/user/info');
export const attributeApi = data => instance.post('/api/attribute', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const attributeFprApi = data => instance.post('/api/attribute-fpr', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const addExtensionShareApi = data => instance.post('/extension-share/add', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const extensionShareListApi = data => instance.post('/extension-share/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

/*创作者页面无登录请求*/
export const getProductList = (headers, data) => {
  data = JSON.stringify(data);
  return instance.post('/extension/home/info', data, {headers ,method: 'POST'});
}
export default instance;