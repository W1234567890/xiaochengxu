//app.js
var aldstat = require("./utils/ald-stat.js");//阿拉丁埋点基础js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('unknown<iPhone11,8>') != -1 || modelmes.search('unknown<iPhone11,2>') != -1 || modelmes.search('unknown<iPhone11,4>') != -1 || modelmes.search('unknown<iPhone11,6>') != -1) {
          that.globalData.isIphoneX = true
        }

      }
    })

  },
  globalData: {
    userInfo: null
  },
  //修改tabBar的active值
  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1]; 
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  tabBar: {
    "borderStyle": "black",
    "backgroundColor": "#fff",
    "color": "#333",
    "selectedColor": "#20b7b6",
    "token": '',
    "isIpx": false,
    "list": [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/images/index/zfIcon.png",
        "selectedIconPath": "/images/index/zfIconH.png",
        "selectedColor": "#20b7b6",
        active:true
      },
      {
        "pagePath": "/pages/personal/personal",
        "text": "我的",
        "iconPath": "/images/index/personalIcon.png",
        "selectedIconPath": "/images/index/personalIconH.png",
        "selectedColor": "#20b7b6",
        active: false
      }
    ]
  },
  //小程序新接口
  globalDataJson: {
    gyjProductBase: "https://appapi.gongyujia.com/",//https://preapi.gongyujia.com/
    "os_type": "brand_mini",      //系统类型:adr/ios/mini
    "os_version": 1,       //系统版本
    "channel": "mini",      //渠道号
    "network": 110,        //网络类型，取值范围以可取到的状态为准：
    //110：WIFI
    //120：未细分的移动网络
    //130：2G
    //140：3G
    //150：4G
    //160：其它
    "version_code": 1,     //客户端本号
    "area_code": "021",       //行政区号
    "app_device": '',   //APP运行设备的唯一标识OPEN_ID
    "g_uid": "",      //当前登录的OPEN_ID(如果已登录时上传)
    "package_name": "",   //应用包名
  },
  //图片域名前缀拼接
  globalDataImg: {
    gyjProductBase: "https://res.gongyujia.com/",
  },
  //图片后缀  
  globalDataImgLast: {
    gyjProductBase: "@!form_s",
  }
})