// pages/calendar/calendar.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    // 所选择日期
    selectDate: {
      'year': new Date().getFullYear(),
      'month': new Date().getMonth() + 1,
      'date': new Date().getDate(),
    },
    calendarTitle: '',
    // 日期list 
    calendarDays: [],
    //有完成的任务
    allfinish:false,
    //有未完成的任务
    allunfinish:false,
    //今日任务
    todaytasks:[],
    unfinishtasks:[],
    finishtasks:[],
    // user表里的fGroup（群组任务的时候用）
    fGroup:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMonthDaysCurrent(new Date())
    this.setTodayTask()
  },
  onShow: function(){
    this.setTodayTask()
    const ui = wx.getStorageSync("userinfo")
    const that = this
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
    })
  },
  //设置今日任务
  setTodayTask(){
    const ui=wx.getStorageSync('userinfo')
    const that = this
    //所有任务
    var tasks = []
    //今日任务
    var todayTask = []
    var ddl = this.data.calendarTitle
    wx.cloud.callFunction({
      name:"getTTask",
      data:{
        openid:ui.openid
      }
    }).then(res=>{
      //所有任务
      tasks=res.result.data
      for (var i=0;i<tasks.length;i++){
        var ddldate = tasks[i].fDeadline.split(' ')
        //当前日期等于tasks里面的ddl(今日任务)
        if (ddldate[0]==ddl){
          //如果就是今天的任务，task就是今天的任务之一
          var task = tasks[i]
          todayTask.push(task)
        }
      }
      // 获取加入的群
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
          // 无任务
          if (groupDetail[i].fTask.length == 0 ){
            continue
          }
          // 有任务，则遍历所有的任务
          for (let j = 0;j<groupDetail[i].fTask.length;j++){
            // 如果这个任务没做完 且 ddl是今天
            var ddldate = groupDetail[i].fTask[j].fDeadline.split(' ')
            if (ddldate[0] == ddl){
              groupDetail[i].fTask[j]['name'] = "group"
              groupDetail[i].fTask[j]['fGroupNum'] = groupDetail[i].fGroupNum
              groupDetail[i].fTask[j]['fTask'] = groupDetail[i].fTask[j].fTaskname
              todayTask.push(groupDetail[i].fTask[j])
            }
          }
        }

        that.setData({
          todaytasks:todayTask
        })

        //今日无任务
        if(todayTask.length==0){
          that.setData({
            allfinish:false,
            allunfinish:false,
            todaytasks:[],
            unfinishtasks:[],
            finishtasks:[]
          })
        }
        //今日有任务
        else{
          var unfinishflag = false
          var finishflag = false
          //未完成的任务
          var unfinishtasks=[]
          //完成的任务
          var finishtasks=[]
          for(var i=0;i<that.data.todaytasks.length;i++){
            // 群任务
            if (todayTask[i].name == 'group'){
              // 如果列表有你，退出的flag
              let flag = false
              for (let j=0;j<todayTask[i].fFinish.length;j++){
                // 已完成列表里有你
                if (todayTask[i].fFinish[j].openid == ui.openid){
                  finishflag = true
                  finishtasks.push(todayTask[i])
                  flag = true
                  break
                }
                
              }
              // 未完成
              if (!flag){
                unfinishflag = true
                unfinishtasks.push(todayTask[i])
              }
            }
            // 普通任务
            else{
              //未做完
              if (that.data.todaytasks[i].fFinish==false){
                unfinishflag = true
                var task = that.data.todaytasks[i]
                unfinishtasks.push(task)
              }
              // 已完成
              else{
                finishflag=true
                var task = that.data.todaytasks[i]
                finishtasks.push(task)
              }
            }
            
          }
          that.setData({
            allfinish:finishflag,
            allunfinish:unfinishflag,
            unfinishtasks:unfinishtasks,
            finishtasks:finishtasks
          })
        }
      })
    })
  },
  //最上面左右切换月份
  handleCalendar(e){
    wx.showLoading({
      title: '加载中',
      mask : true
    })
    const handle = e.currentTarget.dataset.handle;//点击的是上一个月还是下一个月
    const cur_year = this.data.selectDate.year;
    const cur_month = this.data.selectDate.month;
    if (handle == "prev"){
      let newMonth = cur_month-1;
      let newYear = cur_year;
      if (newMonth<1){//现在是12月
        newYear = cur_year -1 ;
        newMonth = 12;
      }
      let e = new Date(cur_year, cur_month - 2, this.data.selectDate.date)
      this.getMonthDaysCurrent(e)
    }
    else{
      let newMonth = cur_month-1;
      let newYear = cur_year;
      if (newMonth<1){//现在是12月
        newYear = cur_year -1 ;
        newMonth = 12;
      }
      let e = new Date(cur_year, cur_month , this.data.selectDate.date)
      this.getMonthDaysCurrent(e)
    }
    this.setTodayTask()
    wx.hideLoading()
  },
  // 所选时间对应月份日期
  getMonthDaysCurrent(e) {
    let year = e.getFullYear()
    let month = e.getMonth() + 1
    let date = e.getDate()
    let day = e.getDay() // 周几
    let days = new Date(year, month, 0).getDate() //当月天数(即下个月0号=当月最后一天)

    let firstDayDate = new Date(year, month - 1, 1) // 当月1号
    let firstDay = firstDayDate.getDay() //当月1号对应的星期

    let lastDate = new Date(year, month - 1, days) //当月最后一天日期
    let lastDay = lastDate.getDay() //当月最后一天对应的星期

    // 更新选择日期
    this.data.selectDate = {
      'year': year,
      'month': month,
      'date': date,
    }
    
    // 更新顶部显示日期
    this.setData({
      calendarTitle: year + "-" + (month > 9 ? month : "0" + month) + "-" + (date > 9 ? date : "0" + date)
    })
    let calendarDays = []

    // 上个月显示的天数及日期
    for (let i = firstDay - 1; i >= 0; i--) {
      let date = new Date(year, month - 1, -i)
      //console.log(date, date.getMonth() + 1)

      calendarDays.push({
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'date': date.getDate(),
        'day': date.getDay(),
        'current': false,
        'selected': false
      })
      this.setTodayTask()
    }

    // 当月显示的日期
    for (let i = 1; i <= days; i++) {
      calendarDays.push({
        'year': year,
        'month': month,
        'date': i,
        'day': new Date(year, month - 1, i).getDay(),
        'current': true,
        'selected': i == date // 判断当前日期
      })
    }

    // 下个月显示的天数及日期
    for (let i = 1; i < 7 - lastDay; i++) {
      let date = new Date(year, month, i)
      //console.log(date, date.getMonth() + 1)

      calendarDays.push({
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'date': date.getDate(),
        'day': date.getDay(),
        'current': false,
        'selected': false
      })
    }

    this.setData({
      calendarDays: calendarDays
    })
  },

  // 手动选中日期
  clickDate(e) {
    wx.showLoading({
      title: '加载中',
      mask : true
    })
    let index = e.currentTarget.dataset.index
    let list = this.data.calendarDays
    for (let i = 0; i < list.length; i++) {
      list[i].selected = i == index
      if (i == index) {
        console.log(list[i], this.data.selectDate)
        // 如果选择日期不在当月范围内，则重新刷新日历数据
        if (list[i].year != this.data.selectDate.year || list[i].month != this.data.selectDate.month) {
          let date = new Date(list[i].year, list[i].month - 1, list[i].date)
          this.getMonthDaysCurrent(date)
          wx.hideLoading()
          return
        }
        // 更新顶部显示日期
        this.setData({
          calendarTitle: list[i].year + "-" + (list[i].month > 9 ? list[i].month : "0" + list[i].month) + "-" + (list[i].date > 9 ? list[i].date : "0" + list[i].date),
        })
        this.data.selectDate = {
          'year':list[i].year,
          'month':list[i].month,
          'date': list[i].date,
        }
      }
    }
    this.setData({
      calendarDays: list
    })
    this.setTodayTask()
    wx.hideLoading()
  },

  // 从未完成到完成
  toFinish(e){
    const ui = wx.getStorageSync('userinfo')
    //点击的是第几个
    var index = e.currentTarget.dataset.index
    var task = this.data.unfinishtasks[index]
    const that = this
    console.log(task)
    wx.showModal({
      title:"请确认该任务是否真的完成",
      confirmColor:"#34D0BA",
      success(res){
        //点击确定键，就把该项从未完成变到完成
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          // 群任务
          if (task.name == "group"){
            // 在fFinish那里加上你的ui,并改unfinishtask和finishtask（setTodayTask()）
            task.fFinish.push(ui)
            // 更新
            wx.cloud.callFunction({
              name:"updateGroupTaskFinishMember",
              data:{
                fGroupNum:task.fGroupNum,
                fNum:task.fNum,
                finish:task.fFinish
              }
            }).then(res=>{
              console.log(res)
              that.setTodayTask()
              wx.hideLoading()
            })
          }
          // 普通任务
          else{
            //首先是数据库要改变，其次是调用setTodayTask方法。(unfinishtasks删除该项，finishtasks增加该项)
            db.collection('t_task').doc(task._id).update({
              data:{
                fFinish:true
              }
            }).then(res=>{
              that.setTodayTask()
              wx.hideLoading()
            })
          }
          
        }
      }
    })
  },

  // 从完成到未完成
  toUnFinish(e){
    const ui = wx.getStorageSync('userinfo')
    var index = e.currentTarget.dataset.index
    var task = this.data.finishtasks[index]
    const that = this
    wx.showModal({
      title:"请确认该任务是否仍未完成",
      confirmColor:"#34D0BA",
      success(res){
        if (res.confirm){
          wx.showLoading({
            title: '加载中',
            mask:true
          })
          // 群任务
          if (task.name == "group"){
            for (let i=0;i<task.fFinish.length;i++){
              if (ui.openid == task.fFinish[i].openid){
                task.fFinish.splice(i,1)
                break
              }
            }
            // 更新
            wx.cloud.callFunction({
              name:"updateGroupTaskFinishMember",
              data:{
                fGroupNum:task.fGroupNum,
                fNum:task.fNum,
                finish:task.fFinish
              }
            }).then(res=>{
              console.log(res)
              that.setTodayTask()
              wx.hideLoading()
            })
          }
          // 任务
          else{
            db.collection('t_task').doc(task._id).update({
              data:{
                fFinish:false
              }
            }).then(res=>{
              that.setTodayTask()
              wx.hideLoading()
            })
          }
          
        }
      }
    })
  },
})