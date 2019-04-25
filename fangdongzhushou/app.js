//app.js
var aldstat = require("./utils/ald-stat.js");
App({
  onLaunch: function () {
  },
  //小程序新接口
  globalDataJson: {
    gyjProductBase: "https://preapi.gongyujia.com/",//http://gyjapitest.gongyujia.com/https://appapi.gongyujia.com/,
    "os_type": "landlord_mini",      //系统类型:adr/ios/mini
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
    gyjProductBase: "https://res.gongyujia.com/",//http://restest.gongyujia.com/
  },
  
  //头像图片域名前缀拼接
  globalDataImgLogo: {
    gyjProductBase: "https://client-op.oss-cn-shanghai.aliyuncs.com/",
  },
  //图片后缀  
  globalDataImgLast: {
    gyjProductBase: "@!form_l",
  }, 
})
