// pages/personal/personal.js
var app = getApp(); 
let isIphoneX = app.globalData.isIphoneX;
var tabBar = app.tabBar1;
var url = app.globalData.gyjProductBase + "home/user/getBanner";
var url1 = app.globalDataApp.gyjProductBase + "miniapi/user/login";
Page({
  data: {
    tabBar: tabBar,
    array: ['租客', '经纪人', '房东'],
    index: 0, 
    isIpx: isIphoneX ? true : false
  },
  onLoad: function (options) {
    var that = this;
    console.log(that.data.isIpx,'that.data.isIpx')
    tabBar.isIpx = that.data.isIpx;
    that.setData({
      tabBar: tabBar,
    })
    /*wx.setStorageSync('token', '27669a59-d4cc-4c3a-8a3b-920c7ac1c3b8');
    wx.setStorageSync('g_uid', '65');
    var token = '27669a59-d4cc-4c3a-8a3b-920c7ac1c3b8';
    var g_uid = 65;
    that.setData({
      token: token,
      g_uid: g_uid,
      kkk: '3kkk3'
    });
    this.loginTap() */
   
    app.aldstat.sendEvent('个人中心页面打开');
    if (options.type_wx == '' || options.type_wx) {
      wx.setStorageSync('type_wx', options.type_wx);
    }
    else {
      var type_wx = wx.getStorageSync('type_wx');
    }
    if (options.token || options.token=='') {

      if (options.token == '') {
        wx.removeStorageSync('token');
        wx.removeStorageSync('g_uid');
        var token = '';
        var g_uid = '';
        that.setData({
          token: token,
          g_uid: g_uid,
        });
        that.loginTap()
        console.log(token, 'token001')
      }
      else{
        wx.setStorageSync('token', options.token);
        wx.setStorageSync('g_uid', options.g_uid);
        var token = options.token;
        var g_uid = options.g_uid;
        that.setData({
          token: token,
          g_uid: g_uid,
          index: 0
        });
        that.loginTap()
        console.log(g_uid,token, 'token002')
      }
    }
    else {
      var token = wx.getStorageSync('token');
      var g_uid = wx.getStorageSync('g_uid');
      var mobile = wx.getStorageSync('mobile');
      var index = wx.getStorageSync('index');
      that.setData({
        token: token,
        g_uid: g_uid,
        mobile: mobile,
        index: index,
      });
    }
    console.log(token, g_uid, 'ppppppppppppppp')
  },
  /*onShow:function(){
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    this.loginTap()
  },*/
  //获取背景图
  /*telTap: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    wx.request({
      url: url,
      data: {
        app_id: app.globalData.app_id,
        channel_id: app.globalData.channel_id,
        sign: app.globalData.sign,
        udid: app.globalData.udid,
        version: app.globalData.version,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        token: token,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data, 'img');
        if (res.data.data.pic_url) {
          var pic_url = res.data.data.pic_url;
        }
        if (res.data.data.link) {
          var link = res.data.data.link;
        }
        that.setData({
          pic_url: pic_url,
          link: link,
        })
      }
    })
  },*/
  //静默登录
  loginTap: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var type_wx = wx.getStorageSync('type_wx');
    console.log(g_uid,'g_uidg_uid')
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        role: '',//1：租客，2：经纪人，3：房东
        session_key: '',
        encrypted_data: '',
        iv: '',
        system: '',
        type_wx: type_wx,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
        source: '1',
        sign: '1'
      },
      success: function (res) {
        console.log(res.data,'login')

        var token = res.data.content.user_info.token;
        var g_uid = res.data.content.user_info.g_uid;
        var mobile = res.data.content.user_info.mobile;
        console.log(res.data, 'phone');
        //保存用户ID,TOKEN
        wx.setStorageSync('index', res.data.content.user_info.role-1);
          wx.setStorageSync('token', res.data.content.user_info.token);
          wx.setStorageSync('mobile', res.data.content.user_info.mobile);
          wx.setStorageSync('g_uid', res.data.content.user_info.g_uid);
          that.setData({
            mobile: mobile,
            token: token,
            g_uid: g_uid,
        })
          //that.telTap();
      },
      fail: function (res) {
        console.log(res, 'err');
      }
    })
  },
  //跳转个人中心判断
  onPersonalBtn: function () {
    app.aldstat.sendEvent('个人中心信息点击');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity',
      })
    } else {
      wx.navigateTo({
        url: 'information/information',
      })
    }
  },
  //跳转收藏列表判断
  onCollectBtn: function () {
    app.aldstat.sendEvent('个人中心收藏点击');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity',
      })
    }else{
      wx.navigateTo({
        url: '/pages/personal/collect/collect',
      })
    }    
  },
  //跳转投诉与建议判断
  onSuggestBtn: function () {
    app.aldstat.sendEvent('个人中心投诉点击');   
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity',
      })
    } else {
      wx.navigateTo({
        url: 'suggest/suggest',
      })
    }
  },
  //跳转关于我们判断
  onAboutBtn: function () {
    app.aldstat.sendEvent('个人中心关于点击');
    wx.navigateTo({
      url: 'about/about',
    })    
  },
  //跳转登录
  onLoginBtn: function () {
    wx.navigateTo({
      url: '/pages/login/ldentity/ldentity',
    })
  },
  //跳转活动H5
  activeH5: function () {
    var link=this.data.link;
    wx.navigateTo({
      url: 'activeH5/activeH5?link=' + link,
    })
  },
  //退出登录
  logout: function () {
    app.aldstat.sendEvent('退出账号点击');
    var that = this;
    var token = that.data.token;
    var mobile = that.data.mobile;
    wx.showModal({
      content: '是否退出当前帐号',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定

          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');
          var token = '';
          var mobile = '';
          wx.clearStorage();
          console.log(mobile, 'mobilemobile')
          that.setData({
            token: token,
            mobile: mobile,
          })
          //跳转到用户中心页面
          wx.switchTab({
            url: '/pages/personal/personal',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  /**身份切换 */
  bindPickerChange: function (e) {
    app.aldstat.sendEvent('个人中心身份切换点击');
    //'picker发送选择改变，携带值为', e.detail.value
    var index = e.detail.value;
    wx.setStorageSync('index', e.detail.value);
    this.setData({
      index: index,
      scrollTop: 0,
    })
  },

  //模拟底部导航
  tabBarTap: function (event) {
    var index = event.currentTarget.dataset.index;
    var url = event.currentTarget.dataset.url; 
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var type_wx = wx.getStorageSync('type_wx');
    var area_code = wx.getStorageSync('area_code');
    console.log(url, 'url');
    console.log(index, url, 'url')
    if (index == 2) {
      app.aldstat.sendEvent('‘我的’点击');
    }
    else if (index == 1) {
      app.aldstat.sendEvent('底部导航‘品牌馆’点击');
      wx.navigateToMiniProgram({
        appId: 'wx7d5f9c72c8a60afe',
        path: 'pages/index/index?token=' + token + "&g_uid=" + g_uid + '&areaCode=' + area_code + '&type_wx=' + type_wx,
        envVersion: 'release', //trial
        success(res) {
          // 打开成功
        }
      })
    }
    else {
      app.aldstat.sendEvent('‘租房’点击');
      wx.navigateTo({
        url: url,
      })
    }
  },
})