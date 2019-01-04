// pages/login/login.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    domainIndex:0,
    domainArray: ['@mails.tsinghua.edu.cn', '@mail.tsinghua.edu.cn'],
    requireCodeStatus: 0,
    requireCodeButtonDisplay: ["点击获取注册码","重新获取注册码"],
    requireCodeButtonDisable: false,
    requireCodeButtonFlay: true,
    emailAddress: null,
    useServer: app.globalData.useServer,
    serverURL: app.globalData.serverURL,
    code: null,
    inputCode: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isRegistered: true,
    haveAuth: false,
    haveRegister: false,
    timer: null,
    countDownNum: 60,
    userIsBlocked: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
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
    var that = this
    wx.request({
      url: that.data.serverURL + "getHistoryMessage.php",
      data: {
        useServer: that.data.useServer,
        userID: app.globalData.userID
      },
      success: function (res) {
        console.log('[login.js][获取历史Message数据] success')
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          var tempMessage = res.data[i]
          var tempNameList = wx.getStorageSync('messageNameList')
          if (tempNameList.indexOf(tempMessage['messageName']) == -1) {
            tempNameList.unshift(tempMessage['messageName'])
            wx.setStorageSync('messageNameList', tempNameList)
            wx.setStorageSync(tempMessage['messageName'], [])
          }
          var tempMessageList = wx.getStorageSync(tempMessage['messageName'])
          tempMessageList.push(tempMessage)
          wx.setStorageSync(tempMessage['messageName'], tempMessageList)
        }
        console.log(wx.getStorageInfoSync().keys)
      },
      fail: function () {
        console.log('[login.js][获取历史Message数据]  fail');
      },
      complete: function () {
        // console.log("complete")
      }
    })

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
  bindGetEmailAddress: function(e){
    this.setData({
      emailAddress: e.detail.value
    })
  },
  bindPickerChange: function(e){
    this.setData({
      domainIndex: e.detail.value
    })
  },
  bindRequireCodeButton: function(){
    var that=this
    var nickName = app.globalData.userInfo['nickName']
    app.globalData.userEmail = that.data.emailAddress + that.data.domainArray[that.data.domainIndex]
    this.setData({
      requireCodeStatus: 1,
      requireCodeButtonDisable: true,
      emailAddress: app.globalData.userEmail
    })
    this.countDown(that.data.countDownNum)
    //console.log(this.data.emailAddress)
    wx.request({
      url: that.data.serverURL +"emailCode.php",
      data: {
        emailAddress: that.data.emailAddress,
        nickName: nickName,
      },
      success: function (res) {
        //console.log("success")
        //console.log(res.data)
        //console.log(res.statusCode)
        that.setData({
          code: res.data['code']
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
  bindAuthorizeButton(e) {
    var that = this
    app.globalData.userInfo = e.detail.userInfo  //已经能够初步获取用户的昵称、头像、地区、性别等信息，但是还不能获取微信用户的唯一ID，openid
    app.globalData.userNickName=e.detail.userInfo['nickName']
    wx.login({
      success: function (res1) {  //获取微信授权，得到授权访问码code，为了进一步得到微信用户的唯一ID，openid
        if (res1.code) {
          that.setData({
            haveAuth: true
          })
          // 发起网络请求，以授权访问码code换取微信用户的唯一ID，openid
          wx.request({
            url:that.data.serverURL+'getOpenID.php',
            data: {
              userCode: res1.code
            },
            success: function (res2) {
              //console.log('[login.js][code换取session_key请求] success ')
              //console.log(res2)
              app.globalData.userOpenID = res2.data['openid']
            },
            fail: function () {
              console.log('[app.js][code换取session_key请求] failed ')
            },
            complete: function () {
              //console.log('[app.js][code换取session_key请求] complete ')
              wx.request({
                url: app.globalData.serverURL + 'login.php',
                data: {
                  userOpenID: app.globalData.userOpenID,
                  userNickName: app.globalData.userNickName,
                  useServer: app.globalData.useServer,
                  userIconPath: app.globalData.userInfo['avatarUrl']
                },
                success: function (res3) {
                  //console.log('[login.js][查看是否已注册] success ')
                  //console.log(res3)
                  if (res3.data['haveRegister'] == true) {
                    if(!res3.data['userIsBlocked']){
                      app.globalData.userEmail = res3.data['userEmail']
                      app.globalData.userID = res3.data['userID'];
                      //console.log('[login.js][查看是否已经有了用户所有信息]')
                      //console.log(app.globalData)
                      wx.reLaunch({
                        url: '../index/index'
                      })
                    } else {
                      wx.showToast({
                        title: "由于您评分太低，已经被拉入系统黑名单，禁止登陆！",
                        content: "请发邮件至：jiaxh17@mails.tsinghua.edu.cn申诉",
                        icon: 'none',
                        duration: 10000
                      })
                    }
                    
                  }
                  else{  
                    that.setData({
                      isRegistered: false
                    })
                  }
                },
                fail: function () {
                  console.log('[app.js][查看是否已注册] failed ')
                },
                complete: function () {
                  //console.log('[app.js][查看是否已注册] complete ')
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  bindGetInputCode(e){
    var that = this
    that.setData({
      codeInput: e.detail.value
    })
  },
  bindVerifyCodeButton: function () {
    var that = this
    if (that.data.code == that.data.codeInput) {
      wx.request({
        url: app.globalData.serverURL + 'register.php',
        data: {
          userOpenID: app.globalData.userOpenID,
          userNickName: app.globalData.userNickName,
          userEmail: app.globalData.userEmail,
          userIconPath: app.globalData.userInfo['avatarUrl'],
          useServer: app.globalData.useServer,
        },
        success: function (res) {
          //console.log('[login.js][对用户进行注册] success ')
          //console.log(res)
          //userInfo = res.
          //wx.setStorageSync('res', userInfo)
          if(res.data['haveRegister']){
            wx.reLaunch({
              url: '../index/index'
            })
          }
          else{
            wx.showToast({
              title: "注册失败，请稍后再试!",
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          console.log('[login.js][对用户进行注册] failed ')
        },
        complete: function () {
          //console.log('[login.js][对用户进行注册] complete ')
        }
      })
    }
    else {
      wx.showToast({
        title: "验证码错误!",
        icon: 'none',
        duration: 2000
      })
    }
  },


  countDown: function (timeSecond) {
    var that = this;
    var countDownNum = timeSecond;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          that.setData({
            countDownNum: 60,
            requireCodeStatus: 0,
            requireCodeButtonDisable: false
          })
          clearInterval(that.data.timer)
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  }
})