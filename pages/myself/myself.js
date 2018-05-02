//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    wx.login({
        success:function(){
            wx.getUserInfo({
                success:function(res){
                    var simpleUser = res.userInfo;
                    console.log(simpleUser.nickName);
                }
            });
        }
    });
  },
})
