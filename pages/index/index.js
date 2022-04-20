import { request } from "../../request/index.js";
import { getSetting, authorize, getLocation } from "../../utils/asyncWx";
// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require("../../lib/qqmap-wx-jssdk.js");
var qqmapsdk;

Page({
  data: {
    address: {
      province: "",
      city: ""
    },
    city: "",                   // 用户所在城市
    endTime: "",                // 疫情数据更新时间
    countryEpidemicData: {},    // 全国疫情数据
    citiesEpidemicData: [],     // 城市的疫情数据
    cityData: {},               // 本地城市数据
    nearbyTopCity: {},          // 附近主要城市数据(包括省)
    image_src: "https://pic.imgdb.cn/item/625d40b4239250f7c540e50b.jpg"
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
    }else{
      this.setData({
        city
      })
    }
    // this.getEpidemicInformation();
  },

  // 显示页面就调用
  onShow: function(){
    this.getEpidemicInformation();    
  },

  // 获取地理位置的授权，得到经纬度，再逆地址解析得到所在城市
  async setCity(){
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    let authSetting = await getSetting();
    if(!authSetting['scope.userLocation']){
      try{
        // 询问用户是否授予权限，拒绝则抛出异常进入catch
        await authorize({name:'scope.userLocation'});
        let result = await getLocation();
        let {location} = {latitude:result.latitude,longitude:result.longitude};
        
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location,
          success:(res)=>{
            console.log(res);
            let city = res.result.ad_info.city.replace('市','');
            let province = res.result.ad_info.province.replace('省','');
            let address = {
              province,
              city
            }
            this.setData({
              address,
              city
            });
            // 设置city的缓存
            wx.setStorageSync("city",city);
            wx.setStorageSync("address",address);
          },
          fail:(res)=>{
            console.log(res);
          }
        })
      }catch(err){
        // console.log(err);
      }
    }
  },

  // 发起请求获取实时疫情信息
  async getEpidemicInformation() {

    let params = {
      url: "https://m.sm.cn/api/rest",
      format: "json",
      method: "Huoshenshan.ncov2022",
      type: "latest",
      news_type: "ncp",
      city: this.data.city,
      uc_param_str: "dsdnfrpfbivesscpgimibtbmnijblaupogpintnwktprchmtut"
    };
    let {data} = await request({url:"https://m.sm.cn/api/rest",data:params});

    // 存入各城市的疫情数据
    let {chinaTopCity} = data;
    let citiesEpidemicData = [];
    chinaTopCity.forEach((result,i) => {
      citiesEpidemicData.push({
        id: i,
        city : result.city,
        danger : result.danger,
        isLocal : result.isLocal,
        province : result.province.replace('省','').replace('自治区',''),
        isMunicipality : result.city === result.province ? true : false,
        present : result.present,
        sure_new_hid : result.sure_new_hid,
        sure_new_loc : result.sure_new_loc,
      })
    })

    // 存入本地附近主要城市的疫情数据
    let nearbyTopCities = data.nearbyTopCity;
    let nearbyTopCity = [];
    nearbyTopCities.forEach((result,i) => {
      nearbyTopCity.push({
        id: i,
        city : result.city,
        danger : result.danger,
        isLocal : result.isLocal,
        province : result.province.replace('省','').replace('自治区',''),
        isMunicipality : result.city === result.province ? true : false,
        present : result.present,
        sure_new_hid : result.sure_new_hid,
        sure_new_loc : result.sure_new_loc,
      })
    })
    // 存入本地城市的疫情数据
    let {cityData} = data;
    let city = cityData.city;
    
    // 存入本地所在省的数据
    let {provinceData} = data;
    nearbyTopCity.unshift({
      id: nearbyTopCity.length,
      city : "全省",
      danger : provinceData.danger,
      isMunicipality : true,
      present : provinceData.present,
      sure_new_hid : provinceData.sure_new_hid,
      sure_new_loc : provinceData.sure_new_loc
    });
    // 存入全国疫情数据
    let {contryData} = data;
    let countryEpidemicData = {
      danger: contryData.danger,
      local_sure_cnt_incr: contryData.local_sure_cnt_incr,
      yst_sure_hid: contryData.yst_sure_hid,
      rest_sure_cnt: contryData.rest_sure_cnt,
    };
    let {endTime} = contryData;

    this.setData({
      countryEpidemicData,
      endTime,
      citiesEpidemicData,
      cityData,
      city,
      nearbyTopCity,
    })
  }

})