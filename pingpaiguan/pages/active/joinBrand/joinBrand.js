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

  },

  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('首页入驻页面分享点击');
    return {
      title: '品牌馆入驻',
      path: '/pages/active/joinBrand/joinBrand',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})