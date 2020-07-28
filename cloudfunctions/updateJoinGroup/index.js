// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  var fGroup = event.fGroup
  var userInfo = event.userInfo
  return await db.collection("t_user").where({
    userInfo:userInfo
  }).update({
    data:{
      fGroup:fGroup
    }
  })
}