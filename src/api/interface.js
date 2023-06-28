import Vue from "vue";
import axios from "axios";
import qs from "qs";
import config from '../configs/config';
let baseURL = config.API_URL;
if (window.location.pathname.startsWith(config.MODECONFIG.SANDBOX.basePath)) {
  baseURL = config.MODECONFIG.SANDBOX.apiURL;
} else {
  baseURL = config.MODECONFIG.PRODUCTION.apiURL;
}
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
        // 清空本地存储的token和cookie
        document.cookie = '';
        localStorage.removeItem(Vue.prototype.$mode + 'applicationKey');
        localStorage.removeItem(Vue.prototype.$mode + 'userInfo')
        localStorage.removeItem(Vue.prototype.$mode + 'token');
        window.location.href = 'https://kodepay.io/user/login';
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
  return instance.get('https://kodepay.io/user/v2/userinfo');
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

export const updatePlan = (id, data) => instance.post(`/product/save/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 订单相关
export const orderList = (data) => instance.post('/app/bill/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const subscriptionList = (data) => instance.post('/app/subscription/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const orderDetailApi = (id,data) => instance.post(`/app/bill/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 订阅相关
export const subscriptionDetailApi = (id,data) => instance.post(`/app/subscription/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

// 客户相关
export const customerListApi = (data) => instance.post('/app/customers/list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const customerDetailApi = (id,data) => instance.post(`/app/customers/detail/${id}`, JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const dashBoardApi = (data) => instance.post('/dashboard/dashboard', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
// 插件端相关
export const extensionLoginIn = () => instance.get('/extension/login');
export const extensionUpdateEmail = data => instance.post('/extension/update-email', data);
export const extensionPayRecord = () => instance.get('/extension/pay-record');
// 取消订阅接口
export const extensionPayStatus = () => instance.get('/extension/pay-status');
export const getUserInfo = () => instance.get('/user/info');

export const addWithdrawInfoApi = data => instance.post('/withdraw/add_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const accountWithdrawInfoApi = data => instance.post('/withdraw/account_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const updateWithdrawInfoApi = data => instance.post('/withdraw/update_withdraw_info', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const accountWithdrawInfoListApi = data => instance.post('/withdraw/account_withdraw_info_apply_list', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});
export const withdrawRateApi = data => instance.post('/withdraw/search_withdraw_exchange_rate', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const searchWithdrawAmountApi = data => instance.post('/withdraw/search_real_amount_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const applyWithdrawApi = data => instance.post('/withdraw/apply_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const checkWithdrawApi = data => instance.post('/withdraw/search_allow_withdraw', JSON.stringify(data), {headers: {'Content-Type' : 'application/json'}});

export const extensionCancelSubscription = (headers, data) => {
  headers['Content-Type'] = 'application/json';
  data = JSON.stringify(data);
  return instance.post('/api/extension/cancel-order', data, {headers ,method: 'POST'});
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
export default instance;