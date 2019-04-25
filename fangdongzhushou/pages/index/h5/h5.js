// pages/list/listDetailOthers/h5/h5.jsvar app = getApp();
var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imgUrl = this.data.imgUrl;
    var imgUrlLast = this.data.imgUrlLast;
    if (!options.url) {
      var link = options.link;
      var houseTitle = options.houseTitle;
      var poster = options.poster;
    }
    else {
      var linkList = decodeURIComponent(options.url);
      console.log(linkList,'linkList')
      var link = linkList.split("?")[0];
      var poster = linkList.split("?")[1].split("&")[0].split("=")[1];
      var houseTitle = linkList.split("?")[1].split("&")[1].split("=")[1];
    }
    var imageUrl = imgUrl + poster + imgUrlLast;
    this.setData({
      link: link,
      poster: poster,
      imageUrl: imageUrl,
      houseTitle: houseTitle
    })
  },

  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('H5详情页分享点击');
    var link = this.data.link;
    var poster = this.data.poster;
    var imageUrl = this.data.imageUrl;
    var houseTitle = this.data.houseTitle;
    console.log(poster, 'poster');
    return {
      title: houseTitle,
      imageUrl: imageUrl,
      path: '/pages/index/h5/h5?link=' + link + '&poster=' + poster + '&houseTitle=' + houseTitle,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})