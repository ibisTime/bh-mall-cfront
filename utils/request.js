import { showWarn } from '../utils/util.js';

export default function ajax(options){
  options.json = options.json || {};
  options.json["token"] = wx.getStorageSync('token') || "";
  var params = {
    code: options.code,
    json: JSON.stringify(options.json)
  };
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'https://xcx.bhxt.hichengdai.com/api',
      url: 'https://mj.cfront.zjqiyu.com/api',
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: options.method || 'POST',
      success: function (res) {
        if (res.data.errorCode == 0) {
          resolve(res.data.data);
        } else {
          showWarn(res.data.errorInfo);
          reject(res.data.errorInfo);
        }
      },
      fail: function (error) {
        showWarn('网络异常，请稍后再试');
        reject(error);
      }
    });
  });
}