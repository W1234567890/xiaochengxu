var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/user/login";
var disabledBtn = true;
Page({
  data: {
    disabledBtn:true,
  },
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid');
    if (!openid){
      var openid='';
    }
    console.log(openid,'openid')
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code');
    wx.getSystemInfo({
      success:function(res){
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
  //获取手机号信息
  getPhoneNumber: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var sessionkey = wx.getStorageSync('sessionkey');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
    var system = wx.getStorageSync('system');
   // var sessionkey = that.data.sessionkey;
    console.log(sessionkey,'sessionkey')
    var iv=e.detail.iv;
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
        role:1,//1：租客，2：经纪人，3：房东
        session_key: sessionkey,
        encrypted_data: encryptedData,
        iv: iv,
        system: system,
        type_wx: 'brand_wx',
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
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
          wx.setStorageSync('type_wx', 'brand_wx');
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
          })
          setTimeout(function () { 
            wx.navigateBack({
              delta: 1,
            }) 
          }, 1000);
          
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
})