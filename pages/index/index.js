import { getPageProduct } from '../../api/api.js';
// 获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
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
    this.getProductList();
  },
  getReferenceId() {
    let str = 'U201804152047269961875';
    // 获取地址栏代理userId
    // let str = decodeURIComponent(options.q)
    // let reg = /[^=]*=([^=]*)/;
    // str=str.replace(reg,"$1");
    //获取用户信息的等级信息
    // request.ajax({
    //   code:'627357',
    //   json:{
    //     userId:str,
    //   },
    //   success:function(res){
    //   }
    // })
  },
  // 查询产品列表
  getProductList() {
    if (this.data.hasMore && !this.data.fetching) {
      getPageProduct(
        this.data.start,
        this.data.limit,
        (res) => {
          this.setData({
            list: res.list,
            start: ++this.data.start,
            hasMore: res.pageNO < res.totalPage
          });
        },
        function (err) { }
      );
    }
  },
  onReachBottom() {
    this.getProductList();
  }
})
