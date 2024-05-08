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

check_local_storage()
Vue.use(VueI18n);
const localLang = getLanguage();
// 将全局方法挂载到Vue原型上
Object.keys(globalMethods).forEach(methodName => {
  Vue.prototype[methodName] = globalMethods[methodName];
});
const i18n = new VueI18n({
  locale: localLang,
  fallbackLocale: localLang,
  silentTranslationWarn: true,
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
function check_local_storage() {
  const userLanguage = navigator.language || navigator.userLanguage;
  let no_local_tip = '⚠️Warning: Your browser does not support local storage. Please update your browser or switch to a different one.'
  let local_limit = '⚠️Warning: Your browser has not enabled local storage permissions. Please enable this feature in your browser settings so that we can save some settings for you. After enabling this feature in the browser settings page, refresh the current page to access it normally. '
  if (userLanguage.startsWith('zh')) {
    no_local_tip = '️⚠️您的浏览器不支持本地存储，请更新浏览器或者更换浏览器';
    local_limit = "⚠️警告：您的浏览器未启用本地存储权限。请在浏览器设置中启用该功能，以便我们为您保存一些设置。在在浏览器设置页面开启，刷新当前页面即可正常访问"
  }
  try {
    if (!window.localStorage) {
      alert(no_local_tip);
    }
    window.localStorage.setItem('kp-m-test', 'test');
    window.localStorage.removeItem('kp-m-test');
  } catch (e) {
    alert(local_limit);
  }
}