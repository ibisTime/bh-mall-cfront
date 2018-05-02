import { wxLogin } from 'api/api.js';
import { formatImg } from 'utils/util.js';

App({
  onLaunch: function (options) {
    this.getReferenceId(options.query.q);
    // wx.setStorageSync('userId', 'U201804152047269961875');
    // wx.setStorageSync('token', 'TUSYS201800000000002TK201804290830290514518');
    if (!wx.getStorageSync('userId')) {
      this.wxLogin();
    } else {
      this.wxLogin();
    } 
  },
  // 登录
  wxLogin() {
    wx.login({
      success: res => {
        wx.getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
          success: (res) => {
            console.log(res);
          },
          fail: (err) => {
            console.log(err);
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wxLogin(res.code).then((data) => {
          wx.setStorageSync('userId', data.userId);
          wx.setStorageSync('token', data.token);
        }).catch(() => {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        });
      },
      error: () => {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },
  getReferenceId(url) {
    if (url) {
      url = decodeURIComponent(url);
      var match = /userId=([^&$]+)/.exec(url);
      if (match) {
        wx.setStorageSync('toUser', match[1]);
      } else {
        this.hasToUser();
      }
    } else {
      this.hasToUser();
    }
  },
  hasToUser() {
    wx.setStorageSync('toUser', 'U201804152047269961875');
    if (!wx.getStorageSync('toUser')) {
      wx.showModal({
        title: '提示',
        content: '您需要通过代理的二维码进入，否则将无法下单',
        showCancel: false
      });
      return false;
    }
    return true;
  },
  globalData: {
    products: [],
    choseAddr: null,
    reloadOrders: true
  }
})