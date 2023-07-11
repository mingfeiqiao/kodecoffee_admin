import Vue from "vue";
export const EN_CODE = 'en-US';
export const ZH_CODE = 'zh-CN';
export const gotoDocCenter = function (language) {
  if (language === this.ZH_CODE) {
    window.open('https://kodepay.io/cn/guide/running', '_blank');
  } else {
    window.open('https://kodepay.io/en/guide/running', '_blank');
  }
}
export const OpenCrispChat = function () {
  Vue.prototype.$Crisp.chat.show();
  Vue.prototype.$Crisp.chat.open();
}