export default function ajax(options){
  options.json = options.json || {};
  options.json["token"] = wx.getStorageSync('token') || "";
  options.json["systemCode"] = wx.getStorageSync('systemCode');
  options.json["companyCode"] = wx.getStorageSync('companyCode');
  var params = {
    code: options.code,
    json: JSON.stringify(options.json)
  };
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://xcx.bhxt.hichengdai.com/api',
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: options.method || 'POST',
      success: function (res) {
        if (res.data.errorCode == 0) {
          resolve(res.data.data);
        } else {
          wx.showToast({
            title: res.data.errorInfo,
            icon: 'none'
          });
          reject(res.data.errorInfo);
        }
      },
      fail: function (error) {
        wx.showToast({
          title: res.data.errorInfo
        });
        reject(error);
      }
    });
  });
}