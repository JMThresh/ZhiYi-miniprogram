import {
  request
} from "../../request/index.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresses: [],
    isFrom: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log("cities:onLoad");
    try {
      // 注意! 因为页面参数是字符串形式，所以这里需要将字符串转成布尔值  使用JSON.parse()转换，true和false必须小写
      let isFrom = JSON.parse(options.isFrom);
      this.setData({
        isFrom
      })
    } catch (err) {
      // console.log(err);
    }
    this.getAddresses();
  },

  onShow() {
    // console.log("cities:onShow");
  },


  async getAddresses() {
    let url = "https://vt.sm.cn/api/QuarkSubscriptionCity/getAllCityV3";
    let {
      data
    } = await request({
      url: url
    });
    data = data.data;
    // data.forEach((v,i) => {
    //   v['id'] = i;
    // })

    // 遍历请求得到的城市列表数组，使结构能用
    data.forEach((v, i) => {
      Object.keys(v).forEach((key) => {
        v['title'] = key;
      })
      // 第一层：对每项增加id索引和cities数组
      v['id'] = i
      v['cities'] = []
      // 第二层：对v[v.title]遍历，将其中的省份和城市信息作为一个对象添加到cities数组中
      // 如果title是热门城市，则单独更正province，否则正常push
      if (v.title === "热门城市") {
        v[v.title].forEach(k => {
          switch (k) {
            case "北京":
              v.cities.push({
                province: "北京",
                city: "北京"
              })
              break;
            case "广州":
              v.cities.push({
                province: "广东",
                city: "广州"
              });
              break;
            case "上海":
              v.cities.push({
                province: "上海",
                city: "上海"
              });
              break;
            case "深圳":
              v.cities.push({
                province: "广东",
                city: "深圳"
              });
              break;
            case "吉林":
              v.cities.push({
                province: "吉林",
                city: "吉林"
              });
              break;
            case "长春":
              v.cities.push({
                province: "吉林",
                city: "长春"
              });
              break;
            case "天津":
              v.cities.push({
                province: "天津",
                city: "天津"
              });
              break;
            case "泉州":
              v.cities.push({
                province: "福建",
                city: "泉州"
              });
              break;
            default:
              console(k+"不会还有吧？");
          }
        })
      }else{
        v[v.title].forEach((c, j) => {
          v['cities'].push({
            // id: j,
            province: v['title'],
            city: c,
          })
        })
      }
    });


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

    // let addresses = [
    //   {
    //     id: 0,
    //     title: "热门城市",
    //     cities: [
    //       {
    //         id: 0,
    //         province: "辽宁",
    //         city: "大连"
    //       },
    //       {}
    //     ]
    //   },
    //   {}
    // ]

    // console.log(data);
    
    this.setData({
      addresses: data
    })
  },
  // 处理input输入事件
  handleInput() {

  },
  // 处理提交按钮事件
  handleTap() {

  },
  // 处理选中城市之后的返回事件
  handleBack(e) {
    // 因为switchTab不能带页面参数，故将页面相关信息存入app.js的全局变量中
    app.globalData.isFrom = this.data.isFrom;
    app.globalData.address = e.currentTarget.dataset.address;
    // 更新全局变量，通知travel，使travel可更新
    app.globalData.update_enable = true;

    wx.switchTab({
      url: "/pages/travel/travel"
    });
  }
})