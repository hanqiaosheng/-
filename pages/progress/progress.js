// pages/progress/progress.js

var interval;
var varName;
var step;
var ctx = wx.createCanvasContext('canvasArcCir');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:null,
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId, 
      bikeCode: options.bikeCode, 
      groupId:options.groupId
    })
    var that = this
    this.drawCircle()
    this.unlock()
    // setTimeout(this.unlock,8000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function () {
    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.drawImage("/pic/progress.jpg", -26.5, -24.5, 250, 250)
    cxt_arc.setLineWidth(3);
    cxt_arc.setStrokeStyle('#eaeaea');
    // cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(100, 100, 96, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
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
    wx.stopPullDownRefresh()
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
   * 开锁
   */
  unlock:function(){
    wx.getStorage({
      key: 'openid',
      success: res => {
        wx.request({
          url: app.globalData.url + '/lock/unlock.action',
          data: {
            userId: this.data.userId,
            groupId: this.data.groupId,
            bikeCode: this.data.bikeCode,
            openid: res.data
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
              code: res.data.code,
              msg: res.data.message
            })
            step = 60
            setTimeout(function(){
              wx.navigateBack({})
            },1000)
          },
        })
      },
    })
  },

  /**
   * 绘图
   */
  drawCircle: function () {
    clearInterval(varName);
    function drawArc(s, e) {
      // ctx.setFillStyle('white');//填充颜色
      // ctx.clearRect(0, 0, 200, 200);//清除画布
      // ctx.draw();//进行绘图
      var x = 100, y = 100, radius = 96;
      ctx.setFontSize(20)//填充字大小
      ctx.fillText('开锁中' + Math.round(step/n*100) + '%', 50, 110)//填充字
      ctx.setLineWidth(3);//线条宽度
      ctx.setStrokeStyle('#50cc99');//线条颜色
      // ctx.setLineCap('round');//设置线条端点的样式
      ctx.beginPath();//开始一个路劲
      ctx.arc(x, y, radius, s, e, false);//添加一个弧形路径到当前路径，顺时针绘制。
      ctx.stroke()//对当前路径进行描边
      ctx.draw()//进行绘图
    }
    step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 50, n = 60;
    var animation = function () {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
      } else {
        clearInterval(varName);
      }
    };
    varName = setInterval(animation, animation_interval);
  },

  /**
   * 返回
   */
  return:function(){
    // setTimeout(function () {
    //   console.log("开始按钮");
    // }, 5000)
  }
})