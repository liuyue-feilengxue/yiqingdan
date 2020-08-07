// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = await cloud.getWXContext()
  var openid = wxContext.OPENID
  let dt = await db.collection("t_task").where({
    openid:openid,
    fFinish:false
  }).get()

  var e = new Date()
  let year = e.getFullYear()
  let month = e.getMonth() + 1
  let date = e.getDate()
  let hour = e.getHours()+8
  let min = e.getMinutes()
  var now = year + "-" + (month > 9 ? month : "0" + month) + "-" + (date > 9 ? date : "0" + date)
  +" "+ (hour > 9 ? hour : "0" + hour) + ":" + (min > 9 ? min : "0" + min)

  for(var i=0;i<dt.data.length;i++){
    if (now == dt.data[i].fWarnTime){
      const res = await cloud.callFunction({
        name:"subscribeMessage",
        data:{
          openid:wxContext.OPENID,
          templateId:"n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ",
          taskname:dt.data[i].fTask,
          ddl:dt.data[i].fDeadline
        }
      })
      return res
    }
  }
  return now
}