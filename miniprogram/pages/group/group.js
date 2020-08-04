// pages/group/group.js
const db = wx.cloud.database()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    //显示菜单
    showDialog: false,
    //加入的群聊
    fGroup:[],
    //用户表的fGroup
    UserfGroup:[]
  },
  //搜索框
  search(){
    wx.navigateTo({
      url: '/pages/searchGroup/searchGroup',
    })
  },
  //加号
  openDialog(){
    this.setData({
      showDialog: true
    });
  },
  //退出显示菜单（创建群聊，加入群聊）
  close(){
    this.setData({
      showDialog: false
    });
  },
  //点击群，前往群详情（传递群号而已）
  toGroupDetail(e){
    //点击的是第几个
    var index = e.currentTarget.dataset.index
    var fGroupNum = this.data.fGroup[index].fGroupNum
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?fGroupNum='+fGroupNum,
    })

  },
  // 前往创建群
  toAddGroup(){
    wx.navigateTo({
      url: '/pages/addGroup/addGroup',
    })
  },
  // 前往加入群
  toJoinGroup(){
    wx.navigateTo({
      url: '/pages/joinGroup/joinGroup',
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
    const ui = wx.getStorageSync('userinfo')
    const that = this
    if (ui!=""){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      // 获取用户加入的群
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          userInfo:ui
        }
      }).then(res=>{
        // user表里的fGroup
        var fGroup = res.result.data[0].fGroup
        // 更新加入的群的情况
        function getAllJoinGroup(i){
          //因为有可能fGroup删除了以后短一点
          if (i >= fGroup.length){
            that.setData({
              fGroup:fGroup
            })
            // 群名群头像改好了，上传
            wx.cloud.callFunction({
              name:"updateJoinGroup",
              data:{
                userInfo:ui,
                fGroup:fGroup
              }
            }).then(res=>{
              that.setData({
                fGroup:fGroup
              })
              wx.hideLoading()
            })
            return;
          } 
          wx.cloud.callFunction({
            name:"getTGroup",
            data:{
              fGroupNum:fGroup[i].fGroupNum
            }
          }).then(res=>{
            //这个群没了
            if (res.result.data.length == 0 ){
              fGroup.splice(i,1)
              that.setData({
                fGroup:fGroup
              })
              getAllJoinGroup(i)
            }
            // 查看是不是被踢了
            if(!that.isInGroup(res)){
              fGroup.splice(i,1)
              getAllJoinGroup(i)
            }
            // 修改群名群头像
            var group = res.result.data[0]
            fGroup[i].fGroupName = group.fGroupName
            fGroup[i].fPicture = group.fPicture
            getAllJoinGroup(i+1)
          })
        }
        getAllJoinGroup(0)
      })
    }
    //没登录
    else{
      wx.showModal({
        title:"当前尚未登录",
        showCancel:false,
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

  //如果在群里，就返回true，否则返回false
  isInGroup(res){
    var group = res.result.data[0]
    const that = this
    var ui = wx.getStorageSync('userinfo')
    for(var i=0;i<group.fMember.length;i++){
      if (group.fMember[i].openid == ui.openid){
        return true
      }
    }
    for (var i=0;i<group.fAdministrator.length;i++){
      if (group.fAdministrator[i].openid == ui.openid){
        return true
      }
    }
    return false
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