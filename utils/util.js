const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export function isUndefined(value) {
  return value === undefined || value === null || value === '';
}
// 格式化图片地址
export function formatImg(imgs, suffix) {
  if (!imgs) {
    return '';
  }
  var img = imgs.split('||')[0];
  suffix = suffix || '?imageMogr2/auto-orient';
  if (!/^http|^data:image/.test(img)) {
    var index = img.indexOf('?imageMogr2');
    if (index !== -1) {
      suffix = img.substr(index);
      img = img.substr(0, index);
    }
    img = 'http://otoieuivb.bkt.clouddn.com/' + encodeURIComponent(img) + suffix;
  }
  return img;
}
/**
 * 获取两位格式化数字
 * @param str
 */
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
/**
 * 日期格式转化
 * @param date
 * @param fmt
 */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (isUndefined(date)) {
    return '-';
  }
  date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}
// 显示loading
export function showLoading(title = '加载中...') {
  wx.showLoading({ title });
}
// 显示警告或错误
export function showWarn(title, duration = 1500) {
  wx.showToast({
    title,
    duration,
    icon: 'none'
  });
}
// 显示成功提示
export function showSuc(title, duration = 1000) {
  wx.showToast({
    title,
    duration,
    icon: 'success'
  });
}
// 获取userId
export function getUserId() {
  return wx.getStorageSync('userId');
}
// 获取推荐人
export function getToUser() {
  return wx.getStorageSync('toUser');
}
// 设置推荐人
export function setToUser(toUser) {
  wx.setStorageSync('toUser', toUser);
}