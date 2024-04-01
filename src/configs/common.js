import Vue from "vue";
export const EN_CODE = 'en-US';
export const ZH_CODE = 'zh-CN';
export const gotoDocCenter = function (language) {
  if (language === this.ZH_CODE) {
    window.open('https://v0kc0b6j3jr.feishu.cn/wiki/IZ49wp8rWiWVUykkBBocfIf8nvd', '_blank');
  } else {
    window.open('https://qb8b3069asp.larksuite.com/wiki/ZCEGwuaEyiT43IkrNJ0uIeHyspf', '_blank');
  }
}
export const OpenCrispChat = function () {
  Vue.prototype.$Crisp.chat.show();
  Vue.prototype.$Crisp.chat.open();
}