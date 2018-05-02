import { wxLogin, getUserInfo } from 'api/api.js';
import { formatImg } from 'utils/util.js';

App({
  onLaunch: function () {
    if (!wx.getStorageSync('userId')) {

      // 现在接口微信登录失败，模拟登录
      wx.setStorageSync('userId', 'U201804152047269961875');
      wx.setStorageSync('token', 'TUSYS201800000000002TK201804290830290514518');

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wxLogin(res.code, (data) => {
            wx.setStorageSync('userId', data.userId);
            wx.setStorageSync('token', data.token);
          }, () => {
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            });
          })
        },
        error: () => {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    }
  },
  getUserInfo() {
    getUserInfo((res) => {
      that.globalData.userInfo = {
        avatar: formatImg(res.photo),
        userId: res.userId,
        mobile: res.mobile
      };
    });
  },
  globalData: {
    userInfo: null,
    products: [],
    choseAddr: null
  }
})