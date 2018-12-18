// pages/message/message.js
var app = getApp()
Page({
  data: {
    /*
    messageList: [{ "message": "5块卖吗", "messageTime": "2018-12-15", "messageID": 25, "userIcon": ['../../images/user_icon1.png'], "userName": "社会人", "messageHaveRead": false }, { "message": "skr~skr~~", "messageTime": "2018-12-14", "messageID": 26, "userIcon": ['../../images/user_icon2.jpg'], "userName": "电鳗", "messageHaveRead": false }, { "message": "党的十八大提出，倡导富强、民主、文明、和谐，倡导自由、平等、公正、法治，倡导爱国、敬业、诚信、友善，积极培育和践行社会主义核心价值观。富强、民主、文明、和谐是国家层面的价值目标，自由、平等、公正、法治是社会层面的价值取向，爱国、敬业、诚信、友善是公民个人层面的价值准则，这24个字是社会主义核心价值观的基本内容", "messageTime": "2018-12-18", "messageID": 27, "userIcon": ['../../images/user_icon3.jpeg'], "userName": "温暖の肥宅", "messageHaveRead": false}
    ]
    */
    messageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.serverURL + 'checkAllMessage.php',
      data: {
        messageUserID: app.globalData.userID,
        serverURL: app.globalData.serverURL
      },
      success: function (res) {
        console.log('[message.js][从服务器接收消息] success Time: ')
        console.log(res)
        that.setData({
          messageList: res.data
        })
      },
      fail: function () {
      },
      complete: function () {
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
    wx.request({
      url: app.globalData.serverURL + 'checkAllMessage.php',
      data: {
        messageUserID: app.globalData.userID,
        serverURL: app.globalData.serverURL
      },
      success: function (res) {
        console.log('[message.js][从服务器接收消息] success Time: ')
        console.log(res)
        that.setData({
          messageList: res.data
        })
      },
      fail: function () {
      },
      complete: function () {
      }
    })
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

  bindIntoChat: function(e){
    var that = this
    console.log(e)
    wx.navigateTo({
      url: '../chat/chat?itemID=' + e.currentTarget.dataset.itemid +
        '&theOtherUserID=' + e.currentTarget.dataset.theotheruserid +
        '&isComeFromDetailPage=' + false,
    })
  },

})

