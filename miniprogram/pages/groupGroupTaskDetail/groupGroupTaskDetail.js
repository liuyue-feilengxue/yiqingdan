// pages/groupGroupTaskDetail/groupGroupTaskDetail.js
// 完成列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 群号
    fGroupNum:-1,
    // 任务
    fTask:{},
    // 已经完成任务的人
    finish:[],
    // 未完成任务的人
    unfinish:[],
    // 所有人
    all:[],
    // 本群
    fGroup:{},
    // 是否为管理
    isAdmin:false
  },

  // 把已完成改为未完成
  changeToUnfinish(e){
    var index = e.currentTarget.dataset.index
    const that = this
    var finish = this.data.finish
    wx.showModal({
      title:"请问您是否确定该成员尚未完成任务",
      success(res){
        if (res.confirm){
          finish.splice(index,1)
          console.log(finish)
          wx.cloud.callFunction({
            name:"updateGroupTaskFinishMember",
            data:{
              fGroupNum:that.data.fGroupNum,
              fNum:that.data.fTask.fNum,
              finish:finish
            }
          }).then(res=>{
            console.log(res)
            var all = that.data.all
            var unfinish = all
            console.log(all)
            // finish修改，unfinish加一个人（可能有bug）
            for (let i=0;i<unfinish.length;i++){
              for (let j = 0;j<finish.length;j++){
                // 这个人在完成列表里，就要删掉
                if (unfinish[i].openid==finish[j].openid){
                  unfinish.splice(i,1)
                  i--
                  break
                }
              }
            }
            that.setData({
              finish:finish,
              unfinish:unfinish
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
    var fGroupNum = Number(options.fGroupNum)
    var fTask = JSON.parse(options.taskjson)
    this.setData({
      fGroupNum:fGroupNum,
      fTask:fTask,
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
    })
    const that = this
    const ui = wx.getStorageSync('userinfo')
    // 已经完成任务的人
    var finish = []
    for (let i=0;i<that.data.fTask.fFinish.length;i++){
      finish.push(that.data.fTask.fFinish[i])
    }
    this.setData({
      finish:finish
    })
    // getTGroup
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:that.data.fGroupNum
      }
    }).then(res=>{
      var fGroup = res.result.data[0]
      var allMember = fGroup.fAdministrator.concat(fGroup.fMember)
      // 此处可能有bug
      for (let i=0;i<allMember.length;i++){
        for (let j=0;j<finish.length;j++){
          if (allMember[i].openid == finish[j].openid){
            allMember.splice(i,1)
            i--
            break
          }
        }
      }
      // 是否为管理员（删除该同学完成任务）
      var isAdmin = false
      for (let i=0;i<fGroup.fAdministrator.length;i++){
        // 是管理
        if (fGroup.fAdministrator[i].openid == ui.openid){
          isAdmin = true
          break
        }
      }
      // 设置unfinish
      that.setData({
        unfinish:allMember,
        fGroup:fGroup,
        isAdmin:isAdmin,
        all:fGroup.fAdministrator.concat(fGroup.fMember)
      })
      wx.hideLoading()
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