import { wxLogin, getUserById } from 'api/api.js';
import { formatImg, setToUser, getToUser } from 'utils/util.js';

App({
  onLaunch: function (options) {
    this.getReferenceId(options.query.q);
  },
  // 登录
  wxLogin(info, suc, err) {
    wx.login({
      success: res => {
        wxLogin(res.code, info.userInfo.avatarUrl, info.userInfo.nickName).then((data) => {
          wx.setStorageSync('userId', data.userId);
          wx.setStorageSync('token', data.token);
          suc && suc();
        }).catch((msg) => {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
          err && err();
        });
      },
      error: (msg) => {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },
  getReferenceId(url) {
    // url = '1';
    if (url) {
      url = decodeURIComponent(url);
      var match = /userId=([^&$]+)/.exec(url);
      // match = ['', 'U201809061405146404245'];
      if (match) {
        setToUser({ userId: match[1] });
      } else {
        this.hasToUser();
      }
    } else {
      this.hasToUser();
    }
  },
  hasToUser() {
    if (!getToUser()) {
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
    reloadOrders: false
  }
})