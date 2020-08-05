// pages/setUp/setUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //复制开发者微信
  getDevelopWechat(){
    wx.setClipboardData({
      data: "tangxuexi288268015",
      success(res){
        wx.getClipboardData({
          success(res){
            console.log(res)
          }
        })
        wx.showToast({
          title: '已复制微信号',
        })
      }
    })
  },
  //订阅消息
  subscribeMessageSend(){
    // 若将来订阅消息变多了，可以改为跳转页面
    // wx.navigateTo({
    //   url: 'url',
    // })
    wx.requestSubscribeMessage({
      tmplIds: ['n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ'],
      success(res){
        console.log(res)
        wx.setStorageSync('dateWarnKey','n_7pjG1HufYoGBjOfRDVj_0Bva_uSwNUuFdiGurNusQ')
      },
      fail(err){
        console.log(err)
      }
    })
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