//index.js
//获取应用实例
var app = getApp();
var tabBar = app.tabBar;//底部导航数组
let isIphoneX = app.globalData.isIphoneX;//手机型号判断
var url = app.globalDataJson.gyjProductBase + "miniapi/brand";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/brand_list";
var url2 = app.globalDataJson.gyjProductBase + "miniapi/handshake";
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var canUseReachBottom = true;//触底函数控制变量
var pageIndex=0;
var timestamp = '';
var area_codeCity='021';
//数组定义
var bannerList=[];
var brandFilter=[];
var brandLogos=[];
var recToday = [];
var recTodayPrice = [];
var brandList=[];
var brandListPrice=[];
var hotHouseListUrl='';
var page=1;
var page_size=5;
var subject_id = '';
var hidden=true;
var hidden1=true;
/*定位*/
var addressPostKey = 0;
var pickerKey = 0;
var pickerPostKey = 0;
var bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = [];
var location = '';
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
/*获取地理位置*/
var postTap1 = function (that) {
  var brandLogos=[];
  var recToday = [];
  var brandFilter = [];
  var brandList = [];
  // 新建百度地图对象 
  var BMap = new bmap.BMapWX({
    ak: 'P3VQEGymE0nncjZXYTTuRP4tOaVwmQpU'
  });
  var fail = function (data) {
    console.log(data,'post01')
    var addressPostKey = that.data.addressPostKey;
    if (addressPostKey == 1) {
      wx.showModal({
        content: '因为未同意获取地理位置，所以不能获取当前位置！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
          this.data({
            brandLogos: [],
            recToday: [],
            brandFilter: [],
            brandList: [],
            houseListNone: '房源数据加载中...'
          })
        }
      })
    }
    page = 1;
    that.indexTap();
  };
  var success = function (data) {
    console.log(data,'post02');
    var activeDistrictName = that.data.activeDistrictName;
    console.log(activeDistrictName, 'activeDistrictName')
    var city = data.originalData.result.addressComponent.city;
    //var area_code = data.originalData.result.cityCode;
    wxMarkerData = data.wxMarkerData;
    that.setData({
      markers: wxMarkerData,
      city: city,
      // area_code: area_code,
    });
    console.log(city, 'citycitycity')
    if (city == '北京市') {
      var index = 1;
      var area_code = 131;
      var activeDistrictName = '北京市';
      var area_codeCity = '010';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    else if (city == '广州市') {
      var index = 2;
      var area_code = 257;
      var activeDistrictName = '广州市';
      var area_codeCity = '020';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    else if (city == '深圳') {
      var index = 3;
      var area_code = 340;
      var activeDistrictName = '深圳市';
      var area_codeCity = '0755';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    else if (city == '杭州市') {
      var index = 4;
      var area_code = 179;
      var activeDistrictName = '杭州市';
      var area_codeCity = '0571';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    else if (city == '成都市') {
      var index = 5;
      var area_code = 75;
      var activeDistrictName = '成都市';
      var area_codeCity = '028';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    else {
      var index = 0;
      var area_code = 289;
      var activeDistrictName = '上海市';
      var area_codeCity = '021';
      that.setData({
        index: index,
        area_code: area_code,
        activeDistrictName: activeDistrictName,
        area_codeCity: area_codeCity,
      })
    }
    that.setData({
      brandLogos: [],
      recToday: [],
      brandFilter: [],
      brandList: [],
      houseListNone: '房源数据加载中...'
    })
    wx.setStorageSync('area_codeCity', area_codeCity);
    page = 1; 
    that.indexTap();
  }
  // 发起regeocoding检索请求 
  BMap.regeocoding({
    fail: fail,
    success: success,
    iconPath: '../../img/marker_red.png',
    iconTapPath: '../../img/marker_red.png'
  });
}
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    array: ['上海', '北京', '广州', '深圳', '杭州', '成都'],
    index: 0,
    pageIndex:0,
    tabBar: tabBar,
    isIpx: isIphoneX ? true : false,
    area_codeCity: area_codeCity,
    brandFilter: brandFilter,
    brandLogos: brandLogos,
    recToday: recToday,
    recTodayPrice: recTodayPrice,
    hotHouseListUrl: hotHouseListUrl,
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    page:1,
    page_size: page_size,
    subject_id: subject_id,
    bannerList: bannerList,
    brandList: brandList,
    brandListPrice: brandListPrice,
    hidden: true,
    hidden1:true,
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var brandFilter = this.data.brandFilter;
    var subject_id = brandFilter[e.detail.current].brand_list_id
    this.setData({
      currentTab: e.detail.current,
      brandList: [],
      subject_id: subject_id,
      hidden1: true,
      
    });
    page = 1;
    this.checkCor(); 
    this.indexBrandListTap();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var subject_idNum = this.data.subject_id;
    var cur = e.target.dataset.current;
    var subject_id = e.currentTarget.dataset.brandlistid;
    if (subject_idNum == subject_id) {
      return false;
    }
    else {
      console.log(subject_id, 'subject_idChange')
      if (this.data.currentTaB == cur) { return false; }
      else {
        this.setData({
          currentTab: cur,
          subject_id: subject_id,
          brandList: [],
          hidden1: true,
        })
      }
      page = 1;
    }
  },
  //滚动到底部/右边 加载数据
  scrollTap: function () {
    console.log('1111')
    var that = this;
    this.setData({
      scrollTop: 0,
      hidden: false,
    });
    if (!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
    that.indexBrandListTap(); 
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('首页打开');
    tabBar.isIpx = this.data.isIpx;
    this.setData({
      tabBar: tabBar,
    })
    var that = this;
    var openid = wx.getStorageSync('openid');
    if (!options.typewx) {
      wx.setStorageSync('type_wx', '');
    }
    else {
      wx.setStorageSync('type_wx', options.type_wx);
    }
    if (options.token || options.token == '') {
      var token = options.token;
      var g_uid = options.g_uid;
      wx.setStorageSync('token', options.token);
      wx.setStorageSync('g_uid', options.g_uid);
      console.log(token,g_uid, 'token002')
    }
    else {
      if (!wx.getStorageSync('g_uid') || !wx.getStorageSync('token')) {
        wx.setStorageSync('token', '');
        wx.setStorageSync('g_uid', '');
      }
      else {
        var token = wx.getStorageSync('token');
        var g_uid = wx.getStorageSync('g_uid');
      }
      //console.log(token, g_uid,'onload-------')
      console.log(token, g_uid, 'token001')
    }
    that.setData({
      token: token,
      g_uid: g_uid,
      hidden1: true,
    })
    tabBar.token=token;
    console.log(tabBar,'tabBartabBar')
    if (!options.areaCode){
      var area_codeCity = that.data.area_codeCity;
      postTap1(this);
    }
    else{
      var area_codeCity = options.areaCode;
      wx.setStorageSync('area_codeCity', area_codeCity);
      if (area_codeCity == '010') {
        var index = 1;
        var activeDistrictName = '北京市';
        that.setData({
          index: index,
        })
      }
      else if (area_codeCity == '020') {
        var index = 2;
        var activeDistrictName = '广州市';
        that.setData({
          index: index,
        })
      }
      else if (area_codeCity == '0755') {
        var index = 3;
        var activeDistrictName = '深圳市';
        that.setData({
          index: index,
        })
      }
      else if (area_codeCity == '0571') {
        var index = 4;
        var activeDistrictName = '杭州市';
        that.setData({
          index: index,
        })
      }
      else if (area_codeCity == '028') {
        var index = 5;
        var activeDistrictName = '成都市';
        that.setData({
          index: index,
        })
      }
      else {
        var index = 0;
        var activeDistrictName = '上海市';
        that.setData({
          index:index,
        })
      }

      console.log(area_codeCity,'area_codeCity1111')
      that.indexTap();
    }
    wx.login({
      success: res => {
        var that = this;
        console.log(res, 'kkkkkkkkkkk')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: 'https://api.gongyujia.com/home/user/getUserBrandOpenId',
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
            console.log(res.data, 'login Openid')
            //保存openid,sessionkey
            wx.setStorageSync('openid', res.data.data.openid);
            wx.setStorageSync('sessionkey', res.data.data.session_key);
            page++;
            that.setData({
              hidden: true,
            });
          },
          fail: function (res) {
            console.log(res.data, 'login1111')
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
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
    that.setData({
      area_codeCity: area_codeCity,
      hidden: false,
      token: token,
      g_uid: g_uid,
      tabBar: tabBar,
    })
    var pageIndex = that.data.pageIndex;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 92;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    console.log(token,g_uid,'tokentoken')
    that.handTap();
  },
  onShow: function (options) {
    var tabBar = this.data.tabBar;
    this.setData({
      tabBar: tabBar,
    })
  },
  //本地区已入住品牌 更多
  brandListTap: function () {
    app.aldstat.sendEvent('本地区已入住品牌 更多跳转');
    wx.navigateTo({
      url: '/pages/brand/brand',
    })
  },
  /*品牌入驻*/
  joinBtnTap: function () {
    app.aldstat.sendEvent('品牌入驻');
    wx.navigateTo({
      url: '/pages/active/joinBrand/joinBrand',
    })
  },
  /**城市切换 */
  bindPickerChange: function (e) {
    //'picker发送选择改变，携带值为', e.detail.value
    var index = e.detail.value;
    var addressPostKey = 0;
    var pickerKey = 1;
    var city = this.data.city;
    console.log(city, 'city')
    if (index == 1) {
      var index = 1;
      var area_code = 131;
      var activeDistrictName = '北京市';
      var area_codeCity = '010';
    }
    else if (index == 2) {
      var index = 2;
      var area_code = 257;
      var activeDistrictName = '广州市';
      var area_codeCity = '020';
    }
    else if (index == 3) {
      var index = 3;
      var area_code = 340;
      var activeDistrictName = '深圳市';
      var area_codeCity = '0755';
    }
    else if (index == 4) {
      var index = 4;
      var area_code = 179;
      var activeDistrictName = '杭州市';
      var area_codeCity = '0571';
    }
    else if (index == 5) {
      var index = 5;
      var area_code = 75;
      var activeDistrictName = '成都市';
      var area_codeCity = '028';
    }
    else {
      var index = 0;
      var area_code = 289;
      var activeDistrictName = '上海市';
      var area_codeCity = '021';
    }
    this.setData({
      index: index,
      area_code: area_code,
      activeDistrictName: activeDistrictName,
      addressPostKey: addressPostKey,
      area_codeCity: area_codeCity,
      scrollTop: 0,
      brandLogos:[],
      recToday:[],
      brandFilter:[],
      brandList:[],
      houseListNone: '房源数据加载中...',
      hidden1:true,
    })
    page = 1;
    console.log(page, 'page01')
    wx.setStorageSync('area_codeCity', area_codeCity);
    this.indexTap();
  },
  //模拟底部导航
  tabBarTap: function (event){
    var index = event.currentTarget.dataset.index;
    var url = event.currentTarget.dataset.url;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var type_wx = wx.getStorageSync('type_wx');
    var area_code = wx.getStorageSync('area_codeCity');
    console.log(g_uid, token, type_wx,'略略略略')
    if (index == 0) {

    }
    else if (index == 1) {
      if(!token){
        wx.navigateTo({
          url: '/pages/personal/login/login',
        })
      }
      else {
        this.jnmpTap()
      }
    }
    else
    {
      wx.navigateTo({
        url: url,
      })
    }
  },
  //跳转小程序
  jnmpTap: function () {
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(token,g_uid,'g_uidg_uid')
    var type_wx = wx.getStorageSync('type_wx');
    var area_codeCity = wx.getStorageSync('area_codeCity');
    wx.navigateToMiniProgram({
      appId: 'wxc29624069daf8890',
      path: '/pages/personal/personal?token=' + token + '&g_uid=' + g_uid + '&type_wx=' + type_wx,
      envVersion: 'release',//trial
      success(res) {
        // 打开成功
      }
    })
  },
  //上半部分运营位数据
  indexTap: function () {
    var that=this;
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    var area_codeCity = wx.getStorageSync('area_codeCity');
    console.log(area_codeCity,'area_codeCity')
   
    var bannerList = that.data.bannerList;
    var brandFilter = that.data.brandFilter;
    var brandLogos = that.data.brandLogos;
    var recToday = that.data.recToday;
    var recTodayPrice = that.data.recTodayPrice;
    var hotHouseListUrl = that.data.hotHouseListUrl;
    //获取时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    wx.request({
      url: url,
      data: {
        os_type: app.globalDataJson.os_type,
        channel: app.globalDataJson.channel,
        os_version: app.globalDataJson.os_version,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        area_code: area_codeCity,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        timestamp: timestamp,
        },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res.data,'000000')
        var total = res.data.content.total; 
        for (var i = 0; i < res.data.content.banners.length; i++) {
          bannerList.push(res.data.content.banners[i]);
        }
        console.log(res.data.content.banners,'bannerList')
        for(var i=0; i<res.data.content.brand_filter.length;i++){
          brandFilter.push(res.data.content.brand_filter[i]); 
        } 
        if (!that.data.subject_id) {
          var subject_id = brandFilter[0].brand_list_id;
        }
        else {
          var subject_id = that.data.subject_id;
        }
        //var brandFilterId = res.data.content.brand_filter[0].brand_list_id;
        //console.log(brandFilterId, 'brandFilterId')
        
        for (var i = 0; i < res.data.content.brand_logos.length; i++) {
          brandLogos.push(res.data.content.brand_logos[i]);
        }
        for (var i = 0; i < res.data.content.rec_today.length; i++) {
          recToday.push(res.data.content.rec_today[i]);
          recTodayPrice.push(res.data.content.rec_today[i].price.split('/')[0]);
        }
        that.setData({
          total: total,
          bannerList: bannerList,
          brandFilter: brandFilter,
          brandLogos: brandLogos,
          recToday: recToday,
          recTodayPrice: recTodayPrice,
          subject_id: subject_id,
         // brandFilterId: brandFilterId,
        })
        page=1;
        that.indexBrandListTap();
      },
      fail: function(res) {
        
      },
    })
  },
  //品牌列表
  indexBrandListTap: function () {
    var that=this;
    var brandListNew=[];
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    var area_codeCity = wx.getStorageSync('area_codeCity');
    var brandList = that.data.brandList;
    var brandListPrice = that.data.brandListPrice;
    var subject_id = that.data.subject_id;
    //获取时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    /* ------------------------- */
    canUseReachBottom = false;//触底函数关闭
      /* ------------------------- */
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataJson.os_type,
        channel: app.globalDataJson.channel,
        os_version: app.globalDataJson.os_version,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        area_code: area_codeCity,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        timestamp: timestamp,
        subject_id: subject_id,  //专题ID编号
        page: page,   //页数
        page_size: page_size,         //
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data,'222222222')
        var brandList = that.data.brandList;
        for (var i = 0; i < res.data.content.brand_list.length;i++)
        {
          brandList.push(res.data.content.brand_list[i]);            
        } 
        if (brandList.length>0&&res.data.content.brand_list.length==0) 
        {
          that.setData({
            hidden1: false,
            hidden: true,
          })
          console.log('hidden1');
        }
        page++;
        /* ------------------------- */
        canUseReachBottom = true;//有新数据，触底函数开启，为下次触底调用做准备
        /* ------------------------- */
        that.setData({
          hidden:true,
          brandList: brandList,
        })
      }
    }) 
  },
  //运营位跳转
  hotHouseTap: function (event) {
    var url = event.currentTarget.dataset.url;
    var adNum = event.currentTarget.dataset.adnum;
    var dataAdent = event.currentTarget.dataset.adent;
    var posterImg = event.currentTarget.dataset.posterimg;
    console.log(url, dataAdent, adNum, 'url')
      if (adNum == 1) {
        app.aldstat.sendEvent('爆款房源跳转');
      } 
      else if (adNum == -1) {
        app.aldstat.sendEvent('顶部banner跳转');
      }
      else if (adNum == 0) {
        app.aldstat.sendEvent('顶部品牌跳转');
      }
      else if (adNum == 2) {
        app.aldstat.sendEvent('底部品牌列表跳转');
      }
      if (dataAdent == 1) {
        var url = encodeURIComponent(url + '&posterImg=' + posterImg);
        wx.navigateTo({
          url: '/pages/h5?url=' + url,
        })
      } else if (dataAdent == 4) {
        wx.navigateTo({
          url: '/pages/brand/brandDetail/brandDetail?id=' + url,
        })
      } 
  },
  //握手协议
  handTap: function () {
    var that = this;
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    var area_codeCity = wx.getStorageSync('area_code');
    var districtList = [];
    var subway = [];
    var area_codeCity = that.data.area_codeCity;
    console.log("qzza" + area_codeCity)
    if (area_codeCity == '010') {
      var activeDistrictParentIndex = 1;
      var area_codeCity = '010';
    } else if (area_codeCity == '020') {
      var activeDistrictParentIndex = 2;
      var area_codeCity = '020';
    } else if (area_codeCity == '0755') {
      var activeDistrictParentIndex = 3;
      var area_codeCity = '0755';
    } else if (area_codeCity == '0571') {
      var activeDistrictParentIndex = 4;
      var area_codeCity = '0571';
    } else if (area_codeCity == '028') {
      var activeDistrictParentIndex = 5;
      var area_codeCity = '028';
    } else {
      var activeDistrictParentIndex = 0;
      var area_codeCity = '021';
    }
    //获取时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.request({
      url: url2,
      data: {
        os_type: app.globalDataJson.os_type,
        os_version: app.globalDataJson.os_version,
        channel: app.globalDataJson.channel,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        area_code: area_codeCity,
        city_timestamp: timestamp,
        support_timestamp: timestamp
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res, '124ppppppp');

        if (res.data.content.current_city.district) {
          for (var i = 0; i < res.data.content.current_city.district.length; i++) {
            districtList.push(res.data.content.current_city.district[i]);
          }
        }
        if (res.data.content.current_city.subway) {
          for (var i = 0; i < res.data.content.current_city.subway.length; i++) {
            subway.push(res.data.content.current_city.subway[i]);
          }
        }
        that.setData({
          districtList: districtList,
          subway: subway,
          activeDistrictParentIndex: activeDistrictParentIndex,
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (event) {
    let that = this;
    app.aldstat.sendEvent('品牌首页分享点击');
    return {
      title: '公寓家品牌馆',
      path: "/pages/index/index?token=''&g_uid=''",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
