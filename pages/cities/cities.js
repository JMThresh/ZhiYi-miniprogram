import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCities();
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

    console.log(data);
    this.setData({
      cities: data
    })
  },
  // 处理input输入事件
  handleInput(){
    
  },
  // 处理提交按钮事件
  handleTap(){

  }
})