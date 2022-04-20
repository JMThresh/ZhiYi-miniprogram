// pages/notice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  onLoad(){
      var tips = wx.getStorageSync('tips');
      if(tips){
        console.log("list");
        this.setData({
          list:tips
        })
      }else{
        console.log("!list");
        wx.cloud.callFunction({
          name: 'zy-dbase',
          data: {
            action: 'dailyTips'
          }
        }).then(res => {
          console.log(res);
          const tips = res.result.data;
          wx.setStorageSync('tips', tips);
          this.setData({
            list:tips
          })
        })
      }

  }
})