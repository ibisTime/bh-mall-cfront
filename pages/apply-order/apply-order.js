import { getAddressList, applyOrder, payOrder, applyCartOrder } from '../../api/api.js';
import { showSuc, showWarn } from '../../utils/util.js';
import { wxPay } from '../../utils/weixin.js';

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
    toUser: ''
  },
  onLoad: function (options) {
    this.setAddr();
    let toUser = wx.getStorageSync('toUser');
    this.setData({
      toUser: toUser ? toUser.userId : ''
    });
    // 商品详情直接下单
    if (options.type == 0) {
      this.setData({
        buyType: 0,
        productSpecsCode: app.globalData.products[0].currentSpec.specsCode
      });
    } else {
      this.setData({
        buyType: 1,
        cartList: app.globalData.products.map(v => v.currentSpec.code)
      });
    }
    let amount = 0;
    // app.globalData.products.forEach(p => {
    //   amount += p.currentSpec.price * p.count;
    // });
    app.globalData.products.forEach(p => {
      if(p.detail.agentPrice) {
        amount += p.detail.agentPrice * p.count;        
      } else {
        amount += p.detail.price * p.count;        
      }
    });
    this.setData({
      products: app.globalData.products,
      totalAmount: amount
    });
  },
  onShow: function () {
    if (app.globalData.choseAddr) {
      let addr = app.globalData.choseAddr;
      this.setData({
        address: {
          ...addr
        }
      });
    }
  },
  // 设置收件地址
  setAddr() {
    if (!app.globalData.choseAddr) {
      this.getAddress();
    } else {
      let addr = app.globalData.choseAddr;
      this.setData({
        address: {
          ...addr
          // signer: addr.receiver
        }
      });
    }
  },
  // 获取收货地址
  getAddress() {
    wx.showLoading({
      title: '加载中...',
    });
    getAddressList(1).then((data) => {
      if (data.length) {
        this.setData({
          address: {
            ...data[0]
            // signer: data[0].receiver
          }
        });
      }
      wx.hideLoading();
    }).catch(() => {});
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
    if (app.hasToUser()) {
      wx.showLoading({
        title: '下单中...'
      });
      if (this.data.buyType == 0) {
        this.apply();
      } else if (this.data.buyType == 1) {
        this.applyCartOrder();
      }
    }
  },
  // 商品详情直接下单
  apply() {
    if(!this.data.address) {
      showWarn('您暂未选择地址');
      return;
    }
    if (!this.data.address.signer) {
      this.data.address.signer = this.data.address.receiver;
    }
    applyOrder({
      ...this.data.address,
      quantity: this.data.products[0].count,
      // productSpecsCode: this.data.productSpecsCode,
      productSpecsCode: this.data.products[0].detail.code,
      applyNote: this.data.applyNote,
      toUser: this.data.toUser
    }).then((data) => {
      app.globalData.reloadOrders = true;
      this.payOrder(data);
    }).catch(() => {});
  },
  applyCartOrder() {
    if (!this.data.address.signer) {
      this.data.address.signer = this.data.address.receiver;
    }
    applyCartOrder({
      ...this.data.address,
      cartList: this.data.cartList,
      applyNote: this.data.applyNote,
      toUser: this.data.toUser,
      signer: this.data.address.receiver
    }).then((data) => {
      app.globalData.reloadOrders = true;
      this.payOrder(data);
    }).catch(() => {});
  },
  payOrder(codeList) {
    payOrder(codeList).then((data) => {
      wx.hideLoading();
      wxPay(data).then(() => {
        showSuc('支付成功');
        wx.switchTab({
          url: '../order/order'
        });
      }).catch(() => {
        wx.switchTab({
          url: '../order/order'
        });
      });
    }).catch(() => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '支付失败',
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '../order/order'
          });
        }
      });
    });
  }
})