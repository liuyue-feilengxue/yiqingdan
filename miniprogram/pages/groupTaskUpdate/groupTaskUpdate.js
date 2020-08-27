// pages/groupTaskUpdate/groupTaskUpdate.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{},
    ddldate: '2000-01-01',
    ddltime: '12:00',
    ddl:'',
    warndate: '2000-01-01',
    warntime: '12:00',
    warn:'',
    array1: ['高优先级', '中优先级', '低优先级','无优先级'],
    value1: 0,
    taskname:'',
    fGroupNum:-1
  },
  //taskname输入
  taskinput(e){
    this.setData({
      taskname:e.detail.value
    })
  },
  //获取日期更新（ddl与warn日期都在这）
  bindDateChange: function(e) {
    // console.log(e)
    if (e.target.dataset.name=='ddl'){
      this.setData({
        ddldate: e.detail.value
      })
    }
    else{
      this.setData({
        warndate: e.detail.value
      })
    }
    
  },
  //获取时间更新
  bindTimeChange: function(e) {
    if (e.target.dataset.name=='ddl'){
      this.setData({
        ddltime: e.detail.value
      })
    }
    else{
      this.setData({
        warntime: e.detail.value
      })
    }
  },
  // 前往完成列表
  toMemberList(){
    var taskjson = JSON.stringify(this.data.task)
    const that = this
    wx.navigateTo({
      url: '/pages/groupGroupTaskDetail/groupGroupTaskDetail?taskjson='+taskjson+
      '&fGroupNum='+that.data.fGroupNum,
    })
  },
  //修改优先级
  bindPicker1Change: function(e) {
    var value = Number(e.detail.value)
    this.setData({
        value1: value
    })
  },
  //点击确定
  finish(){
    const that = this
    var fNum = that.data.task.fNum
    var fGroupNum = that.data.fGroupNum
    var task = that.data.task
    this.setData({
      ddl:this.data.ddldate+' '+this.data.ddltime,
      warn:this.data.warndate+' '+this.data.warntime,
    })
    task.fDeadline = that.data.ddl
    task.fWarnTime = that.data.warn
    task.fUrgency = that.data.value1
    task.fTaskname = that.data.taskname
    wx.showModal({
      title:"请问是否确定需要更新群任务",
      success(res){
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
          })
          // 获取fTask
          wx.cloud.callFunction({
            name:"getTGroup",
            data:{
              fGroupNum:that.data.fGroupNum
            }
          }).then(res=>{
            var fTask = res.result.data[0].fTask
            for (let i=0;i<fTask.length;i++){
              // 是同一个任务
              if (fTask[i].fNum == fNum){
                fTask[i] = task
                break
              }
            }
            console.log(task)
            console.log(fTask)
            // 更新
            wx.cloud.callFunction({
              name:"updateGroupTask",
              data:{
                fGroupNum:fGroupNum,
                fTask:fTask
              }
            }).then(res=>{
              wx.hideLoading()
              wx.navigateBack()
            })
          })
        }
      }
    })
    
  },
  //点击删除
  delete(){
    const that = this
    var fGroupNum = that.data.fGroupNum
    var fNum = that.data.task.fNum
    wx.showModal({
      title:"确定要删除本任务吗？",
      success(res){
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          wx.cloud.callFunction({
            name:"deleteGroupTask",
            data:{
              fGroupNum:fGroupNum,
              fNum:fNum
            }
          }).then(res=>{
            wx.hideLoading()
            wx.navigateBack()
          })
        }
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var task = JSON.parse(options.taskjson)
    console.log(task.fNum)
    //把ddl和warn分开，分为date和time
    var ddl = task.fDeadline.split(' ')
    var warn = task.fWarnTime.split(' ')
    this.setData({
      task:task,
      ddl:task.fDeadline,
      warn:task.fWarnTime,
      value1:task.fUrgency,
      taskname:task.fTaskname,
      ddldate:ddl[0],
      ddltime:ddl[1],
      warndate:warn[0],
      warntime:warn[1],
      fGroupNum:Number(options.fGroupNum)
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