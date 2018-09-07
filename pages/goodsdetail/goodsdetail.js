const app = getApp()
import { formatImg, showLoading, showSuc } from "../../utils/util.js";
import { getProduct, getSysConfig, addCart, queryProductByLevel } from '../../api/api';

Page({
  data: {
    telephone: '',
    advPic: [],
    detail: {},
    specsList: [],
    current: {},
    price: '-',
    amount: '-',
    count: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 300,
    showMask: false,
    info: '<p><img src="http://otoieuivb.bkt.clouddn.com/IMG_2130_1524907296779.JPG" style="max-width:100%"></p><p>关于我们</p><p><br></p>'
  },
  onLoad:function(options){
    if(options.order) {
      this.queryProductByLevel(options.code);
    } else {
      this.getDetail(options.code);
    }
  },
  // 获取商品详情
  getDetail(code) {
    showLoading();
    Promise.all([
      getProduct(code),
      getSysConfig('telephone')
    ]).then(([data, telephone]) => {
      wx.hideLoading();
      let advPic = data.product.advPic.split('||').map(p => formatImg(p));
      let specsList = data.specsList;
        // .filter(v => v.isNormalOrder === '1')
        // .filter(s => {
        //   let flag = false;
        //   s.priceList.forEach(p => {
        //     flag = p.level == '6';
        //   });
        //   return flag;
        // });
      let current = {}, price = '-';
      if (specsList.length) {
        current = specsList[0];
        // current.priceList.forEach(p => {
        //   if (p.level == '6') {
        //     price = p.price;
        //   }
        // });
        price = current.price;
      }
      this.setData({
        advPic,
        current,
        specsList,
        price,
        amount: price,
        detail: data,
        indicatorDots: advPic.length > 1,
        telephone: telephone.cvalue
      });
    }).catch(() => {});
  },
  // 获取商品详情-订单进入
  queryProductByLevel(code) {
    showLoading();
    Promise.all([
      queryProductByLevel(code),
      getSysConfig('telephone')
    ]).then(([data, telephone]) => {
      wx.hideLoading();
      let advPic = data.advPic.split('||').map(p => formatImg(p));
      let specsList = data.specsList;
      data.product = {
        price: data.price,
        pic: data.pic,
        name: data.name
      }
      let current = {}, price = '-';
      if (specsList.length) {
        specsList.forEach(s => {
          s.price = s.price.price;
          s.specsName = s.name;
          s.specsCode = s.code;
        });
        // console.log(data);
        current = specsList[0];
        // current.priceList.forEach(p => {
        //   if (p.level == '6') {
        //     price = p.price;
        //   }
        // });
        price = current.price;
      }
      this.setData({
        advPic,
        current,
        specsList,
        price,
        amount: price,
        detail: data,
        indicatorDots: advPic.length > 1,
        telephone: telephone.cvalue
      });
    }).catch(() => { });
  },
  // 拨打客服
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephone
    });
  },
  // 显示遮罩层
  showMask() {
    this.setData({ showMask: true });
  },
  // 隐藏遮罩层
  hideMask() {
    this.setData({ showMask: false });
  },
  // 选择规格
  chooseItem(e) {
    var current = this.data.specsList[e.target.dataset.idx];
    var price;
    // current.priceList.forEach(p => {
    //   if (p.level == '6') {
    //     price = p.price;
    //   }
    // });
    price = current.price;
    var amount = price * this.data.count;
    this.setData({ current, price, amount });
  },
  // 购买数量修改
  inputChange(e) {
    let count = e.detail.value;
    count = Math.max(count, 1);
    this.setNewPrice(count);
  },
  // 购买数量增加
  add() {
    let count = ++this.data.count;
    this.setNewPrice(count);
  },
  // 购买数量减少
  decrease() {
    let count = --this.data.count;
    count = Math.max(count, 1);
    this.setNewPrice(count);
  },
  // 设置最新的总价
  setNewPrice(count) {
    var amount = this.data.price * count;
    this.setData({ count, amount });
  },
  // 添加购物车
  addCart() {
    showLoading();
    addCart(this.data.current.specsCode, this.data.count)
      .then(() => {
        wx.hideLoading();
        showSuc('购物车添加成功');
      })
      .catch(() => {});
  },
  // 进入购物车
  goCart() {
    wx.navigateTo({
      url: '../cart/cart'
    });
  },
  // 购买商品
  buy() {
    let price;
    // this.data.current.priceList.forEach(p => {
    //   if (p.level == '6') {
    //     price = p.price;
    //   }
    // });
    price = this.data.current.price;
    app.globalData.products = [{
      detail: this.data.detail,
      currentSpec: {
        ...this.data.current,
        price
      },
      count: this.data.count
    }];
    wx.navigateTo({
      url: '../apply-order/apply-order?type=0',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.detail.name,
      path: '/page/goodsdetail/goodsdetail?code=' + this.data.detail.code
    }
  }
});