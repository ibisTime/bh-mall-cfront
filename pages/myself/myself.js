import { getUserInfo } from '../../api/api.js';
import { showLoading, getUserId, showWarn } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    userInfo: {},
    login: true
  },
  onLoad: function (options) {
    if (getUserId()) {
      this.getUserInfo();
    } else {
      this.setData({ login: false });
    }
  },
  getUserInfo() {
    showLoading();
    getUserInfo().then((userInfo) => {
      this.setData({ userInfo, login: true });
      wx.hideLoading();
    }).catch(() => {});
  },
  login() {
    app.wxLogin(() => {
      this.getUserInfo();
    });
  },
  loginAgain() {
    wx.removeStorageSync('userId');
    wx.removeStorageSync('toUser');
    app.wxLogin(() => {
      this.getUserInfo();
    });
  },
  goSetting() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../setting/setting'
      });
    } else {
      showWarn('您还未登录');
    }
  },
  goHelp() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../help/help'
      });
    } else {
      showWarn('您还未登录');
    }
  },
  callPhone() {
    if (this.data.login) {
      let toUser = wx.getStorageSync('toUser');
      if (toUser.mobile) {
        wx.makePhoneCall({
          phoneNumber: toUser.mobile
        });
      } else {
        showWarn('您的代理还没有手机号');
      }
    } else {
      showWarn('您还未登录');
    }
  },
  goVersion() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../version/version'
      });
    } else {
      showWarn('您还未登录');
    }
  }
});
