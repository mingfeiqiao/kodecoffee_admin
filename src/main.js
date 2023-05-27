import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n';
import messages from './locales/locales.json';
import router from './router';

Vue.prototype.URL = 'https://host.com';
Vue.prototype.MODECONFIG = {
  PRODUCTION: {
    mode: 'production',
    basePath:'/production',
    baseURL: `${Vue.prototype.URL}/production`,
    apiURL: `${Vue.prototype.URL}/production/api`,
  },
  SAASBOX: {
    mode: 'saasbox',
    basePath:'/saasbox',
    baseURL: `${Vue.prototype.URL}/saasbox`,
    apiURL: `${Vue.prototype.URL}/saasbox/api`,
  }
}
if (window.location.pathname.startsWith('/production')) {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.PRODUCTION.mode;
} else {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.SAASBOX.mode;
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

