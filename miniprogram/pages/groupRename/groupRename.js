// miniprogram/pages/groupRename/groupRename.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fGroupName:"",
    fGroupNum:-1
  },
  //填空
  groupName(e){
    this.setData({
      fGroupName:e.detail.value
    })
  },
  // 完成*
  finish(){
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    wx.cloud.callFunction({
      name:"updateGroupName",
      data:{
        fGroupNum:that.data.fGroupNum,
        fGroupName:that.data.fGroupName
      }
    }).then(res=>{
      //user表没解决，建议底层修改
      wx.hideLoading()
      wx.navigateBack()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fGroupName = options.fGroupName
    var fGroupNum = Number(options.fGroupNum)
    this.setData({
      fGroupName:fGroupName,
      fGroupNum:fGroupNum
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