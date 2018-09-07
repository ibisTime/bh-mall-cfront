import { getPageCart, deleteCartProduct, editCartQuantity } from '../../api/api.js';
import { showLoading, showSuc, showWarn } from '../../utils/util.js';

const app = getApp();

Page({
  data: {
    totalAmount: 0,
    checkAll: false,
    list: [],
    start: 1,
    limit: 20,
    hasMore: true,
    scrollHeight: 100
  },
  onLoad: function (options) {
    this.getHeight();
    this.getPageCart();
  },
  // 获取购物车列表
  getPageCart(refresh) {
    let start = refresh && 1 || this.data.start;
    getPageCart(start, this.data.limit).then((data) => {
      this.setData({
        list: refresh ? data.list : this.data.list.concat(data.list),
        hasMore: data.pageNO < data.totalPage,
        start: ++start
      });
    });
  },
  // 设置scroll-view高度
  getHeight() {
    wx.getSystemInfo({
      success: (res) => {
        wx.createSelectorQuery().selectAll('.cart-footer')
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
  // 进入首页
  goHome() {
    wx.switchTab({
      url: '../index/index'
    });
  },
  // 数量修改
  inputChange(e) {
    let quantity = e.detail.value;
    quantity = Math.max(quantity, 1);
    let code = e.currentTarget.dataset.code;
    let index = this.data.list.findIndex(d => d.code === code);
    let item = this.data.list[index];
    this.editQuantity(code, quantity, item, index);
  },
  // 数量增加
  add(e) {
    let code = e.currentTarget.dataset.code;
    let index = this.data.list.findIndex(d => d.code === code);
    let item = this.data.list[index];
    let quantity = item.quantity + 1;
    this.editQuantity(code, quantity, item, index);
  },
  // 数量减少
  decrease(e) {
    let code = e.currentTarget.dataset.code;
    let index = this.data.list.findIndex(d => d.code === code);
    let item = this.data.list[index];
    let quantity = item.quantity - 1;
    if (quantity >= 1) {
      this.editQuantity(code, quantity, item, index);
    }
  },
  // 设置最新的总价
  editQuantity(code, quantity, item, index) {
    showLoading();
    editCartQuantity(code, quantity).then(() => {
      wx.hideLoading();
      let list = this.data.list;
      item.quantity = quantity;
      list.splice(index, 1, item);
      if (item.checked) {
        let amount = 0;
        list.forEach(d => {
          amount += d.price * d.quantity;
        });
        this.setData({ totalAmount: amount });
      }
      this.setData({ list });
    }).catch(() => {});
  },
  // 选择商品
  choseItem(e) {
    let code = e.currentTarget.dataset.code;
    let index = this.data.list.findIndex(d => d.code === code);
    let item = this.data.list[index];
    item.checked = !item.checked;
    let list = this.data.list;
    list.splice(index, 1, item);
    this.setData({ list });
    this.checkAll();
  },
  // 判断是否需要勾选全选按钮
  checkAll() {
    let flag = true;
    let amount = 0;
    this.data.list.forEach(d => {
      if (!d.checked) {
        flag = false;
      }
      amount += d.price * d.quantity;
    });
    this.setData({
      checkAll: flag,
      totalAmount: amount
    });
  },
  // 全选
  choseAll() {
    let flag = true;
    if (this.data.checkAll) {
      flag = false;
    }
    let list = this.data.list;
    let amount = 0;
    list.forEach(v => {
      v.checked = flag;
      amount += v.price * v.quantity;
    });
    this.setData({
      list,
      checkAll: flag,
      totalAmount: amount
    });
  },
  // 删除商品
  deleteItem(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除吗?',
      success: (res) => {
        if (res.confirm) {
          let code = e.currentTarget.dataset.code;
          let index = this.data.list.findIndex(d => d.code === code);
          let item = this.data.list[index];
          showLoading();
          deleteCartProduct(code).then(() => {
            wx.hideLoading();
            // let amount = this.data.totalAmount;
            // amount -= item.price * item.quantity;
            let list = this.data.list;
            list.splice(index, 1);
            let amount = 0;
            list.forEach(d => {
              if(d.checked) {
                amount += d.price * d.quantity;
              }
            });
            this.setData({
              list,
              totalAmount: amount
            });
          }).catch(() => {});
        }
      }
    });
  },
  // 购买商品
  buy() {
    let price;
    let list = [];
    this.data.list.forEach(p => {
      if (p.checked) {
        list.push({
          detail: p.product,
          currentSpec: p,
          count: p.quantity
        });
      }
    });
    if (list.length) {
      app.globalData.products = list;
      wx.navigateTo({
        url: '../apply-order/apply-order?type=1',
      });
    } else {
      showWarn('您未选择要购买的商品');
    }
  }
})