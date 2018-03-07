//app.js
App({
  globalData: {
    // url: 'http://localhost',
     url: 'https://test-admin.letulife.com',
    // url: 'https://admin.letulife.com',
    userInfo: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    var that = this
    wx.showToast({
      title: '登录中',
      icon:'loading',
      duration:500
    })
    // wx.checkSession({
    //   success: function () {
    //   },
    //   fail: function () {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              wx.request({
                url: that.globalData.url+'/guide/login.action',
                data: {
                  code: res.code
                },
                success: res2 => {
                  if (res2.statusCode != 200) {
                    wx.showModal({
                      title: 'error',
                      content: '服务器状态码' + res2.statusCode + ',请联系客服处理',
                      showCancel: false
                    })
                    return
                  }
                  wx.setStorageSync("openid",res2.data.openid)
                  wx.setStorageSync("session_key",res2.data.session_key)
                  if(res2.data.code!=null && res2.data.code ==0){//未注册
                    wx.reLaunch({
                      url: '/pages/newUser/newUser?source=guide',
                    })
                  } else if (res2.data.code != null && res2.data.code==1){
                    wx.setStorageSync("guideId",res2.data.guideId)
                  }
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
    //   }
    // }),
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})