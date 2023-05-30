import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n';
import messages from './locales/locales.json';
import router from './router';

Vue.prototype.URL = 'wsx.tc.com:8080';
Vue.prototype.MODECONFIG = {
  PRODUCTION: {
    mode: 'vendor',
    basePath:'/vendor',
    baseURL: `${Vue.prototype.URL}/vendor`,
    apiURL: `${Vue.prototype.URL}/production/api`,
  },
  SANDBOX: {
    mode: 'vendor-sandbox',
    basePath:'/vendor-sandbox',
    baseURL: `${Vue.prototype.URL}/vendor-sandbox`,
    apiURL: `${Vue.prototype.URL}/sandbox/api`,
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
  router,
  template: '<App/>',
  components: { App }
})

