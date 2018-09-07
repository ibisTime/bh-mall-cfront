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
    fetching: false,
    isLogin: true
  },
  onLoad(options) {
    if (!wx.getStorageSync('userId')) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: (res) => {
                app.wxLogin(res, () => this.setData({ isLogin: true }));
              }
            });
          } else {
            this.setData({ isLogin: false });
          }
        },
        fail: () => {
          this.setData({ isLogin: false });
        }
      });
    }
    // console.log('index' + getToUser());
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
    // console.log('getProductList');
    if (this.data.hasMore && !this.data.fetching) {
      getPageProduct(this.data.start, this.data.limit)
        .then((res) => {
          console.log('suc', res);
          // debugger;
          // this.list = res.list.map(item => {
          //   let code = item.code;
          //   item.specsList.filter(l => {
          //     console.log(l.code, item.code);
          //     return l.code = code;
          //   })
          // });
          // console.log(this.list);
          // res.list.filter(l => {
          //   return i.
          // })
          this.setData({
            list: res.list,
            start: ++this.data.start,
            hasMore: res.pageNO < res.totalPage
          });
        }).catch((err) => {
          console.log('no', res);
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
  },
  onConfirm() {
    this.setData({
      isLogin: true
    })
  },
  bindGetUserInfo: function (e) {
    app.wxLogin(e.detail, () => this.setData({ isLogin: true }));
  }
})
