// pages/groupTask/groupTask.js
// 查看群任务，是在群里面进去的那个
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //group表里的群任务
    fTask:[],
    // 排序后的群任务()
    task:[],
    // 群号
    fGroupNum:-1,
    // 是否为管理员
    isAdministrator:false,
    //是否有群任务
    haveGroupTask:false
  },
 
  // 去群任务详情（非管理员进不去）
  toTaskDetail(e){
    var index = e.currentTarget.dataset.index
    var taskjson = JSON.stringify(this.data.task[index])
    const that = this
    if (this.data.isAdministrator){
      wx.navigateTo({
        url: '/pages/groupTaskUpdate/groupTaskUpdate?taskjson='+taskjson+
          '&fGroupNum='+that.data.fGroupNum,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fGroupNum = Number(options.fGroupNum)
    this.setData({
      fGroupNum:fGroupNum,
      isAdministrator:JSON.parse(options.isAdministrator)
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
    const fGroupNum = this.data.fGroupNum
    const that = this
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:fGroupNum
      }
    }).then(res=>{
      var fTask = res.result.data[0].fTask
      var haveGroupTask = false
      var task = fTask
      // 有任务
      if (fTask.length!=0){
        haveGroupTask = true
      }
      this.setData({
        fTask:fTask,
        haveGroupTask:haveGroupTask
      })
      task.sort(that.compare)
      this.setData({
        task:task
      })
    })
  },

  // 排序函数
  compare:function(obj1,obj2){
    var value1 = obj1.fUrgency
    var value2 = obj2.fUrgency
    if (value1<value2){
      return -1;
    }
    else if (value1>value2){
      return 1;
    }
    else{
      var ddl1 = obj1.fDeadline
      var ddl2 = obj2.fDeadline
      if (ddl1 < ddl2) {
        return -1;
      } else if (ddl1 > ddl2) {
          return 1;
      } else {
          var warn1 = obj1.fWarnTime
          var warn2 = obj2.fWarnTime
          if (warn1<warn2){
            return -1;
          }
          else if (warn1>warn2){
            return 1;
          }
          else{
            return 0;
          }
        }
    }   
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