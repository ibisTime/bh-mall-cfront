export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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