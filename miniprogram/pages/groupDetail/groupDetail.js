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
    //群号
    fGroupNum:0,
    //所有群成员
    member:[],
    //该用户是否为群管理
    isAdministrator:false
  },
  //更换群头像
  changeGroupAvatar(){
    //是管理员才能换头像
    if (this.data.isAdministrator){
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
                title: '加载中，请不要退出小程序',
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
    }
  },
  //去群成员页面
  toGroupMember(){
    var fGroupjson = JSON.stringify(this.data.fGroup)
    console.log(this.data.fGroup)
    wx.navigateTo({
      url: '/pages/groupMember/groupMember?fGroup='+fGroupjson,
    })
  },
  // 去修改群名页面
  toGroupRename(){
    //是管理员才能操作
    if(this.data.isAdministrator){
      var fGroupName = this.data.fGroup.fGroupName
      var fGroupNum = this.data.fGroupNum
      wx.navigateTo({
        url: '/pages/groupRename/groupRename?fGroupName='+fGroupName+"&fGroupNum="+fGroupNum,
      })
    }
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
  //新建群任务
  toPostTask(){
    wx.navigateTo({
      url: '/pages/postTask/postTask?fGroupNum='+this.data.fGroupNum,
    })
  },
  //去查看群任务页面
  toGroupTask(){
    var fTaskjson = JSON.stringify(this.data.fGroup.fTask)
    wx.navigateTo({
      url: '/pages/groupTask/groupTask?fTask='+fTaskjson+"&fGroupNum="+this.data.fGroup.fGroupNum,
    })
  },
  //解散本群
  disband(){
    const that = this
    wx.showModal({
      title:"请问你是否确定解散本群",
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          var fGroup = that.data.fGroup
          //删除群头像文件
          wx.cloud.deleteFile({
            fileList:[that.data.fileID]
          })
          wx.cloud.callFunction({
            name:"deleteGroup",
            data:{
              fGroupNum : fGroup.fGroupNum
            }
          }).then(res=>{
            console.log(res.result.data)
            wx.hideLoading()
            wx.navigateBack()
          })
        }
      }
    })
  },
  //退出本群
  exit(){
    var fGroup = this.data.fGroup
    var that = this
    var ui = wx.getStorageSync('userinfo')
    wx.showModal({
      title:"请问你是否确定退出本群",
      success(res){
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          //删除fGroup中fMember的（因为管理员是解散群聊）
          for(var i=0;i<fGroup.fMember.length;i++){
            if (ui.openid==fGroup.fMember[i].openid){
              fGroup.fMember.splice(i,1)
            }
          }
          //上传数据库（group），然后删除user库的
          wx.cloud.callFunction({
            name:"updateGroupMember",
            data:{
              fMember:fGroup.fMember,
              fGroupNum:that.data.fGroupNum
            }
          }).then(res=>{
            wx.cloud.callFunction({
              name:"getUserInfo",
              data:{
                userInfo:ui
              }
            }).then(res=>{
              //用户表的fGroup
              var UserfGroup = res.result.data[0].fGroup
              for(var j = 0;j<UserfGroup.length;j++){
                if (UserfGroup[j].fGroupNum == that.data.fGroupNum){
                  UserfGroup.splice(j,1)
                }
              }
              console.log(UserfGroup)
              wx.cloud.callFunction({
                name:"updateTUserGroup",
                data:{
                  userInfo:ui,
                  fGroup:UserfGroup
                }
              }).then(res=>{
                wx.hideLoading()
                wx.navigateBack()
              })
            })

          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //group页面传递过来的群号
    var fGroupNum =Number(options.fGroupNum)
    this.setData({
      fGroupNum:fGroupNum,
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    const that = this
    const ui = wx.getStorageSync('userinfo')
    const openid = ui.openid
    var isAdministrator  = false
    //云函数确定信息
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:that.data.fGroupNum
      }
    }).then(res=>{
      var fGroup = res.result.data[0]
      //是否为群管理
      for (var i=0;i<fGroup.fAdministrator.length;i++){
        if (fGroup.fAdministrator[i].openid==openid){
          isAdministrator=true
          break
        }
      }
      // 把群成员的情况放入member中
      var member = fGroup.fAdministrator.concat(fGroup.fMember)
      that.setData({
        fGroup:fGroup,
        fileID:fGroup.fPicture,
        isAdministrator:isAdministrator,
        member:member
      })    
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
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