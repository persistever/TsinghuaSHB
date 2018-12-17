//profile.js
//获取应用实例
var app = getApp()

Page({
  data: {
    userInfo: {},
  },

  onLoad: function () {
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
