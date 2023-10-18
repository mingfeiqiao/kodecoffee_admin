import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import '../src/css/cus-theme.scss'
import VueI18n from 'vue-i18n';
import messages from './locales/locales.json';
import router from './router';
import store from './vuex/store';
import config from './configs/config';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import * as echarts from 'echarts';
import * as globalMethods from './configs/common';
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
const localLang = getLanguage();
// 将全局方法挂载到Vue原型上
Object.keys(globalMethods).forEach(methodName => {
  Vue.prototype[methodName] = globalMethods[methodName];
});
const i18n = new VueI18n({
  locale: localLang,
  fallbackLocale: localLang,
  messages: {
    'zh-CN': Object.assign(messages["zh-CN"], zhLocale), // 中文语言包
    'en-US': Object.assign(messages['en-US'], enLocale) // 英文语言包
  },
  i18n: (key, value) => i18n.t(key, value)
});
Vue.config.productionTip = false;
ElementLocale.i18n((key, value) => i18n.t(key, value));
Vue.use(ElementUI);
new Vue({
  el: '#app',
  i18n: i18n,
  store,
  router,
  template: '<App/>',
  components: { App }
})
function getLanguage() {
  const support_language = ['en-US', 'zh-CN'];
// 获取当前浏览器的语言, 只支持中文和英文，如果是其他语言，默认为英文
  let localLang = localStorage.getItem('selected_language');
  if (!support_language.includes(localLang)) {
    const navLang = navigator.language;
    // 取前两位判断是否为zh或者en
    if (navLang.startsWith('zh')) {
      localLang = 'zh-CN';
    } else {
      localLang = 'en-US';
    }
    localStorage.setItem('selected_language', localLang);
  }
  return localLang;
}