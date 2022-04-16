// pages/travel/travel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexTabs: [            // tabs标题及内容
      {
        value: "全国疫情",
        id: 1,
        isActive: true
      },
      {
        value: "大连",
        id: 2,
        isActive: false
      }
    ]
  },

  //  处理Tabs点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { indexTabs } = this.data;
    indexTabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      indexTabs
    })
  }

})