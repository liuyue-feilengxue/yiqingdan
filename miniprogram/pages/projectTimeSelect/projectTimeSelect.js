// pages/projectTimeSelect/projectTimeSelect.js
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
    // 上一页面传递下来的参数
    father:'',
    time:[],
    index:-1,
    taskname:'',
    tasks:[],
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
  //任务名输入
  taskinput(e){
    this.setData({
      taskname:e.detail.value
    })
  },
  //返回父页面
  toFatherPages(){
    const pages = getCurrentPages()
    // 上一页
    const lastPages = pages[pages.length - 2]
    var time = this.data.time;
    var index = this.data.index;
    var ddl = this.data.ddldate+' '+this.data.ddltime;
    var warn = this.data.warndate+ ' ' + this.data.warntime;
    var obj = {ddl,warn}
    if (time.length==0){
      time = [{}]
    }
    time[index] = obj
    console.log(time)
    var tasks = this.data.tasks
    tasks[index]=this.data.taskname
    //数据传到上一页
    lastPages.setData({
      time:time,
      isFirst:false,
      tasks:tasks
    })
    wx.navigateBack({
      success(){
        console.log('success')
      },
      fail(){
        console.log('fail')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowTime()

    var timejson = options.time
    var time = JSON.parse(timejson)
    var tasksjson = options.tasks
    var tasks = JSON.parse(tasksjson)
    
    this.setData({
      time:time,
      index:options.index,
      tasks:tasks,
      father:options.father,
      taskname:tasks[options.index],
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