// pages/grade/grade.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    itemID: null,
    grade: null,
    theOtherUserNickName: null,
    theOtherUserID: null,
    sellOrBuy: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tempSellOrBuy = 0
    var that = this
    if (options.fromPage=="userBought"){
      tempSellOrBuy = 1
    } else {
      tempSellOrBuy = 0
    }
    this.setData({
      itemID: options.itemID,
      sellOrBuy: tempSellOrBuy,
    })
    wx.request({
      url: that.data.serverURL + "grade/GetTradeInfo.php",
      data: {
        useServer: that.data.useServer,
        itemID: that.data.itemID,
        userID: app.globalData.userID,
        sellOrBuy: that.data.sellOrBuy
      },
      success: function (res) {
        console.log('[grade.js][获取对方信息，在评分页显示] success')
        console.log(res.data)
        that.setData({
          theOtherUserNickName: res.data['theOtherUserNickName'],
          theOtherUserID: res.data['theOtherUserID']
        })
      },
      fail: function () {
        console.log('[grade.js][获取对方信息，在评分页显示]  fail');
      },
      complete: function () {
        // console.log("complete")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindSliderGradeChange: function(e){
    var that = this
    console.log('[grade.js][评分滑动条的值] ' + e.detail.value)
    that.setData({
      grade: e.detail.value
    })
  },

  bindButtonGrade: function(){
    var that = this
    wx.request({
      url: that.data.serverURL + "grade/GradeUser.php",
      data: {
        useServer: that.data.useServer,
        userID: that.data.theOtherUserID,
        itemID: that.data.itemID,
        grade: that.data.grade,
        sellOrBuy: that.data.sellOrBuy
      },
      success: function (res) {
        console.log('[grade.js][给用户打分] success')
        console.log(res.data)
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function () {
        console.log('[grade.js][给用户打分]  fail');
      },
      complete: function () {
        // console.log("complete")
      }
    })
  }
})