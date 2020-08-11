// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
// 用于个人完成了群任务以后
exports.main = async (event, context) => {
  // 群号
  var fGroupNum = event.fGroupNum
  // 任务编号
  var fNum = event.fNum
  // 用户ui
  var ui = event.ui
}