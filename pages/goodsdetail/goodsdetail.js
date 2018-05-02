const app = getApp()
import { formatImg } from "../../utils/util.js";
import { getProduct } from '../../api/api';

Page({
    data: {
      advPic: [],
      detail: {},
      specsList: [],
      current: {},
      price: '-',
      count: 1,
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 300,
      showMask: false,
      info: '<p><img src="http://otoieuivb.bkt.clouddn.com/IMG_2130_1524907296779.JPG" style="max-width:100%"></p><p>关于我们</p><p><br></p>'

    },
    onLoad:function(options){
      this.getDetail(options.code);
    },
    getDetail(code) {
      wx.showLoading({
        title: '加载中...'
      });
      getProduct(code, (data) => {
        wx.hideLoading();
        let advPic = data.advPic.split('||').map(p => formatImg(p));
        this.setData({
          advPic,
          detail: data,
          indicatorDots: advPic.length > 1,
          current: data.specsList[0],
          specsList: data.specsList.filter(v => v.isNormalOrder === '1'),
          price: data.price
        });
      }, () => {
        wx.hideLoading();
      });
    },
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: '1340000'
      });
    },
    showMask() {
      this.setData({ showMask: true });
    },
    hideMask() {
      this.setData({ showMask: false });
    },
    chooseItem(e) {
      var current = this.data.specsList[e.target.dataset.idx];
      var price = this.data.detail.price * this.data.count;
      this.setData({ current, price });
    },
    inputChange(e) {
      console.log(e);
      let count = e.detail.value;
      count = Math.max(count, 1);
      this.setNewPrice(count);
    },
    add() {
      let count = ++this.data.count;
      this.setNewPrice(count);
    },
    decrease() {
      let count = --this.data.count;
      count = Math.max(count, 1);
      this.setNewPrice(count);
    },
    setNewPrice(count) {
      var price = this.data.detail.price * count;
      this.setData({ count, price });
    },
    buy() {
      app.globalData.products = [{
        detail: this.data.detail,
        currentSpec: this.data.current,
        count: this.data.count
      }];
      wx.navigateTo({
        url: '../apply-order/apply-order?type=0',
      });
    }
});