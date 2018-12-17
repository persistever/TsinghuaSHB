//profile.js
//获取应用实例
var app = getApp()
var sta = require("../../utils/util.js");
Page({
  data: {
    userInfo: {},
  },
  onShow: function () {
    sta();
  },
  onLoad: function () {
    var that = this
    //获取用户信息，包括用户ID，用户名，用户头像，给到userInfo里面
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    })
  },

  user_upload: function () {
    wx.navigateTo({ url: "../../pages/user_upload/user_upload" });
  },

  collect: function () {
    //订单
    wx.navigateTo({ url: "/pages/collect/collect" })
  },
  onShareAppMessage: function () {

  }
})
