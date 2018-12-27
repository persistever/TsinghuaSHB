// pages/index/to_news/to_news.js
//reference:
//https://blog.csdn.net/qq_35713752/article/details/78688311
var app = getApp()
var util = require('../../utils/util.js')
var message = ''
var text = ''
var user = {}
var length
var zx_info_id
var openid_talk

Page({
  data: {
    pageheight: 0,
    chatheight: 0,

    news: '',
    message: '',
    text: text,
    centendata: '',
    nickName: '',
    avatarUrl: '',
    news_input_val: '',
    tabdata: '',
    bookstatus: '在售',
    date_time: '',

    userID: null,
    itemID: null,
    itemCoverPath: null,
    itemName: null,
    itemPrice: null,
    isComeFromDetailPage: false,
    itemIsSold:null,
    itemIsPublished:null,
    itemIsDelete:null,
    messageInput: '',
    messageList: [],
    messageName: null,
    theOtherUserID: null,

    timer: null,
    tiemSecond: 1000,

    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
  },

  bindChange: function (e) {
    message = e.detail.value
  },

  onLoad: function (e) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    var that = this
    this.setData({
      date_time: time,
      userID: app.globalData.userID,
      itemID: e.itemID,
      isComeFromDetailPage: parseInt(e.isComeFromDetailPage),
      theOtherUserID: e.theOtherUserID,
      messageName: 'msg_' + e.itemID + '_' + e.theOtherUserID,
    })
    //console.log('[chat.js][查看是否被正确赋值]')
    //console.log(that.data)

    wx.request({
      url: that.data.serverURL + "detail.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        itemID: that.data.itemID,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          itemName: res.data['itemName'],
          itemPrice: '￥' + res.data['itemPrice'],
          itemShortInfo: res.data['itemShortInfo'],
          itemCoverPath: res.data['itemPicturePathList'][0],
          itemUserID: res.data['itemUserID'],
          itemIsSold: res.data['itemIsSold'],
          itemIsPublished: res.data['itemIsPublished'],
          itemIsDelete: res.data['itemIsDelete']
        })
      },
      fail: function () {
        console.log('[chat.js][onLoad请求数据]  fail')
      },
      complete: function () {
        // console.log("complete")
      }
    })
    if (wx.getStorageInfoSync().keys.indexOf(that.data.messageName) == -1) {
      let messageNameTemp = 'msg_' + that.data.itemID + '_' + that.data.theOtherUserID
      //console.log(messageNameTemp)
      this.setData({
        messageName: messageNameTemp
      })
      wx.setStorageSync(messageNameTemp, [])
      var messageNameList = wx.getStorageSync('messageNameList')
      messageNameList.unshift(messageNameTemp)
      wx.setStorageSync('messageNameList', messageNameList)
      messageNameList = wx.getStorageSync('messageNameList')
      //console.log('[chat.js][看messageName是否加入到messsageNameList当中]')
      //console.log(messageNameList)
      that.setData({
        timer: setInterval(that.checkMessage, that.data.tiemSecond)
      })
    }
    else {
      //console.log('查看message的值')
      //console.log(that.data.messageList)
      that.setData({
        messageList: wx.getStorageSync(that.data.messageName),
        timer: setInterval(that.checkMessage, that.data.tiemSecond)
      })
    }
    //console.log('[chat.js][查看messsageList的Name：messageName是否写入存储]')
    //console.log(wx.getStorageInfoSync().keys)
  },

  onHide: function () {
    var that = this
    that.setData({
      isComeFromDetailPage: false
    })
    clearInterval(that.data.timer)
  },

  onUnload: function () {
    var that = this
    clearInterval(that.data.timer)
  },
  ToBook: function () {
    var that = this
    //console.log(that.data.isComeFromDetailPage)
    if (!that.data.isComeFromDetailPage) {
      wx.navigateTo({
        url: '/pages/detail/detail?itemID=' + that.data.itemID
      })
    }
  },

  bindMessageInput(e) {
    this.setData({
      messageInput: e.detail.value
    })
  },

  bindMessageSend() {
    var that = this
    var messageInput = util.trim(that.data.messageInput)
    //console.log('[chat.js][打印输入的字符串]  ' + messageInput)
    if (messageInput.length != 0) {
      wx.request({
        url: that.data.serverURL + 'sendMessage.php',
        data: {
          itemID: that.data.itemID,
          messageReceiveUserID: that.data.theOtherUserID,
          messageSendUserID: app.globalData.userID,
          messageInput: that.data.messageInput,
          useServer: that.data.useServer,
          messageName: that.data.messageName
        },
        success: function (res) {
          //console.log('[chat.js][发送消息到服务器] success Time: ')
          //console.log(res);
          var messageListTemp = wx.getStorageSync(that.data.messageName)
          var data = {
            itemID: that.data.itemID,
            messageReceiveUserID: that.data.theOtherUserID,
            messageSendUserID: app.globalData.userID,
            messageInput: that.data.messageInput,
            messageSendTime: res.data['messageSendTime'],
          }
          messageListTemp.push(data);
          wx.setStorageSync(that.data.messageName, messageListTemp)
          //console.log('[chat.js][查看messsageList：message是否写入存储]')
          //console.log(wx.getStorageSync(that.data.messageName))
          that.setData({
            messageList: messageListTemp,
            messageInput: '',
          })
        },
        fail: function () {
        },
        complete: function () {
        }
      })
    }
  },

  checkMessage: function () {
    var that = this
    wx.request({
      url: that.data.serverURL + 'checkMessage.php',
      data: {
        itemID: that.data.itemID,
        messageReceiveUserID: app.globalData.userID,
        messageSendUserID: that.data.theOtherUserID,
        useServer: that.data.useServer
      },
      success: function (res) {
        //console.log('[chat.js][从服务器接收消息] success Time: ')
        //console.log(res)
        if (res.data.length) {
          if (wx.getStorageInfoSync().keys.indexOf(that.data.messageName) == -1) {
            let messageNameTemp = 'msg_' + that.data.itemID + '_' + that.data.theOtherUserID
            //console.log(messageNameTemp)
            this.setData({
              messageName: messageNameTemp
            })
            wx.setStorageSync(messageNameTemp, [])
            var messageNameList = wx.getStorageSync('messageNameList')
            messageNameList.unshift(messageNameTemp)
            wx.setStorageSync('messageNameList', messageNameList)
            messageNameList = wx.getStorageSync('messageNameList')
            //console.log('[chat.js][看messageName是否加入到messsageNameList当中12]')
            //console.log(messageNameList)
            that.setData({
              timer: setInterval(that.checkMessage, that.data.tiemSecond)
            })
          }

          var messageListTemp = wx.getStorageSync(that.data.messageName)
          for (let i = 0; i < res.data.length; i++) {
            messageListTemp.push(res.data[i]);
          }

          wx.setStorageSync(that.data.messageName, messageListTemp)
          //console.log('[chat.js][查看messsageList：message返回值是否写入存储]')
          //console.log(wx.getStorageSync(that.data.messageName))
          that.setData({
            messageList: messageListTemp,
          })
          //console.log(that.data.messageList)
        }

      },
      fail: function () {
      },
      complete: function () {
      }
    })

  },
})




