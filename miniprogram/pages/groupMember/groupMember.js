// pages/groupMember/groupMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fGroup:[],
    //管理员
    fAdministrator:[],
    //群成员
    fMember:[],
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
    var fGroup = JSON.parse(options.fGroup)
    var isAdmin = false
    const ui = wx.getStorageSync('userinfo')
    const openid = ui.openid
    for (var i=0;i<fGroup.fAdministrator.length;i++){
      //如果在管理员名单找到你，那么你就是管理员
      if (fGroup.fAdministrator[i].openid==openid){
        isAdmin = true
      }
    }
    this.setData({
      fGroup:fGroup,
      isAdmin:isAdmin,
      fAdministrator:fGroup.fAdministrator,
      fMember:fGroup.fMember,
    })
    console.log(this.data.fGroup)
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