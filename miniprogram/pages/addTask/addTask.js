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
    // 父页面
    father:'',
    //自定义页面用到
    time:[],
    tasks:[],
    length:-1,
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
    var warn = that.data.warndate+' '+that.data.warntime
    var ddl = that.data.ddldate+' '+that.data.ddltime
    //错误提醒，提醒大于截止时间（不可能）
    if (warn>ddl){
      wx.showModal({
        showCancel: false,
        title : '您的提醒时间大于截止时间，请重新确认'
      })
    }
    else{
      //addProject
      if (this.data.father == 'addProject'){
        if (this.data.taskname==''){
          wx.showModal({
            showCancel: false,
            title : '请设置任务名'
          })
        }else{
        wx.showLoading({
          title: '加载中',
        })
        const pages = getCurrentPages()
        // 上一页
        const lastPages = pages[pages.length - 2]
        
        // 自定义的time和index
        var time = this.data.time;
        // index为task的长度
        var index = this.data.length;
        console.log(index)
        var ddl = this.data.ddldate+' '+this.data.ddltime;
        var warn = this.data.warndate+ ' ' + this.data.warntime;
        var obj = {ddl,warn}
        var time1 = time.concat(obj)
  
        var tasks = this.data.tasks.concat(this.data.taskname)
        // 数据传递
        lastPages.setData({
          tasks:tasks,
          time:time1,
          isFirst:false
        })
        wx.hideLoading()
        wx.navigateBack()
        }
         
      }
      //addTask
      else{
        // 获取订阅消息授权
        var subId = wx.getStorageSync('dateWarnKey')
        if (!subId){
          wx.requestSubscribeMessage({
            tmplIds: ['n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ'],
            success(res){
              wx.setStorageSync('dateWarnKey', "n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ")
              subId = "n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ"
            }
          })
        }
        // wx.cloud.callFunction({
        //   name:"subscribeMessage",
        //   data:{
        //     templateId:subId,
        //     taskname:that.data.taskname,
        //     ddl:that.data.ddldate+' '+that.data.ddltime
        //   }
        // }).then(res=>{
        //   console.log(res)
        // })
        //存入数据库
        db.collection("t_task").add({
          data:{
            //任务名
            fTask:that.data.taskname,
            //提醒时间
            fWarnTime:that.data.warndate+' '+that.data.warntime,
            //截止时间
            fDeadline:that.data.ddldate+' '+that.data.ddltime,
            //紧急程度（存0-3）
            fUrgency:that.data.value1,
            //是否完成
            fFinish:false,
            //系统自带openid无法查找
            openid:wx.getStorageSync('userinfo').openid
          }
        })
        wx.navigateBack()
      }
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowTime()
    if (options.father=='addProject'){
      var tasksjson = options.tasksjson
      var tasks = JSON.parse(tasksjson)
      var timejson = options.time
      var time = JSON.parse(timejson)
      this.setData({
        father:options.father,
        tasks:tasks,
        time:time,
        // tasks长度
        length:Number(options.length)
      })
    }
    else{
      this.setData({
        father:options.father,
      })
    }
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