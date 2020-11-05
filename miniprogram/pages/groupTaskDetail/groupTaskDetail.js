// pages/groupTaskDetail/groupTaskDetail.js
// 查看群任务，是首页进去的那个
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
  },
  
  //开关，是否完成
  taskIsFinish(e){
    this.setData({
      isFinish:!this.data.isFinish
    })
  },
  
  //点击确定*
  finish(){
    const that = this
    const ui = wx.getStorageSync('userinfo')
    var task = that.data.task
    // 文字合法
    if (!this.textcheck(that.data.taskname)){
      wx.showModal({
        showCancel: false,
        title : '您的任务或项目名有不合法信息'
      })
    }
    // 如果是已完成
    else if(that.data.isFinish){
      wx.showModal({
        title:"请问你是否确定已经完成该任务",
        success(res){
          if (res.confirm){
            wx.showLoading({
              title: '加载中',
              mask:true
            })
            // 传入数据库
            wx.cloud.callFunction({
              name:"GroupTaskFinish",
              data:{
                ui:ui,
                fGroupNum:task.fGroupNum,
                fNum:task.fNum
              }
            }).then(res=>{
              console.log(res)
              wx.hideLoading()
              wx.navigateBack()
            })
          }
        }
      })
    }
  },
  textcheck(text){
    wx.cloud.callFunction({
      name:"msgSecurityCheck",
      data:{
        text:text
      },
      success(e){
        return true
      },
      fail(e){
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
    console.log(task)
    var ddl = task.fDeadline.split(' ')
    var warn = task.fWarnTime.split(' ')
    // 这里没有写isFinish，因为进来的都没完成任务
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