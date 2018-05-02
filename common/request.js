export default function ajax(options){
  options.json = options.json || {};
  options.json["token"] = wx.getStorageSync('token') || "";
  options.json["systemCode"] = wx.getStorageSync('systemCode');
  options.json["companyCode"] = wx.getStorageSync('companyCode');
  var params = {
    code: options.code,
    json: JSON.stringify(options.json)
  };
  wx.request({
    url: 'https://xcx.bhxt.hichengdai.com/api',
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: options.method || 'POST',
    success: function(res){
      if (res.data.errorCode == 0) {
        options.success && options.success(res.data.data);
      } else {
        wx.showToast({
          title: res.data.errorInfo,
          icon: 'none'
        });
        options.fail && options.fail(res.data.errorInfo);
      } 
    },
    fail: function(error) {
      wx.showToast({
        title: res.data.errorInfo
      });
      options.fail && options.fail(error);
    },
    complete: function(res) {
      options.complete && options.complete(res);
    }
  });
}