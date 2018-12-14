// pages/detail/detail.js
var app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    //书籍信息
    img_url: res.data['itemPicturePath'],
    book_name: res.data['itemName'],
    book_price: res.data['itemPrice'],
    book_sort: res.data['itemSort'],
    book_info: res.data['itemInfo'],
    book_pub: res.data['itemPublisher'],
    book_cn: res.data['itemCourseName'],
    book_ct: res.data['itemCourseTeacher'],
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
  },
  onLoad: function () {
    var that = this
    /*------------------------------
     * wx.request()
     * 说明：请求Page:detail的书籍详情数据
     * url: serverURL+detail.php
     * data:{
     * useServer: bool变量，传给后台表示采用服务器还是本地资源，前端开发无需修改。
     * }
     * 请求返回值：res，该变量在successs: function中有效，需要在本页面.data中声明变量接收。
     -------------------------------*/
    wx.request({
      url: that.data.serverURL + "detail.php",
      data: {
        useServer: that.data.useServer,
        serverURL: that.data.serverURL,
        totalIndex: that.data.totalIndex,
      },
      success: function (res) {
        console.log(res.data)
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
  }
})