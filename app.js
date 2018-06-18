import { wxLogin, getUserById } from 'api/api.js';
import { formatImg, setToUser, getToUser } from 'utils/util.js';

App({
  onLaunch: function (options) {
    this.wxLogin();
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
          success: (info) => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // console.log(res.code);
            // console.log(info);
            // console.log(info.userInfo.avatarUrl);
            // console.log(info.userInfo.nickName);
            wxLogin(res.code, info.userInfo.avatarUrl, info.userInfo.nickName).then((data) => {
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
          fail: (err) => {
            console.log(err);
          }
        })
        console.log(res.code);
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
      // match = ['', 'U201806181551130696982'];
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