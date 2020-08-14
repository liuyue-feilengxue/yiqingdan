// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 群号
  var fGroupNum = event.fGroupNum
  // 任务号
  var fNum = event.fNum
  // 完成情况
  var finish = event.finish
  var groupres = cloud.callFunction({
    name:"getTGroup",
    data:{
      fGroupNum:fGroupNum
    }
  })

  var fGroup = (await groupres).result.data[0]

  for (let i=0;i<fGroup.fTask.length;i++){
    // 任务编号一样，完成情况就改成传入的数据
    if (fGroup.fTask[i].fNum == fNum){
      fGroup.fTask[i].fFinish = finish
    }
  }
  return await db.collection("t_group").where({
    fGroupNum:fGroupNum
  }).update({
    data:{
      fTask:fGroup.fTask
    }
  })
}