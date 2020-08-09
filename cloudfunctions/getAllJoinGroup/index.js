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
    var res =await cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:allGroupNum[i]
      }
    })
    fGroup.push(res.result.data[0])
  }
  return fGroup
}