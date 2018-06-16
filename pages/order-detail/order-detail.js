import { getOrder, payOrder, cancelOrder, receiveOrder } from '../../api/api.js';
import { formatDate, showLoading, showSuc } from '../../utils/util.js';
import { wxPay } from '../../utils/weixin.js';

const app = getApp();

Page({
  data: {
    order: {}
  },
  onLoad: function (options) {
    this.getOrder(options.code);
  },
  getOrder(code) {
    showLoading();
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
  // 支付订单
  payOrder() {
    showLoading('支付中...');
    payOrder([this.data.order.code]).then((data) => {
      wx.hideLoading();
      wxPay(data).then(() => {
        showSuc('支付成功');
        app.globalData.reloadOrders = true;
        setTimeout(() => {
          wx.switchTab({
            url: '../order/order',
          });
        }, 1000);
      }).catch(() => {});
    }).catch(() => {
      wx.hideLoading();
    });
  },
  // 点击取消订单
  cancel() {
    wx.showModal({
      title: '提示',
      content: '确定提交取消订单申请吗?',
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder();
        }
      }
    });
  },
  // 取消订单
  cancelOrder() {
    showLoading('取消中...');
    cancelOrder(this.data.order.code).then(() => {
      wx.hideLoading();
      showSuc('取消订单申请提交成功');
      app.globalData.reloadOrders = true;
      this.setData({
        order: {
          ...this.data.order,
          status: '5'
        }
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  // 点击确认收货
  receive(e) {
    wx.showModal({
      title: '提示',
      content: '确定收货吗?',
      success: (res) => {
        if (res.confirm) {
          this.receiveOrder();
        }
      }
    });
  },
  // 确认收货
  receiveOrder(code) {
    showLoading('收货中...');
    receiveOrder(this.data.order.code).then(() => {
      wx.hideLoading();
      showSuc('收货成功');
      app.globalData.reloadOrders = true;
      this.setData({
        order: {
          ...this.data.order,
          status: '4'
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