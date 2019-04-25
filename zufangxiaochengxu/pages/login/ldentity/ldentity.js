// pages/login/ldentity/ldentity.js
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
    app.aldstat.sendEvent('身份选择页面打开');
    var url = options.url;
    console.log(url);
    this.setData({
      url: url,
    })


    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code');
   
    wx.login({
      success: res => {
        var that = this;
        console.log(res, 'kkkkkkkkkkk')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: 'https://api.gongyujia.com/home/user/getUserOpenId',
          data: {
            app_id: '0007',
            sign: '73a9627c42fc4fd2ba16e3df3e99f9c6',
            udid: 'wxapp',
            version: '200',
            channel_id: '001',
            js_code: res.code,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res.data, 'login Openid')
            //保存openid,sessionkey
            wx.setStorageSync('openid', res.data.data.openid);
            wx.setStorageSync('sessionkey', res.data.data.session_key);
          },
          fail:function(res){
            console.log(res.data, 'login1111')
          }
        })
      }
    })
  },
  ldentityTap:function(e){
    var role = e.currentTarget.dataset.id;
    var url = this.data.url;
    wx.navigateTo({
      url: '../login/login?role=' + role + '&url=' + url,
    })
  }
})