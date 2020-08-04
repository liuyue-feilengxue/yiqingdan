// pages/group/group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    //输入内容
    inputVal: "",
    //该用户所有的群（user表里的）
    fGroup:[],
    // 实时查询文本
    currentdata:[]
  },
  //显示输入框
  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },
  // 隐藏输入框
  hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
  },
  //清空输入
  clearInput: function () {
    this.setData({
      inputVal: "",
      currentdata:[]
    });
  },
  //输入
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      currentdata:[]
    });
    var currentdata = []
    var fGroup = this.data.fGroup
    const that = this
    for (var i=0;i<this.data.fGroup.length;i++){
      //是否为群名
      if (JSON.stringify(fGroup[i].fGroupName).indexOf(e.detail.value)!=-1){
        currentdata.push(fGroup[i])
      }
      //是否为群号
      else if (JSON.stringify(fGroup[i].fGroupNum).indexOf(e.detail.value)!=-1){
        currentdata.push(fGroup[i])
      }
      //可扩展（但比较麻烦，需要修改为group表）
    }
    this.setData({
      currentdata:currentdata
    })
  },
  //点击群，前往群详情
  toGroupDetail(e){
    //点击的是第几个
    var index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name:"getTGroup",
      data:{
        fGroupNum:this.data.currentdata[index].fGroupNum
      }
    }).then(res=>{
      var fGroupNum = res.result.data[0].fGroupNum
      wx.navigateTo({
        url: '/pages/groupDetail/groupDetail?fGroupNum='+fGroupNum,
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const ui = wx.getStorageSync('userinfo')
    const that = this
    //把fGroup存到本地
    wx.cloud.callFunction({
      name:"getUserInfo",
      data:{
        userInfo:ui
      }
    }).then(res=>{
      var fGroup = res.result.data[0].fGroup
      that.setData({
        fGroup:fGroup
      })
      wx.hideLoading()
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