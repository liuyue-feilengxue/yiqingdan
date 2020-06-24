// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    openid:""
  },
  onGotUserInfo(e){
    const that = this
    wx.showModal({
      title:"是否同意获取本机授权",
      confirmColor:"#34D0BA",
      success(res){
        if (res.confirm){
          wx.cloud.callFunction({
            name:"login",
            success:res=>{
              that.setData({
                openid: res.result.openid,
                userinfo : e.detail.userInfo
              })
              //保存在缓存中
              that.data.userinfo.openid = that.data.openid
              // console.log(userInfo)
              wx.setStorageSync('userinfo', that.data.userinfo)
            },
            fail:res=>{
              console.log("云函数调用失败")
            }
          })
        }
      }
    })
    
  },

  clearLogin(){
    const that = this;
    wx.showModal({
      title:"确定退出当前账号吗",
      confirmColor:"#34D0BA",
      success (res){
        if (res.confirm){
          wx.clearStorage()
          that.setData({
            userinfo:{},
            openid:""
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ui=wx.getStorageSync('userinfo')
    this.setData({
      userinfo: ui,
      openid: ui.openid
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