const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const path = [
  {
    fileId: "cloud://enviro-3gpc2tf22b14c986.656e-enviro-3gpc2tf22b14c986-1304979033/payment/wechat.png",
    dbId:"79550af2604794000933e7e86074ac56"
  },
  {
    fileId: "cloud://enviro-3gpc2tf22b14c986.656e-enviro-3gpc2tf22b14c986-1304979033/payment/alipay.png",
    dbId:"28ee4e3e6048555709d955ef6bc05548"
  }
]
// 下载云存储图片
let downLoad = async(fileId) => {
    const res = await cloud.downloadFile({
        fileID: fileId, // 图片的File ID
    })
    const buffer = res.fileContent
    return buffer
}
// 把媒体文件上传到微信服务器
let upLoad = async(Buffer) => {
    return await cloud.openapi.customerServiceMessage.uploadTempMedia({
        type: 'image',
        media: {
            contentType: 'image/png',
            value: Buffer
        }
    })
}

// 云函数入口函数
exports.main = async (event, context) => {
  let Buffer = null;
  let media = null;
  
  for(i = 0;i<path.length;i++){
    Buffer = await downLoad(path[i].fileId);
    media = await upLoad(Buffer);
    db.collection('setConfig').doc(path[i].dbId).update({
      data:{
        value: media.mediaId
      }
    })
  }
  return media
}
