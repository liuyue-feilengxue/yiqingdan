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
      // 获取用户加入的群
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          userInfo:ui
        }
      }).then(res=>{
        // user表里的fGroup
        var fGroup = res.result.data[0].fGroup
        that.setData({
          UserfGroup:fGroup
        })
        // 更新加入的群的情况
        //先获取所有加入的群的消息
        function getAllJoinGroup(i){
          if (i == fGroup.length){
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
              console.log(res)
              that.setData({
                fGroup:fGroup
              })
            })
            return;
          } 
          wx.cloud.callFunction({
            name:"getAllJoinGroup",
            data:{
              fGroup:fGroup[i]
            }
          }).then(res=>{
            //这个群没了
            if (res.result.data.length == 0 ){
              fGroup.splice(i,1)
              console.log(i)
              that.setData({
                fGroup:fGroup
              })
              getAllJoinGroup(i+1)
            }
            // console.log(that.check(res)) 
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

  //检查是否被删除提出之类的
  check(res){
    var group = res.result.data[0]
    var UserfGroup = this.data.UserfGroup
    const that = this
    return group
    // //该群是否被解散
    // for (var i=0;i<fGroup.length;i++){
    //   var flag1 = false
    //   for (var j=0;j<allgroup.length;j++){
    //     if (fGroup[i].fGroupNum == allgroup[j].fGroupNum){
    //       flag1 = true
    //       break
    //     }
    //   }
    //   if (!flag1){
    //     fGroup.splice(i,1)
    //   }
    // }
    // for(var i = 0; i<allgroup.length;i++){
    //   //所有成员
    //   var member = allgroup[i].fMember.concat(allgroup[i].fAdministrator)
    //   //是否被踢
    //   var flag = false
    //   for (var j= 0;j<member.length;j++){
    //     if (member[j].openid == ui.openid){
    //       // 还在这个群里
    //       flag = true
    //       break
    //     }
    //   }
    //   // 如果已经被踢了，就在user表里把这个群删了
    //   if (flag == false){
    //     var fGroupNum = allgroup[i].fGroupNum
    //     for (var j=0;j<fGroup.length;j++){
    //       if (fGroup[j].fGroupNum == fGroupNum){
    //         fGroup.splice(j,1)
    //       }
    //     }
    //     continue
    //   }
    //   for (var j=0;j<fGroup.length;j++){
    //     if (allgroup[i].fGroupNum == fGroup[j].fGroupNum){
    //       //群名不同或者群头像不同
    //       if (allgroup[i].fGroupName != fGroup[j].fGroupName || allgroup[i].fPicture != fGroup[j].fPicture){
    //         fGroup[j].fPicture = allgroup[i].fPicture
    //         fGroup[j].fGroupName = allgroup[i].fGroupName
    //         break
    //       }
    //     }
    //   }
    // }
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