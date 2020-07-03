// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //存任务
    tasks:[]
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
    if (ui){
      //如果已经登录
      wx.cloud.callFunction({
        name:"getTTask",
        data:{
          openid:ui.openid
        }
      }).then(res=>{
        //data是数组，存的是整个数据库的东西
        console.log(res.result.data)
        that.setData({
          tasks:res.result.data
        })
      })
    }
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