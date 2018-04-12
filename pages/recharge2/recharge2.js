// pages/recharge2/recharge2.js
var app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


    var openid = wx.getStorageSync('openid')
    var session_key = wx.getStorageSync('session_key')
    this.setData({
      openid: openid,
      session_key: session_key,
      ismoney: options.ismoney
    })
    console.log(options.ismoney)
    console.log(this.data.openid)
    console.log(this.data.session_key)
    this.generateOrder(openid)

  },
  /**生成商户订单 */
  generateOrder: function (openid) {
    var that = this
    
    //统一支付
    wx.request({
      url: '后台路径',
      method: 'GET',
      data: {
        gfee: '商品价钱',
        gname: '商品名称',
        openId: openid
      },
      success: function (res) {
        var pay = res.data
        //发起支付
        var timeStamp = pay[0].timeStamp;
        var packages = pay[0].package;
        var paySign = pay[0].paySign;
        var nonceStr = pay[0].nonceStr;
        var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        that.pay(param)

      },
    })
  },
  /* 支付  */
  pay: function (param) {
    console.log("支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })

          },
          fail: function () {
            // fail


          },
          complete: function () {
            // complete

          }
        })

      },
      fail: function (res) {
        // fail

      },
      complete: function () {
        // complete

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

  }
})