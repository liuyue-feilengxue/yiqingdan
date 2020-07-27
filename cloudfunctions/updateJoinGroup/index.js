// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //用户表的fGroup
  const fGroup = event.fGroup
  //根据用户表的群号搜索群组表的情况，如果有修改了（群名或者群头像），则将用户表的也改了
  for (var i = 0 ; i<fGroup.length;i++){
    var res = db.collection("t_group").where({
      fGroupNum:fGroup[i].fGroupNum
    }).get()
    var group = res
    console.log(group)
    return await group
    if ((fGroup[i].fGroupName != group.fGroupName) || (fGroup[i].fPicture != group.fPicture)){
      return await 1
    }
    else{
      return await 2
    }
  }
}