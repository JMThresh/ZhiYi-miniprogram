import { getSetting, authorize, getLocation } from "../../utils/asyncWx";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: ""
  },

  onLoad(){
    let city = wx.getStorageSync("city");
    if(!city){
      this.setCity();
    }
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

  handleInput(e){
    console.log(e);
  }

})