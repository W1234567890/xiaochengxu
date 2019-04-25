var app = getApp();
var url = app.globalDataApp.gyjProductBase + "miniapi/user/login";
var disabledBtn = true;
var headerData = app.globalHeaderData;
Page({
  data: {
    disabledBtn:true,
    headerData: headerData,
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('登录页面打开');
    var openid = wx.getStorageSync('openid');
    if (!openid){
      var openid='';
    }
    console.log(openid,'openid')
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code');
    var role = options.role;
    this.setData({
      role: role,
    })
    if (options.url) {
      var back_url = options.url;
    }
    else {
      var back_url = '';
    }
    /*//判断跳转登录的来源
    if (options.url){
      var back_url = decodeURIComponent(options.url);
      this.setData({
        back_url: back_url
      });
      console.log(back_url, 'back_url')
    }*/

    /*wx.login({
      success: res => {
        var that = this;
        console.log(res,'kkkkkkkkkkk')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: app.globalDataApp.gyjProductBase + 'miniapi/user/getUserOpenId',
          data: {
            os_type: app.globalDataApp.os_type,
            os_version: app.globalDataApp.os_version,
            channel: app.globalDataApp.channel,
            network: app.globalDataApp.network,
            version_code: app.globalDataApp.version_code,
            area_code:area_code,     //百度地图返回的city_code
            app_device: openid,   //APP运行设备的唯一标识OPEN_ID
            package_name: "",   //应用包名
            g_uid: g_uid,
            js_code: res.code,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            console.log(res.data, 'login Openid')
            wx.setStorageSync('openid', res.data.openid);
            var sessionkey = res.data.content.session_key;
            console.log(sessionkey, 'sessionkey-login')
            that.setData({
              sessionkey: sessionkey
            })
          },
          fail:function(res){
            console.log(res.data, 'login1111')
          }
        })
      }
    })*/
    wx.getSystemInfo({
      success: function (res) {
        console.log(res,'888888')
        var system = res.system;
        var system = system.split(' ');
        console.log(system, '设备')
        if (system[0] == 'iOS'){
          var system = 'iOS';
          wx.setStorageSync('system', system);
        }
        else
        {
          var system = '安卓';
          wx.setStorageSync('system', system);
        }
      }
    })

  },
  /*onShow: function () {
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      var openid = '';
    }
    console.log(openid, 'openid')
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code');
    var role = this.data.role;
    var back_url = this.data.back_url;
    this.setData({
      role: role,
    })

    wx.login({
      success: res => {
        var that = this;
        console.log(res, 'kkkkkkkkkkk')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: app.globalDataApp.gyjProductBase + 'miniapi/user/getUserOpenId',
          data: {
            os_type: app.globalDataApp.os_type,
            os_version: app.globalDataApp.os_version,
            channel: app.globalDataApp.channel,
            network: app.globalDataApp.network,
            version_code: app.globalDataApp.version_code,
            area_code: area_code,     //百度地图返回的city_code
            app_device: openid,   //APP运行设备的唯一标识OPEN_ID
            package_name: "",   //应用包名
            g_uid: g_uid,
            js_code: res.code,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            console.log(res.data, 'loginShow')
            wx.setStorageSync('openid', res.data.openid);
            var sessionkey = res.data.content.session_key;
            console.log(sessionkey, 'sessionkey-login')
            that.setData({
              sessionkey: sessionkey
            })
          },
          fail: function (res) {
            console.log(res.data, 'login1111')
          }
        })
      }
    })
    },*/
  //获取手机号信息
  getPhoneNumber: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var sessionkey = wx.getStorageSync('sessionkey');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
    var back_url = wx.getStorageSync('back_url'); 
    var system = wx.getStorageSync('system');
    var headerData = that.data.headerData;
   // var sessionkey = that.data.sessionkey;
    console.log(g_uid,'g_uid',sessionkey,'sessionkey')
    var role = that.data.role;
    var iv=e.detail.iv;
    var encryptedData = e.detail.encryptedData;
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
        g_uid: '',
        role:role,//1：租客，2：经纪人，3：房东
        session_key: sessionkey,
        encrypted_data: encryptedData,
        iv: iv,
        system: system,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: '',
        source: '1',
        sign: '1'
      },
      success: function (res) {
        console.log(res.data,'phone');
        console.log(res.data.content.user_info.g_uid,'res.data.content.user_info.g_uid')
        if (res.data.ret == 0) {
          //保存用户ID,TOKEN
          wx.setStorageSync('token', res.data.content.user_info.token); 
          wx.setStorageSync('mobile', res.data.content.user_info.mobile);
          wx.setStorageSync('g_uid', res.data.content.user_info.g_uid);
          wx.setStorageSync('index', res.data.content.user_info.role-1);
          wx.setStorageSync('type_wx', '');
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
          })
          //var back_url = that.data.back_url;
          console.log(back_url, 'back_url1111')
          //判断跳转登录的来源
          if (!back_url || back_url == "undefined") {
            wx.navigateTo({
              url: '../../personal/personal',
            })
          }
          else
          {
            console.log(back_url, 'back_url222')
            wx.navigateTo({
              url: back_url,
            })
          }
        }
        else{
          if (res.data.msg =='角色不符合，登录失败')
          {
            wx.showModal({
              content: res.data.msg,
              showCancel:false,
              success:function(){
                wx.navigateBack({
                  delta:1,
                })
              }
            })
          }
        }
      },
      fail:function(res){
          console.log(res,'err')
      }
    })
  },
  //跳转注册页
  registerBtn:function(){
    wx.navigateTo({
      url: '../registerNext/registerNext',
    })
  },
  //跳转忘记密码页
  forgetBtn: function () {
    wx.navigateTo({
      url: '../forget/forget?type=1',
    })
  },

  //微信登录跳转绑定手机号页
  onGotUserInfo: function(e) {
    console.log(e.detail.userInfo,'onGotUserInfo')
    wx.setStorageSync('nick_name', e.detail.userInfo.nickName);
    wx.setStorageSync('avatar', e.detail.userInfo.avatarUrl);
    wx.navigateTo({
      url: '../bindMobile/bindMobile',
    });  
  },
  //获取输入内容
  mobileTap:function(e){
    var mobile=e.detail.value;
    if (!mobile){
        this.setData({
          disabledBtn:true,
        })
    }
    else {
      this.setData({
        disabledBtn: false,
      })
    }
  },
  //跳转手机验证码登录页面
  loginTelBtn:function(){
    wx.navigateTo({
      url: '../loginTel/loginTel',
    })
  }
})