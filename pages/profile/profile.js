//profile.js
//获取应用实例
var app = getApp()

Page({
  data: {
    serverURL: app.globalData.serverURL,
    useServer: app.globalData.useServer,
    userInfo: {},
    userGrade: null,
    
  },

  onLoad: function () {
    
  },

  onShow: function(){
    var that = this
    wx.request({
      url: that.data.serverURL + "profile/GetUserInfo.php",
      data: {
        useServer: that.data.useServer,
        userID: app.globalData.userID
      },
      success: function (res) {
        that.setData({
          userGrade: res.data['userGrade']
        })
      },
      fail: function () {
        console.log('[profile.js][获取用户信息]  fail');
      },
      complete: function () {
        // console.log("complete")
      }
    })
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
