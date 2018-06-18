import { getPageProduct, getBanners } from '../../api/api.js';
import { getToUser } from '../../utils/util.js';
// 获取应用实例
const app = getApp()

Page({
  data: {
    banners: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 300,
    list:[],
    start: 1,
    limit: 20,
    hasMore: true,
    fetching: false
  },
  onLoad: function(options) {
    app.wxLogin();
    if (getToUser()) {
      this.getProductList();
    } else {
      wx.showModal({
        title: '提示',
        content: '您需要通过代理的二维码进入，否则将无法下单',
        showCancel: false
      });
    }
    this.getBanners();
  },
  // 查询产品列表
  getProductList() {
    if (this.data.hasMore && !this.data.fetching) {
      getPageProduct(this.data.start, this.data.limit)
        .then((res) => {
          this.setData({
            list: res.list,
            start: ++this.data.start,
            hasMore: res.pageNO < res.totalPage
          });
        }).catch((err) => {
          this.setData({
            hasMore: false
          });
        });
    }
  },
  getBanners() {
    getBanners().then((banners) => {
      this.setData({ banners });
    }).catch(() => {});
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?code=' + e.currentTarget.dataset.code
    });
  },
  goCart() {
    wx.navigateTo({
      url: '../cart/cart'
    })
  },
  onReachBottom() {
    this.getProductList();
  }
})
