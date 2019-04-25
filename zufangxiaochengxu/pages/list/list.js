var app = getApp();
var tabBar = app.tabBar;
let isIphoneX = app.globalData.isIphoneX;
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url = app.globalDataApp.gyjProductBase + "miniapi/index";
var urlHouse = app.globalDataApp.gyjProductBase + "miniapi/index/house_list";
var url1 = app.globalDataApp.gyjProductBase + "miniapi/handshake";
var city_id = 39;
var district_id = 0;
var price = 0;
var page = 1;
var page_size = 10;
var layout_type = 0;
var rent_date = 0;
var height = 552;
var topBanner = 0;
var topSelect = 400;
var marginTopSetsNum = 524;
var keywordsInputnum = 0;
var activeDistrictName = '';
var timestamp='';
var houseListNone='房源数据加载中...'
var hidden1=true;
/*定位*/
var addressPostKey = 0;
var pickerKey=0;
var pickerPostKey = 0;
var bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = [];
var location = '';
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

/**页面数据请求 */
var GetList = function (that) {
  var city = that.data.city;
  var g_uid = wx.getStorageSync('g_uid');
  var openid = wx.getStorageSync('openid');
  var activeDistrictName = that.data.activeDistrictName;
  if (activeDistrictName == city) {
    var locationDing = that.data.locationDing;
  }
  else{
    var locationDing = '';
  }
  var list = that.data.list;
  var listPriceList = that.data.listPriceList;
  var list1 = that.data.list;
  var area_code = wx.getStorageSync('area_code');
  if (!area_code){
    var area_code = '021';
  }
  that.setData({
    hidden: 'block',
  });
  if (that.data.keywords) {
    var keywords = that.data.keywords;
  }
  if (that.data.district) {
    district_id = that.data.district;
  }
  if (that.data.city) {
    city_id = that.data.city;
  }
  if (that.data.price) {
    price = that.data.price;
  }
  if (that.data.houseType) {
    layout_type = that.data.houseType;
  }
  if (that.data.rent_date) {
    rent_date = that.data.rent_date;
  }

  wx.showToast({
    title: '加载中',
    icon: 'loading',
    mask: true
  })

  wx.request({
    url: url,
    data: {
      os_type: app.globalDataJson.os_type,
      os_version: app.globalDataJson.os_version,
      network: app.globalDataJson.network,
      version_code: app.globalDataJson.version_code,
      app_device: openid,   //APP运行设备的唯一标识OPEN_ID
      package_name: "",   //应用包名
      g_uid: g_uid,
      area_code: area_code,
      timestamp: timestamp,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data);
      wx.hideToast();
      if (!res.data.content.banners){  }
      else {var banner_list = res.data.content.banners;}

      if (!res.data.content.area_ad.action_l) { }
      else { var action_lurl = res.data.content.area_ad.action_l.action;
      var poster_lType = res.data.content.area_ad.action_l.action_type; }

      if (!res.data.content.area_ad.poster_l) { }
      else { var poster_l = res.data.content.area_ad.poster_l; }

      if (!res.data.content.area_ad.action_rb) { }
      else { var action_rburl = res.data.content.area_ad.action_rb.action; 
       var poster_rbType = res.data.content.area_ad.action_rb.action_type;
        var poster_rb = res.data.content.area_ad.poster_rb; }

      if (!res.data.content.area_ad.action_rt) { }
      else { var action_rturl = res.data.content.area_ad.action_rt.action;
      var poster_rtType = res.data.content.area_ad.action_rt.action_type;
      var poster_rt = res.data.content.area_ad.poster_rt; }    
      // for (var i = 0; i < res.data.content.recommend_house.length; i++) {
      //   list.push(res.data.content.recommend_house[i]);
      // }
      // if (res.data.content.recommend_house.length == 0) {
      //   var hidden1 = 'block';
      // }
      that.setData({
        action_lurl: action_lurl,
        poster_l: poster_l,
        poster_rb: poster_rb,
        action_rburl: action_rburl,
        action_rturl: action_rturl,
        poster_rt: poster_rt,
        banner_list: banner_list,
        poster_lType: poster_lType,
        poster_rbType: poster_rbType,
        poster_rtType: poster_rtType,
      });
      console.log(action_lurl, 'action_lurl')
      that.setData({
        hidden: 'none'
      });
    }
  });

  console.log(11, '11111');
  wx.request({
    url: urlHouse,
    data: {
      os_type: app.globalDataJson.os_type,
      os_version: app.globalDataJson.os_version,
      network: app.globalDataJson.network,
      version_code: app.globalDataJson.version_code,
      app_device: openid,   //APP运行设备的唯一标识OPEN_ID
      package_name: "",   //应用包名
      g_uid: g_uid,
      area_code: area_code,
      timestamp: timestamp,
      page: page,  //页数。默认第一页
      page_size: page_size,//条数,默认20条
      location: locationDing,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res.data,'housse');
      wx.hideToast();
      var page_size = res.data.content.foot.pagesize;
      if (res.data.content.house_list){
        for (var i = 0; i < res.data.content.house_list.length; i++) {
          if (res.data.content.house_list[i].cover_pic != '') {
            res.data.content.house_list[i].cover_pic = res.data.content.house_list[i].cover_pic;
            list.push(res.data.content.house_list[i]);
          } else {
            res.data.content.house_list[i].cover_pic = "/images/list/im_eorr.png";
            list.push(res.data.content.house_list[i]);
          }
          listPriceList.push(res.data.content.house_list[i].price.split('/')[0]);
        }
      }
      if (list.length > 0 && res.data.content.house_list.length == 0) {
        that.setData({
          hidden1: false,
        })
      }
      console.log(page, 'page02')
      page++;
      console.log(page, 'page03')
      that.setData({
        list: list,
        listPriceList: listPriceList,
        houseListNone: '暂无精选房源',     
      });
      console.log(list,'list02',page)
      that.setData({
        hidden: 'none',
        pickerKey:0,
      });
    }
  });
}

