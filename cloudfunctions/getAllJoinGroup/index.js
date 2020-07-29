// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //用户表的fGroup
  const fGroup = event.fGroup
  var groupNum = []
  groupNum.push(fGroup.fGroupNum)
  //根据用户表的群号搜索群组表的情况，如果有修改了（群名或者群头像），则将用户表的也改了
  return await db.collection("t_group").where({
    tags:_.all(groupNum)
  }).get()
}