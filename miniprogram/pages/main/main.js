// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //存任务
    tasks:[],
    projects:[],
    all:[],
    // user表的fGroup
    fGroup:[]
  },
  //转到任务（项目）详情
  toTaskDetail(e){
    var all = this.data.all
    var index = e.currentTarget.dataset.index
    var alljson = JSON.stringify(all[index])
    //任务详情
    if (all[index].identity=='task'){
      wx.navigateTo({
        url: '/pages/taskDetail/taskDetail?alljson='+alljson,
      })
    }
    //项目详情
    else if(all[index].identity=='project'){
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?alljson='+alljson,
      })
    }
    //群任务
    else{
      wx.navigateTo({
        url: "/pages/groupTaskDetail/groupTaskDetail?alljson="+alljson,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * 
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
   * 要到数据库取数据
   */
  onShow: function () {
    const ui=wx.getStorageSync('userinfo')
    const that = this
    //任务
    var tasks=[]
    //项目
    var projects = []
    //群组任务
    var groupTasks = []
    //全部
    var all=[]
    //已经登录
    if (ui){
      //获取用户表的fGroup
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          userInfo:ui
        }
      }).then(res=>{
        that.setData({
          fGroup:res.result.data[0].fGroup
        })
        // 通过用户表的fGroup去搜索
        wx.cloud.callFunction({
          name:"getAllJoinGroup",
          data:{
            fGroup:that.data.fGroup
          }
        }).then(res=>{
          //群组详情
          var groupDetail = res.result
          // 获取群组任务
          for (let i = 0;i<groupDetail.length;i++){
            if (groupDetail[i].fTask.length == 0 ){
              continue
            }
            for (let j = 0;j<groupDetail[i].fTask.length;j++){
              groupDetail[i].fTask[j]['identity'] = 'group'
            }
            groupTasks = groupTasks.concat(groupDetail[i].fTask)
          }
          console.log(groupTasks)
        })
        // 获取任务
        wx.cloud.callFunction({
          name:"getTTask",
          data:{
            openid:ui.openid
          }
        }).then(res=>{
          //data是数组，存的是整个数据库的东西
          //看一下里面有没有已经完成的任务，若已经完成就不用出现
          for(var i=0;i<res.result.data.length;i++){
            //未完成
            if (!res.result.data[i].fFinish){
              //加入身份，区分是task还是project
              var task = res.result.data[i]
              task['identity'] = 'task'
              tasks.push(task)
            }
          }
          //查找project
          wx.cloud.callFunction({
            name:'getTProject',
            data:{
              openid:ui.openid
            }
          }).then(res=>{
            for(var i=0;i<res.result.data.length;i++){
              //未完成
              var finish = res.result.data[i].fFinish
              var flag = 0
              //是否所有项目中的任务都完成
              for (var j=0;j<finish.length;j++){
                //如果该任务完成，flag+1
                if (finish[j]){
                  flag++
                }
              }
              //有没做完的
              if (flag!=finish.length){
                var project = res.result.data[i]
                //身份
                project['identity'] = 'project'
                projects.push(project)
              }
            }
            //把project和tasks合并起来(concat(project))
            all=tasks.concat(projects)
            all=all.concat(groupTasks)
            //排序
            all.sort(that.compare)
            that.setData({
              tasks:tasks,
              projects:projects,
              all:all
            })
          })
        })
      })
    }
    // 未登录
    else{
      wx.showModal({
        title:"您尚未登录",
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
  //排序函数
  compare:function(obj1,obj2){
    var value1 = obj1.fUrgency
    var value2 = obj2.fUrgency
    if (value1<value2){
      return -1;
    }
    else if (value1>value2){
      return 1;
    }
    else{
      var ddl1 = obj1.fDeadline
      var ddl2 = obj2.fDeadline
      if (ddl1 < ddl2) {
        return -1;
      } else if (ddl1 > ddl2) {
          return 1;
      } else {
          var warn1 = obj1.fWarnTime
          var warn2 = obj2.fWarnTime
          if (warn1<warn2){
            return -1;
          }
          else if (warn1>warn2){
            return 1;
          }
          else{
            return 0;
          }
        }
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