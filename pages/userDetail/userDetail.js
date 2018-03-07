// pages/userDetail/userDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    isweb: false,
    userName: '王尼玛',
    userTel: '188211212',
    card:'340102010100101010101',
    method: '骑行中',
    status: '代开锁'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.userId,
      groupId:options.groupId
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
  
  },
  

  /**
   * 用户点击代开锁
   */
  qrcode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {

      },
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
  map:function(){
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
   * 跳转到web
   */
  web: function () {
    this.setData({
      isweb: true
    })
  },
})