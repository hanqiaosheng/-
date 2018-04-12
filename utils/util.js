const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const login = () => {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        //发起网络请求
        wx.request({
          url: getApp().globalData.url + '/guide/login.action',
          data: {
            code: res.code
          },
          success: res2 => {
            
            if (res2.statusCode != 200) {
              wx.showModal({
                title: 'error',
                content: '服务器状态码' + res2.statusCode + ',请联系客服处理',
                showCancel: false
              })
              return
            }
            wx.setStorageSync("openid", res2.data.openid)
            wx.setStorageSync("session_key", res2.data.session_key)
            if (res2.data.code != null && res2.data.code == 0) {//未注册
              wx.reLaunch({
                url: '/pages/newUser/newUser?source=guide',
              })
            } else if (res2.data.code != null && res2.data.code == 1) {
              wx.setStorageSync("guideId", res2.data.guideId)
            }
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  login: login
}
