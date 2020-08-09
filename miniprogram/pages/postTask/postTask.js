// pages/addTask/addTask.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ddldate: '2000-01-01',
    ddltime: '12:00',
    warndate: '2000-01-01',
    warntime: '12:00',
    nowdate: '',
    nowtime: '',
    array1: ['高优先级', '中优先级', '低优先级','无优先级'],
    value1: 0,
    taskname:'',
    fGroup:{},
    fGroupNum:-1,
    fTask:[]
  },
  //获取优先级
  bindPicker1Change: function(e) {
    this.setData({
        value1: e.detail.value
    })
  },
  //获取日期（ddl与warn日期都在这）
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
  //获取时间
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
  // 获取现在时间
  getNowTime(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if(month < 10) {
      month = '0' + month;
    };
    if(day < 10) {
      day = '0' + day;
    };
    //  如果需要时分秒，就放开
    var h = now.getHours();
    var m = now.getMinutes();
    if(m<10){
      m='0'+m
    }
    var date = year + '-' + month + '-' + day;
    var time =  h + ':' + m;
    // console.log('当前时间',formatDate)
    // return formatDate;
    this.setData({
      ddldate:date,
      warndate:date,
      nowdate: date,
      ddltime:time,
      warntime:time,
      nowtime:time,
    })
  },
  //任务名获取
  taskinput(e){
    this.setData({
      taskname:e.detail.value
    })
  },
  //点击确定
  finish(){
    const that = this;
    var fGroupNum = this.data.fGroupNum
    var warn = that.data.warndate+' '+that.data.warntime
    var ddl = that.data.ddldate+' '+that.data.ddltime
    //错误提醒，提醒大于截止时间（不可能）
    if (warn>ddl){
      wx.showModal({
        showCancel: false,
        title : '您的提醒时间大于截止时间，请重新确认'
      })
    }
    else if (that.data.taskname == ""){
      wx.showModal({
        showCancel: false,
        title : '请设置任务名'
      })
    }
    else{
      wx.showModal({
        title:"请问您是否确定要创建新的群任务",
        success(res){
          if (res.confirm){
            wx.showLoading({
              title: '加载中',
              mask:true
            })
            // 任务对象，存到fTask里面的
            var obj = {}
            // 任务名称
            obj.fTaskname = that.data.taskname
            // 任务紧急程度
            obj.fUrgency = that.data.value1
            // 任务序号
            obj.fNum = new Date().getTime()
            // 任务提醒时间
            obj.fWarnTime = warn
            // 任务截止时间
            obj.fDeadline = ddl
            // 任务完成人数
            obj.fFinish = 0
            var fTask = that.data.fTask
            fTask.push(obj)
            //云函数存入group里
            wx.cloud.callFunction({
              name:"updateGroupTask",
              data:{
                fGroupNum:fGroupNum,
                fTask:fTask
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowTime()
    this.setData({
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
    var fGroupNum = this.data.fGroupNum
    const that = this
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:fGroupNum
      }
    }).then(res=>{
      that.setData({
        fGroup:res.result.data[0],
        fTask:res.result.data[0].fTask
      })
    })
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