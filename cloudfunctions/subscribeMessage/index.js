// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var templateId = event.subId
  var taskname = event.taskname
  var ddl = event.ddl

  try{
    const result = await cloud.openapi.subscribeMessage.send({
      touser:openid,
      miniprogramState:"developer",
      templateId:"n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ",
      data:{
        "thing1.DATA":{
          "value":taskname
        },
        "time2.DATA":{
          "value":ddl
        }
      }
    })
    return result
  }
  catch (err) {
    return err
  }
}