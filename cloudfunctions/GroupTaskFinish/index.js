// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
// 用于个人完成了群任务以后
exports.main = async (event, context) => {
  // 群号
  var fGroupNum = event.fGroupNum
  // 任务编号
  var fNum = event.fNum
  // 用户ui
  var ui = event.ui
  var groupres = cloud.callFunction({
    name:"getTGroup",
    data:{
      fGroupNum:fGroupNum
    }
  })

  var fGroup = (await groupres).result.data[0]
  // 加一道保险
  var flag = false
  for (let i=0;i<fGroup.fTask.length;i++){
    // 任务编号一样
    if (fGroup.fTask[i].fNum == fNum){
      fGroup.fTask[i].fFinish.push(ui)
      flag = true
    }
  }

  if (flag){
    return await db.collection("t_group").where({
      fGroupNum:fGroupNum
    }).update({
      data:{
        fTask:fGroup.fTask
      }
    })
  }
}