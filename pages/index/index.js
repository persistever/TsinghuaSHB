//index.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')

Page({
  // 页面初始数据
  data: {
    colors: ['red', 'orange', 'yellow', 'green', 'purple'],
    // banner 初始化
    banner_url: fileData.getBannerData(),
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    // nav 初始化
    navTopItems: fileData.getIndexNavData(),
    navSectionItems: fileData.getIndexNavSectionData(),
    curNavId: 1,
    curIndex: 0,
    totalIndex: 5,
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
  },

  onLoad: function () {
    var that = this
    // navSectionItems 为/utils/data.js中设置的默认数据，
    // 在有远程服务的时候，应当注释掉
    // that.setData({
    //   list: that.data.navSectionItems
    // })

    /*------------------------------
     * wx.request()
     * 说明：请求Page:index的推荐、理科、工科、文科、其他类别数据
     * url: serverURL+index.php
     * data:{
     * useServer: bool变量，传给后台表示采用服务器还是本地资源，前端开发无需修改。
     * totalIndex: int 当前为5，表示有“推荐、理科、工科、文科、其他”五个类别
     * }
     * 请求返回值：res，该变量在successs: function中有效，需要在本页面.data中声明变量接收。
     * res.data: 返回的三维数组，第一维5个元素，分别表示推荐、理科、工科、文科、其他；
     * 第二维的元素取决于要求显示的条目数，目前前后台均没有设置；
     * 第三维的元素为每一条item的详情，其key按照index.wxml中{{item.xxx}}设置，尚未规范协议。
     * 其他说明：请求发生之后，服务器会进行响应，无论success还是fail都会执行complete
     -------------------------------*/
    wx.request({
      url: that.data.serverURL + "index.php",  
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        totalIndex: that.data.totalIndex,
      },
      success: function (res) {
        console.log(res.data)
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
      url: that.data.serverURL + "index.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        totalIndex: that.data.totalIndex,
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
      url: that.data.serverURL + "index.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        totalIndex: that.data.totalIndex,
      },
      success: function (res) {
        // 回调函数
        // 将res中的数据拼接到现在已有的data中
        var data_list = that.data.list;
        // 第一重循环：index(推荐、理科...)
        for (var i = 0; i < res.data.length; i++){
          // 若返回非空
          if (res.data[i]){
            //第二重循环：数据项
            for (var j = 0; j < res.data[i].length; j++) {
              data_list[i].push(res.data[i][j]);
            }
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

  //标签切换
  switchTab: function (e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    var that = this
    this.setData({
      curNavId: id,
      curIndex: index,
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
  wxToSearchTap: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})
