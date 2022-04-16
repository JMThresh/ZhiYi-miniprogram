// pages/user/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  onShow() {
    const userInfo = wx.getStorageSync("userinfo");
    this.setData({
      userInfo,
    })
  },

  handleGetUserProfile() {
    wx.getUserProfile({
      desc: "用以渲染用户个人界面",
      success: (res) => {
        const { userInfo } = res;
        wx.setStorageSync("userinfo", userInfo);  
        this.setData({
          userInfo
        })
      },
      fail: (res) => {
        console.log("fail:", res);
      }
    })
  }
})