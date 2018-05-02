import { getPageOrder } from '../../api/api.js';

Page({
  data: {
    list: [],
    start: 1,
    limit: 100,
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
  goView(e) {
    this.setData({
      topIdx: e.currentTarget.dataset.index
    });
  },
  getOrders() {
    if (this.data.hasMore) {
      getPageOrder({
        start: this.data.start,
        limit: this.data.limit,
        status: this.data.topStatus[this.data.topIdx]
      }, (data) => {
        this.setData({
          start: ++this.data.start,
          hasMore: data.pageNO < data.totalPage,
          list: this.data.list.concat(data.list)
        });
      });
    }
  },
  goDetail(e){
    this.setData({
      _num: e.target.dataset.code
    });
  }
})