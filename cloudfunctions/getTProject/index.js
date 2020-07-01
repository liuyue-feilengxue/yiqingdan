// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var projectname = event.projectname
  return await{
    openid: wxContext.OPENID,
    projectname:db.collection("t_project").where({
      fProject:projectname
    }).get()
  }
}