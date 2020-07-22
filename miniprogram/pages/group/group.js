// pages/group/group.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    //显示菜单
    showDialog: false,
    //加入的群聊
    fGroup:[]
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
  //点击群，前往群详情
  toGroupDetail(e){
    //点击的是第几个
    var index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:this.data.fGroup[index].fGroupNum
      }
    }).then(res=>{
      var fGroup = res.result.data[0]
      var fGroupjson = JSON.stringify(fGroup)
      wx.navigateTo({
        url: '/pages/groupDetail/groupDetail?fGroupjson='+fGroupjson,
      })
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
        console.log(res)
        var fGroup = res.result.data[0].fGroup
        console.log(fGroup)
        that.setData({
          fGroup:fGroup
        })
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