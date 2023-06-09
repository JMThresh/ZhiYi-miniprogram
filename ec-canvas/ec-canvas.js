import WxCanvas from './wx-canvas';
import * as echarts from './echarts';

let ctx;

Component({
  properties: {
    canvasId: {
      type: String,
      value: 'ec-canvas'
    },
    ec: {
      type: Object
    }
  },

  data: {
    // 新增数据
    seriesData:'',
    visable:false
  },

  ready: function () {
    if (!this.data.ec) {
      console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
        + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
      return;
    }

    if (!this.data.ec.lazyLoad) {
      this.init();
    }
  },

  methods: {
    setVisable(flag){
      this.setData({
        visable:flag
      })
    },
    // 设置地图信息
    setSeriesData:function(data){
      this.seriesData = data
    },
    // 渲染页面
    init: function (callback) {
      const version = wx.version.version.split('.').map(n => parseInt(n, 10));
      const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9)
        || (version[0] === 1 && version[1] === 9 && version[2] >= 91);
      if (!isValid) {
        console.error('微信基础库版本过低，需大于等于 1.9.91。'
          + '参见：https://github.com/ecomfe/echarts-for-weixin'
          + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
        return;
      }

      ctx = wx.createCanvasContext(this.data.canvasId, this);

      const canvas = new WxCanvas(ctx, this.data.canvasId);
      // 绘制
      echarts.setCanvasCreator(() => {
        return canvas;
      });
      var query = wx.createSelectorQuery().in(this);
      query.select('.ec-canvas').boundingClientRect(res => {
        if (typeof callback === 'function') {
          this.chart = callback(canvas, res.width, res.height, this.seriesData);
        }
        else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
          // 主要是这里修改了参数
          this.chart = this.data.ec.onInit(canvas, res.width, res.height,this.seriesData);
        }
        else {
          this.triggerEvent('init', {
            canvas: canvas,
            width: res.width,
            height: res.height,
            seriesData:this.seriesData
          });
        }
      }).exec();
    },

    canvasToTempFilePath(opt) {
      if (!opt.canvasId) {
        opt.canvasId = this.data.canvasId;
      }

      ctx.draw(true, () => {
        wx.canvasToTempFilePath(opt, this);
      });
    },

    touchStart(e) {
      try{
        if (this.chart && e.touches.length > 0) {
          var touch = e.touches[0];
          var handler = this.chart.getZr().handler;
          handler.dispatch('mousedown', {
            zrX: touch.x,
            zrY: touch.y
          });
          handler.dispatch('mousemove', {
            zrX: touch.x,
            zrY: touch.y
          });
          handler.processGesture(wrapTouch(e), 'start');
        }
      }catch(err){
        // console.log(err);
      }
    },

    touchMove(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        var handler = this.chart.getZr().handler;
        handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.processGesture(wrapTouch(e), 'change');
      }
    },

    touchEnd(e) {
      try{
        if (this.chart) {
          const touch = e.changedTouches ? e.changedTouches[0] : {};
          var handler = this.chart.getZr().handler;
          handler.dispatch('mouseup', {
            zrX: touch.x,
            zrY: touch.y
          });
          handler.dispatch('click', {
            zrX: touch.x,
            zrY: touch.y
          });
          handler.processGesture(wrapTouch(e), 'end');
        }
      }catch(err){
        // console.log(err);
      }
    }
  }
});

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}