/*获取地理位置*/
var postTap1 = function (that) {
  var list=[];
  var listPriceList=[];
  // 新建百度地图对象 
  var BMap = new bmap.BMapWX({
    ak: 'XHBlxBUrLEuCPS3L7MTrwKfkQAmCFcWy'
  });
  var fail = function (data) {
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
            locationDing: '',
            list:[],
            listPriceList: [],
            hidden1: true,
            houseListNone:'房源数据加载中...'
          })
        }
      })
    }
    page=1;
    GetList(that);
  };
  var success = function (data) {
    console.log(data);
    var activeDistrictName = that.data.activeDistrictName;
    console.log(activeDistrictName,'activeDistrictName')
    var city = data.originalData.result.addressComponent.city;
    if (activeDistrictName=='区域')
    {
      var lat = data.originalData.result.location.lat;
      var lng = data.originalData.result.location.lng;
      var locationDing = lat + ',' + lng;
      that.setData({
        locationDing: locationDing,
      })
    }
    else if (activeDistrictName == city) {
      var lat = data.originalData.result.location.lat;
      var lng = data.originalData.result.location.lng;
      var locationDing = lat + ',' + lng;
      that.setData({
        locationDing: locationDing,
      })
    }
    else {
      that.setData({
        locationDing: '',
      })
    }
   //var area_code = data.originalData.result.cityCode;
    wxMarkerData = data.wxMarkerData;
    that.setData({
      markers: wxMarkerData,
      city: city,
     // area_code: area_code,
    });
    console.log(city,'citycitycity')
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
    wx.setStorageSync('area_code', area_codeCity);
    that.setData({
      latitude: wxMarkerData[0].latitude
    });
    that.setData({
      longitude: wxMarkerData[0].longitude
    });
    var keywords = wxMarkerData[0].address;
    that.setData({
      keywords: keywords,
      list: [],
      listPriceList:[],
      houseListNone: '房源数据加载中...'
    })
    page = 1;
    GetList(that);
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
    tabBar: tabBar,
    isIpx: isIphoneX ? true : false,
    num:0,
    hidden: 'none',
    hidden1: true,
    list: [],
    listPriceList:[],
    scrollTop: 0,
    scrollHeight: 0,
    typeID: 0,
    isLoading: true,
    loadOver: false,
    scrollTop: 0,
    array: ['上海', '北京', '广州', '深圳', '杭州', '成都'],
    index: 0,
    districtChioceIcon: "/images/list/icon-go-black.png",
    priceChioceIcon: "/images/list/icon-go-black.png",
    typeChioceIcon: "/images/list/icon-go-black.png",
    timeChioceIcon: "/images/list/icon-go-black.png",
    chioceDistrict: false,
    chiocePrice: false,
    chioceType: false,
    chioceTime: false,
    activeDistrictParentIndex: -1,
    activeDistrictChildrenIndex: -1,
    activeDistrictName: "区域",
    scrollTop: 0,
    scrollIntoView: 0,
    activePriceIndex: -1,
    activeTypeIndex: -1,
    activeTimeIndex: -1,
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    city: '',
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    bannerImgHidden: false,//banner显示
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },
  //上拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: [],
      listPriceList:[],
      scrollTop: 0
    });
    page = 0;
    GetList(this);
    wx.stopPullDownRefresh()
  },
  //触底加载
  onReachBottom: function () {
    var that = this;
    this.setData({
      scrollTop: 0
    });
    GetList(that);
  },

  onLoad: function (options) {
    tabBar.isIpx = this.data.isIpx;
    this.setData({
      tabBar: tabBar,
    })
    app.aldstat.sendEvent('首页进入');
    var code = options.code;
    //console.log(code,'code');
    app.aldstat.sendEvent(code);
    if (wx.getStorageSync('token')){
      var token = wx.getStorageSync('token');
    }
    else{
      var token='';
    }
    console.log(token,'token1111111111')
    postTap1(this);
    this.setData({
      height: height,
      topBanner: topBanner,
      topSelect: topSelect,
      marginTopSetsNum: marginTopSetsNum,
      windowHeight:wx.getSystemInfoSync().windowHeight,
      token: token,
    })
    this.openidTap();
  },
  //banner切换出发
  swiperChange: function (e) {
    var that = this;
    var num = e.detail.current;
    that.setData({
      num: num,
    })
  },
  onShow: function () {
    console.log(page,'page04')
    var addressPostKey = 0;
    var keywordsInputnum = 0;
    this.setData({
      addressPostKey: addressPostKey,
      keywordsInputnum: keywordsInputnum,
    })
  },
 // 监听页面滚动距离scrollTop
  onPageScroll: function(e) {
    var that=this;
    if (e.scrollTop>=600){
      that.setData({
        bannerImgHidden:true,
      })
    }
    else {
      that.setData({
        bannerImgHidden: false,
      })
    }
  },
