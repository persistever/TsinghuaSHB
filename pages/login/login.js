// pages/login/login.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    domainIndex:0,
    domainArray: ['@mails.tsinghua.edu.cn', '@mail.tsinghua.edu.cn'],
    requireCodeStatus: 0,
    requireCodeButtonDisplay: ["点击获取注册码","重新获取注册码"],
    requireCodeButtonDisable: false,
    requireCodeButtonFlay: true,
    emailAddress: null,
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    code: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('hello')
    console.log(app.globalData.userInfo)
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
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
  bindGetEmailAddress: function(e){
    this.setData({
      emailAddress: e.detail.value
    })
  },
  bindPickerChange: function(e){
    this.setData({
      domainIndex: e.detail.value
    })
  },
  bindRequireCodeButton: function(){
    var that=this
    this.setData({
      requireCodeStatus: 1,
      requireCodeButtonDisable: true,
      emailAddress: that.data.emailAddress+that.data.domainArray[that.data.domainIndex]
    })
    console.log(this.data.emailAddress)
    wx.request({
      url: that.data.serverURL+'emailCode.php',
      data: {
        emailAddresss: that.data.emailAddress
      },
      success: function (res) {
        console.log("success")
        console.log(res.data)
        console.log(res.statusCode)
        that.setData({
          code: res.data['code']
        })
      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
        console.log("complete")
      }
    })
  },
  bindVerifyCodeButton: function(){
    wx.reLaunch({
      url: '../index/index'
    })
  }
})