var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/user/user_login";
Page({
  data: {
  
  },
  onLoad: function (options) {
    
  },
 
  formSubmit: function (e) {
    var utilMd5 = require('../../../utils/md5.js');
    var mobile = e.detail.value.mobile;
    var password=e.detail.value.password; 
    var mobileIf=this.validatemobile(mobile);
    if (mobileIf==false){
      return false;
    }
    if (password == '') {
      wx.showToast({
        title: '请输入密码！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    var password = utilMd5.hexMD5(password);
    wx.request({
      url: url,
      data: {
        os_type: app.globalDataJson.os_type,
        os_version: app.globalDataJson.os_version,
        channel: app.globalDataJson.channel,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        package_name: "",   //应用包名
        area_code: app.globalDataJson.area_code,
        phone_bind: mobile,
        g_pwd: password,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {

        if (res.data.code==400){
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1500
          });
          return false;
        }

        console.log(res);
        
        //保存用户ID,TOKEN
        wx.setStorageSync('token', res.data.content.user_info.token);
        wx.setStorageSync('mobile', res.data.content.user_info.mobile);
        wx.setStorageSync('g_uid', res.data.content.user_info.g_uid);
        wx.setStorageSync('nickname', res.data.content.user_info.nickname);
        wx.setStorageSync('avatar', res.data.content.user_info.avatar);
        wx.setStorageSync('have_roles', res.data.content.user_info.have_roles);
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
        })
        setTimeout(function () {
          var have_roles = res.data.content.user_info.have_roles;
          for (var i = 0; i < have_roles.length; i++) {
            if (have_roles[i] == 3 || have_roles[i] == 4) {
              wx.setStorageSync('num', have_roles[i]);
              //跳转首页
              wx.switchTab({
                url: '../../index/index',
              })
              return false;
            }
          }//跳转角色选择
          wx.navigateTo({
            url: '../role/role?changeKey=1',
          })
        }, 1200);
      },
      fail: function (res) {
        console.log(res, 'err')
      }
    })
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    return true;
  },
  registerBtn:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  forgetBtn: function () {
    wx.navigateTo({
      url: '../forget/forget?type=1',
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  /*onUnload: function () {
    wx.switchTab({
      url: '/pages/list/list',
    })
  },*/
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '公寓家房东助手',
      desc: '',
      path: '/pages/login/login/login',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})