import { getOrder, payOrder } from '../../api/api.js';
import { formatDate } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    order: {}
  },
  onLoad: function (options) {
    this.getOrder(options.code);
  },
  getOrder(code) {
    wx.showLoading({
      title: '加载中...',
    });
    getOrder(code).then((order) => {
      wx.hideLoading();
      order = {
        ...order,
        applyDatetime: formatDate(order.applyDatetime, 'yyyy-MM-dd hh:mm:ss')
      };
      this.setData({ order });
    }).catch((err) => {
      wx.hideLoading();
    });
  },
  payOrder() {
    wx.showLoading({
      title: '支付中...',
    });
    payOrder(this.data.order.code).then((data) => {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.wechatPackage,
        signType: data.signType,
        paySign: data.paySign,
        success: (res) => {
          wx.hideLoading();
          app.globalData.reloadOrders = true;
          wx.showToast({
            title: '支付成功',
            duration: 1000
          });
          setTimeout(() => {
            wx.switchTab({
              url: '../order/order',
            });
          }, 1000);
        },
        fail: (res) => {
          wx.hideLoading();
          if (res.errMsg != 'requestPayment:fail cancel') {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            });
          }
        }
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?code=' + e.currentTarget.dataset.code
    });
  }
})