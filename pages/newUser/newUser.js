// pages/newUser/newUser.js
const app = getApp()
var timer
var flag = true
// var second = 59
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source:'guide',
    codetext: '获取验证码',
    codecss: 'code',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.code!=null){
      this.setData({
        code:options.code
      })
    }
    this.setData({
      source: options.source,
    })
    if (options.source == 'newUser'){
      this.setData({
        guideGroupId: options.guideGroupId,
      })
    }
    if (options.source == 'editUser'){
      this.setData({
        userId: options.userId,
        userRealname: options.userRealname,
        userTel: options.userTel,
        userIdcard: options.userIdcard
      })
    }

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
    flag = true
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

    return {
      path: '/pages/group/group',
    }
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js')
    var appId = 'wxf1ac1446cfa0ca65'
    var sessionKey 
    wx.getStorage({
      key: 'session_key',
      success: function(res) {
        sessionKey = res.data
      },
    })
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv

    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData, iv)

    console.log('data: ', data)
  },
  
  /**
   * 监听手机号输入框
   */
  setTel: function (event){
    this.setData({
      tel:event.detail.value
    })
    if(this.telRep(event.detail.value)){
      this.setData({
        codecss: 'code2'
      })
    }else{
      this.setData({
        codecss: 'code'
      })
    }
  },

  /**
   * 手机号验证
   */
  telRep:function(tel){
    var rep = /^[1][0-9]{10}$/
    if (rep.test(tel)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 获取验证码
   */
  getcode:function(){
    if (!this.telRep(this.data.tel)){
      return
    }
    if(!flag){
      return
    }
    flag = false
    var second = 59
    this.setData({
      codetext: second + "秒后重发",
        codecss: 'code'
    });
    clearInterval(timer)
    timer = setInterval(res =>{  //function声明的函数和箭头函数的作用域不同
      second--;
      this.setData({
        codetext: second + "秒后重发"
      });
      if (second <= 0) {
        flag = true
        clearInterval(timer)
        this.setData({
          codetext: '获取验证码',
        codecss: 'code2'
        })
      }
    },1000)

    wx.request({
      url: app.globalData.url + '/guide/getMsgCode.action',
      data: {
        tel:this.data.tel
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: 'error',
            content: '服务器状态码' + res.statusCode + ',请联系客服处理',
            showCancel: false
          })
          return
        }
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            icon: 'loading',
            title: res.data.msg,
            duration: 1000
          })
        }
      },
    })
  },

  /**
   * 导游注册
   */
  formSubmit:function(e){
    var that = this
    var url = app.globalData.url + '/guide/regist.action';
    this.setData({
      registBtnDisabled:true,
      registBtnLoading:true
    })
    if (this.data.source == 'newUser'){
      url = app.globalData.url + '/user/add.action'
      e.detail.value.guideGroupId = that.data.guideGroupId
    }
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        e.detail.value.openId = res.data
        wx.request({
          url: url,
          data: e.detail.value,
          success: function (res) {
            that.setData({
              registBtnDisabled: false,
              registBtnLoading: false
            })
            if (res.statusCode != 200) {
              wx.showModal({
                title: 'error',
                content: '服务器状态码' + res.statusCode + ',请联系客服处理',
                showCancel: false
              })
              return
            }
            if (res.data.code == 1) {//注册成功
              wx.setStorageSync("guideId", res.data.guideId)
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000,
                success: function () {
                  setTimeout(function () {
                    if (that.data.source == 'newUser') {
                      wx.navigateBack({})
                    } else {
                      wx.reLaunch({
                        url: '/pages/group/group'
                      })
                    }
                  },1000)
                }
              })
            } else {//注册失败  提示错误信息
              wx.showToast({
                icon: 'loading',
                title: res.data.msg,
                duration: 1000
              })
            }
          },
        })
      },
    })
  },
})