// console.log(e.scrollTop);
  /**城市切换 */
  bindPickerChange: function (e) {
    //'picker发送选择改变，携带值为', e.detail.value
    var index = e.detail.value;
    var addressPostKey = 0;
    var pickerKey = 1;
    var city=this.data.city;
    console.log(city,'city')
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
      list: [],
      listPriceList:[],
      scrollTop: 0,
      hidden1:true,
      houseListNone:'房源数据加载中...'
    })
    page = 1;
    console.log(page,'page01')
    wx.setStorageSync('area_code', area_codeCity);
    GetList(this);
  },
  /**获取输入框数据 */
  keywordsInputEvent: function (e) {
    var keywords = e.detail.value;
    console.log(keywords);
    var keywordsInputnum = 1;
    this.setData({
      keywords: keywords,
      keywordsInputnum: keywordsInputnum,
      locationDing:''
    })
    /*//输入内容自动补全
      // 实例化API核心类
      var demo = new QQMapWX({
        key: 'CVCBZ-XLER3-MBL3Q-3OT5J-6WWJJ-HQFPY' // 必填
      });
      // 调用接口
      demo.getSuggestion({
        keyword: keywords,
        success: function (res) {
          console.log(res);
        },
        fail: function (res) {
          console.log(res);
        }
      });
    //输入内容自动补全结束*/
  },
  /**搜索跳转 */
  onSearchBtn: function () {
    app.aldstat.sendEvent('首页搜索点击');
    var city = this.data.city;
    var activeDistrictName = this.data.activeDistrictName;
    if (activeDistrictName == city) {
      var locationDing = this.data.locationDing;
    }
    else {
      var locationDing = '';
    }
    var addressPostKey = this.data.addressPostKey;
    var keywordsInputnum = this.data.keywordsInputnum;
    var area_codeCity = this.data.area_codeCity;
    if (addressPostKey == 1 || keywordsInputnum == 1) {
      var keywords = this.data.keywords;
    }
    else {
      var keywords = '';
    }
    wx.navigateTo({
      url: 'search/search?keywords=' + keywords + '&area_codeCity=' + area_codeCity + '&locationDing=' + locationDing,
    })
  },
  /**跳转房源详情页 */
  onListDetailTap: function (event) {
    app.aldstat.sendEvent('首页房源点击');
    var postId = event.currentTarget.dataset.id;
    var price_count = event.currentTarget.dataset.pricec;
    console.log(price_count,'price_count')
    if (price_count == -1 || price_count==1) {
      wx.navigateTo({
        url: 'listDetail/listDetail?id=' + postId
      })
    }
    else {
      wx.navigateTo({
        url: 'listDetailOthers/listDetailOthers?id=' + postId
      })
    }
  },
  /**分享转发 */
  onShareAppMessage: function (event) {
    return {
      title: '公寓家租房',
      desc: '',
      path: '/pages/list/list',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**获取当前位置 */
  postTap: function () {
    postTap1(this);
    var addressPostKey = 1;
    this.setData({
      addressPostKey: addressPostKey,
    })
  },
  /*活动页跳转h5*/
  newsListTap: function (event) {
    var url = event.currentTarget.dataset.url;
    var adNum = event.currentTarget.dataset.adnum;
    var dataAdent = event.currentTarget.dataset.adent;
    console.log(url, dataAdent, 'url')
    if (adNum == 0) {
      app.aldstat.sendEvent('首页banner位点击');
    }
    else if (adNum == 1) {
      app.aldstat.sendEvent('首页广告位点击_左');
      this.setData({
        posterImg : this.data.poster_l,
      })
    }
    else if (adNum == 2) {
      app.aldstat.sendEvent('首页广告位点击_右上');
      this.setData({
        posterImg:  this.data.poster_rt,
      })
    }
    else{
      app.aldstat.sendEvent('首页广告位点击_右下');
      this.setData({
        posterImg:  this.data.poster_rb,
      })
    }
    if (dataAdent == 1) {
      var posterImg = this.data.posterImg;
      console.log(posterImg,'posterImg');
      var url = encodeURIComponent(url + '&posterImg=' + posterImg);
      console.log(url,'url001');
      wx.navigateTo({
        url: 'newsList/newsList?url=' + url,
      })
    } else if (dataAdent == 2) {
      wx.navigateTo({
        url: '../listDetail/listDetail?id=' + url,
      })
    } else if (dataAdent == 3) {
      wx.navigateTo({
        url: 'search/search?list_id=' + url +'&is_show=1',
      })
    } else if (dataAdent == 0) {
      //wx.showToast({
      //  title: '暂无跳转',
       // icon: 'loading'
      //})
    }
    // var util=require('../../utils/util.js');
    // var actionType = util.actionType(dataAdent, url,'00');

  },
  /*oneTap:function(){
    wx.navigateTo({
      url: '/pages/list/newsList/newsList?link=https://special.gongyujia.com/#/relieved&newsTitle=安心住&posterImg=',
    })
  },*/
  //调用wx.login获取openid
  openidTap: function () {
    var that=this;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code');
    if (openid){
      that.handTap();
    }
    else{
    wx.login({
      success: res => {
        var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: 'https://api.gongyujia.com/home/user/getUserOpenId',
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
              that.handTap();
          },
          fail: function (res) {
            console.log(res.data, 'login1111')
            that.handTap();
          }
        })
      }
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
        area_code: area_codeCity,
        city_timestamp: timestamp,
        support_timestamp: timestamp
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res, 'kkkkkkkk');

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
  //模拟底部导航
  tabBarTap: function (event) {
    var index = event.currentTarget.dataset.index;
    var url = event.currentTarget.dataset.url;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var area_code = wx.getStorageSync('area_code'); 
    var type_wx = wx.getStorageSync('type_wx');
    console.log(url,'url');
    console.log(index, url, 'url')
    if (index == 0) {
      app.aldstat.sendEvent('底部导航‘租房’点击');
    } 
    else if (index == 1) {
      app.aldstat.sendEvent('底部导航‘品牌馆’点击');
      wx.navigateToMiniProgram({
        appId: 'wx7d5f9c72c8a60afe',
        path: 'pages/index/index?token=' + token + '&areaCode=' + area_code + '&g_uid=' + g_uid + '&type_wx=' + type_wx,
        envVersion: 'release', //trial
        success(res) {
          // 打开成功
        }
      })
    }
    else {
      app.aldstat.sendEvent('底部导航‘我的’点击');
      wx.navigateTo({
        url: url,
      })
    }
  },
})