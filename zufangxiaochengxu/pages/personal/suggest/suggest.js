// pages/personal/suggest/suggest.js
var app = getApp();
var url = app.globalDataApp.gyjProductBase + "miniapi/feedback";
var headerData = app.globalHeaderData;
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
    app.aldstat.sendEvent('投诉与建议页面打开');
    var Pagetoken = wx.getStorageSync('token');
    if (!Pagetoken) {
      wx.redirectTo({
        url: '/pages/login/login/login',
      })
    }  
  },
  //提交投诉建议
  formSubmit: function (e) {
    app.aldstat.sendEvent('提交投诉建议');
    var mobile = e.detail.value.mobile;
    var content = e.detail.value.content;
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    var util = require('../../../utils/util.js');   
  
    if (content == "") {
      wx.showToast({
        title: '请填写内容！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    var mobileIf = util.validatemobile(mobile);
    if (mobileIf == false) {
      return false;
    }
    //请求接口
    wx.request({
      url: url,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        tel_num: mobile,
        content: content,
        user_id: g_uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: headerData,
      success: function (res) {
        console.log(res);
        if (res.data.ret == 0) {
          wx.showToast({
            title:'感谢您的参与！',
            icon: 'success',
            duration: 1500
          });

          wx.navigateBack({
            delta:1,
          })
          return false;        
        } 
        else if (res.data.ret == 401) {
          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');

          //保存跳转链接
          var to_url = '/pages/personal/suggest/suggest';
          wx.setStorageSync('back_url', to_url);
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
          })
        }
        else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1500
          });
          return false;
        }
      }
    })   
  }
})