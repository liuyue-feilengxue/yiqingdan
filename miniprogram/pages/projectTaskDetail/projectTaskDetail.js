// pages/projectTaskDetail/projectTaskDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskname:'',
    ddldate:'',
    ddltime:'',
    ddl:'',
    warndate:'',
    warntime:'',
    warn:'',
    isFinish:false,
    //这个index是unfinishtask或者finishtask排在哪个位置
    index:0,
    //是未完成任务的还是完成任务的
    father:''
  },

  //任务名修改
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
  //完成
  finish(){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      ddl:this.data.ddldate+' '+this.data.ddltime,
      warn:this.data.warndate+' '+this.data.warntime,
    })
    const pages = getCurrentPages()
    const lastpage = pages[pages.length - 2]
    lastpage.setData({

    })
    wx.hideLoading()
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var task = JSON.parse(options.taskjson)
    console.log(task)
    var ddl = task.fDeadline.split(' ')
    var warn = task.fWarnTime.split(' ')
    this.setData({
      taskname:task.fTask,
      ddldate:ddl[0],
      ddltime:ddl[1],
      warndate:warn[0],
      warntime:warn[1],
      isFinish:task.fFinish,
      index:options.index
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