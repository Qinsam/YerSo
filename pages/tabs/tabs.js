// pages/tabs/tabs.js
var app = getApp()
wx.cloud.init({env:"q-tx5ik"})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: "baoxiao",
    currentTabNo:0
  },

  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullDownRefresh: function (e) {
    //console.log("下拉刷新");
    this.onLoad();
  },
  pullUpLoad: function (e) {
    //console.log(this.currentTabNo)
    //console.log("**")
    //console.log(app.page)
    app.page[this.currentTabNo]++

    this.setData({
      page: app.page[this.currentTabNo]
    })
    //console.log("上拉加载 ");
    //console.log(app.page[this.currentTabNo]);
    this.loading();
    this.getTypeData(app.page[this.currentTabNo]);
  },

  check: function (e) {
    app.cssActive = e.target.dataset.id
    this.currentTab = e.target.id;
    this.currentTabNo = parseInt(e.target.dataset.id)
    //console.log(e.target.id)
    this.resetData();
    this.setData({
      dataId: app.cssActive,
      title: app.title[this.currentTabNo],
      imgUrls: app.imgUrls[this.currentTabNo],
      author: app.author,
      date: app.date,
      page: app.page[this.currentTabNo]
    }),
    //console.log(app.page)
    //console.log(app.title)
    this.loading();
    this.getTypeData(app.page[this.currentTabNo]);
  },

  resetData: function () {
    /*
    app.title = [];
    app.imgUrls = [];
    app.author = [];
    app.title = [];
    */
  },

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },

  getTypeData: function (page) {
    var _this=this
    var _app=app
    //console.log(this.currentTab)
    //console.log(page)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'paginator',
      // 传给云函数的参数
      data: {
        "dbName":_this.currentTab,
        "pageIndex":page,
        "pageSize":10
      },
      success: function (res) {
        //console.log(res.result.data)
        //console.log(page)
        for (var i = 0; i < res.result.data.length; i++) {
          //console.log(_this.currentTabNo)
          //console.log(_app.title)
          _app.title[_this.currentTabNo].push(res.result.data[i].title);
          _app.imgUrls[_this.currentTabNo].push(res.result.data[i].src);
        }
        //   console.log( app.imgUrls );
        _this.setData({
          title: _app.title[_this.currentTabNo],
          imgUrls: _app.imgUrls[_this.currentTabNo],
          page: _app.page[_this.currentTabNo]
        })
      },
      fail: function(){
        console.log("get feed error")
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
    this.currentTab="baoxiao"
    this.currentTabNo=0
    this.getTypeData(app.page[this.currentTabNo])
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})