//app.js
App({
  globalData: {
    userInfo: null,
    //后端协同开发前端时使用，前端开发勿做任何修改-------
    useServer: 1,
    serverURL: 'https://tsinghuashb.idlab-tsinghua.com/TsinghuaSHB/'
    //useServer: 0,
    //serverURL: 'localhost/TsinghuaSHB/'
    //-----------------------------------------------
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      // wx.login({
      //   success: function () {
      //     wx.getUserInfo({
      //       success: function (res) {
      //         console.log('This is login function')
      //         that.globalData.userInfo = res.userInfo
      //         console.log(res)
      //         typeof cb == "function" && cb(that.globalData.userInfo)
      //       }
      //     })
      //   }
      // })
    }
  },
})