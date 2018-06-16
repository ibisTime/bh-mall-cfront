import { wxLogin, getUserById } from 'api/api.js';
import { formatImg, setToUser, getToUser } from 'utils/util.js';

App({
  onLaunch: function (options) {
    this.getReferenceId(options.query.q);
    if (!wx.getStorageSync('userId')) {
      this.wxLogin();
    }
  },
  // 登录
  wxLogin(suc, err) {
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
          suc && suc();
        }).catch(() => {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
          err && err();
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
    // url = '1';
    if (url) {
      url = decodeURIComponent(url);
      var match = /userId=([^&$]+)/.exec(url);
      // match = ['', 'U201806161136139587216'];
      if (match) {
        setToUser({ userId: match[1] });
        getUserById(match[1]).then((data) => {
          setToUser(data);
        }).catch(() => {});
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