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
    var del = false
    var that = this
    wx.showModal({
      title: '是否删除该聊天',
      content: '',
      showCancel: true,
      cancelText: '否',
      cancelColor: 'blue',
      confirmText: '是',
      confirmColor: 'blue',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } 
        else {
          var oldlist = that.data.messageList         
          var len = oldlist.length
          var newlist = []
          del = true
          for(let i=0;i<len;i++){
            var temp = oldlist.shift()
            if ((temp['itemID'] == _itemid) && (temp['messageTheOtherUserID'] ==_userid)){
              continue
            }
            else{
              newlist.push(temp)
            }
          }
          wx.request({
            url: app.globalData.serverURL + 'deleteMessage.php',
            data: {
              userServer: that.data.userServer,
              delete_itemid: _itemid,
              delete_userid: _userid,
              thisUserID: app.globalData.userID,
            },
            success: function (res) {
              console.log(res)
            },
            fail: function () {
            },
            complete: function () {
            }
        }),
        that.setData({
            messageList: newlist
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})

