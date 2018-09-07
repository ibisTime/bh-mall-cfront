import { getAddress, addAddress, editAddress } from '../../api/api.js';
import { showLoading, showSuc, showWarn } from '../../utils/util.js';

// 获取应用实例
const app = getApp();

Page({
  data: {
    code: '',
    receiver: '',
    mobile: '',
    province: '',
    city: '',
    area: '',
    address: '',
    isDefault: 2,
    region: []
  },
  onLoad: function (options) {
    if (options.code) {
      this.setData({
        code: options.code
      });
      this.getAddress(options.code);
    }
  },
  bindKeyInput(e) {
    this.setData({
      [e.target.dataset.name]: e.detail.value
    });
  },
  choseAddr() {
    this.setData({
      isDefault: this.data.isDefault == 1 ? 2 : 1
    });
  },
  getAddress(code) {
    wx.showLoading({
      title: '加载中...',
    });
    getAddress(code).then((data) => {
      wx.hideLoading();
      this.setData({
        ...data,
        region: [data.province, data.city, data.area]
      });
    }).catch(() => {
    });
  },
  saveAddr() {
    if (this.data.code) {
      this.editAddress();
    } else {
      this.addAddress();
    }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2]
    });
  },
  // 新增地址
  addAddress: function() {
    wx.showLoading({
      title: '新增中...',
    });
    let { receiver, mobile, province, city, area, address, isDefault } = this.data;
    if(!receiver || !mobile || !province || !city || !area || !address) {
      showWarn('信息未填写完全');
      return
    }
    addAddress({ receiver, mobile, province, city, area, address, isDefault })
      .then((data) => {
        app.globalData.choseAddr = {
          receiver,
          mobile,
          province,
          city,
          area,
          address,
          isDefault,
          code: data.code
        };
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        });
      }).catch(() => {});
  },
  // 修改地址
  editAddress: function () {
    wx.showLoading({
      title: '修改中...',
    });
    let { code, receiver, mobile, province, city, area, address, isDefault } = this.data;

    editAddress({ code, receiver, mobile, province, city, area, address, isDefault }).then(() => {
      app.globalData.choseAddr = {
        code,
        receiver,
        mobile,
        province,
        city,
        area,
        address,
        isDefault
      };
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }).catch(() => {
    });
  }
})