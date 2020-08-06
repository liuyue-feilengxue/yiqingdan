// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var templateId = event.templateId
  var taskname = event.taskname
  var ddl = event.ddl

  try{
    const result = await cloud.openapi.subscribeMessage.send({
      touser:openid,
      miniprogramState:"developer",
      templateId:templateId,
      data:{
        "thing1":{
          "value":taskname
        },
        "time2":{
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