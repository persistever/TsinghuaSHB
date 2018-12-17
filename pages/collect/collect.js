// pages/collect/collect.js
var util = require('../../utils/util.js')
var sta = require("../../utils/util.js");
Page({
  data: {
    allGoods: {},
    sumPrice: 0
  },
  onLoad: function () {

  },
  onShow: function () {
    sta();
    this.showAllGoods();
  },
  jia: function (e) {
    this.jiaj(e, true);
  },
  jian: function (e) {
    this.jiaj(e, false);
  },
  showAllGoods: function () {

    var allGoods = wx.getStorageSync('shoppingcar');
    var sumPrice = 0;
    for (var i = 0; i < allGoods.length; i++) {
      var price = allGoods[i].price;
      var count = allGoods[i].buycount;
      price = util.accMul(price, count);
      sumPrice = util.accAdd(sumPrice, price);
    }

    this.setData({
      allGoods: allGoods,
      sumPrice: sumPrice
    });
  },
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../detail/detail?id=' + id
    }
    )
  },
  jiaj: function (e, boo) {
    var id = e.currentTarget.dataset.id;
    var s = 0;
    var allGoods = this.data.allGoods;
    for (var i = 0; i < allGoods.length; i++) {
      if (allGoods[i].id == id) {
        if (boo) {
          s = allGoods[i].buycount + 1;
        } else {
          s = allGoods[i].buycount - 1;
        }
        //最低值不得低于1
        if (1 > s) {
          allGoods.splice(i, 1);
        } else {
          allGoods[i].buycount = s;
        }
        break;
      }
    }
    wx.setStorageSync('shoppingcar', allGoods);
    this.setData({
      allGoods: allGoods
    });
    this.showAllGoods();
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {

  },

    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

