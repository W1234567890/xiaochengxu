// pages/personal/suggest/suggest.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/upload_house_list";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    user_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mobile = wx.getStorageSync('mobile'); 
    this.setData({
      mobile: mobile,
    })
  },
  //获取输入框内容
  textareaTap: function (event){
    var content = event.detail.value;
    this.setData({
      content: content,
    })
  },
  //提交
  suggestTap: function () {
    var mobile = wx.getStorageSync('mobile');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token'); 
    var content = this.data.content;
    if (content==''){
      wx.showToast({
        title: '请填写意见！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    else{
      content=this.data.content;
    }
    if (!g_uid){
      var user_id=0;
    }
    else{
      var user_id = g_uid;
    }
    wx.request({
      url: url,
      data: {
        os_type: app.globalDataJson.os_type,
        os_version: app.globalDataJson.os_version,
        channel: app.globalDataJson.channel,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        tel_num: mobile,
        content: content,
        user_id: user_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res, '1111111111')
        if(res.data.ret==0){
          wx.showToast({
            title: '提交成功！',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () { 
            wx.switchTab({
              url: '../../personal/personal',
            })
          }, 1200);
          
        }
      }
    })
  }
  
})