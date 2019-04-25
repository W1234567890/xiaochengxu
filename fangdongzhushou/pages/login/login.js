var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/user/login_ren";
var disabledBtn = true;
var headerData = app.globalHeaderData;
Page({
  data: {
    disabledBtn: true,
    headerData: headerData,
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('登录页面打开');
    wx.login({
      success: res => {
        var that = this;
        console.log(res, 'kkkkkkkkkkk')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: 'https://api.gongyujia.com/home/user/getUserLandlordOpenId',
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
            console.log(res, 'login Openid')
            //保存openid,sessionkey
            wx.setStorageSync('openid', res.data.data.openid);
            wx.setStorageSync('sessionkey', res.data.data.session_key);
            console.log(res.data.data.session_key,'res.data.data.session_key')
          },
          fail: function (res) {
            console.log(res.data, 'login1111')
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res, '888888')
        var system = res.system;
        var system = system.split(' ');
        console.log(system, '设备')
        if (system[0] == 'iOS') {
          var system = 'iOS';
          wx.setStorageSync('system', system);
        }
        else {
          var system = '安卓';
          wx.setStorageSync('system', system);
        }
      }
    })

  },
  //获取手机号信息
  getPhoneNumber: function (e) {
    console.log(e,'000000')
    var that = this;
    var openid = wx.getStorageSync('openid');
    var sessionkey = wx.getStorageSync('sessionkey');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
    var back_url = wx.getStorageSync('back_url');
    var system = wx.getStorageSync('system');
    var headerData = that.data.headerData;
    // var sessionkey = that.data.sessionkey;
    console.log(sessionkey, 'sessionkey')
    var role = that.data.role;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;

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
        session_key: sessionkey,
        encrypted_data: encryptedData,
        iv: iv,
        system: system,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
        source: '1',
        sign: '1'
      },
      success: function (res) {
        console.log(res.data, 'phone');
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
        var have_roles=res.data.content.user_info.have_roles;
        for (var i = 0; i < have_roles.length;i++){
          if (have_roles[i] == 3 || have_roles[i] == 4) {
            wx.setStorageSync('num', have_roles[i]);
            //跳转首页
            wx.switchTab({
              url: '../index/index',
            })
            return false;
          }
        }//跳转角色选择
        wx.navigateTo({
          url: 'role/role?changeKey=0',
        })
          
          
      },
      fail: function (res) {
        console.log(res, 'err')
      }
    })
  },

  //微信登录跳转绑定手机号页
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo, 'onGotUserInfo')
    wx.setStorageSync('nick_name', e.detail.userInfo.nickName);
    wx.setStorageSync('avatar', e.detail.userInfo.avatarUrl);
    wx.navigateTo({
      url: '../bindMobile/bindMobile',
    });
  },

  //账号登录页面
  accountTap:function(){
    wx.navigateTo({
      url: 'account/account',
    })
  }
})