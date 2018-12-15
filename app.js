//app.js
App({
  globalData: {
    userInfo: null,
    userOpenID: null,
    userNickName: null,
    userEmail: null,
    userID: null,
    //后端协同开发前端时使用，前端开发勿做任何修改-------
    useServer: 1,
    serverURL: 'https://tsinghuashb.idlab-tsinghua.com/TsinghuaSHB/'
    //useServer: 0,
    //serverURL: 'localhost/TsinghuaSHB/'
    //-----------------------------------------------
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  }
})