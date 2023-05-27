import axios from "axios";
import qs from "qs";

const baseURL = 'http://localhost:8001/sandbox';
// 创建一个axios实例
const instance = axios.create({
  baseURL: baseURL, // 设置API的基础URL
  timeout: 5000, // 请求超时时间
});
// 响应拦截器
instance.interceptors.response.use(
    response => {
      // 如果用户token已经过期，那么我需要重定向到登录页面
      if (response.data.code === 401) { // 这里是token过期
        // 清空本地存储的token和cookie
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const token = response.headers['x-auth-token']; // 获取响应中的Token
      if (token) {
        localStorage.setItem('token', token);
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
      console.log('ss');
      // 在发送请求之前做些什么
      if (localStorage.getItem('token')) {
        config.headers.Authorization = localStorage.getItem('token');
      }
      // // 添加Cookie到请求标头
      // const cookie = document.cookie; // 获取本地Cookie
      // if (cookie) {
      //   config.headers['Cookie'] = cookie;
      // }
      return config;
    },
    error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
);
export const zbUserInfo = () => instance.get('/zbase/user-info');
export const postUserInfo = data => {
  console.log('xxx');
  const formData = qs.stringify(data);
  console.log('instance',instance);
  return instance.post('/account/login', formData);
};
export const loginOut = () => instance.get('/user/login-out');
// plugin 相关
export const addPlugin = data => instance.post('/plugin/add', data);
export const updatePlugin = data => instance.post('/plugin/update-plugin', data);
export const pluginList = () => instance.get('/plugin/list');
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