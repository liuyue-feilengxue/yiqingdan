// pages/groupTask/groupTask.js
// 查看群任务，是在群里面进去的那个
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所有任务
    fTask:[],
    //所有项目
    fProject:[],
    //存未完成的任务
    tasks:[],
    projects:[],
    all:[],
    //存已经完成的任务
    finishtasks:[],
    finishproject:[],
    finishall:[],
    //是否有未完成的
    unfinish:false,
    //是否有完成的
    finish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fTask = JSON.parse(options.fTask)
    var fProject = JSON.parse(options.fProject)
    this.setData({
      fProject:fProject,
      fTask:fTask
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