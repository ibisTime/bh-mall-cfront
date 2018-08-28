import { getSysConfig } from '../../api/api.js';
import { showLoading } from '../../utils/util.js';

Page({
  data: {
    info: ''
  },
  onLoad: function (options) {
    showLoading();
    getSysConfig('about_us').then((data) => {
      wx.hideLoading();
      this.setData({
        info: data.cvalue
      });
    }).catch(() => {});
  }
})