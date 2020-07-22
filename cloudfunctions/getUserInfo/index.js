// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //从前端页面传递userInfo，看看在不在数据库中
  var userInfo = event.userInfo;
  return await db.collection("t_user").where({
    _openid:userInfo.openid
  }).get()
}