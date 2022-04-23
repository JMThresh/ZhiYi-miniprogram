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
    case "dailyTips": {
      return getDailyTips(event)
    }
    case "indexImage": {
      return getIndexImage(event)
    }
    default:{
      return
    }
  }
}

async function getImageAndTips(event){

  let indexImage = await db.collection('dailyTips')
  .where({type: 'indexImage'})
  .get();
  let id = await db.collection('dailyTips')
  .where({type: 'tip'})
  .orderBy('time','desc')
  .get();

  return {indexImage,id}
}

async function getDailyTips(event){
  return await db.collection('dailyTips')
  .orderBy('time','desc')
  .get()
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