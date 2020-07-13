// pages/joinGroup/joinGroup.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否开启群密码
    checked:false,
    //群号
    fGroupNum:-1,
    //群名
    fGroupName:"",
    //群密码
    fPassword:"",
  },
  //群名
  groupNum(e){
    this.setData({
      fGroupName:e.detail.value
    })
  },
  //群密码
  groupPassword(e){
    this.setData({
      fPassword:e.detail.value
    })
  },
  //确定* 
  finish(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // const that = this
    const ui = wx.getStorageSync('userinfo')
    
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