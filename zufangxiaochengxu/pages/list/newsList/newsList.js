// pages/list/newsLsit/newsList.js
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
    if (!options.url) {
      var link = options.link;
      var newsTitle = options.newsTitle;
      var posterImg = options.posterImg;
    }
    else {
      var url = decodeURIComponent(options.url);
      var link = url.split("?")[0];
      var newsTitle = url.split("?")[1].split("&")[0].split("=")[1];
      var posterImg = url.split("?")[1].split("&")[2].split("=")[1];
    }
    this.setData({
      link: link,
      newsTitle: newsTitle,
      posterImg: posterImg,
    })
    
  },
  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('首页H5详情页分享点击');
    var house_id = this.data.house_id;
    var link = this.data.link;
    var newsTitle = this.data.newsTitle;
    var posterImg = this.data.posterImg;
    return {
      title: newsTitle,
      imageUrl: posterImg,
      path: '/pages/list/newsList/newsList?link=' + link + '&newsTitle=' + newsTitle + '&posterImg=' + posterImg,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})