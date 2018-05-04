const app = getApp()
import { formatImg, showLoading } from "../../utils/util.js";
import { getProduct, getSysConfig } from '../../api/api';

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
      this.getDetail(options.code);
    },
    getDetail(code) {
      showLoading();
      Promise.all([
        getProduct(code),
        getSysConfig('telephone')
      ]).then(([data, telephone]) => {
        wx.hideLoading();
        let advPic = data.advPic.split('||').map(p => formatImg(p));
        let specsList = data.specsList
          .filter(v => v.isNormalOrder === '1')
          .filter(s => {
            let flag = false;
            s.priceList.forEach(p => {
              flag = p.level == '6';
            });
            return flag;
          });
        let current = {}, price = '-';
        if (specsList.length) {
          current = specsList[0];
          current.priceList.forEach(p => {
            if (p.level == '6') {
              price = p.price;
            }
          });
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
      }).catch(() => {
        wx.hideLoading();
      });
    },
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: this.data.telephone
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
      var price;
      current.priceList.forEach(p => {
        if (p.level == '6') {
          price = p.price;
        }
      });
      var amount = price * this.data.count;
      this.setData({ current, price, amount });
    },
    inputChange(e) {
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
      var amount = this.data.price * count;
      this.setData({ count, amount });
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