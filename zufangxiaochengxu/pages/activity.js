// pages/activity.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*var urlTop = options.url;
    var url = decodeURIComponent(options.url);
    var titlesTop = options.title;
    var titles = decodeURIComponent(options.title);
    console.log(url, '11url')
    console.log(url,'url')
    this.setData({
      url: url,
      titles: titles,
      urlTop: urlTop,
      titlesTop: titlesTop,
    })
    wx.setNavigationBarTitle({
      title: titles
    })*/
    app.aldstat.sendEvent('红包领取H5页访问');
  },
  
  onShareAppMessage: function (event) {
    /*var titles = this.data.titlesTop;
    var title = this.data.titles;
    var urls = this.data.urlTop;*/
    return {
      title: '0元抢购保洁券',
      desc: '',
      path: "pages/activity",
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log(1);
      },
      fail: function (res) {
        // 转发失败
        console.log(2);
      }
    }
  },
  /*encodeURIComponent: function () {
    var url = encodeURIComponent('https://special.gongyujia.com/#/zeroActivity');
    var titles = encodeURIComponent('0元抢购保洁券');
    console.log(url,titles)
  }*/
})