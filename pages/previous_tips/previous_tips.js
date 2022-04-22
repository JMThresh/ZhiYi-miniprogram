// import N_Filter from "../../utils/filter.wxs"
// pages/notice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  onLoad(){
    this.setList();
  },
  setList(){
    var tips = wx.getStorageSync('tips');
    if(tips){
      // console.log(tips);
      this.setData({
        list:tips
      })
    }else{
      // console.log("!list");
      wx.cloud.callFunction({
        name: 'zy-dbase',
        data: {
          action: 'dailyTips'
        }
      }).then(res => {
        // console.log(res);
        let tips = res.result.data;
        // 为每个note的自然段前增加两个空格
        // tips.forEach(v=>{
        //   v.note = "  " + v.note
        //   v.note.replace(/\\\\n/i,"  \n")
        // })
        wx.setStorageSync('tips', tips);
        this.setData({
          list:tips
        })
      })
    }
  }
})