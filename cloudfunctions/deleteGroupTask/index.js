// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const fNum = event.fNum
  const fGroupNum = event.fGroupNum
  var res = db.collection("t_group").where({
    fGroupNum : fGroupNum
  }).get()
  var fGroup = (await res).data[0]
  var fTask = fGroup.fTask

  for (let i=0;i<fTask.length;i++){
    // 任务编号一样
    if (fTask[i].fNum == fNum){
      fTask.splice(i,1)
      break
    }
  }
  return cloud.callFunction({
    name:"updateGroupTask",
    data:{
      fGroupNum:fGroupNum,
      fTask:fTask
    }
  })
}