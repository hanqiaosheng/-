// pages/census/census.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['日', '月', '年'], 
    currentTab: 0 ,
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      phone: "2222222222225",
      answer: "空闲",
      isFsas: true
    },
      { //假数据
        name: "欢顔1",
        phone: "2222222224522",
        answer: "骑行中",
        isFsas: false
      },
      { //假数据
        name: "欢顔2",
        phone: "2222245722222", 
        answer: "骑行中",
        isFsas: false
      },
      { //假数据
        name: "欢顔3",
        phone: "22224562222222",
        answer: "骑行中",
        isFsas: false
      },
    ],
    expertList1: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      phone: "2222222222225",
      answer: "空闲",
      isFsas: false
    },
    { //假数据
      name: "欢顔6",
      phone: "2222222224522",
      answer: "空闲",
      isFsas: false
    },
    { //假数据
      name: "欢顔5",
      phone: "2222245722222",
      answer: "空闲",
      isFsas: false
    },
    { //假数据
      name: "欢",
      phone: "22224562222222",
      answer: "空闲",
      isFsas: false
    },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

//点击切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  } ,
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