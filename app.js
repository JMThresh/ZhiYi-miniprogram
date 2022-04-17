// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,

    // 出行政策 始发地和目的地，以及二者的标识
    city: "",               // 要更新的城市
    isFrom: false,          // 是否是始发地
    update_enable: false    // 是否更新

  }
})
