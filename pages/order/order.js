import { getPageOrder, payOrder, cancelOrder, receiveOrder } from '../../api/api.js';
import { formatDate, showLoading, showSuc } from '../../utils/util.js';
import { wxPay } from '../../utils/weixin';

const app = getApp();

Page({
  data: {
    list: [],
    start: 1,
    limit: 100,
    first: true,
    hasMore: true,
    scrollHeight: 100,
    allList: {},
    topStatus:['', 0, '1,2', 3, 4, 5, 6],
    topIdx: 0,
    viewId: ['all', 'dzf', 'dfh', 'dsh', 'ysf', 'sqqx', 'yqx']
  },
  onLoad: function (options) {
    this.getHeight();
    this.judgeCate(this.data.topIdx);
  },
  onShow: function () {
    if (this.data.first) {
      this.setData({ first: false });
    } else if (app.globalData.reloadOrders) {
      app.globalData.reloadOrders = false;
      showLoading();
      this.setData({
        allList: {
          [this.data.topIdx]: this.data.allList[this.data.topIdx]
        }
      });
      this.getOrders({ refresh: true });
    }
  },
  onHide: function() {
    wx.hideLoading();
  },
  // 设置scroll-view高度
  getHeight(){
    wx.getSystemInfo({
      success: (res) => {
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
    this.judgeCate(e.currentTarget.dataset.index);
  },
  judgeCate(topIdx) {
    if (!this.data.allList[topIdx]) {
      let arr = [];
      arr.hasMore = true;
      arr.start = 1;
      this.setData({
        topIdx,
        allList: {
          ...this.data.allList,
          [topIdx]: arr
        },
        hasMore: true,
        list: []
      });
      this.getOrders({
        topIdx,
        start: 1
      });
    } else {
      this.setData({
        topIdx,
        list: this.data.allList[topIdx],
        hasMore: this.data.allList[topIdx].hasMore,
        start: this.data.allList[topIdx].start
      });
    }
  },
  // 分页查询订单
  getOrders({ start = 1, topIdx = this.data.topIdx, refresh }) {
    this.getOrders.fetchs = this.getOrders.fetchs || {};
    if (!this.getOrders.fetchs[topIdx] && (this.data.hasMore || refresh)) {
      this.getOrders.fetchs[topIdx] = true;
      var limit = refresh ? this.data.list.length : this.data.limit;
      limit = Math.max(10, limit);
      var start = refresh ? 1 : start;
      getPageOrder({
        start,
        limit,
        status: this.data.topStatus[topIdx]
      }).then((data) => {
        this.getOrders.fetchs[topIdx] = false;
        refresh && wx.hideLoading();
        var list = data.list.map(d => ({
          ...d,
          applyDatetime: formatDate(d.applyDatetime, 'yyyy-MM-dd hh:mm:ss')
        }));
        list = refresh ? list : this.data.list.concat(list);
        let hasMore = data.pageNO < data.totalPage;
        list.start = ++start;
        list.hasMore = hasMore;
        this.setData({
          list,
          hasMore,
          start,
          allList: {
            ...this.data.allList,
            [topIdx]: list
          }
        });
      }).catch(() => {
        this.getOrders.fetchs[topIdx] = false;
        refresh && wx.hideLoading();
      });
    }
  },
  // 点击取消订单
  cancel(e) {
    wx.showModal({
      title: '提示',
      content: '确定提交取消订单申请吗?',
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder(e.target.dataset.code);
        }
      }
    });
  },
  // 点击确认收货
  receive(e) {
    wx.showModal({
      title: '提示',
      content: '确定收货吗?',
      success: (res) => {
        if (res.confirm) {
          this.receiveOrder(e.target.dataset.code);
        }
      }
    });
  },
  // 确认收货
  receiveOrder(code) {
    showLoading('收货中...');
    receiveOrder(code).then(() => {
      wx.hideLoading();
      showSuc('收货成功');
      this.updateList({
        code,
        toStatus: '4'
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  // 取消订单
  cancelOrder(code) {
    showLoading('取消中...');
    cancelOrder(code).then(() => {
      wx.hideLoading();
      showSuc('取消订单申请提交成功');
      this.updateList({
        code,
        toStatus: '5'
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  // 支付订单
  payOrder(e) {
    showLoading('支付中...');
    let code = e.target.dataset.code;
    payOrder([code]).then((data) => {
      wx.hideLoading();
      wxPay(data).then(() => {
        showSuc('支付成功');
        this.updateList({
          code,
          toStatus: 1
        });
      }).catch(() => {});
    }).catch(() => {
      wx.hideLoading();
    });
  },
  // 更新列表状态
  updateList({ code, toStatus }) {
    let allList = this.getNewList(this.data.allList[0], toStatus, code);
    if (toStatus == '1') {
      this.updateByPay(code, allList);
    } else if (toStatus == '5') {
      this.updateByCancel(code, allList);
    } else if (toStatus == '4') {
      this.updateByReceive(code, allList);
    }
  },
  // 支付后更新列表状态
  updateByPay(code, allList) {
    let dzfList = null;
    if (this.data.allList[1]) {
      dzfList = this.data.allList[1].filter(v => v.code != code);
      dzfList.hasMore = this.data.allList[1].hasMore;
      dzfList.start = this.data.allList[1].start;
    }
    this.setData({
      allList: {
        ...this.data.allList,
        '0': allList,
        '1': dzfList,
        '2': null
      },
      list: this.data.topIdx == '0' ? allList : dzfList
    });
  },
  // 取消后更新列表状态
  updateByCancel(code, allList) {
    let dzfList = null;
    if (this.data.allList[1]) {
      dzfList = this.data.allList[1].filter(v => v.code != code);
      dzfList.hasMore = this.data.allList[1].hasMore;
      dzfList.start = this.data.allList[1].start;
    }
    this.setData({
      allList: {
        ...this.data.allList,
        '0': allList,
        '1': dzfList,
        '5': null
      },
      list: this.data.topIdx == '0' ? allList : dzfList
    });
  },
  // 收货后更新列表状态
  updateByReceive(code, allList) {
    let dshList = null;
    if (this.data.allList[3]) {
      dshList = this.data.allList[3].filter(v => v.code != code);
      dshList.hasMore = this.data.allList[3].hasMore;
      dshList.start = this.data.allList[3].start;
    }
    this.setData({
      allList: {
        ...this.data.allList,
        '0': allList,
        '3': dshList,
        '4': null
      },
      list: this.data.topIdx == '0' ? allList : dshList
    });
  },
  getNewList(list, status, code) {
    let result = list.map(v => {
      if (v.code === code) {
        v.status = '1';
      }
      return v;
    });
    result.hasMore = list.hasMore;
    result.start = list.start;
    return result;
  },
  // 进入订单详情
  goDetail(e){
    wx.navigateTo({
      url: '../order-detail/order-detail?code=' + e.currentTarget.dataset.code,
    });
  }
})