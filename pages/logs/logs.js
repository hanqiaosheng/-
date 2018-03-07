//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    sysInfo: {},
    light:0
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    }),
    wx.getSystemInfo({
      success: res => {
        this.setData({
          sysInfo:res
        })
      }
    }),
    wx.getScreenBrightness({
      // success: function (res) {   function声明的函数和箭头函数的作用域不同
      success: res => {
        this.setData({
          light: res.value
        })
      },
    })
  }
})
