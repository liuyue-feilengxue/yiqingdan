// pages/groupMember/groupMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // fGroup 改过昵称的group表
    fGroup:{},
    // fGroup1 原装的group表，更新的时候用这个
    fGroup1:{},
    //群号
    fGroupNum:-1,
    //管理员
    fAdministrator:[],
    //群成员
    fMember:[],
    array1: ['添加为群管理', '删除群成员'],
    value1: 0,
    //是否为群管理
    isAdmin:true,
    //显示下拉菜单
    showDialog: false,
    //哪一个群成员
    index:-1
  },
  //下拉菜单关闭
  closeMenu: function() {
    this.setData({
        showDialog: false
    });
  },  
  //下拉菜单开启
  openMenu: function (e) {
    this.setData({
        showDialog: true,
        index:e.currentTarget.dataset.index
    });
  },
  //踢出群成员
  deleteMember(){
    const that = this
    var fGroupNum = that.data.fGroupNum
    wx.showModal({
      title:"请问你是否要删除该成员",
      success(res){
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
          })
          var index = that.data.index
          var fMember = that.data.fMember
          fMember.splice(index,1)
          //调用云函数
          wx.cloud.callFunction({
            name:"updateGroupMember",
            data:{
              fMember:fMember,
              fGroupNum:fGroupNum
            }
          }).then(res=>{
            wx.hideLoading()
            wx.showToast({
              title: '删除成功',
            })
            that.setData({
              fMember:fMember
            })
          })
        }
      }
    })
    
  },
  //添加为群管理*（有bug）
  toAdmin(){
    var index = this.data.index
    const that = this
    wx.showModal({
      title:"请问您是否确定要将该成员设置为管理员",
      success(res){
        if (res.confirm){
          // 要变成管理员的用户ui，注意，这里的fMember，fAdministrator是改过名字的
          // 本地修改
          var people = that.data.fMember[index]
          var fMember = that.data.fMember
          var fAdministrator = that.data.fAdministrator
          fMember.splice(index,1)
          fAdministrator.push(people)
          that.setData({
            fMember:fMember,
            fAdministrator:fAdministrator
          })
          // 上传数据库的（这里虽然名字可能被改过，但是也不管这个bug了，下面代码有bug）
          // var fGroup1 = that.data.fGroup1
          // var people1 = fGroup1.fMember[index]
          // var fMember1 = fGroup1.fMember
          // fMember1.splice(index,1)
          // var fAdministrator1 = fGroup1.fAdministrator
          // fAdministrator1.push(people1)
          wx.cloud.callFunction({
            name:"updateGroupUserInfo",
            data:{
              fGroupNum:that.data.fGroupNum,
              fMember:fMember,
              fAdministrator:fAdministrator
            }
          }).then(res=>{
            console.log(res)
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fGroup = JSON.parse(options.fGroup)
    var fGroup1 = JSON.parse(options.fGroup)
    console.log(fGroup1)
    var isAdmin = false
    const ui = wx.getStorageSync('userinfo')
    const openid = ui.openid
    for (var i=0;i<fGroup.fAdministrator.length;i++){
      //如果在管理员名单找到你，那么你就是管理员
      if (fGroup.fAdministrator[i].openid==openid){
        isAdmin = true
      }
    }
    //改管理员昵称
    var temp = fGroup.fAdministrator.length
    for (var i=0;i<temp;i++){
      //改名
      if (fGroup.fAdministrator[i].nickName.length<=8){
      }
      //取前8个字符，第9个字符为"..."
      else{
        var nickName = fGroup.fAdministrator[i].nickName.substring(0,7)+"..."
        console.log(nickName)
        fGroup.fAdministrator[i].nickName = nickName
      }
    }
    //改群员
    temp = fGroup.fMember.length
    for (var i=0;i<temp;i++){
      //改名
      if (fGroup.fMember[i].nickName.length<=8){
      }
      //取前8个字符，第9个字符为"..."
      else{
        var nickName = fGroup.fMember[i].nickName.substring(0,7)+"..."
        console.log(nickName)
        fGroup.fMember[i].nickName = nickName
      }
    }
    this.setData({
      fGroup:fGroup,
      fGroup1:fGroup1,
      fGroupNum:fGroup.fGroupNum,
      isAdmin:isAdmin,
      fAdministrator:fGroup1.fAdministrator,
      fMember:fGroup1.fMember,
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