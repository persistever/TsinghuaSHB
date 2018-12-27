// pages/user_upload/user_upload.js
// pages/collect/collect.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')

Page({
  // 页面初始数据
  data: {
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    list: []
  },
  onLoad: function () {
   
  },
  onShow: function(){
    var that = this

    /*------------------------------
     * wx.request()
     * 说明：请求Page:collect的userID的收藏
     * url: serverURL+collect.php
     * data:{
     * useServer: bool变量，传给后台表示采用服务器还是本地资源，前端开发无需修改。
     * totalIndex: int 当前为5，表示有“推荐、理科、工科、文科、其他”五个类别
     * }
     * 请求返回值：res，该变量在successs: function中有效，需要在本页面.data中声明变量接收。
     * res.data: 返回的二维数组
     * 第一维的元素取决于要求显示的条目数，目前前后台均没有设置；
     * 第二维的元素为每一条item的详情，其key按照index.wxml中{{item.xxx}}设置，尚未规范协议。
     * 其他说明：请求发生之后，服务器会进行响应，无论success还是fail都会执行complete
     -------------------------------*/
    wx.request({
      url: that.data.serverURL + "userupload.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        userID: app.globalData.userID
      },
      success: function (res) {
        //console.log(res.data)
        // console.log(res.statusCode)
        that.setData({
          list: res.data
        })
      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
        // console.log("complete")
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: that.data.serverURL + "userupload.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
      },
      success: function (res) {
        // console.log("success")
        console.log(res.data)
        // console.log(res.statusCode)
        that.setData({
          list: res.data
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
        // console.log("complete")
      }
    })
  },
  // 加载更多
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    // page = page + 1;
    wx.request({
      url: that.data.serverURL + "userupload.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
      },
      success: function (res) {
        // 回调函数
        // 将res中的数据拼接到现在已有的data中
        var data_list = that.data.list;
        // index(用户的收藏) 循环
        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            data_list.push(res.data[j]);
          }
        }
        console.log(data_list)
        // 设置数据
        that.setData({
          list: data_list
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  },

  // 跳转至详情页
  navigateDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?itemID=' + e.currentTarget.dataset.aid
    })
  },

  // 加载更多
  loadMore: function (e) {
    console.log('加载更多')
    var curid = this.data.curIndex

    if (this.data.navSectionItems[curid].length === 0) return

    var that = this
    that.data.navSectionItems[curid] = that.data.navSectionItems[curid].concat(that.data.navSectionItems[curid])
    that.setData({
      list: that.data.navSectionItems,
    })
  },

  uploaddel: function (e) {
    var _userid = app.globalData.userID
    var _itemid = e.currentTarget.dataset.aid
    var _itemsold = e.currentTarget.dataset.sold
    var _itempublished = e.currentTarget.dataset.publish
    var _statuschangetype  //这个值就作为送给服务器的操作标识吧，-1：恢复发布，0：已卖，1：不想卖了，2：隐藏发布
    var del = false
    var that = this
    if (_itemsold == 0 && _itempublished == 1) {
      wx.showActionSheet({
        //2个list分别对应itemIsDelete和itemIsPublished
        itemList: ['这本书我不想卖了。。。', '你等我考虑考虑要不要卖'],
        //itemColor: 'skyblue',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          }
          else {
            var oldlist = that.data.list
            var len = oldlist.length
            var newlist = []
            del = true
            for (let i = 0; i < len; i++) {
              var temp = oldlist.shift()
              if ((temp['itemID'] == _itemid) && (res.tapIndex == 0)) {
                _statuschangetype = 1
                continue
              }
              else if ((temp['itemID'] == _itemid) && (res.tapIndex == 1)) {
                temp.itemIsPublished = 0;
                _statuschangetype = 2
                newlist.push(temp)
              }
              else {
                newlist.push(temp)
              }
            }
            wx.request({
              url: app.globalData.serverURL + 'DeleteUserUpload.php',
              data: {
                useServer: that.data.userServer,
                itemID: _itemid,
                userID: _userid,
                status: _statuschangetype
              },
              success: function (res) {
              },
              fail: function () {
              },
              complete: function () {
              }
            }),
              that.setData({
                list: newlist
              })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    else if (_itempublished == 0){
      _statuschangetype = -1
      wx.showActionSheet({
        itemList: ['我决定了！我还是卖它'],
        //itemColor: 'skyblue',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          }
          else {
            var oldlist = that.data.list
            var len = oldlist.length
            var newlist = []
            del = true
            for (let i = 0; i < len; i++) {
              var temp = oldlist.shift()
              if ((temp['itemID'] == _itemid) && (res.tapIndex == 0)) {
                temp.itemIsPublished = 1;
                newlist.push(temp)
              }
              else {
                newlist.push(temp)
              }
            }
            wx.request({
              url: app.globalData.serverURL + 'DeleteUserUpload.php',
              data: {
                useServer: that.data.userServer,
                itemID: _itemid,
                userID: _userid,
                status: _statuschangetype  //status = -1表示重新上架
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
                list: newlist
              })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }
})