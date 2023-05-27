import config from './config';
const install = function (Vue) {
  Vue.prototype.$config = config; // 注册配置文件
  Vue.prototype.$mode = 'sandbox'; // 默认为沙盒模式
  let checkWebp = function () {
    try {
      return (
          document
              .createElement('canvas')
              .toDataURL('image/webp')
              .indexOf('data:image/webp') === 0
      );
    } catch (err) {
      return false;
    }
  };
  Vue.prototype.WebP = !!checkWebp();
  Vue.prototype.loadScript = function (src, callback) {
    let script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.src = src;
    if (script.addEventListener) {
      script.addEventListener(
          'load',
          function () {
            callback();
          },
          false
      );
    } else if (script.attachEvent) {
      script.attachEvent('onreadystatechange', function () {
        let target = window.event.srcElement;
        if (target.readyState === 'loaded') {
          callback();
        }
      });
    }
    head.appendChild(script);
  };
  // 点击翻页回到页头
  Vue.prototype.getInitTable = function () {
    $('body,html').animate({ scrollTop: 0 }, 500);
  };
  // 图片格式转换
  Vue.prototype.imgChange = function () {
    let isWebP = false;
    let img = new Image();
    img.onload = function () {
      isWebP = !!(img.height > 0 && img.width > 0);
      checkPic(isWebP);
    };
    img.onerror = function () {
      isWebP = false;
      checkPic(isWebP);
    };
    img.src = './c.webp';
    let checkPic = function (isWebP) {
      $('#pics img').each(function (i, v) {
        let src = isWebP ? $(v).attr('webppic-src') : $(v).attr('pic-src');
        $(v).attr('src', src);
      });
    };
  };
  // 字符长度判断函数
  Vue.prototype.strLength = function (str) {
    if (str !== undefined) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      return len;
    } else {
      return '0';
    }
  };
};
export default {
  install,
};
