//search.js
//获取应用实例
var WxSearch = require('./wxSearch/wxSearch.js')
var app = getApp()
Page({
  data: {
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    searchHotKeyList: null
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    //WxSearch.init(that, 43, ['计算机程序设计基础', '电子电路与系统基础', '微积分', '线性代数']);
    //WxSearch.initMindKeys(['计算机程序设计基础', '电子电路与系统基础', '微积分', '线性代数']);
    
  },
  onShow: function () {
    var that = this
    wx.request({
      url: that.data.serverURL + "searchHotKey.php",
      data: {
        useServer: that.data.useServer,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          searchHotKeyList: res.data
        })
        WxSearch.init(that, 43, that.data.searchHotKeyList);
        WxSearch.initMindKeys(that.data.searchHotKeyList);
      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
      }
    })
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    this.wxSearchBack(e);
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSearchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
    this.wxSearchBack(e);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  // do something to jump to another page
  navigateDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?itemID=' + e.currentTarget.dataset.aid
    })
  },

  // Modify this function to interact with database
  wxSearchBack: function (e) {
    // do something for searching with searchText and return an arr
    var that = this
    var searchText = that.data.wxSearchData.value
    console.log(searchText)
    wx.request({
      url: that.data.serverURL + "search.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        searchInput: searchText,
        searchType: 0,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          wxSearchBackData:res.data
        })
      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
        // console.log("complete")
      }
    })
  }
})
