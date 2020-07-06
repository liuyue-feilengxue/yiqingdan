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
    var index = e.currentTarget.dataset.index
    const that = this
    // console.log(this.data.finishtasks[index])
    wx.showModal({
      title:'该任务是否尚未完成',
      success(res){
        if (res.confirm){
          // 总队列里的位置
          var i = that.data.finishtasks[index].index
          var project = that.data.project
          project.fFinish[i] = false
          that.setData({
            project:project
          })
          that.refresh(project)
          // console.log(that.data.project)
        }
      }
    })
  },
  //未完成的任务修改
  UnFinishTask(e){
    var index = e.currentTarget.dataset.index
    const that = this
    // console.log(this.data.unfinishtasks[index])
    wx.showModal({
      title:'该任务是否完成',
      success(res){
        if (res.confirm){
          // 总队列里的位置
          var i = that.data.unfinishtasks[index].index
          var project = that.data.project
          project.fFinish[i] = true
          that.setData({
            project:project
          })
          that.refresh(project)
          // console.log(that.data.project)
        }
      }
    })
    // var taskjson = JSON.stringify(this.data.unfinishtasks[index])
    // wx.navigateTo({
    //   url: '/pages/projectTaskDetail/projectTaskDetail?taskjson=' + taskjson+'&index='+index+'&father=unfinish',
    // })
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
  //刷新
  refresh(project){
    //未完成任务
    var unfinishtasks = []
    //完成任务
    var finishtasks = []
    //把项目内的任务分为完成与未完成
    for (var i=0;i<project.fTask.length;i++){
      //如果未完成
      if (project.fFinish[i]==false){
        var obj = {}
        obj['fDeadline'] = project.fDeadline[i]
        obj['fFinish'] = project.fFinish[i]
        obj['fTask'] = project.fTask[i]
        obj['fWarnTime'] = project.fWarnTime[i]
        //加一个编号
        obj['index'] = i
        unfinishtasks.push(obj)
      }
      //完成
      else{
        var obj = {}
        obj['fDeadline'] = project.fDeadline[i]
        obj['fFinish'] = project.fFinish[i]
        obj['fTask'] = project.fTask[i]
        obj['fWarnTime'] = project.fWarnTime[i]
        obj['index'] = i
        finishtasks.push(obj)
      }
    }
    console.log(finishtasks)
    console.log(unfinishtasks)
    //没有 完成任务的
    if (finishtasks.length==0){
      this.setData({
        allfinish : false
      })
    }
    //没有 没完成任务
    else if (unfinishtasks.length==0){
      this.setData({
        allunfinish : false
      })
    }
    //存数据
    this.setData({
      projectname:project.fProject,
      finishtasks:finishtasks,
      unfinishtasks:unfinishtasks,
      project:project
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var project = JSON.parse(options.alljson)
    this.refresh(project)
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