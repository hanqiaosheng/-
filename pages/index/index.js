//index.js
//获取应用实例

const app = getApp()
var order = ['red', 'yellow', 'blue', 'green', 'red']
var wxCharts = require('../../utils/wxcharts.js');
var timer;
Page({
  data: {
    circles:[{//地图上的园
      latitude: 23.099994,
      longitude: 113.324520,
      radius:200,
      fillColor:'#50cc99',
    }],
    markers: [{ //地图上的标记点
      iconPath: "/pic/logo.jpg",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50,
      callout:{ //标记点气泡
        content:'标记点气泡',
        bgColor:'#aaa'
      },
      label:{//标记点气泡的标签
        content:'气泡标签',
        bgColor:'#aaa'
      }
    }],
    polyline: [{ //地图上的路线
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FFFFFF",
      width: 2,
      dottedLine: true
    }],
    controls: [{ //地图上的控件
      id: 1,
      iconPath: '/pic/main.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    toView: 'red',
    scrollTop: 100,
    wid:0,
    isweb:false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 
  onReady() {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  play() {
    this.videoCtx.play()
  },
  pause() {
    this.videoCtx.pause()
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生物认证
   */
  auth:function(){
    wx.showActionSheet({
      itemList:['指纹识别','声纹识别','人脸识别'],
      success: function (res) {
        wx.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请用指纹解锁',
          success(res) {
            wx.showModal({
              title: '',
              content: '本次生物识别认证的生物信息编号:' + res.resultJSON,
              showCancel: true,
            })
          }
        })
      },
    })
  },

  /**
   * 手机振动
   */
  vib:function(){
    wx.vibrateLong({})
  },

  /**
   * 置顶消息
   */
  top:function(){
    wx.showToast({
      title: '点击右上角置顶小程序后在聊天界面可以看到消息置顶',
      icon: 'success',
      duration: 2000
    })
    wx.setTopBarText({
      text: 'tiiiiiiiiips'
    })
  },

  /**
   * 收货地址
   */
  address:function(){
    wx.chooseAddress({})
  },

  /**
   * 跳转到web
   */
  web:function(){
    this.setData({
      isweb:true
    })
  },

 
  /**
   * 设置
   */
  set:function(){
    wx.openSetting({})
  },


  /**
   * 微信运动
   */
  run: function () {
    wx.getWeRunData({
      success(res) {
        wx.showModal({
          title: '',
          content: '返回:' + res.resultJSON,
          showCancel: true,
        })
      }
    })
  },

  /**
   * 卡券
   */
  card:function(){
    wx.openCard({
      cardList: [
        {
          cardId: '',
          code: ''
        }, {
          cardId: '',
          code: ''
        }
      ],
      success: function (res) {
      }
    })
  },

  /**
   * 开锁中
   */
  aaa:function(){
    // wx.scanCode({
      // onlyFromCamera: true,
      // success: function (res) {
        wx.navigateTo({
          url: '/pages/progress/progress'
        })
      // },
    // })
  },

  /**
   * chart
   */
  chart:function(){
    wx.showActionSheet({
      itemList: ['area', 'column', 'line', 'pie', 'radar', 'ring'],
      success: function (res) {
        switch (res.tapIndex){
          case 0:wx.navigateTo({
            url: '/pages/charts/area/area',
          })
            break
          case 1: wx.navigateTo({
            url: '/pages/charts/column/column',
          })
            break
          case 2: wx.navigateTo({
            url: '/pages/charts/line/line',
          })
            break
          case 3: wx.navigateTo({
            url: '/pages/charts/pie/pie',
          })
            break
          case 4: wx.navigateTo({
            url: '/pages/charts/radar/radar',
          })
            break
          case 5: wx.navigateTo({
            url: '/pages/charts/ring/ring',
          })
            break
        }
      },
      fail: function (res) {
        wx.navigateTo({
          url: '/pages/charts/scrollline/scrollline',
        })
      }
    })
  },

  /**
   * 绘图
   */
  canvas:function(){
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')

    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },

  /**
   * 延时重复任务
   * SetInterval为自动重复，setTimeout不会重复。
   */
  repeat: function () {
    if(timer!=null||undefined){
      clearInterval(timer); 
      timer=null;
    }else{
      timer = setInterval(function () {
        wx.showToast({
          title: 'repeat',
          icon: 'loading',
          duration: 500
        })
      }, 1000);
    }
  },

  /**
   * 获取系统剪贴板内容
   */
  getclip:function(){
    wx.getClipboardData({
      success: function (res) {
        wx.showModal({
          title: '#$%',
          content: res.data,
        })
      }
    })
  },

  /**
   * 下载
   */
  upload:function(){
    wx.downloadFile({
      url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', 
      success: function (res) {
      }
    })
  },

  /**
   * 拍照
   */
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  /**
   * 录音
   */
  record:function(){
    wx.startRecord({
      success:function(){

      }
    })
  },

  /**
   * 选择图片
   */
  image: function () {
    wx.chooseImage({
      success: function () {

      }
    })
  },

  /**
   * 选择视频
   */
  video: function () {
    wx.chooseVideo({
      success: function () {

      }
    })
  },

  /**
   * 罗盘
   */
  compass: function () {
    wx.startCompass({
      success:function (res) {
        wx.showModal({
          title: '罗盘数据',
          content: '方向:'+res.direction,
        })
      }
    })
  },

  /**
   * 加速度
   */
  acc: function () {
    wx.startAccelerometer({
      success: function (res) {
        wx.showModal({
          title: '加速度',
          content: 'x:' + res.x + '/y:' + res.y + '/z' + res.z,
        })
      }
    })
  },

  /**
   * 微信支付
   */
  pay:function(){
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '*',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  },
  /**
  * 拨打电话
  */
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '188982822232' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 定位
   */
  map: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },

  /**
   * 我的手机
   */
  getPhoneNumber: function (e) {
    console.log(e.detail.iv)
    wx.showModal({
      title: 'title',
      content: '加密算法初始向量:' + e.detail.iv,
      showCancel: true,
    })
  },

  /**
  * 发起本地请求
  */
  re: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.url +'/guide/login.action',
            data: {
              code: res.code
            },
            success:res=>{
              console.log(res.data.openid)
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // wx.request({
    //   url: app.globalData.url+'/guide/unlockAgent.action',
    //   data: {
    //     userId: '133',
    //     bikeCode: '500'
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     wx.showModal({
    //       title: '',
    //       content: '返回数据:' + res.data,
    //       showCancel: true,
    //     })
    //   }
    // })
  },

})
