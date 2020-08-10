// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 用户表中的fGroup
  var UserGroup = event.fGroup
  //所有加入群的群号
  var allGroupNum = []
  //group表里的群
  var fGroup = []
  for (let i=0;i<UserGroup.length;i++){
    allGroupNum.push(UserGroup[i].fGroupNum)
  }
  for (let i = 0;i<allGroupNum.length;i++){
    let fGroupNum = allGroupNum[i]
    var res = await db.collection("t_group").where({
      fGroupNum:fGroupNum
    }).get()
    fGroup.push(res.data[0])
  }
  return fGroup
}