import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './theme/index.css'
import VueI18n from 'vue-i18n';
import messages from './locales/locales.json';
import router from './router';
import store from './vuex/store';
import config from './configs/config';
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
Vue.prototype.URL = config.URL;
Vue.prototype.API_URL = config.API_URL;
Vue.prototype.MODECONFIG = config.MODECONFIG;
if (window.location.pathname.startsWith(Vue.prototype.MODECONFIG.SANDBOX.basePath)) {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.SANDBOX.mode;
} else {
  Vue.prototype.$mode = Vue.prototype.MODECONFIG.PRODUCTION.mode;
}
Vue.use(VueI18n);
// 获取当前浏览器的语言, 只支持中文和英文，如果是其他语言，默认为英文
const navLang = navigator.language;
let localLang = navLang === 'zh-CN' || navLang === 'en-US' ? navLang : false;
const i18n = new VueI18n({
  locale: localLang,
  fallbackLocale: localLang,
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