// pages/userDetail2/userDetail2.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.groupId, 
      isNow: options.isNow, 
      userId: options.userId
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
    this.refresh()
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
    const refreshPromise = new Promise((resolve, reject) => {
      this.refresh()
      resolve()
    })
    refreshPromise.then(wx.stopPullDownRefresh())
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

  /**
   * 带操作
   */
  agent: function () {
    if (this.data.user.userState == 0) {//空闲
      this.qr()
    } else {
      this.finish()
    }
  },

  /**
   * 用户点击代开锁
   */
  qr: function () {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var userId = that.data.user.userId
        var groupId = that.data.groupId
        var bikeCode = res.result
        // wx.showModal({
        //   title: res.scanType,
        //   content: res.result + res.path,
        //   showCancel: true,
        //   success: function (res) {
        wx.navigateTo({
          url: '/pages/progress/progress?userId=' + userId + '&groupId=' + groupId + '&bikeCode=' + res.result.split('bike=')[1]
        })
        //   },
        // })
      },
    })
  },

  /**
   * 代还车
   */
  finish: function () {
    wx.showLoading({
      title: '处理中...',
      mask:true
    })
    var that = this
    var userId = that.data.user.userId
    var groupId = that.data.groupId

    wx.request({
      url: app.globalData.url + '/lock/finish.action',
      data: {
        userId: that.data.user.userId,
        groupId: that.data.groupId,
      },
      success: res => {
        if (res.statusCode != 200) {
          wx.showModal({
            title: 'error',
            content: '服务器状态码' + res.statusCode + ',请联系客服处理',
            showCancel: false
          })
          return
        }
        var title = '成功'
        if (res.data.code!=1){
          title = '失败'
        }
        wx.showModal({
          title: title,
          content: res.data.message,
          showCancel: false,
        })
      },
      complete: function () {
        wx.hideLoading()
        that.refresh()
      }
    })
  },
  /**
   * 修改用户
   */
  edit: function () {
    wx.navigateTo({
      url: '/pages/newUser/newUser?source=editUser&userRealname=' +   this.data.user.userRealname + '&userIdcard=' + this.data.user.userIdcard
      + '&userTel=' + this.data.user.userTel + '&userId=' + this.data.user.userId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 刷新数据
   */
  refresh() {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/user/userDetail.action',
      data: {
        userId: this.data.userId,
        groupId: this.data.groupId,
        // openid: res.data
      },
      success: res => {
        if (res.statusCode != 200) {
          wx.showModal({
            title: 'error',
            content: '服务器状态码' + res.statusCode + ',请联系客服处理',
            showCancel: false
          })
          return
        }
        var d = new Date()
        res.data.rents.forEach(function (v, i, a) {
          if (v.rentEndtime ==null){
            v.time = 0
          }else{
            v.time = parseInt((v.rentEndtime - v.rentStarttime)/60000)
          }
          d.setTime(v.rentStarttime)
          v.starttime = d.toLocaleString().replace(/\//g, '-')
          d.setTime(v.rentEndtime)
          v.endtime = d.toLocaleString().replace(/\//g, '-')
        })
        this.setData({
          user: res.data.user,
          rents: res.data.rents.sort(that.sortDate)
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 排序
   */
  sortDate(a,b){
    return b.rentStarttime - a.rentStarttime
  },

  /**
   * 打电话
   */
  makephone(){
    wx.makePhoneCall({
      phoneNumber: this.data.user.userTel //仅为示例，并非真实的电话号码
    })
  },
})