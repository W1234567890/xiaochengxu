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
      var house_id = options.house_id;
      var relative_id = options.relative_id;
      var houseTitle = options.houseTitle;
      var poster = options.poster;
    }
    else {
      var linkList = decodeURIComponent(options.url);
      var link = linkList.split("?")[0];
      var house_id = linkList.split("?")[1].split("&")[0].split("=")[1];
      var poster = linkList.split("?")[1].split("&")[3].split("=")[1];
      var relative_id = linkList.split("?")[1].split("&")[1].split("=")[1];
      var houseTitle = linkList.split("?")[1].split("&")[4].split("=")[1];
    }
    var imageUrl = imgUrl + poster + imgUrlLast;
    var url = link + '?house_id=' + house_id + '&relative_id=' + relative_id;
    /*//动态修改标题
    if (houseTitle) {
      wx.setNavigationBarTitle({
        title: houseTitle,
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: '公寓家房源详情',
      })
    }*/
    this.setData({
      link: link,
      house_id: house_id,
      poster: poster,
      relative_id: relative_id,
      url: url,
      imageUrl: imageUrl,
      houseTitle: houseTitle
    })
    console.log(houseTitle, 'houseTitle')
    console.log(link, 'link')
    console.log(house_id, 'house_id')
    console.log(poster, 'poster')
    console.log(url, 'url')
  },

  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('H5详情页分享点击');
    var house_id = this.data.house_id;
    var link = this.data.link;
    var poster = this.data.poster;
    var relative_id = this.data.relative_id;
    var imageUrl = this.data.imageUrl;
    var houseTitle = this.data.houseTitle;
    console.log(poster,'poster');
    return {
      title: houseTitle,
      imageUrl: imageUrl,
      path: '/pages/list/listDetailOthers/h5/h5?house_id=' + house_id + '&link=' + link + '&poster=' + poster + '&relative_id=' + relative_id + '&houseTitle=' + houseTitle,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})