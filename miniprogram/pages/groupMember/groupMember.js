// pages/groupMember/groupMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array1: ['添加为群管理', '删除群成员'],
    value1: 0,
    //是否为群管理
    isAdmin:true,
    //显示下拉菜单
    showDialog: false,
    //哪一个群成员
    index:-1
  },
  //下拉菜单关闭
  closeMenu: function() {
    this.setData({
        showDialog: false
    });
  },  
  //下拉菜单开启
  openMenu: function (e) {
    this.setData({
        showDialog: true,
        index:e.currentTarget.dataset.index
    });
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