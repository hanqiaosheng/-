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
    showModalStatus: false,
    ismoney: false,
    groupList:[],
    
    selectPerson: true,
    firstPerson: '全部',
    selectArea: false
  },

  //点击选择类型
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  //点击切换全部
  mySelect: function (e) {
    var that = this
    wx.getStorage({
      key: 'guideId',
      success: res => {
        wx.request({
          url: app.globalData.url + '/group/groupList.action',
          data: {
            guideId: res.data
          },

          success: res => {
            
            var d = new Date()
            res.data.groupList.forEach(function (v, i, a) {
              d.setTime(v.guideGroupStartTime)
              v.startTime = d.toLocaleDateString()
              v.show = true   
              if (v.guideGroupEndTime > new Date().valueOf()
                // &&new Date().valueOf() > v.guideGroupStartTime
              ) {//判断是否在团开锁结束时间内 以控制出团状态
              v.isNow=true
               
              }
            })
            this.setData({
              groupList: res.data.groupList.sort(that.sortDate),
                firstPerson: '全部',
              selectPerson: true,
              selectArea: false,
            })
          },
     
        })
      },
 
    })

  },
  //点击切换已出团
  mySelect1: function (e) {
    var that = this
    wx.getStorage({
      key: 'guideId',
      success: res => {
        wx.request({
          url: app.globalData.url + '/group/groupList.action',
          data: {
            guideId: res.data
          },

          success: res => {

            var d = new Date()
            res.data.groupList.forEach(function (v, i, a) {
              d.setTime(v.guideGroupStartTime)
              v.startTime = d.toLocaleDateString()
              if (v.guideGroupEndTime < new Date().valueOf()
                // &&new Date().valueOf() > v.guideGroupStartTime
              ) {//判断是否在团开锁结束时间内 以控制出团状态
               
                v.show = true
              }
            })
            this.setData({
              groupList: res.data.groupList.sort(that.sortDate),
              firstPerson: '已出团',
              selectPerson: true,
              selectArea: false,
            })
          },

        })
      },

    })

  },
  //点击切换待出团
  mySelect2: function (e) {
    var that = this
    wx.getStorage({
      key: 'guideId',
      success: res => {
        wx.request({
          url: app.globalData.url + '/group/groupList.action',
          data: {
            guideId: res.data
          },

          success: res => {

            var d = new Date()
            res.data.groupList.forEach(function (v, i, a) {
              d.setTime(v.guideGroupStartTime)
              v.startTime = d.toLocaleDateString()
              if (v.guideGroupEndTime > new Date().valueOf()
                // &&new Date().valueOf() > v.guideGroupStartTime
              ) {//判断是否在团开锁结束时间内 以控制出团状态
                v.isNow = true
                v.show = true
              }
            })
            this.setData({
              groupList: res.data.groupList.sort(that.sortDate),
              firstPerson: '待出团',
              selectPerson: true,
              selectArea: false,
            })
          },

        })
      },

    })

  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 300, //动画时长 
      timingFunction: "ease-in", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    animation.opacity(0).translateY(0).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).translateY(50).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭抽屉 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  //跳转邀请码
  toast: function () {
    wx.navigateTo({
      url: '../invitation/invitation'
    })
  },
  //跳转骑行统计
  census: function () {
    wx.navigateTo({
      url: '../census/census',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //跳转我的钱包
  wallet: function () {
    wx.navigateTo({
      url: '../wallet/wallet'
    })
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
      path: '/pages/group/group'
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
      mask: true,
    })
    wx.getStorage({
      key: 'guideId',
      success: res => {
        if (res.data == null || res.data == undefined) {
          util.login()
        }
        wx.request({
          url: app.globalData.url + '/group/groupList.action',
          data: {
            guideId: res.data
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
            res.data.groupList.forEach(function (v, i, a) {
              d.setTime(v.guideGroupStartTime)
              v.startTime = d.toLocaleDateString()
              v.show = true
              if (v.guideGroupEndTime > new Date().valueOf()
                // &&new Date().valueOf() > v.guideGroupStartTime
              ) {//判断是否在团开锁结束时间内 以控制出团状态
                v.isNow = true
              }
            })
            this.setData({
              groupList: res.data.groupList.sort(that.sortDate),
              firstPerson: '全部',
              selectPerson: true,
              selectArea: false,
            })
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.hideLoading()
        util.login()
      }
    })
  },

  /**
   * 团列表排序  按进行中-未进行   时间大-时间小  排序
   */
  sortDate(a, b) {
    if (a.isNow == b.isNow) {
      return b.guideGroupStartTime - a.guideGroupStartTime
    } else {
      return a.isNow ? -1 : 1
    }
  }

})