// app.js
App({
  onLaunch() {
    if(!wx.cloud){
      console.error('请使用2.2.3或以上的基础库已使用云能力');
    }else{
      wx.cloud.init({
        //填写自己的环境id
        env: 'enviro-3gpc2tf22b14c986',
        traceUser: true,
      })
    }




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
    address: {},               // 要更新的城市
    isFrom: false,          // 是否是始发地
    update_enable: false    // 是否更新

  }
})
