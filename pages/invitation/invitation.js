// pages/invitation/invitation.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    b:'***********'
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
    var b = '13123930325'
    this.setData({
      b: b.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    })
    this.refresh()

    // 调节品目亮度
    wx.getScreenBrightness({
      success: res => {
        this.setData({
          screenbright: res.value
        })
      },
    })
    wx.setScreenBrightness({
      value: this.data.screenbright + 0.3
    })
  },

// 获取数据
  refresh() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.url + '/group/groupList.action',
      data: {
        
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

        this.setData({
          groupList: res.data.groupList
        })
      },
      complete: function () {
        wx.hideLoading()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      //  console.log(res.target)
    }
    return {
      path:"/pages/invitation/invitation",
      imageUrl:"../../pic/mark2.jpg",
      success: function (res) {
         console.log("转发成功")
      },
      fail: function (res) {
         console.log("转发失败")
      }
    }
  }
})