// pages/qrcode/qrcode.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.groupId
    })
    console.log(options.groupId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.refresh()
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setScreenBrightness({
      value: this.data.screenbright
    })
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //返回上一层会卸载该页面 而不会调用隐藏页面
    wx.setScreenBrightness({
      value: this.data.screenbright
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const refreshPromise = new Promise((resolve, reject)=>{
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
   * 刷新数据
   */
  refresh:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url +'/group/groupDetail.action',
      data: {
        // guideId: res.data,
        groupId: this.data.groupId
      },
      success: res => {
        if (res.statusCode != 200) {
          wx.showModal({
            title: 'error',
            content: '服务器状态码' + res.statusCode+',请联系客服处理',
            showCancel: false
          })
          return
        }
        if (res.data.group.guideGroupEndTime > new Date().valueOf()
        //  && new Date().valueOf() > res.data.group.guideGroupStartTime
         ) {//判断是否在团开锁结束时间内 以控制出团状态
          res.data.group.isNow = true
        } else { res.data.group.isNow = false}
        var d = new Date()
        d.setTime(res.data.group.guideGroupStartTime)
        res.data.group.guideGroupStartTime = d.toLocaleString().replace(/\//g, '-')
        var mark
        if (res.data.group.isNow == true && res.data.group.guideGroupCouponInfo!=null){
          mark = app.globalData.url + res.data.group.guideGroupCouponInfo.split('letu_bike')[1]
        }else{
          mark = '/pic/mark.jpg'
        }
        this.setData({
          mark:mark,
          group: res.data.group,
          userList: res.data.userList
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },


  /**
   * 带操作
   */
  agent: function (event) {
    if (event.currentTarget.dataset.userstate == 0) {//空闲
      this.qrcode(event)
    } else {
      this.finish(event)
    }
  },

  /**
   * 代还车
   */
  finish: function (event) {
    wx.showLoading({
      title: '处理中...',
      mask: true
    })
    var that = this
    wx.request({
      url: app.globalData.url + '/lock/finish.action',
      data: {
        userId: event.currentTarget.dataset.userid,
        groupId: that.data.group.guideGroupId,
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
        if (res.data.code != 1) {
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
   * 用户点击代开锁
   */
  qrcode: function (event) {
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        var userId = event.currentTarget.dataset.userid
        var groupId = that.data.group.guideGroupId
        var bikeCode = res.result
        // wx.showModal({
        //   title: res.scanType,
        //   content: res.result,
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
   * 进入用户详情
   */
  userdetail: function (event){
    var that = this
    var userId = event.currentTarget.dataset.userid
    wx.navigateTo({
      url: '/pages/userDetail2/userDetail2?groupId=' + that.data.group.guideGroupId + '&userId=' + userId + '&isNow=' + that.data.group.isNow,
    })
  },

  /**
   * 删除用户
   */
  del:function(){

  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.userList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      userList: this.data.userList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.userList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      userList: that.data.userList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.userList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      userList: this.data.userList
    })
  },
  
  /**
   * 显示网页
   */
  showWeb(){
    // this.setData({
    //   showWeb :true
    // })
  },

  /**
   * 预览图片  分享
   */
  shareQrCode(){
    var that = this
    wx.previewImage({
      urls: [
        that.data.mark.split('.png')[0]+'pro.png'
      ] // 需要预览的图片http链接列表
    })
  }
})