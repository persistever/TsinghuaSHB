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

  user_bought: function () {
    wx.navigateTo({ url: "../../pages/userBought/userBought" });
  },

  user_sold: function () {
    //订单
    wx.navigateTo({ url: "/pages/userSold/userSold" })
  },
  onShareAppMessage: function () {
  }
})
