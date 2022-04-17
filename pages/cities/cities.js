import { request } from "../../request/index.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities:[],
    isFrom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("cities:onLoad");
    try{
      // 注意! 因为页面参数是字符串形式，所以这里需要将字符串转成布尔值  使用JSON.parse()转换，true和false必须小写
      let isFrom = JSON.parse(options.isFrom);
      this.setData({
        isFrom
      })
    }catch(err){
      // console.log(err);
    }
    this.getCities();
  },
  
  onShow(){
    // console.log("cities:onShow");
  },


  async getCities(){
    let url = "https://vt.sm.cn/api/QuarkSubscriptionCity/getAllCityV3";
    let {data} = await request({url:url});
    data = data.data;
    // data.forEach((v,i) => {
    //   v['id'] = i;
    // })
    data.forEach((v,i) => {
      Object.keys(v).forEach((key) => {
        v['title'] = key;
      })
      v['id'] = i
      v['cities'] = []
      v[v.title].forEach((c,j) => {
        v['cities'].push({
          // id: j,
          city: c
        })
      })
    })

    // let cities = [
    //   {
    //     id:0,
    //     title: "热门城市"
    //     cities: [
    //       {
    //         id:0,
    //         city: "北京"
    //       },
    //       {}
    //     ]
    //   },
    //   {}
    // ];

    // console.log(data);
    this.setData({
      cities: data
    })
  },
  // 处理input输入事件
  handleInput(){
    
  },
  // 处理提交按钮事件
  handleTap(){

  },
  // 处理选中城市之后的返回事件
  handleBack(e){
    // 因为switchTab不能带页面参数，故将页面相关信息存入app.js的全局变量中
    app.globalData.isFrom = this.data.isFrom;
    app.globalData.city = e.currentTarget.dataset.city;
    // 更新全局变量，使travel可更新
    app.globalData.update_enable = true;

    wx.switchTab({url:"/pages/travel/travel"});
  }
})