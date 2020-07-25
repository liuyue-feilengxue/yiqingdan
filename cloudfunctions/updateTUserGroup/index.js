// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var userInfo = event.userInfo
  var fGroup = event.fGroup
  return await db.collection("t_user").where({
    _openid:userInfo.openid
  }).update({
    data:{
      fGroup:fGroup
    }
  })
}