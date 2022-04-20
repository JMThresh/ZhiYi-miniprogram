import { request } from "../../request/index.js";
import { getSetting, authorize, getLocation, showToast } from "../../utils/asyncWx";
var QQMapWX = require("../../lib/qqmap-wx-jssdk.js");
var qqmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: {
      province:"",
      city:""
    },
    to: {
      province:"",
      city:""
    }
  },

  onLoad(){
    // 读取本地城市缓存
    let city = wx.getStorageSync("city");
    let address = wx.getStorageSync("address");
    if(address){
      this.setData({
        from: address
      })
    }
    // console.log("onLoad");
  },
  async onShow(){
    let {address} = app.globalData;
    let {isFrom} = app.globalData;
    let {update_enable} = app.globalData;

    // console.log("travel:onShow()");
    // console.log(address);
    // console.log(isFrom);
    // console.log(update_enable);
    // 确认是否更新
    if(update_enable){
      // 判断要更新的是始发地还是目的地
      if(isFrom){   // 若更新的是始发地
        // 如果始发地不为空且原始发城市与新的目的城市相同，则提示用户
        if(address.city === this.data.to.city){     
          await showToast({title:"始发地和目的地不能相同！"});
        }else{
          this.setData({
            from: address
          })
        }
      }else{  //若更新的是目的地
        // 如果目的地不为空且原目的城市与新的始发城市相同，则提示用户
        if(address.city === this.data.from.city){
          await showToast({title:"目的地和始发地不能相同！"});
        }else{
          this.setData({
            to: address
          })
        }
      }

      // 更新数据后，关闭更新，防止用户退出cities页面时被误认为选择了某城市而误更新
      app.globalData.update_enable = false;
    }


  },
  // 交换始发地和目的地
  handleExchange(){
    let from = this.data.to;
    let to = this.data.from;
    this.setData({
      from,
      to
    })
  },

  async handleTap(){
    // let params = {
    //   url: "https://vt.sm.cn/api/QuarkGo/getHomeData",
    //   fromp: this.data.from.province,
    //   fromc: this.data.from.city,
    //   top: this.data.to.province,
    //   toc: this.data.to.city
    // }
    // let res = await request(params);
    // console.log(res.data.data);


    let params = {
      url: "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5",
      dataType: "json",
    }
    let res = await request(params);
    let data = JSON.parse(res.data.data);
    console.log(data);

    
  }

})