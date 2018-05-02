import { getUserInfo } from '../../api/api.js';

const app = getApp();

Page({
  data: {
    userInfo: {},
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    });
    getUserInfo().then((userInfo) => {
      this.setData({ userInfo });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
    });
  },
})
