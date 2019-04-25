// pages/personal/setting/setting.js
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
  /**编辑资料 */
  editTap:function(){
    wx.navigateTo({
      url: 'edit/edit',
    })
  },
  /**关于公寓家 */
  aboutTap: function () {
    wx.navigateTo({
      url: 'about/about',
    })
  },
})