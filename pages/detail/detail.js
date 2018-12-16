// pages/detail/detail.js
var app = getApp();

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    special: '课程',
    //书籍信息
    img_url: ['../../images/programIcon.png'],
    book_id: null,
    book_name: '微积分',
    book_price: 10,
    book_sort: '书籍',
    book_info: '微积分是门好课',
    book_pub: '清华大学出版社',
    book_pubv:'第一版',
    user_id: null,
    isclass: '不是',
    course_name: '高等数学',
    course_teacher: '章纪民'
  },
  onLoad: function (e) {
    var that = this
    console.log(e.itemID)
    that.setData({
      book_id: e.itemID
    })
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
        itemID: that.data.book_id,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          book_name: res.data['itemName'],
          book_price: res.data['itemPrice'],
          book_sort: res.data['itemSort'],
          book_info: res.data['itemInfo'],
          book_pub: res.data['itemPublisher'],
          book_pubv: res.data['itemPublishVersion'],
          img_url: res.data['itemPicturePathList'],
          user_id: res.data['itemUserID'],
          isclass: res.data['itemSortIsClass'],
          course_name: res.data['itemCourseName'],
          course_teacher: res.data['itemCourseTeacher']
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