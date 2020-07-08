// pages/groupDetail/groupDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //群头像位置
    fileID:''
  },
  //更换群头像
  changeGroupAvatar(){
    const that = this
    wx.showModal({
      title:'是否需要更换群头像',
      success(res){
        //确定要换
        if (res.confirm){
          //选图
          wx.chooseImage({
            success(res){
              wx.showLoading({
                title: '加载中',
              })
              var path = res.tempFilePaths[0]
              //文件后缀名
              var end = path.substring(path.length - 4)
              // 上传到云存储
              wx.cloud.uploadFile({
                cloudPath:Date.now()+"GroupAvatar"+end,
                filePath:path
              }).then(res=>{
                console.log(res)
                that.setData({
                  fileID:res.fileID
                })
                wx.hideLoading()
              })
              
            }
          })
        }
      }
    })
  },
  //去群成员页面
  toGroupMember(){
    wx.navigateTo({
      url: '/pages/groupMember/groupMember',
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