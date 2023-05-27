
// 转换成三位一个逗号格式
Vue.prototype.getFData1000 = (source, length = 3) => {
  source = String(source).split('.');
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), '$1,');
  return source.join('.');
};

//数字转换成K，M格式
Vue.prototype.nFormatter = (num, digits) => {
  let isFu = num < 0;
  num = Math.abs(num);

  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  let ret = (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  if (isFu) ret = '-' + ret;
  return ret;
};
// 将文件大小B转换为KB,MB,GB这种格式
Vue.prototype.fileSizeFormat = (file_size) => {
  let size = '';
  if(file_size < 0.1 * 1024) {                            //小于0.1KB，则转化成B
    size = file_size.toFixed(2) + 'B';
  }else if(file_size < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
    size = (file_size / 1024).toFixed(2) + 'K';
  }else if(file_size < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
    size = (file_size / (1024 * 1024)).toFixed(2) + 'M';
  }else{                                            //其他转化成GB
    size = (file_size / (1024 * 1024 * 1024)).toFixed(2) + 'G';
  }
  let sizeStr = size + '';                        //转成字符串
  let index = sizeStr.indexOf('.');                    //获取小数点处的索引
  let dou = sizeStr.substr(index + 1 ,2);            //获取小数点后两位的值
  if(dou === '00') {                                //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
};