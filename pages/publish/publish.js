// pages/publish/publish.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    netTestValue: "后台访问失败",
    itemCourseName: "",
    itemName: "",
    itemPrice: "",
    itemShortInfo: "",
    itemSubjectList: ["推荐", "理科", "工科", "文科", "其它"],
    itemSubject: 1,
    itemSortArray: [["课程资料", "非课程资料"], ["课本","讲义","作业","参考书","其他"]],
    itemSort: [0, 0],
    itemInfo: "",
    itemPublisher: "",
    itemPublishVersion: "",
    itemCourseName: "",
    itemCourseNO: "",
    itemCourseTeacher: "",
    itemPicturePath: [],
    bookToastHidden:true,
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
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
      url: that.data.serverURL+'data.php',
      data: {
        netTestValue: '后台访问失败',
      },
      success: function (res) {
        // console.log("success")
        //console.log(res.data)
        // console.log(res.statusCode)
        that.setData({
          netTestValue: res.data['netTestValue']
        })

      },
      fail: function () {
        console.log("fail")
      },
      complete: function () {
        //console.log("complete")
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

  wxToUploadPhoto: function () {
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success(res) {
        const tempFilePaths = res.tempFilePaths
        const images = that.data.itemPicturePath.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        that.setData({
          itemPicturePath: images.length <= 3 ? images : images.slice(0, 3)
        });

        //wx.uploadFile({
        //  url: that.data.serverURL+'uploadphoto.php',
        //  filePath: tempFilePaths[0],
        //  name: 'file',
        //  formData: {
        //    email: 'test@mails.tsinghua.edu.cn',
        //    courseName: that.data.courseName,
        //    price: that.data.price,
        //    subject: that.data.subject,
        //    useServer: that.data.useServer,
        //  },
        //  success(res) {
        //    console.log("it's good!")
        //    const data = res.data
        //    console.log(data)
        //    that.setData({
        //      netTestValue: "上传成功!"
        //    })
        //  }
        //})
        wx.uploadFile({
          url: that.data.serverURL+'uploadphoto.php',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            email: 'test@mails.tsinghua.edu.cn',
            courseName: that.data.courseName,
            price: that.data.price,
            subject: that.data.subject,
            useServer: that.data.useServer,
          },
          success(res) {
            console.log("it's good!")
            const data = res.data
            console.log(data)
            that.setData({
              netTestValue: "上传成功!"
            })
          }
        })
      }
    })
  },
  wxGetItemName: function (e) {
    this.setData({
      itemName: e.detail.value
    })
  },

  wxGetItemPrice: function (e) {
    if (e.detail.value > 1000){
      e.detail.value = 1000
    }
    this.setData({
      itemPrice: e.detail.value
    })
  },

  wxGetItemShortInfo(e) {
    this.setData({ itemShortInfo: e.detail.value });
  },

  wxGetItemSubject(e) {
    this.setData({ 
      itemSubject: e.detail.value 
      });
  },

  // process the column change (课程资料/非课程资料)
  wxGetItemSortColumnChange: function (e) {
    var data = {
      itemSortArray: this.data.itemSortArray,
      itemSort: this.data.itemSort
    };
    data.itemSort[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.itemSort[0]) {
          // dynamically change the second column when the first column change
          case 0:
            //课程资料
            data.itemSortArray[1] = ["课本", "讲义", "作业", "参考书", "其他"];
            break;
          case 1:
            //非课程资料
            data.itemSortArray[1] = ["科技", "艺术", "人文社科", "经济金融", "其他"];
            break;
        }
        data.itemSort[1] = 0;
        break;
      case 1:
        break;
    }
    this.setData(data);
  },

  wxGetItemSort: function (e) {
    this.setData({
      itemSort: e.detail.value
    })
  },

  wxGetItemInfo: function (e) {
    this.setData({
      itemInfo: e.detail.value
    })
  },

  wxGetItemPublisher: function (e) {
    this.setData({
      itemPublisher: e.detail.value
    })
  },

  wxGetItemPublishVersion: function (e) {
    this.setData({
      itemPublishVersion: e.detail.value
    })
  },


  wxGetItemCourseName: function (e) {
    this.setData({
      itemCourseName: e.detail.value
    })
  },

  wxGetItemCourseNO: function (e) {
    this.setData({
      itemCourseNO: e.detail.value
    })
  },

  wxGetItemCourseTeacher: function (e) {
    this.setData({
      itemCourseTeacher: e.detail.value
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    var newItemPicturePath = this.data.itemPicturePath
    newItemPicturePath.splice(idx, 1)
    this.setData({
      itemPicturePath: newItemPicturePath
      })
    console.log(this.data.itemPicturePath)
  },

  handleImagePreview(e) {
    //delete this function if cannot return
    const idx = e.target.dataset.idx
    const images = this.data.itemPicturePath
    console.log(images)
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  // Modify this function to update data to database
  bindToastTap: function () {
    console.log('发布成功')
    this.setData({
      // show the success icon 
      bookToastHidden: false
    })
    //wx.reLaunch({
    //  url: '../index/index'
    //})
  },
  hideToast: function () {
    this.setData({
      // hide the success icon
      bookToastHidden: true
    })
    wx.reLaunch({
      url: '../index/index'
    })
  }
})