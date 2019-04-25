//app.js
var aldstat =require("./utils/ald-stat.js");
App({
  onLaunch: function () {
    var that=this;
    var token = wx.getStorageSync('token'); 
    var openid = wx.getStorageSync('openid');
    if(token){
      var session_id = token;
    }else{
      var timestamp = Date.parse(new Date());  
      var session_id = timestamp;
    }
    wx.setStorageSync('session_id', session_id);
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
  //header参数
 globalHeaderData:{
    "Content-Type": "application/json",
    token: wx.getStorageSync('token'),
    source: '1',
    sign: '1'
  },
  //小程序旧接口
  globalData: {
    userInfo: null,
    gyjProductBase: "https://api.gongyujia.com/",
    app_id:'0007',
    sign:'73a9627c42fc4fd2ba16e3df3e99f9c6',
    udid:'wxapp',
    version:'200',
    channel_id:'001'
  },
  //小程序新接口
  globalDataJson: {
    gyjProductBase: "https://gyjapi.gongyujia.com/",
    os_type: "mini",      //系统类型:adr/ios/mini
    os_version: 340 ,       //微信版本
    network: 110,        //网络类型，取值范围以可取到的状态为准：
                          //110：WIFI
                          //120：未细分的移动网络
                          //130：2G
                          //140：3G
                          //150：4G
                          //160：其它
    version_code: 110,     //客户端本号
    area_code: '021' 
  },
  //App接口
  globalDataApp: {
    gyjProductBase: "https://appapi.gongyujia.com/",//http://gyjapitest.gongyujia.com/
    "os_type": "mini",      //系统类型:adr/ios/mini
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
    gyjProductBase: "@!form_l",
  }, 
  //底部tab
  //list
  tabBar: {
    "borderStyle": "black",
    "backgroundColor": "#fff",
    "color": "#333",
    "selectedColor": "#20b7b6",
    "isIpx": false,
    "list": [
      {
        "pagePath": "/pages/list/list",
        "text": "租房",
        "iconPath": "/images/list/zfIcon.png",
        "selectedIconPath": "/images/list/zfIconH.png",
        "selectedColor": "#20b7b6",
        active: true
      },
      {
        "pagePath": "/pages/index/index",
        "text": "品牌馆",
        "iconPath": "/images/list/brand.png",
        "selectedIconPath": "/images/list/brandH.png",
        "selectedColor": "#20b7b6",
        active: false
      },
      {
        "pagePath": "/pages/personal/personal",
        "text": "我的",
        "iconPath": "/images/list/personalIcon.png",
        "selectedIconPath": "/images/list/personalIconH.png",
        "selectedColor": "#20b7b6",
        active: false
      }
    ]
  },
  //personal
  tabBar1: {
    "borderStyle": "black",
    "backgroundColor": "#fff",
    "color": "#333",
    "selectedColor": "#20b7b6",
    "isIpx": false,
    "list": [
      {
        "pagePath": "/pages/list/list",
        "text": "租房",
        "iconPath": "/images/list/zfIcon.png",
        "selectedIconPath": "/images/list/zfIconH.png",
        "selectedColor": "#20b7b6",
        active: false
      },
      {
        "pagePath": "/pages/index/index",
        "text": "品牌馆",
        "iconPath": "/images/list/brand.png",
        "selectedIconPath": "/images/list/brandH.png",
        "selectedColor": "#20b7b6",
        active: false
      },
      {
        "pagePath": "/pages/personal/personal",
        "text": "我的",
        "iconPath": "/images/list/personalIcon.png",
        "selectedIconPath": "/images/list/personalIconH.png",
        "selectedColor": "#20b7b6",
        active: true
      }
    ]
  },
})