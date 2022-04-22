Page({

  data: {
    tip: {},
    bgImage: "https://pic.imgdb.cn/item/6262b41c239250f7c54a8d91.png"
  },

  onLoad(e){
    this.setList(e.id);
  },
  setList(id){
    var tips = wx.getStorageSync('tips');
    tips.forEach(v=>{
      if(v.id == id){
        this.setData({
          tip: v
        })
      }
    })
  }
})