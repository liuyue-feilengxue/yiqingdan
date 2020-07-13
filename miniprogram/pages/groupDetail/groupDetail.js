// pages/groupDetail/groupDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //群头像位置
    fileID:'',
    //群对象
    fGroup:{},
    //所有群成员
    member:["a","b"],
    //该用户是否为群管理
    isAdministrator:false
  },
  //更换群头像
  changeGroupAvatar(){
    const that = this
    wx.showModal({
      title:'是否需要更换群头像',
      success(res){
        //确定要换
        if (res.confirm){
          //删除原来的图
          wx.cloud.deleteFile({
            fileList:[that.data.fileID]
          }).then(res=>{
            console.log(res)
          })
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
                var fGroup = that.data.fGroup
                fGroup["fGroup"] = res.fileID
                that.setData({
                  fileID:res.fileID,
                  fGroup:fGroup
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
    var fGroupjson = JSON.stringify(this.data.fGroup)
    wx.navigateTo({
      url: '/pages/groupMember/groupMember?fGroup='+fGroupjson,
    })
  },
  //复制群号
  copyGroupNum(){
    wx.setClipboardData({
      data: JSON.stringify(this.data.fGroup.fGroupNum),
      success(res){
        wx.getClipboardData({
          success(res){
            console.log(res)
          }
        })
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  //去查看群任务页面*
  toGroupTask(){
    var fTaskjson = JSON.stringify(this.data.fGroup.fTask)
    var fProjectjson = JSON.stringify(this.data.fGroup.fProject)
    wx.navigateTo({
      url: '/pages/groupTask/groupTask?fTask='+fTaskjson+"&fProject="+fProjectjson,
    })
  },
  //解散本群*
  disband(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fGroup = JSON.parse(options.fGroupjson)
    console.log(fGroup)
    const ui = wx.getStorageSync('userinfo')
    const openid = ui.openid
    var isAdministrator  = false
    //是否为群管理
    for (var i=0;i<fGroup.fAdministrator.length;i++){
      // console.log(fGroup.fAdministrator[i])
      if (fGroup.fAdministrator[i].openid==openid){
        isAdministrator=true
        break
      }
    }
    // 获取所有群成员头像与昵称（avatar和nickname）
    
    this.setData({
      fGroup:fGroup,
      fileID:fGroup.fPicture,
      isAdministrator:isAdministrator
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
   * 更新头像
   */
  onUnload: function () {
    const that = this
    //先在Group表改，再到user表改
    db.collection("t_group").doc(this.data.fGroup._id).update({
      data:{
        fPicture:this.data.fileID
      }
    }).then(res=>{
      const ui = wx.getStorageSync('userinfo')
      //获取_id
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          userInfo:ui
        }
      }).then(res=>{
        var fGroup = res.result.data[0].fGroup
        for (var i=0;i<fGroup.length;i++){
          //群号相同（同一个群）
          if (fGroup.fGroupNum==that.data.fGroup.fGroupNum){
            fGroup[i].fPicture = that.data.fileID
          }
        }
        db.collection("t_user").doc(res.result.data[0]._id).update({
          data:{
            fGroup:fGroup
          }
        })
      })
    })
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