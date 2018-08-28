import { getAddressList, deleteAddress, setDefaultAddr } from '../../api/api.js';
import { showLoading } from '../../utils/util.js';

// 获取应用实例
const app = getApp();

Page({
  data: {
    first: true,
    addrList: [],
    scrollHeight: 100,
    choseAddr: {}
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.getAddressList();
  },
  onShow: function () {
    if (this.data.first) {
      this.setData({ first: false });
    } else {
      this.getAddressList();
    }
  },
  // 获取地址列表
  getAddressList() {
    showLoading();
    getAddressList().then((addrList) => {
      let choseAddr = app.globalData.choseAddr;
      if (!choseAddr) {
        let arr = addrList.filter(v => v.isDefault == 1);
        choseAddr = arr.length ? arr[0] : addrList.length ? addrList[0] : {};
        app.globalData.choseAddr = choseAddr;
      }
      this.setData({ addrList, choseAddr });
      wx.hideLoading();
    }).catch(() => {
    });
  },
  // 选择地址
  choseItem(e) {
    let idx = e.currentTarget.dataset.idx;
    let choseAddr = this.data.addrList[idx];
    app.globalData.choseAddr = choseAddr;
    this.setData({ choseAddr });
  },
  // 点击修改按钮
  editItem(e) {
    wx.navigateTo({
      url: '../addedit-address/addedit-address?code=' + e.currentTarget.dataset.code
    });
  },
  // 点击删除按钮
  deleteItem(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该地址',
      success: (res) => {
        if (res.confirm) {
          this.deleteAddress(e.currentTarget.dataset.code);
        }
      }
    })
  },
  // 删除地址
  deleteAddress(code) {
    wx.showLoading({
      title: '删除中...',
    });
    deleteAddress(code).then(() => {
      wx.hideLoading();
      if (this.data.choseAddr.code == code) {
        app.globalData.choseAddr = null;
      }
      this.getAddressList();
    }).catch(() => {});
  },
  setDefault(e) {
    showLoading('删除中...');
    setDefaultAddr(e.target.dataset.code).then(() => {
      wx.hideLoading();
      this.getAddressList();
    }).catch(() => {});
  }
})