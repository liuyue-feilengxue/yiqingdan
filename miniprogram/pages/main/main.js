// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //存任务
    tasks:[]
  },
  //转到任务详情
  toTaskDetail(e){
    var tasks = this.data.tasks
    var index = e.currentTarget.dataset.index
    var taskjson = JSON.stringify(tasks[index])
    wx.navigateTo({
      url: '/pages/taskDetail/taskDetail?taskjson='+taskjson,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    const ui=wx.getStorageSync('userinfo')
    //如果没有登录
    if(!ui){
      wx.showModal({
        //到时候把取消给删掉，必须要登录才能使用我们小程序
        title:"您尚未登录",
        success(res){
          if (res.confirm){
            wx.switchTab({
              url: '/pages/my/my',
            })
          }
        }
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
   * 要到数据库取数据
   */
  onShow: function () {
    const ui=wx.getStorageSync('userinfo')
    const that = this
    //任务
    var tasks=[]
    if (ui){
      //如果已经登录
      wx.cloud.callFunction({
        name:"getTTask",
        data:{
          openid:ui.openid
        }
      }).then(res=>{
        //data是数组，存的是整个数据库的东西
        //看一下里面有没有已经完成的任务，若已经完成就不用出现
        for(var i=0;i<res.result.data.length;i++){
          //未完成
          if (!res.result.data[i].fFinish){
            tasks.push(res.result.data[i])
          }
        }
        //排序函数
        var compare = function(obj1,obj2){
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
        }
        console.log(tasks.sort(compare))
        that.setData({
          tasks:tasks
        })
      })
    }
    //未登录
    else{
      that.setData({
        tasks:[]
      })
      wx.showModal({
        //到时候把取消给删掉，必须要登录才能使用我们小程序
        title:"您尚未登录",
        success(res){
          if (res.confirm){
            wx.switchTab({
              url: '/pages/my/my',
            })
          }
        }
      })
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