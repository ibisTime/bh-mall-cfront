import { getPageOrder, payOrder } from '../../api/api.js';
import { formatDate } from '../../utils/util.js';
import { orderStatusDict } from '../../utils/dict.js';

const app = getApp();

Page({
  data: {
    list: [],
    start: 1,
    limit: 100,
    first: true,
    hasMore: true,
    topStatus:['', 0, 1, 2, 3, 4, 5, 6],
    topIdx: 0,
    scrollHeight: 100,
    viewId: ['all', 'dzf', 'dsh', 'dfh', 'dsh', 'ysf', 'sqqx', 'yqx']
  },
  onLoad: function (options) {
    this.getHeight();
    this.getOrders();
  },
  onShow: function () {
    if (this.data.first) {
      this.setData({ first: false });
    } else if (app.globalData.reloadOrders) {
      app.globalData.reloadOrders = false;
      this.setData({ start: 1 });
      wx.showLoading({
        title: '加载中...',
      });
      this.getOrders(true);
    }
  },
  onHide: function() {
    wx.hideLoading();
  },
  // 设置scroll-view高度
  getHeight(){
    wx.getSystemInfo({
      success: (res) => {
        let height = res.windowHeight;
        wx.createSelectorQuery().selectAll('.top-scroll')
          .boundingClientRect((rects) => {
            rects.forEach((rect) => {
              this.setData({
                scrollHeight: res.windowHeight - rect.height
              });
            })
          }).exec();
      }
    })
  },
  // 选中分类
  choseCate(e) {
    this.setData({
      topIdx: e.currentTarget.dataset.index
    });
  },
  // 分页查询订单
  getOrders(refresh) {
    if (this.data.hasMore) {
      getPageOrder({
        start: refresh ? 1 : this.data.start,
        limit: this.data.limit,
        status: this.data.topStatus[this.data.topIdx]
      }).then((data) => {
        refresh && wx.hideLoading();
        var list = data.list.map(d => ({
          ...d,
          statusInfo: orderStatusDict[d.status],
          applyDatetime: formatDate(d.applyDatetime, 'yyyy-MM-dd hh:mm:ss')
        }));
        this.setData({
          start: refresh ? 2 : ++this.data.start,
          hasMore: data.pageNO < data.totalPage,
          list: this.data.list.concat(list)
        });
      }).catch(() => {
        refresh && wx.hideLoading();
      });
    }
  },
  // 支付订单
  payOrder(e) {
    wx.showLoading({
      title: '支付中...',
    });
    let code = e.target.dataset.code;
    payOrder(code).then((data) => {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.wechatPackage,
        signType: data.signType,
        paySign: data.paySign,
        success: (res) => {
          wx.hideLoading();
          wx.showToast({
            title: '支付成功',
            duration: 1000
          });
          let list = this.data.list.map(v => {
            if (v.code === code) {
              v.status = '1';
            }
            return v;
          });
          this.setData({ list });
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
  goDetail(e){
    wx.navigateTo({
      url: '../order-detail/order-detail?code=' + e.currentTarget.dataset.code,
    });
  }
})