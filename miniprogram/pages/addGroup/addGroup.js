// pages/addGroup/addGroup.js
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
    //图片地址
    fPicture:"",
    //群密码
    fPassword:"",
    //管理员名单
    fAdministrator:[],
    //成员名单
    fMember:[],
    //群组项目
    fProject:[],
    //群组任务
    fTask:[],
  },
  //群密码是否开启
  checkboxChange(){
    this.setData({
      checked:!this.data.checked
    })
    console.log(this.data.checked)
  },
  //群名
  groupName(e){
    this.setData({
      fGroupName:e.detail.value
    })
  },
  //选择图片
  selectPhoto(){
    const that = this
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
            fPicture:res.fileID
          })
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
          })
        })
      }
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
    wx.showLoading({
      title: '创建群中',
    })
    // 设置群号=>时间戳，精确到毫秒，重复概率小
    var timestamp = new Date().getTime();
    const that = this
    //管理员
    const ui = wx.getStorageSync('userinfo')
    var fAdministrator= []
    fAdministrator.push(ui.openid)
    this.setData({
      fGroupNum:timestamp,
      fAdministrator:fAdministrator,
    })
    //存到group表里
    db.collection("t_group").add({
      data:{
          //群号
          fGroupNum:that.data.fGroupNum,
          //群名
          fGroupName:that.data.fGroupName,
          //图片地址
          fPicture:that.data.fPicture,
          //群密码
          fPassword:that.data.fPassword,
          //管理员名单
          fAdministrator:that.data.fAdministrator,
          //成员名单
          fMember:that.data.fMember,
          //群组项目
          fProject:that.data.fProject,
          //群组任务
          fTask:that.data.fTask,
      }
    }).then(res=>{
      //获取_id 用于更新user表
      wx.cloud.callFunction({
        name:"getUserInfo",
        //传递userinfo
        data:{
          userInfo:ui
        }
      }).then(res=>{
        var _id = res.result.data[0]._id
        //group对象，用于存进fGroup
        var group = {}
        //原有的群
        var fGroup = res.result.data[0].fGroup
        group["fGroupNum"] = that.data.fGroupNum
        group["fGroupName"] = that.data.fGroupName
        group["fPicture"] = that.data.fPicture
        fGroup.push(group)
        //存到user表里
        db.collection("t_user").doc(_id).update({
          data:{
            fGroup:fGroup
          }
        }).then(res=>{
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/group/group',
          })
        })
      })
      
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