// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const fGroupNum = event.fGroupNum
  const fMember = event.fMember
  const fAdministrator = event.fAdministrator
  return await db.collection("t_group").where({
    fGroupNum : fGroupNum
  }).update({
    data:{
      fMember:fMember,
      fAdministrator:fAdministrator
    }
  })
}