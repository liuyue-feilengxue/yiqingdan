// pages/taskDetail/taskDetail.js
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
    //是否完成
    isFinish:false,
    _id:0
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
  //开关，是否完成
  taskIsFinish(e){
    this.setData({
      isFinish:!this.data.isFinish
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
    
    this.setData({
      ddl:this.data.ddldate+' '+this.data.ddltime,
      warn:this.data.warndate+' '+this.data.warntime,
    })
    console.log(that.data.taskname)
    // 文字合法
    if (!this.textcheck(that.data.taskname)){
      wx.showModal({
        showCancel: false,
        title : '您的任务或项目名有不合法信息'
      })
    }
    else{
      // 发送服务提醒
      wx.requestSubscribeMessage({
        tmplIds: ['n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ'],
        success(res){
          wx.setStorageSync('dateWarnKey', "n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ")
          var subId = "n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ"
          //传入数据库
          db.collection("t_task").doc(that.data._id).update({
            data:{
              fFinish:that.data.isFinish,
              fDeadline:that.data.ddl,
              fWarnTime:that.data.warn,
              fTask:that.data.taskname,
              fUrgency:that.data.value1,
            }
          }).then(res=>{
            console.log(res)
            wx.navigateBack()
          })
        }
      })
    }
  },
  //点击删除
  delete(){
    const that = this
    wx.showModal({
      title:"确定要删除本任务吗？",
      success(res){
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        if (res.confirm){
          db.collection("t_task").doc(that.data._id).remove().then(res=>{
            console.log(res)
            wx.hideLoading()
            wx.navigateBack()
          })
        }
      }
    }) 
  },
  // 文字检测
  textcheck(text){
    wx.cloud.callFunction({
      name:"msgSecurityCheck",
      data:{
        text:text
      },
      success(e){
        console.log(e)
        return true
      },
      fail(e){
        console.log(e)
        return false
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var task = JSON.parse(options.alljson)
    //把ddl和warn分开，分为date和time
    var ddl = task.fDeadline.split(' ')
    var warn = task.fWarnTime.split(' ')
    this.setData({
      task:task,
      ddl:task.fDeadline,
      warn:task.fWarnTime,
      value1:task.fUrgency,
      taskname:task.fTask,
      ddldate:ddl[0],
      ddltime:ddl[1],
      warndate:warn[0],
      warntime:warn[1],
      isFinish:task.fFinish,
      _id:task._id
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