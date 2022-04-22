// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  switch (event.action) {
    case "styles": {
      return getStyles(event)
    }
    case "swiperList": {
      return getSwiperList(event)
    }
    case "indexTabs": {
      return getIndexTabs(event)
    }
    case "noticeList": {
      return getNoticeList(event)
    }
    default:{
      return
    }
  }
}


async function getStyles(event) {
  return await db.collection('styles').get()
}
async function getSwiperList(event) {
  return await db.collection('swiperList').where({
    name: 'swiperList_item'
  }).get()
}
async function getIndexTabs(event) {
  return await db.collection('indexTabs').get()
}
async function getNoticeList(event) {
  return await db.collection('noticeList')
  .orderBy('time','desc') //按日期降序排列
  .get()
}