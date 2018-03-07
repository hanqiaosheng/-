// pages/group/group.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cssgroupList: 'groupList',
    cssgroupList2: 'groupList2',
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
   * 选择日期
   */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  
  /**
   * 刷新
   */
  refresh() {
    var that = this 
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.getStorage({
      key: 'guideId',
      success: res => {
        if (res.data == null || res.data == undefined){
          util.login()
        }
        wx.request({
          url: app.globalData.url + '/group/groupList.action',
          data: {
            guideId: res.data
          },
          success: res => {
            if(res.statusCode != 200){
              wx.showModal({
                title: 'error',
                content: '服务器状态码' + res.statusCode + ',请联系客服处理',
                showCancel:false
              })
              return
            }
            var d = new Date()
            res.data.groupList.forEach(function (v, i, a) {
              d.setTime(v.guideGroupStartTime)
              v.startTime = d.toLocaleDateString()
              if (v.guideGroupEndTime > new Date().valueOf()
              // &&new Date().valueOf() > v.guideGroupStartTime
              ){//判断是否在团开锁结束时间内 以控制出团状态
                v.isNow = true
              }
            })
            this.setData({
              groupList: res.data.groupList.sort(that.sortDate)
            })
          },
          complete:function(){
            wx.hideLoading()
          }
        })
      },
      fail: function() {
        wx.hideLoading()
        util.login()
      }
    })
  },

  /**
   * 团列表排序  按进行中-未进行   时间大-时间小  排序
   */
  sortDate(a,b){
    if(a.isNow==b.isNow){
      return b.guideGroupStartTime - a.guideGroupStartTime
    }else {
      return a.isNow?-1:1
    }
  }
  
})