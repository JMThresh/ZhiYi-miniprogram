import {request} from "../../request/index.js";
import * as echarts from '../../ec-canvas/echarts';
import geoJson from '../../js/mapData-old';
// import geoJson from '../../js/mapData-henan.js';

const app = getApp();

async function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });

  let data = await getData();

  canvas.setChart(chart);

  echarts.registerMap('china', geoJson);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: function (obj) {
        return `${obj.data.name} 确诊人数：${obj.data.value}`
      },
      textStyle: {
        fontWeight: 'bold',
        width: '30px'
      },
      position: function (point, dom, rect, size) {
        let windowWidth = wx.getSystemInfoSync().windowWidth
        if (point[0] > windowWidth / 2) {
          return [parseInt(point[0] - size.width), point[1]]
        } else {
          return [point[0], point[1]]
        }

      }
    },

    visualMap: {
      min: 0,
      max: 34000,
      // splitNumber: 5,
      top: "top",
      pieces: [{
          min: 5001
        }, // 不指定 max，表示 max 为无限大（Infinity）。
        {
          min: 3001,
          max: 5000
        },
        {
          min: 1001,
          max: 3000
        },
        {
          min: 101,
          max: 1000
        },
        {
          min: 11,
          max: 100
        },
        // {value: 123, label: '123（自定义特殊颜色）', color: 'grey'}, // 表示 value 等于 123 的情况。
        {
          max: 10
        } // 不指定 min，表示 min 为无限大（-Infinity）。
      ],
      color: [
        "#c0e3e4",
        "#92bfc7",
        "#639aa9",
        "#35768c",
        "#06516e"
      ].reverse(),
      textStyle: {
        color: "#000",
        fontSize: 12
      }
    },
    textStyle: {
      color: "#ecf7f7"
    },
    // toolbox: {
    //   show: true,
    //   orient: 'vertical',
    //   left: 'right',
    //   top: 'center',
    //   feature: {
    //     dataView: { readOnly: false },
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },

    // 系列：设为map地图
    series: [{
      type: "map",
      mapType: "china",
      // 图形上的文本标签
      label: {
        show: true,
        emphasis: {
          textStyle: {
            color: "#fff",
            fontSize: 8
          }
        },
        textStyle: {
          color: "#000",
          fontSize: 8
        },
        // formatter:function(value){
        //   console.log(value)
        //   if(value.value > 3000) {
        //     value.marker.style
        //   }
        // },
      },
      // 数据所在区域的所变星样式设置
      itemStyle: {
        normal: {
          borderColor: "#AAAAAA",
          areaColor: "#fff"
          //   fontSize:8,
        },
        emphasis: {
          areaColor: "#0000AA",
          borderWidth: 0
          //   fontSize:8,
        }
      },
      animation: false,

      data: data
    }],

  };

  chart.setOption(option);

  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onLoad() {
  },
});
// 获取各省份的疫情数据
async function getData() {
  try{
    let params = {
      url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
      // dataType: "json",
    };
    let res = await request(params);
    let data = res.data.data.diseaseh5Shelf;

    let newArr = [];
    if (data) {
      //获取到各个省份的数据
      let province = data.areaTree[0].children;
      province.forEach(v => {
        newArr.push({
          name: v.name,
          value: v.total.confirm
        })
      });
      // console.log(newArr);
      return newArr;
    } else {
      console.log("未获取到疫情数据data");
    }
  }catch(err){
    console.log(err);
  }
}