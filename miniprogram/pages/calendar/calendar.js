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

    allfinish:false,
    allunfinish:false,
    //今日任务
    tasks:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMonthDaysCurrent(new Date())
    this.setTodayTask()
  },
  onShow: function(){
    
  },
  //设置今日任务
  setTodayTask(){
    const ui=wx.getStorageSync('userinfo')
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
      tasks=res.result.data
      for (var i=0;i<tasks.length;i++){
        var ddldate = tasks[i].fDeadline.split(' ')
        //当前日期等于tasks里面的ddl
        if (ddldate[0]==ddl){
          var task = tasks[i]
          todayTask.push(task)
          this.setData({
            tasks:todayTask
          })
        }else{
          console.log(2)
        }
      }
      //今日无任务
      if(this.data.tasks.length==0){
        // this.setData({
        //   allfinish:true,
        //   allunfinish:true
        // })
        console.log(1)
      }else{
        //今日有任务
        console.log(2)
      }
      console.log(this.data.tasks)
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
          wx.showToast({
            title: '加载完成',
            duration:1000
          })
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
    wx.hideLoading()
  },

  // 从未完成到完成
  toFinish(){
    console.log("toFinish")
    wx.showModal({
      title:"请确认该任务是否真的完成",
      confirmColor:"#34D0BA",
      success(res){
        if (res.confirm){

        }
        else{

        }
      }
    })
  },

  // 从完成到未完成
  toUnFinish(){
    console.log("toUnFinish")
    wx.showModal({
      title:"请确认该任务是否仍未完成",
      confirmColor:"#34D0BA",
      success(res){
        if (res.confirm){

        }
        else{
          
        }
      }
    })
  },
})