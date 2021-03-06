// pages/allTask/allTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //存未完成的任务
    tasks:[],
    projects:[],
    all:[],
    //存已经完成的任务
    finishtasks:[],
    finishproject:[],
    finishall:[],
    //是否有未完成的
    unfinish:false,
    //是否有完成的
    finish:false
  },
  //转到任务（项目）详情
  toTaskDetail(e){
    var isFinish = e.currentTarget.dataset.isfinish
    //未完成的
    if (isFinish=='false'){
      var all = this.data.all
    }
    //完成了的
    else{
      var all = this.data.finishall
    }
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
  },
  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    const ui=wx.getStorageSync('userinfo')
    //如果没有登录
    if(!ui){
      wx.showModal({
        //到时候把取消给删掉，必须要登录才能使用我们小程序
        title:"您尚未登录",
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
    //全部
    var all=[]

    //完成了的
    var finishtasks=[]
    var finishprojects = []
    var finishall = []

    if (ui){
      //如果已经登录
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
          //完成
          else{
            var finishtask = res.result.data[i]
            finishtask['identity'] = 'task'
            finishtasks.push(finishtask)
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
            //全做完的
            else{
              var finishproject = res.result.data[i]
              //身份
              finishproject['identity'] = 'project'
              finishprojects.push(finishproject)
            }
          }
          //把project和tasks合并起来(concat(project))
          all=tasks.concat(projects)
          finishall=finishtasks.concat(finishprojects)
          //排序
          all.sort(this.compare)
          finishall.sort(this.compare)
          that.setData({
            tasks:tasks,
            projects:projects,
            all:all,
            finishtasks:finishtasks,
            finishprojects:finishprojects,
            finishall:finishall
          })
          //未完成的
          if (all.length>0){
            that.setData({
              unfinish:true
            })
          }
          //完成了的
          if (finishall.length>0){
            that.setData({
              finish:true
            })
          }
          //其他
          if(all.length==0&&finishall.length==0) {
            that.setData({
              unfinish:false,
              finish:false
            })
          }

        })
      })
      
    }
    //未登录
    else{
      that.setData({
        tasks:[]
      })
      wx.showModal({
        //到时候把取消给删掉，必须要登录才能使用我们小程序
        title:"您尚未登录",
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