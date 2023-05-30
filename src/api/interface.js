import axios from "axios";
import qs from "qs";
import Vue from "vue";

const baseURL = 'http://localhost:8001/sandbox';
// 创建一个axios实例
const instance = axios.create({
  baseURL: baseURL, // 设置API的基础URL
  timeout: 10 * 60 * 1000, // 请求超时时间
});
// 响应拦截器
instance.interceptors.response.use(
    response => {
      console.log(Vue.prototype.$mode);
      const token = response.headers['x-auth-token']; // 获取响应中的Token
      console.log('响应token',token,'response header:', response.headers);
      const applicationKey = response.headers['x-application-key']; // 获取响应中的Token
      if (applicationKey) {
        localStorage.setItem(Vue.prototype.$mode + 'applicationKey', applicationKey);
      }
      if (token) {
        localStorage.setItem(Vue.prototype.$mode + 'token', token);
      }
      // 如果用户token已经过期，那么我需要重定向到登录页面
      if (response.data.code === 401) { // 这里是token过期
        // 清空本地存储的token和cookie
        localStorage.removeItem(Vue.prototype.$mode + 'applicationKey');
        localStorage.removeItem(Vue.prototype.$mode + 'userInfo')
        localStorage.removeItem(Vue.prototype.$mode + 'token');
        window.location.href = '/login';
      }
      return response;
    },
    error => {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
);
// 请求拦截器
instance.interceptors.request.use(
    config => {
      let token = localStorage.getItem(Vue.prototype.$mode + 'token');
      console.log(token);
      if (token) {
        config.headers.Authorization = token;
        config.headers.applicationKey = localStorage.getItem(Vue.prototype.$mode + 'applicationKey');
      }
      return config;
    },
    error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
);
export const zbUserInfo = () => instance.get('/zbase/user-info');
export const postUserInfo = data => {
  const formData = qs.stringify(data);
  return instance.post('/account/login', formData);
};
export const loginOut = () => instance.post('/account/login-out');
// plugin 相关
export const addPlugin = data => {
  const formData = new FormData();
  formData.append('plugin_name', data.name);
  formData.append('icon', data.icon);
  formData.append('description', data.description);
  formData.append('store_address', data.storeAddress);
  return instance.post('/plugin/add-plugin', formData);
};
export const updatePlugin = data => instance.post('/plugin/update-plugin', data);
export const pluginList = () => instance.post('/plugin/plugin-list');
// plan 相关
export const planList = () => instance.get('/plan/list');
export const addPlan = data => instance.post('/plan/add', data);
export const updatePlan = data => instance.post('/plan/update-plan', data);
// 订单相关
export const orderList = () => instance.get('/order/order-list');
export const orderDetail = id => instance.get(`/order/order-detail`);
// 订阅相关
export const subscriptionList = () => instance.get('/subscription/subscription-list');
export const subscriptionDetail = id => instance.get(`/subscription/subscription-detail`);
// 插件端相关
export const extensionLoginIn = () => instance.get('/extension/login');
export const extensionUpdateEmail = data => instance.post('/extension/update-email', data);
export const extensionPayRecord = () => instance.get('/extension/pay-record');
// 取消订阅接口
export const cancelSubscription = data => instance.post('/extension/cancel-subscription', data);
export const extensionPayStatus = () => instance.get('/extension/pay-status');
export const extensionUserInfo = () => instance.get('/extension/user-info');
export const getUserInfo = () => instance.get('/user/info');
export const extensionLogin = () => instance.get('/user/login-in');
export default instance;