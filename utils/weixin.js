// 微信支付
export function wxPay(data) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.wechatPackage,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        wx.hideLoading();
        if (res.errMsg != 'requestPayment:fail cancel') {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          });
        }
        reject(res);
      }
    });
  });
}