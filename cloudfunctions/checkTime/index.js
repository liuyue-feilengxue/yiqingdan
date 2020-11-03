// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //现在时间
  var e = new Date()
  let year = e.getFullYear()
  let month = e.getMonth() + 1
  let date = e.getDate()
  let hour = e.getHours()+8
  let min = e.getMinutes()
  var now = year + "-" + (month > 9 ? month : "0" + month) + "-" + (date > 9 ? date : "0" + date)
  +" "+ (hour > 9 ? hour : "0" + hour) + ":" + (min > 9 ? min : "0" + min)

  // 用户表
  var userdata = db.collection("t_user").get();
  var user = (await userdata).data
  // 任务表（已经改为筛选成是现在的任务）
  var dt = db.collection("t_task").where({
    fFinish:false,
    fWarnTime:now
  }).get()
  //所有没完成的任务
  var task = (await dt).data
  // 群组表（已经改为筛选成是现在的任务的群）
  var groupdata = db.collection("t_group").where({
    fTask:_.elemMatch({
      fWarnTime:_.eq(now),
    })
  }).get();
  var group = (await groupdata).data

  for (let i=0;i<user.length;i++){
    var openid = user[i]._openid
    var fGroup = user[i].fGroup
    // 这个用户的任务
    var thisUserTask = []
    // 将任务表的任务放进去
    for (let j = 0;j<task.length;j++){
      if (task[j]._openid == openid){
        thisUserTask.push(task[j])
      }
    }
    // 将群组里的群任务放进去
    for (let j=0;j<fGroup.length;j++){
      // 找群
      for (let k=0;k<group.length;k++){
        if (fGroup[j].fGroupNum == group[k].fGroupNum){
          // 该群的所有任务
          var grouptasks = group[k].fTask
          for (let l=0;l<grouptasks.length;l++){
            // 如果完成名单有本用户，就继续下一个任务
            // return grouptasks.fTask.find(item=>item.fFinish)
            if (grouptasks[l].fWarnTime == now){
              grouptasks[l]["fTask"] = grouptasks[l].fTaskname
              thisUserTask.push(grouptasks[l])
            }
          }
          break
        }
      }
    }

    // 发通知
    for (let j = 0;j<thisUserTask.length;j++){
      if (now == thisUserTask[j].fWarnTime){
        await cloud.callFunction({
          name:"subscribeMessage",
          data:{
            openid:openid,
            templateId:"n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ",
            taskname:thisUserTask[j].fTask,
            ddl:thisUserTask[j].fDeadline
          }
        })
      }
    }
  }
}