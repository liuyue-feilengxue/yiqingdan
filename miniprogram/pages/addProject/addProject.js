// pages/addProject/addProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tasks:[],
    time:[],
    
    array1: ['高优先级', '中优先级', '低优先级','无优先级'],
    value1: 0,
  },
  //选择ddltime和warntime
  toSelectDate(e){
    console.log(e.currentTarget.dataset.index)
    var time=[];
    const that=this;
    if (that.data.name=='paper'){
      time=[{},{},{},{},{}]
      that.setData({
        time:time
      })
    }
    else if(that.data.name=='book'){
      time=[{},{},{},{}]
      that.setData({
        time:time
      })
    }
    console.log(that.data.time)
    wx.navigateTo({
      url: '/pages/projectTimeSelect/projectTimeSelect',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 是哪个模板点进来的
    this.setData({
      name:options.name
    })
    if (options.name=='paper'){
      this.setData({
        tasks:['确定题目','细列提纲','全心撰写','精心修改','完善要素']
      })
    }
    else if(options.name=='book'){
      this.setData({
        tasks:['列书单','购买书籍','开始阅读','阅读完成']
      })
    }
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