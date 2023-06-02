import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n';
import messages from './locales/locales.json';
import router from './router';
import store from './vuex/store';

Vue.prototype.URL = 'https://kodepay.io';
Vue.prototype.API_URL = 'https://api.kodepay.io';
Vue.prototype.MODECONFIG = {
  PRODUCTION: {
    mode: 'vendors',
    basePath:'/vendors',
    baseURL: `${Vue.prototype.URL}/vendors`,
    apiURL: `${Vue.prototype.API_URL}/production/api`,
  },
  SANDBOX: {
    mode: 'sandbox-vendors',
    basePath:'/sandbox-vendors',
    baseURL: `${Vue.prototype.URL}/sandbox-vendors`,
    apiURL: `${Vue.prototype.API_URL}/sandbox`,
  }
}
if (window.location.pathname.startsWith(Vue.prototype.MODECONFIG.SANDBOX.basePath)) {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.SANDBOX.mode;
} else {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.PRODUCTION.mode;
}
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages,
});
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  template: '<App/>',
  components: { App }
})

