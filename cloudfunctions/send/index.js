// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  // 获取用户输入内容
  console.log(event);
  const { Content } = event
  const wxContext = cloud.getWXContext()

  // 业务逻辑
  try {

    switch (Content) {
      case '我要微信付款': {
        const media = await db.collection('setConfig').where({
          _id: '79550af2604794000933e7e86074ac56'
        }).get();
        const result = await cloud.openapi.customerServiceMessage.send({
          touser: wxContext.OPENID,
          msgtype: 'image',
          image: {
            mediaId: media.data[0].value,
          },
        })
        return result
      }
      case '我要支付宝付款': {
        const media = await db.collection('setConfig').where({
          _id: '28ee4e3e6048555709d955ef6bc05548'
        }).get();
        const result = await cloud.openapi.customerServiceMessage.send({
          touser: wxContext.OPENID,
          msgtype: 'image',
          image: {
            mediaId: media.data[0].value,
          },
        })
        return result
      }
      default: {
        await cloud.openapi.customerServiceMessage.send({
          touser: wxContext.OPENID,
          msgtype: 'text',
          text: {
            content: '请输入“我要微信付款”或“我要支付宝付款”'
          }
        })
      }
        break;
    }

  } catch (err) {
    return err
  }
}