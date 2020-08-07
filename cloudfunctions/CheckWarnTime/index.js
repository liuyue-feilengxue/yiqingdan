// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext =  cloud.getWXContext()
  var openid = wxContext.OPENID

  var dt = db.collection("t_task").where({
    openid:openid,
    fFinish:false
  }).get()
  
  return dt.data
  var e = new Date()
  let year = e.getFullYear()
  let month = e.getMonth() + 1
  let date = e.getDate()

}