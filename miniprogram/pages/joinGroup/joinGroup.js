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
    //群密码
    fPassword:"",
  },
  //群号
  groupNum(e){
    this.setData({
      fGroupNum:e.detail.value
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
    const that = this
    var fGroupNum = Number(that.data.fGroupNum)
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:fGroupNum
      }
    }).then(res=>{
      console.log(res)
      //输入有问题
      if (res.result.data.length == 0 ){
        wx.showModal({
          title : "查无该群",
          showCancel:false
        })
      }
      else{
        //查一下有没有密码
        var group = res.result.data[0]
        // console.log(group)
        // 是不是有密码
        var havePassword = false
        // 没有密码
        if (group.fPassword == ""){
          havePassword = false
        }
        //有密码
        else{
          havePassword = true
        }
        // 查一下密码对不对（包括没写密码的时候）
        if (havePassword){
          //密码正确
          if (that.data.fPassword==group.fPassword){

          }
          // 密码错误(有可能是没写密码,所以要把check改为true)
          else{
            that.setData({
              checked:true
            })
            wx.showModal({
              title : "密码错误",
              showCancel:false
            })
          }
        }
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