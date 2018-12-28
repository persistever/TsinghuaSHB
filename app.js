//app.js
App({
  globalData: {
    userInfo: null,
    userOpenID: null,
    userNickName: null,
    userEmail: null,
    userID: null,
    userIsBlocked: 0,

    messageNameList: null,
    //后端协同开发前端时使用，前端开发勿做任何修改-------
    useServer: 1,
    serverURL: 'https://tsinghuashb.idlab-tsinghua.com/TsinghuaSHB/',
    //useServer: 0,
    //serverURL: 'localhost/TsinghuaSHB/'
    //-----------------------------------------------
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    //var logs = wx.getStorageSync('logs')
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    wx.clearStorageSync()

    var storageInfo = wx.getStorageInfoSync()
    if(storageInfo.keys.indexOf('messageNameList')==-1){
      wx.setStorageSync('messageNameList', [])
    }
    else{
      that.globalData.messageNameList=wx.getStorageSync('messageNameList')
    }
    //console.log('[app.js][查看messageNameList是否写入存储]')
    //console.log(wx.getStorageInfoSync().keys)
  },
})