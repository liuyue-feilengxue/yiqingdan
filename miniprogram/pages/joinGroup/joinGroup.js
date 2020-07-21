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
    //用户表的id
    userid : "",
    //用户表里的组
    fGroup:[]
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
    const ui = wx.getStorageSync('userinfo')
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
        var group = res.result.data[0]
        // console.log(group)
        //密码正确
        if (that.data.fPassword==group.fPassword){
          var isJoin = false
          // 查看一下你是否在该群里，若不在则成功加入，否则加入失败
          for (var i=0;i<group.fMember.length;i++){
            if (ui.openid==group.fMember[i].openid){
              isJoin=true
              break
            }
          }
          for (var i=0;i<group.fAdministrator.length;i++){
            if (ui.openid == group.fAdministrator[i].openid){
              isJoin = true
              break
            }
          }
          // 已经加入该群
          if (isJoin){
            wx.showModal({
              title : "您已加入该群，请勿重复添加",
              showCancel:false
            })
          }
          // 没有加入该群，user表里加入该群，group表里加入ui
          else{
            // group表的成员
            var fMember = group.fMember
            fMember.push(ui)
            var groupid = group._id
            var userid = that.data.userid
            var fGroupName = group.fGroupName
            var fGroupNum = group.fGroupNum
            var fPicture = group.fPicture
            var obj = {fGroupName,fGroupNum,fPicture}
            // user表的fGroup
            var fGroup = that.data.fGroup
            fGroup.push(obj)
            //调用云函数修改group的数据，由于创建者的openid与加入者不同
            wx.cloud.callFunction({
              name:"updateGroupMember",
              data:{
                fGroupNum:fGroupNum,
                fMember:fMember
              }
            }).then(res=>{
              db.collection("t_user").doc(userid).update({
                // 用户表
                data:{
                  fGroup:fGroup
                }
              }).then(res=>{
                wx.showModal({
                  title:"加入成功",
                  showCancel:false,
                  success(res){
                    //点击确定，返回上一页
                    if (res.confirm){
                      wx.navigateBack()
                    }
                  }
                })
              })
            })
            
          }
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
    const that = this
    const ui = wx.getStorageSync('userinfo')
    wx.cloud.callFunction({
      name:"getUserInfo",
      data : {
        userInfo: ui
      }
    }).then(res=>{
      that.setData({
        userid:res.result.data[0]._id,
        fGroup:res.result.data[0].fGroup
      })
    })
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