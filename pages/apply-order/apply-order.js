import { getAddressList, applyOrder } from '../../api/api.js';

const app = getApp();

Page({
  data: {
    totalAmount: 0,
    buyType: 0,
    products: [],
    applyNote: '',
    address: null,
    cartList: [],
    productSpecsCode: '',
    toUser: 'U201804152047269961875'
  },
  onLoad: function (options) {
    this.setAddr();
    // 商品详情直接下单
    if (options.type == 0) {
      this.setData({
        buyType: 0,
        productSpecsCode: app.globalData.products[0].currentSpec.code
      });
    }
    let amount = 0;
    app.globalData.products.forEach(p => {
      amount += p.detail.price * p.count;
    });
    this.setData({
      products: app.globalData.products,
      totalAmount: amount
    });
  },
  // 设置收件地址
  setAddr() {
    if (!app.globalData.choseAddr) {
      this.getAddress();
    } else {
      let addr = app.globalData.choseAddr;
      this.setData({
        address: {
          ...addr,
          singer: addr.receiver
        }
      });
    }
  },
  // 获取收货地址
  getAddress() {
    wx.showLoading({
      title: '加载中...',
    });
    getAddressList(1, (data) => {
      if (data.length) {
        this.setData({
          address: {
            ...data[0],
            singer: data[0].receiver
          }
        });
      }
      wx.hideLoading();
    }, () => {
      wx.hideLoading();
    });
  },
  // 进入地址列表页
  goAddr() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  bindKeyInput(e) {
    this.setData({
      [e.target.dataset.name]: e.detail.value
    });
  },
  // 下单
  applyOrder() {
    wx.showLoading({
      title: '下单中...'
    });
    if (this.data.buyType == 0) {
      this.apply();
    }
  },
  // 商品详情直接下单
  apply() {
    applyOrder({
      ...this.data.address,
      quantity: this.data.products[0].count,
      productSpecsCode: this.data.productSpecsCode,
      applyNote: this.data.applyNote,
      toUser: this.data.toUser
    }, (data) => {
      console.log(data);
      wx.hideLoading();
    }, () => {
      wx.hideLoading();
    });
  }
})