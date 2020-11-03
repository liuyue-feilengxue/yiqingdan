// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  //所有加入群的群号,用户表中的fGroup
  var allGroupNum = event.fGroup
  //group表里的群
  var fGroup = []
  var flag = false
  for (let i = 0;i<allGroupNum.length;i++){
    let fGroupNum = allGroupNum[i]
    var res = await db.collection("t_group").where({
      fGroupNum:fGroupNum
    }).get()
    if (res.data[0] == null){
      allGroupNum.splice(i,1)
      i--
      flag = true
    }
    else if (!isInGroup(res)){
      allGroupNum.splice(i,1)
      i--
      flag = true
    }
    else{
      fGroup.push(res.data[0])
    }
  }
  // 如果被踢或者群解散
  if (flag){
    await db.collection("t_user").where({
      _openid:_openid
    }).update({
      data:{
        fGroup:allGroupNum
      }
    })
  }
  return fGroup

  //如果在群里，就返回true，否则返回false
  function isInGroup(res){
    var group = res.data[0]
    const wxContext = cloud.getWXContext()
    const _openid = wxContext.OPENID
    for(var i=0;i<group.fMember.length;i++){
      if (group.fMember[i].openid == _openid){
        return true
      }
    }
    for (var i=0;i<group.fAdministrator.length;i++){
      if (group.fAdministrator[i].openid == _openid){
        return true
      }
    }
    return false
  }
}