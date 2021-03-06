// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var fGroupNum = event.fGroupNum
  var fTask = event.fTask
  return await db.collection("t_group").where({
    fGroupNum:fGroupNum
  }).update({
    data:{
      fTask:fTask
    }
  })
}