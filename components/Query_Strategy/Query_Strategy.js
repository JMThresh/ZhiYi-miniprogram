// components/Query_Strategy/Query_Strategy.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    from: {
      province: String,
      city: String
    },
    to: {
      province: String,
      city: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleExchange(){
      let from = this.properties.to.city;
      let to = this.properties.from.city;
      let data = {
        from : this.properties.to.city,
        to : this.properties.from.city
      }
      // 自定义父组件触发的事件
      this.triggerEvent("addressExchange",{from,to});
    }
  }
})
