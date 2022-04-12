import { request } from "../../request/index.js";
import { getSetting, authorize, getLocation } from "../../utils/asyncWx";
// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require("../../lib/qqmap-wx-jssdk.js");
var qqmapsdk;
Page({
  data: {
    city: "",           // 用户所在城市
    time: "04-12 14:53", // 疫情数据更新时间
    countryEpidemicData: [],
    cityEpidemicData: [],   // 城市的疫情数据

  },
  // 页面第一次加载时调用
  onLoad() {
    // 定义腾讯地图SDK的调用变量
    qqmapsdk = new QQMapWX({
      key: '26QBZ-XRJ6K-A6UJE-APXPY-MHSBS-5UBGO'
    })

    // 判断有没有city的缓存
    let city = wx.getStorageSync("city");
    if(!city){
      this.setCity();
    }
  },

  // 显示页面就调用
  onShow: function(){

    
  },

  // 获取地理位置的授权，得到经纬度，再逆地址解析得到所在城市
  async setCity(){
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    let authSetting = await getSetting();
    if(!authSetting['scope.userLocation']){
      await authorize({name:'scope.userLocation'});
      let result = await getLocation();
      let {location} = {latitude:result.latitude,longitude:result.longitude};

      // 调用接口
      qqmapsdk.reverseGeocoder({
        location,
        success:(res)=>{
          let city = res.result.ad_info.city.replace('市','');
          this.setData({
            city
          });
          // 设置city的缓存
          wx.setStorageSync("city",city);
        },
        fail:(res)=>{
          console.log(res);
        }
      })
    }
  },







  // 发起请求获取实时疫情信息
  async bindMyTap(e) {

    let params = {
      url: "https://m.sm.cn/api/rest",
      format: "json",
      method: "Huoshenshan.ncov2022",
      type: "latest",
      news_type: "ncp",
      city: this.data.city,
      uc_param_str: "dsdnfrpfbivesscpgimibtbmnijblaupogpintnwktprchmtut"
    };
    let result = await request({url:"https://m.sm.cn/api/rest",data:params});
    console.log(result);
  }

})