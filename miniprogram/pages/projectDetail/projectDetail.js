// pages/projectDetail/projectDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allunfinish:true,
    allfinish:true,
    //整个项目
    project:{},
    //项目名
    projectname:'',
    //未完成任务
    unfinishtasks:[],
    //完成任务
    finishtasks:[],
  },
  //修改项目名
  projectinput(e){
    this.setData({
      projectname:e.detail.value
    })
  },
  //完成的任务修改（想搞一个projectTaskDetail）*
  FinishTask(e){

  },
  //未完成的任务修改*
  UnFinishTask(e){
    var index = e.currentTarget.dataset.index
    console.log(this.data.unfinishtasks[index])
    var taskjson = JSON.stringify(this.data.unfinishtasks[index])
    wx.navigateTo({
      url: '/pages/projectTaskDetail/projectTaskDetail?taskjson=' + taskjson+'index='+index,
    })
  },
  //删除项目
  delete(){
    const that = this
    wx.showModal({
      title:"是否确定要删除该项目",
      success(res){
        if (res.confirm){
          var project = that.data.project
          db.collection("t_project").doc(project._id).remove().then(res=>{
            wx.navigateBack()
          })
        }
      }
    })
  },
  //确定*
  finish(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var project = JSON.parse(options.alljson)
    //未完成任务
    var unfinishtasks = []
    //完成任务
    var finishtasks = []
    console.log(project)
    //把项目内的任务分为完成与未完成
    for (var i=0;i<project.fTask.length;i++){
      //如果未完成
      if (project.fFinish[i]==false){
        var obj = {}
        obj['fDeadline'] = project.fDeadline[i]
        obj['fFinish'] = project.fFinish[i]
        obj['fTask'] = project.fTask[i]
        obj['fWarnTime'] = project.fWarnTime[i]
        unfinishtasks.push(obj)
      }
      //完成
      else{
        var obj = {}
        obj['fDeadline'] = project.fDeadline[i]
        obj['fFinish'] = project.fFinish[i]
        obj['fTask'] = project.fTask[i]
        obj['fWarnTime'] = project.fWarnTime[i]
        finishtasks.push(obj)
      }
    }
    //没有 完成任务的
    if (finishtasks.length==0){
      this.setData({
        allfinish : false
      })
    }
    //没有 没完成任务
    else if (finishtasks.length==0){
      this.setData({
        allunfinish : false
      })
    }
    this.setData({
      projectname:project.fProject,
      finishtasks:finishtasks,
      unfinishtasks:unfinishtasks,
      project:project
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})