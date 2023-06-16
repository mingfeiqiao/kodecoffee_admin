export const timestampToDatetime = function (timestamp) {
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear();
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};
//2019-8-01转换成Aug 01 2019或2019年1月25日的格式
export const dateNbsp = function (date) {
  let chn_mon_arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']; //中文参照
  if (this.asoLanguage !== 'zh-cn') {
    let en_mon_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; //英文月份
    let current_month = date.substring(5, 7);
    let current_day = date.substring(8, 10);
    let current_year = date.substring(0, 4);
    for (let i = 0; i < chn_mon_arr.length; i++) {
      //循环匹配
      if (current_month == chn_mon_arr[i]) {
        return `${en_mon_arr[i]} ${current_day} ${current_year}`;
      }
    }
  } else {
    let en_mon_arr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']; //中文月份
    let current_month = date.substring(5, 7);
    let current_day = date.substring(8, 10);
    let current_year = date.substring(0, 4);
    for (let i = 0; i < chn_mon_arr.length; i++) {
      //循环匹配
      if (current_month == chn_mon_arr[i]) {
        return `${current_year}年${en_mon_arr[i]}${current_day}日`;
      }
    }
  }
};

//标准时间 转换成 2020-11-11
export const getTimeDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  return `${year}-${month}-${strDate}`;
};

//转换成起止时间戳。day为30，返回数组[0]为起始时间戳，[1]为结束时间戳
export const getDays = function (day) {
  let end = new Date(new Date().setHours(23, 59, 59, 999));
  let start = new Date(new Date().setHours(0, 0, 0, 0));
  start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1));
  let beginDate = parseInt(start.getTime() / 1000);
  let endDate = parseInt(end.getTime() / 1000);
  let arr = [];
  arr.push(beginDate);
  arr.push(endDate);
  return arr;
};

// Dec 13,2019 汉化为 X年X月X日
export const getTimeZh = function (date) {
  if (!date) {
    return;
  }
  let zh_mon_arr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  let en_mon_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; //英文月份//中文月份
  let str = date.trim().split(' ');
  let str2 = str[1].trim().split(',');
  let current_month = str[0];
  let current_day = str2[0];
  let current_year = str2[1];
  if (this.asoLanguage == 'zh-cn') {
    for (let i = 0; i < en_mon_arr.length; i++) {
      //循环匹配
      if (current_month == en_mon_arr[i]) {
        return `${current_year}年${zh_mon_arr[i]}${current_day}日`;
      }
    }
  } else {
    return date;
  }
};

export const timestampToTime = function (timestamp) {
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  return `${year}-${month}-${strDate}`;
};

export const timeToZh = function (str) {
  if (!str) {
    return;
  }
  if (this.asoLanguage == 'zh-cn') {
    str = str.replace('ago', '前');
    str = str.replace(/years|year/, '年');
    str = str.replace(/months|month/, '月');
    str = str.replace(/weeks|week/, '周');
    str = str.replace(/days|day/, '天');
    return str;
  } else {
    str = str.replace(/1 years/, '1 year');
    str = str.replace(/1 months/, '1 month');
    str = str.replace(/1 weeks/, '1 week');
    str = str.replace(/1 days/, '1 day');
    return str;
  }
};

export const timestampToDateString = function (timestamp, format = 'yyyy-MM-dd') {
  const date = new Date(timestamp * 1000); // 将秒级别的时间戳转换为毫秒级别
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  let dateString = `${year}-${month}-${day}`;

  if (format === 'yyyy-MM-dd HH:II:SS') {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    dateString += ` ${hours}:${minutes}:${seconds}`;
  }

  return dateString;
}