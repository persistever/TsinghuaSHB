// pages/message/message.js
var app = getApp()
Page({
  data: {
    messageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        //console.log('[message.js][从服务器接收消息] success Time: ')
        //console.log(res)
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
        '&isComeFromDetailPage=' + 0,
    })
  },

  chatdel: function(e){
    var _userid = e.currentTarget.dataset.theotheruserid
    var _itemid = e.currentTarget.dataset.itemid
    var that = this
    wx.showModal({
      title: '删除',
      content: '是否删除该聊天',
      showCancel: true,
      cancelColor: 'skyblue',
      confirmColor: 'skyblue',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } 
        else {
          var index = 0
          var temp = that.data.messageList
          console.log(that.data.messageList)
          var len = temp.length
          for(var i=0;i<len;i++){
            if ((temp[i].itemid == _itemid) && (temp[i].messageTheOtherUserID ==_userid)){
              index = i
              break
            }
          }
          that.setData({
            messageList:temp.splice(index,1)
          })
          console.log(index)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})

