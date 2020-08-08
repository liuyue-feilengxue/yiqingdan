// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  var userdata = db.collection("t_user").get();
  var user = (await userdata).data
  var dt = await db.collection("t_task").where({
    fFinish:false
  }).get()
  //所有没完成的任务
  var task = dt.data
  //现在时间
  var e = new Date()
  let year = e.getFullYear()
  let month = e.getMonth() + 1
  let date = e.getDate()
  let hour = e.getHours()+8
  let min = e.getMinutes()
  var now = year + "-" + (month > 9 ? month : "0" + month) + "-" + (date > 9 ? date : "0" + date)
  +" "+ (hour > 9 ? hour : "0" + hour) + ":" + (min > 9 ? min : "0" + min)

  return sendMessage(user,0,task);

  //递归方式给用户发消息
  function sendMessage(user,i,task){
    var openid = user[i]._openid
    //这个用户的任务
    var thisUserTask = []
    for (let j = 0;j<task.length;j++){
      if (task[j]._openid == openid){
        thisUserTask.push(task[j])
      }
    }
    for(let j=0;j<thisUserTask.length;j++){
      if (now == thisUserTask[j].fWarnTime){
        // const res = await cloud.callFunction({
        //   name:"subscribeMessage",
        //   data:{
        //     openid:openid,
        //     templateId:"n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ",
        //     taskname:thisUserTask[j].fTask,
        //     ddl:thisUserTask[j].fDeadline
        //   }
        // })
        // return res
        return send(openid,thisUserTask[j])
      }
    }
    return now
  }

  function send (openid,thisUserTask){
    const res = await cloud.callFunction({
      name:"subscribeMessage",
      data:{
        openid:openid,
        templateId:"n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ",
        taskname:thisUserTask.fTask,
        ddl:thisUserTask.fDeadline
      }
    })
    return res
  }
}

// ,
//   "triggers": [
//     {
//       "name": "checkTime",
//       "type": "timer",
//       "config": "0 */1 * * * * *"
//     }
//   ]