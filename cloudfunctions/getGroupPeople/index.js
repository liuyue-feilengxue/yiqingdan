// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ =db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const fGroup = event.fGroup
  //群成员fgroup数组
  var UserfGroup = []
  for(var i = 0;i < fGroup.fMember.length;i++){
    
  }
  return await db.collection('t_user').where({
    userInfo:fGroup.fMember[i]
  }).get()
}
