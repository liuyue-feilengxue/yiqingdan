// pages/addProject/addProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tasks:[],
    time:[],
    // 是不是第一次跳转页面（防止把数据清空）
    isFirst : true,
    
    array1: ['高优先级', '中优先级', '低优先级','无优先级'],
    value1: 0,
  },
  //选择ddltime和warntime
  toSelectDate(e){
    var index=e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset.index)
    var time=[];
    const that=this;
    //第一次的话要初始化time
    if (this.data.isFirst){
      if (that.data.name=='paper'){
        time=[{},{},{},{},{}]
        that.setData({
          time:time
        })
      }
      else if(that.data.name=='book'){
        time=[{},{},{},{}]
        that.setData({
          time:time
        })
      }
    }
    
    // console.log(that.data.time)
    var timejson = JSON.stringify(this.data.time)
    var tasksjson = JSON.stringify(this.data.tasks)
    wx.navigateTo({
      url: '/pages/projectTimeSelect/projectTimeSelect?time='+timejson+'&index='+index
      +'&tasks='+tasksjson+'&father='+this.data.name,
    })
  },

  //添加任务（自定义）
  addTask(){
    var tasksjson = JSON.stringify(this.data.tasks)
    var timejson = JSON.stringify(this.data.time)
    wx.navigateTo({
      //告诉addTask页面父页面是哪个
      url: '/pages/addTask/addTask?father=addProject&tasksjson='+tasksjson
      +'&length='+this.data.tasks.length+'&time='+timejson,
    })
  },

  //是否填完
  isFillIn(){
    var time = this.data.time;
    //数组为空
    if (time.length == 0){
      return false;
    }
    // 里面有对象为空
    for (var i=0;i<time.length;i++){
      if (Object.keys(time[i]).length == 0){
        return false;
      }
    }
    return true
  },
  finish(){
    //如果没填好
    console.log(this.data.time)
    if(!this.isFillIn()){
      wx.showModal({
        showCancel: false,
        title : '你仍有任务未设置提醒时间或截止时间'
      })
    }
    else{
      // 传递到数据库中

      wx.navigateBack()//关闭当前页面，返回主页，实际不要用back，现在暂时用
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 是哪个模板点进来的
    this.setData({
      name:options.name
    })
    if (options.name=='paper'){
      this.setData({
        tasks:['确定题目','细列提纲','全心撰写','精心修改','完善要素']
      })
    }
    else if(options.name=='book'){
      this.setData({
        tasks:['列书单','购买书籍','开始阅读','阅读完成']
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