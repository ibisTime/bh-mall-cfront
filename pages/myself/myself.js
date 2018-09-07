import { getUserInfo, getAgent } from '../../api/api.js';
import { showLoading, getUserId, showWarn, showSuc } from '../../utils/util.js';

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
  logOut() {
    wx.removeStorageSync('userId');
    wx.removeStorageSync('toUser');
    showSuc('退出登陆成功');
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
      getAgent(toUser.userId).then((res) => {
        if(res.mobile) {
          wx.makePhoneCall({
            phoneNumber: res.mobile
          });
        } else {
          showWarn('您的代理还没有手机号');
        }
      })
      // if (toUser.mobile) {
      //   wx.makePhoneCall({
      //     phoneNumber: toUser.mobile
      //   });
      // } else {
        
      // }
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
