var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var headerData = app.globalHeaderData;
var url = app.globalDataApp.gyjProductBase + "miniapi/house_list";
var url1 = app.globalDataApp.gyjProductBase + "miniapi/handshake";
var url2 = app.globalDataApp.gyjProductBase + "miniapi/Collection/user_collect";
var url3 = app.globalDataApp.gyjProductBase + "miniapi/Collection/cancel_collect";
var page = 1;
var city_id = '';
var district_id = 0;
var price = 0;
var layout_type = 0;
var rent_date = 0;
var keywords = '';
var hl_data = '';
var messageList = [];
var isCollect=[];
var noHouseListHidden = true; 
var hiddenSearch=true;
var ReachBottomNum=0;//上拉加载判断key
var business_code=0;
var district_id = 0; 
var subwayline_id = 0;
var station_id = 0;
var width100 = 0;//条件筛选(区域+地铁)宽度和显示变化
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');// 引入SDK核心类 
var is_show=0;

var GetList = function (that) {
  var brand_type = that.data.brand_type;
  var is_show = that.data.is_show;
  var locationDing = that.data.locationDing;
  var list_id = that.data.list_id;
  var bannersList = that.data.bannersList;
  var filter_type = that.data.filter_type;
  var brand_id = that.data.brandId;
  var community_id = that.data.community_id;
  var ReachBottomNum =  that.data.ReachBottomNum;
  console.log(locationDing,'locationDingGet')
  var g_uid = wx.getStorageSync('g_uid');
  var openid = wx.getStorageSync('openid');
  var area_code = wx.getStorageSync('area_code'); 
  //筛选条件
  var rent_mode = that.data.rent_mode;
  //区域+商圈选择条件
  if (that.data.district_id)
  {
    var district_id = that.data.district_id;
  }
  else{
    var district_id = 0;
  } 
  if (that.data.business_code) {
    var business_code = that.data.business_code;
  }
  else {
    var business_code = 0;
  }
  //区域+商圈选择条件结束
  //地铁线路+地铁站选择条件
  if (that.data.subwayline_id) {
    var subwayline_id = that.data.subwayline_id;
  }
  else {
    var subwayline_id = 0;
  }
  if (that.data.station_id) {
    var station_id = that.data.station_id;
  }
  else {
    var station_id = 0;
  }
  //地铁线路+地铁站选择条件结束
  var pullKey = that.data.pullKey;
  if (pullKey == 1) {
    var index_house_id = that.data.index_house_id;
  } else {
    var index_house_id = '';
  }
  var price_sort = that.data.price_sort;
  var activePriceMessage = that.data.activePriceMessage;
  var layout = that.data.houseType;
  //var area_code = that.data.area_codeCity;
  var messageList = [];
  if (!rent_mode) {
    var rent_mode = 0;
  }
  if (!price_sort) {
    var price_sort = 0;
  }
  if (!layout) {
    layout = 0;
  }
  if (!area_code) {
    area_code = '021';
  }
  if (!activePriceMessage) {
    var activePriceMessage = 0;
    var price_bottom = 0;
    var price_top = 0;
  } else {
    messageList = activePriceMessage.split("-");
    console.log(messageList, 'messageList');
    var price_bottom = messageList[0];
    var price_top = messageList[1];
  }
  var noHouseListHidden = that.data.noHouseListHidden;
  that.setData({
    hidden: false
  });
  if (that.data.keywords) {
    keywords = that.data.keywords;
  } else {
    keywords = '';
  }
  /*console.log(that.data.district, 'that.data.district')
  if (that.data.district) {
    district = that.data.district;
  }*/
  if (that.data.price) {
    price = that.data.price;
  }
  if (that.data.rent_date) {
    rent_date = that.data.rent_date;
  }
  if (that.data.hl_data) {
    hl_data = that.data.hl_data;
  }

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
      g_uid: g_uid,
      area_code: area_code,
      page: page,
      is_show: is_show,                          //是否显示banner，默认为0不显示，1显示
      subwayline_id: subwayline_id,                  //地铁id，不选传0
      station_id: station_id,                      //地铁站id，不选传0
      filter_type: filter_type , //列表基本筛选规则：
      //normal: 常规筛选，只以常规筛选条件（如区域价格等）来筛选
      //similar: 请求所带house_id参数对应房源的相似房源为基础筛选，同时包含常规筛选条件
      //community: 请求所带house_id参数对应房源的同小区房源为基础筛选，同时包含常规筛选条件
      //brand: 请求所带的brand_id参数对应的同品牌房源为基础筛选，同时包含常规筛选条件
      //list: 请求的是运营位上配置的列表，使用list_id指定列表ID
      community_id: community_id,//小区ID
      filter_house_id: 0, //filter_type为similar/community时使用
      layout: layout, //户型：
      //0: 不限
      //1: 一居
      //2: 两居
      //3: 三居
      //4: 四居+
      business_code: business_code, //商圈代码，由握手同步协议下发, 为0则为不限
      district_id: district_id, //行政区id，由握手同步协议下发, 为0则为不限
      price_bottom: price_bottom, //价格筛选最低价, 为0则为不限
      price_top: price_top, //价格筛选最高价, 为0则为不限
      rent_mode: rent_mode, //租赁方式: 0-不限; 1-整租 ; 2-合租
      keyword: keywords, //搜索关键词
      index_house_id: index_house_id, //分页请求的起始房源ID
      page_size: 10, //分页请求的单页的数量
      brand_id: brand_id, //品牌ID
      list_id: list_id, //列表页ID
      price_sort: price_sort, // 0-不限 1从低到高 2 从高到低
      location: locationDing,
      brand_type: brand_type,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log(res, 'list1111')
      console.log(that.data,'data')
      var list = that.data.list;
      var bannersList = that.data.bannersList;
      var listPriceList = that.data.listPriceList;
      var isCollect = that.data.isCollect;
      var recommendList = that.data.recommendList;
      var recommendPriceList = that.data.recommendPriceList;
      var recommendIsCollect = that.data.recommendIsCollect;
      if (res.data.content.house_list == '') {
        var index_house_id = '';
      } else {
        var num = res.data.content.house_list.length - 1;
        var index_house_id = res.data.content.house_list[num].house_id;
      }
      for (var i = 0; i < res.data.content.banners.length; i++) {
        bannersList.push(res.data.content.banners[i]);
      }
      for (var i = 0; i < res.data.content.house_list.length; i++) {
        if (res.data.content.house_list[i].cover_pic != '') {
          res.data.content.house_list[i].cover_pic = res.data.content.house_list[i].cover_pic;     
        } else {
          res.data.content.house_list[i].cover_pic = "../../../images/list/im_eorr.png";
        }
        list.push(res.data.content.house_list[i]);
        isCollect.push(res.data.content.house_list[i].is_collect);
        listPriceList.push(res.data.content.house_list[i].price.split('/')[0]);
        console.log(listPriceList,'listPriceList')
      }
      if (page != 1 || list.length > 0) {
        var noHouseListHidden = true;
        console.log('noHouseListHidden2')
      }
      else {
        var noHouseListHidden = false;
        console.log('noHouseListHidden1')
      }
      //房源总数
      var hidden = true;
      that.setData({
        hidden: true,
      })
      var house_total = res.data.content.house_total;
      if (res.data.content.house_total>0){
        console.log(ReachBottomNum,'ReachBottomNum111111111111')
        if (ReachBottomNum == 1) {
          var hiddenSearch = true; 
        }
        else {
          var hiddenSearch = false;
        }
      }
      //推荐房源
      for (var i = 0; i < res.data.content.recommend.length; i++) {
        if (res.data.content.recommend[i].cover_pic != '') {
          res.data.content.recommend[i].cover_pic = res.data.content.recommend[i].cover_pic;
        } else {
          res.data.content.recommend[i].cover_pic = "../../../images/list/im_eorr.png";
        }
        recommendList.push(res.data.content.recommend[i]);
        recommendIsCollect.push(res.data.content.recommend[i].is_collect);
        recommendPriceList.push(res.data.content.recommend[i].price.split('/')[0]);
        console.log(recommendPriceList,'recommendPriceList')
      }
     
      that.setData({
        house_total: house_total,
        isCollect: isCollect,
        list: list,
        bannersList: bannersList,
        listPriceList: listPriceList,
        recommendIsCollect: recommendIsCollect,
        recommendList: recommendList,
        recommendPriceList: recommendPriceList,
        index_house_id: index_house_id,
        pullKey: 0,
        /* day_new_count:res.data.data.day_new_count,
         day_rent_count: res.data.data.day_rent_count,*/
        noHouseListHidden: noHouseListHidden,
      });
      page++;
      that.setData({
        hiddenSearch: hiddenSearch,
        hidden: hidden,
        ReachBottomNum:0,
      });
      that.timeOutHouse();
    }
  });
}
Page({
  data: {
    width100:0,
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    hidden: true,
    hiddenSearch:true,
    list: [],
    bannersList:[],
    listPriceList:[],
    isCollect: [],
    recommendIsCollect: [],
    recommendList: [],
    recommendPriceList:[],
    messageList: [],
    city_list: [],
    districtList: [],
    pullKey: 0,
    scrollTop: 0,
    scrollHeight: 0,
    typeID: 0,
    postid: "",
    isLoading: true,
    loadOver: false,
    noHouseListHidden: true,
    priceList: [{
      key: 0,
      value: "不限",
      message: 0
    },
    {
      key: 1,
      value: "1500以下",
      message: '0-1500'
    },
    {
      key: 2,
      value: "1500-3000",
      message: '1500-3000'
    },
    {
      key: 3,
      value: "3000-5000",
      message: '3000-5000'
    },
    {
      key: 4,
      value: "5000-10000",
      message: '5000-10000'
    },
    {
      key: 5,
      value: "10000-20000",
      message: '10000-20000'
    },
    {
      key: 6,
      value: "20000以上",
      message: '20000-0'
    }
    ],
    typeList: [{
      key: 0,
      value: "不限"
    },
    {
      key: 1,
      value: "一室"
    },
    {
      key: 2,
      value: "二室"
    },
    {
      key: 3,
      value: "三室"
    },
    {
      key: 4,
      value: "四室及以上"
    }
    ],
    timeList: [{
      key: 0,
      value: "不限"
    },
    {
      key: 1,
      value: "整租"
    },
    {
      key: 2,
      value: "合租"
    },
    ],
    height_lowList: [{
      key: 0,
      value: "不限"
    },
    {
      key: 1,
      value: "价格从低到高"
    },
    {
      key: 2,
      value: "价格从高到低"
    },
    ],
    districtChioceIcon: "/images/list/icon-go-black.png",
    priceChioceIcon: "/images/list/icon-go-black.png",
    typeChioceIcon: "/images/list/icon-go-black.png",
    timeChioceIcon: "/images/list/icon-go-black.png",
    HLChioceIcon: "/images/list/sorting.png",
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
    activeTypeName: "户型",
    activePriceName: "租金",
    activeTimeName: "整租/合租",
    activeHlName: "",
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('搜索列表页打开');
    console.log(options.brandId,options.areaCode, options.brandType,'1111333311111')
    if (options.is_show==1){
      var is_show=1;
    }
    else{
      var is_show=0;
    }
    var noHouseListHidden = this.data.noHouseListHidden;
    if (!options.brandType)
    {
      var area_codeCity = wx.getStorageSync('area_code'); 
      var brand_type=0;
    }
    else {
      wx.setStorageSync('area_code', options.areaCode);
      var area_codeCity = options.areaCode;
      var brand_type = options.brandType
    } 
    if (!options.brandId) {
      var brandId = 0;
    }
    else {
      var brandId = options.brandId
    }
    console.log(noHouseListHidden,'noHouseListHidden11111111111')
    if (options.list_id) {
      var list_id = options.list_id;
      var filter_type = 'list';
    }
    else if (options.communityid) {//房源详情页小区id
      var community_id = options.communityid;
      var filter_type = 'community_list';
    }
    else if (options.brandId) {//品牌id
      var brandId = options.brandId;
      var filter_type = 'brand';
    }
    else if (options.brandType == 3 || options.brandType == 2 || options.brandType ==1) {//品牌id
      var brand_type = options.brandType;
      var filter_type = 'brand';
    }
    else {
      var list_id = '';
      var community_id='';
      var filter_type = 'normal';
    }
    console.log(imgUrl, 'eeee')
    //var area_codeCity = options.area_codeCity;
    if (!options.locationDing)
    {
      var locationDing = '';
    }
    else
    {
      var locationDing = options.locationDing;
    }

    page = 1;

    if (options.keywords == 'undefined') {
      keywords = '';
    } else {
      keywords = options.keywords;
    }

    if (area_codeCity == '010') {
      var areaCityName = '北京市';
      var activeDistrictParentIndex = 1;
      var area_codeCity = '010';
    } else if (area_codeCity == '020') {
      var areaCityName = '广州市';
      var activeDistrictParentIndex = 2;
      var area_codeCity = '020';
    } else if (area_codeCity == '0755') {
      var areaCityName = '深圳市';
      var activeDistrictParentIndex = 3;
      var area_codeCity = '0755';
    } else if (area_codeCity == '0571') {
      var areaCityName = '杭州市';
      var activeDistrictParentIndex = 4;
      var area_codeCity = '0571';
    } else if (area_codeCity == '028') {
      var areaCityName = '成都市';
      var activeDistrictParentIndex = 5;
      var area_codeCity = '028';
    } else {
      var areaCityName = '上海市';
      var activeDistrictParentIndex = 0;
      var area_codeCity = '021';
    }
    this.setData({
      keywords: keywords,
      list: [],
      bannersList:[],
      listPriceList:[],
      recommendList:[],
      recommendPriceList:[],
      scrollTop: 0,
      area_codeCity: area_codeCity,
      //activeDistrictName: activeDistrictName,
      city_id: city_id,
      district: 0,
      price: 0,
      houseType: 0,
      rent_date: 0,
      locationDing: locationDing,
      list_id: list_id,
      filter_type: filter_type,
      areaCityName: areaCityName,
      community_id: community_id,//房源详情页小区id
      is_show: is_show,
      brand_type: brand_type,
      brandId: brandId,
    });
    this.handTap();
    GetList(this);
  },
  //握手协议
  handTap: function () {
    var that = this;
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    if (that.data.brand_type == 0) {
      var area_codeCity = wx.getStorageSync('area_code'); 
    }
    else{
      var area_codeCity = that.data.area_codeCity;
    }
    var districtList = [];
    var subway=[];
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
        console.log(res,'kkkkkkkk');
        
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
  //下拉刷新
  onPullDownRefresh: function () {
    var pullKey = 1;
    page = 1;
    this.setData({
      pullKey: pullKey,
      list:[],
      bannersList:[],
      listPriceList:[],
      ReachBottomNum:0,
    })
    GetList(this);
    wx.stopPullDownRefresh()
  },
  brandsTap: function (event) {
    var partner_id = event.target.id;
    if (partner_id == 29) {
      return false;
    }
    wx.navigateTo({
      url: '/pages/list/brands/brands?id=' + partner_id
    })
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    var ReachBottomNum=1;
    this.setData({
      ReachBottomNum: ReachBottomNum,
    })
    GetList(that);
  },
  onListDetailTap: function (event) {
    var postId = event.currentTarget.dataset.id;
    var pricecount = event.currentTarget.dataset.pricecount;
    console.log(pricecount,'pricecount')
    if (pricecount == -1 || pricecount==1) {
      wx.navigateTo({
        url: '../listDetail/listDetail?id=' + postId
      })
    }
    else {
      wx.navigateTo({
        url: '../listDetailOthers/listDetailOthers?id=' + postId
      })
    }
  },
  //搜索
  onSearchBtn: function () {
    app.aldstat.sendEvent('搜索列表页搜索点击');
    var that=this;
    var areaCityName = that.data.areaCityName;
    var locationDing = that.data.locationDing;
    var keywords = that.data.keywords;
    console.log(areaCityName, 'areaCityName')
    page = 1;
    that.setData({
      list: [],
      bannersList:[],
      listPriceList:[],
      recommendList:[],
      recommendPriceList:[],
    })
    //地址解析  
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'CVCBZ-XLER3-MBL3Q-3OT5J-6WWJJ-HQFPY' // 必填
    });  
    // 调用接口
    demo.geocoder({
      address: areaCityName+keywords,
      success: function (res) {
        console.log(res, '地图', res.result.location.lat, res.result.location.lng);
        var reliability = res.result.reliability;
        if (reliability<7)
        {
          var locationDing = '';
          console.log(locationDing, 'locationDing333');
          that.setData({
            locationDing: locationDing,
          })
          GetList(that);
        }
        else {
          demo.reverseGeocoder({
            location: {
              latitude: res.result.location.lat,
              longitude: res.result.location.lng
            },
            coord_type: 3,//baidu经纬度
            success: function (res) {
              var lat = res.result.ad_info.location.lat;
              var lng = res.result.ad_info.location.lng;
              var locationDing = lat + ',' + lng;
              console.log(locationDing, '转化')
              that.setData({
                locationDing: locationDing,
              })
              console.log(locationDing, 'locationDing1111')
              GetList(that);
            }
          });
        }
      },
      fail: function (res) {
        console.log(res, '失败');
        var locationDing = '';
        console.log(locationDing, 'locationDing333');
        that.setData({
          locationDing: locationDing,
        })
        GetList(that);
      }
    });
    //地址解析结束
  },


  //条件选择
  choiceItem: function (e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chioceTime) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-down-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: true,
            chioceHL: false,
          });
        }
        break;
      case "2":
        this.setData({
          keywords: '',
        })
        if (this.data.chioceDistrict) {
         /* var activeDistrictParentIndexNum = this.data.activeDistrictParentIndexNum;
          if (activeDistrictParentIndexNum == 2) {
            var districtListNew = this.data.subway;
          }
          else {
            var districtListNew = this.data.districtList;
          }
          console.log(activeDistrictParentIndexNum, districtListNew, 'districtListNew111')*/
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
            //districtListNew: districtListNew,

          });
        } else {
         /* var activeDistrictParentIndexNum = this.data.activeDistrictParentIndexNum;
          if (activeDistrictParentIndexNum == 2) {
            var districtListNew = this.data.subway;
          }
          else {
            var districtListNew = this.data.districtList;
            var activeDistrictParentIndex1No = this.data.activeDistrictParentIndex1No;
            console.log(activeDistrictParentIndex1No, 'activeDistrictParentIndex1No00001')
            if (activeDistrictParentIndex1No == 0) {
              var activeDistrictParentIndex1No = 0;
              var activeDistrictParentIndex1 = this.data.activeDistrictParentIndex1;
              console.log(activeDistrictParentIndex1No, 'activeDistrictParentIndex1No1111')
            }
            else {
              var activeDistrictParentIndex1No = -1;
              var activeDistrictParentIndex1 = 0;
              console.log(activeDistrictParentIndex1No, 'activeDistrictParentIndex1No0000')
            }
          }
          console.log(activeDistrictParentIndex1, activeDistrictParentIndex1No,'districtListNew222')*/
          this.setData({
            districtChioceIcon: "/images/list/icon-down-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: true,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
            /*districtListNew: districtListNew,
            activeDistrictParentIndex1: activeDistrictParentIndex1,
            activeDistrictParentIndex1No: activeDistrictParentIndex1No,*/
          });
        }
        break;
      case "3":
        if (this.data.chiocePrice) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-down-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: true,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
          });

        }
        break;
      case "4":
        if (this.data.chioceType) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-down-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: true,
            chioceTime: false,
            chioceHL: false,
          });

        }
        break;
      case "5":
        if (this.data.chioceType) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-down-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting1.png",
            chioceDistrict: false,
            chiocePrice: false,
            chioceType: false,
            chioceTime: false,
            chioceHL: true,
          });
        }
        break;
    }
  },
  hideAllChioce: function () {
    this.setData({
      districtChioceIcon: "/images/list/icon-go-black.png",
      priceChioceIcon: "/images/list/icon-go-black.png",
      typeChioceIcon: "/images/list/icon-go-black.png",
      timeChioceIcon: "/images/list/icon-go-black.png",
      HLChioceIcon: "/images/list/sorting.png",
      chioceDistrict: false,
      chiocePrice: false,
      chioceType: false,
      chioceTime: false,
      chioceHL: false,
    });
  },
  //输入框内容获取
  keywordsInputEvent: function (e) {
    var that=this;
    var areaCityName = this.data.areaCityName;
    var keywords = e.detail.value;
    var cityKeyWord = keywords;// areaCityName +
    that.setData({
      keywords: keywords,
      chioceDistrict: false,
      cityKeyWord: cityKeyWord,
    })
  },
  //输入框获取焦点
  searchFocus: function () {
    this.setData({
      PriceChioceIcon: "/images/list/icon-go-black.png",
      chioceDistrict: false,
      chiocePrice: false,
      chioceType: false,
      chioceTime: false,
      chioceHL: false,
    })
  },
  //选择区域或地铁
  selectDistrictParent: function (e) {
    var activeDistrictParentIndexNum = e.currentTarget.dataset.index;
    var activeDistrictParentIndex=e.currentTarget.dataset.index;
    this.setData({
      activeDistrictParentIndex: activeDistrictParentIndex,
      activeDistrictParentIndexNum: activeDistrictParentIndexNum,
      currentIdx:-1,
      activeDistrictParentIndex1:0,
      activeDistrictParentIndexSubway: 0, 
      selectDistrictChildrenNo: -1,
      selectDistrictChildrenSubwayNo: -1,//地铁线路不限
      activeDistrictParentIndex1No: -1,//区域不限
      business_code: 0,//商圈代码
      district_id: 0,//行政区id
      subwayline_id: 0, //地铁id
      station_id: 0,//地铁站id      
      district:-1,
      width100:0,

    });
   //this.handTap();
   // page = 0;
   // GetList(this);

  },
  //选择区域
  selectDistrictChildren: function (e) {
    var idx = e.currentTarget.dataset.index;
    var district_id = this.data.districtList[e.currentTarget.dataset.index].district_id;
    this.setData({
      activeDistrictParentIndex1: e.currentTarget.dataset.index,
      district_id:district_id,
      activeDistrictParentIndex1No: 0,
      activeDistrictName: this.data.districtList[e.currentTarget.dataset.index].district_name,
      scrollIntoView: 0,
      city: e.currentTarget.dataset.index,
      district: 0,
      idx: idx,
      currentIdx: -1,
      width100:1,
    });
    if (this.data.districtList[e.currentTarget.dataset.index].business_name.length == 0) {
      this.setData({
        chioceDistrict: false, 
        locationDing: '',
        width100: 0,
      })
      this.handTap();
      page =1;
      GetList(this);
    }
  },
  //选择区域(不限)
  selectDistrictChildrenNo: function (e) {
    var activeDistrictParentIndex1No = e.currentTarget.dataset.index;
    console.log(activeDistrictParentIndex1No, 'activeDistrictParentIndex1No0000');
    this.setData({
      districtChioceIcon: "/images/list/icon-go-black.png",
      chioceDistrict: false,
      activeDistrictParentIndex1No: activeDistrictParentIndex1No,
      activeDistrictName: '不限',
      district_id: 0,
      business_code: 0,
      district_id: 0,
      list: [],
      bannersList:[],
      listPriceList:[],
      recommendList: [],
      recommendPriceList:[],
      isCollect: [],
      locationDing: ''
    })
    this.handTap();
    page = 1;
    GetList(this);
  },
  //选择地铁线路
  selectDistrictChildrenSubway: function (e) {
    var activeDistrictParentIndexSubway=e.currentTarget.dataset.index;
    this.setData({
      activeDistrictName: this.data.subway[activeDistrictParentIndexSubway].subwayline,
      activeDistrictParentIndexSubway: e.currentTarget.dataset.index,
      subwayline_id: this.data.subway[e.currentTarget.dataset.index].subwayline_id,
      selectDistrictChildrenSubwayNo:0,
      scrollIntoView: 0,
      city: e.currentTarget.dataset.index,
      width100: 1,
    });
    if (this.data.subway[e.currentTarget.dataset.index].station.length == 0) {
      this.setData({
        chioceDistrict: false,
        locationDing: '',
        width100: 0,
      })
      this.handTap();
      page = 1;
      GetList(this);
    }
  },
  //选择地铁线路(不限)
  selectDistrictChildrenSubwayNo: function (e) {
    var selectDistrictChildrenSubwayNo = e.currentTarget.dataset.index;
    this.setData({
      districtChioceIcon: "/images/list/icon-go-black.png",
      chioceDistrict: false,
      activeDistrictName: '不限',
      subwayline_id: 0,
      station_id: 0,
      selectDistrictChildrenSubwayNo: selectDistrictChildrenSubwayNo,
      list: [],
      bannersList:[],
      listPriceList:[],
      recommendList: [],
      recommendPriceList:[],
      isCollect: [],
      locationDing: ''
    })
    this.handTap();
    page = 1;
    GetList(this);
  },
  //选择商圈
  selectDistrictChildrenOne: function (e) {
    var currentIdxNo = e.currentTarget.dataset.index;
    if (currentIdxNo == -1) {
      this.setData({
        currentIdxNo: currentIdxNo,
        business_code:0,
        districtChioceIcon: "/images/list/icon-go-black.png",
        chioceDistrict: false,
        list: [],
        bannersList:[],
        listPriceList:[],
        recommendList: [],
        recommendPriceList:[],
        isCollect: [],
        locationDing: ''
      })
    }
    else {
      var idx = e.currentTarget.dataset.index;
      var parentIndex = this.data.activeDistrictParentIndex1 == -1 ? 0 : this.data.activeDistrictParentIndex1;
      this.setData({
        activeDistrictName: this.data.districtList[parentIndex].business_name[idx].name,
        business_code: this.data.districtList[parentIndex].business_name[idx].business_code,
        districtChioceIcon: "/images/list/icon-go-black.png",
        chioceDistrict: false,
        currentIdxNo:0,
        //activeDistrictParentIndex1: -1,
        currentIdx: e.currentTarget.dataset.index,
        list: [],
        bannersList:[],
        listPriceList:[],
        recommendList: [],
        recommendPriceList:[],
        isCollect: [],
        city: idx,
        district: idx,
        locationDing: ''
      });
    }
    this.handTap();
    page =1;
    GetList(this);
  },
  //选择地铁站
  selectDistrictChildrenOneSubway: function (e) {
    var districtNo = e.currentTarget.dataset.index;
    if (districtNo == -1) {
      this.setData({
        districtNo: districtNo,
        station_id: 0,
        districtChioceIcon: "/images/list/icon-go-black.png",
        chioceDistrict: false,
        list: [],
        bannersList:[],
        listPriceList:[],
        recommendList: [],
        recommendPriceList:[],
        isCollect: [],
        locationDing: ''
      })
      this.handTap();
      page =1;
      GetList(this);
    }
    else {
      var idx = e.currentTarget.dataset.index;

      var parentIndex = this.data.activeDistrictParentIndexSubway == -1 ? 0 : this.data.activeDistrictParentIndexSubway;
      this.setData({
        activeDistrictName: this.data.subway[parentIndex].station[idx].station_name,
        station_id: this.data.subway[parentIndex].station[idx].station_id,
        districtChioceIcon: "/images/list/icon-go-black.png",
        chioceDistrict: false,
        list: [],
        bannersList:[],
        listPriceList:[],
        recommendList: [],
        recommendPriceList:[],
        isCollect: [],
        city: idx,
        district: idx,
        locationDing: ''
      });
      this.handTap();
      page =1;
      GetList(this);
    }
  },
  //选择租金
  selectPrice: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      PriceChioceIcon: "/images/list/icon-go-black.png",
      chiocePrice: false,
      activePriceName: this.data.priceList[index].value,
      activePriceMessage: this.data.priceList[index].message,
      list: [],
      bannersList:[],
      listPriceList:[],
      isCollect:[],
      price: this.data.priceList[index].key
    });
    page = 1;
    GetList(this);

  },
  //选择房型
  selectType: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      typeChioceIcon: "/images/list/icon-go-black.png",
      chioceType: false,
      activeTypeName: this.data.typeList[index].value,
      list: [],
      bannersList:[],
      listPriceList:[],
      isCollect:[],
      houseType: this.data.typeList[index].key
    });
    page = 1;
    GetList(this);

  },
  //选择租期(整租/合租)
  selectTime: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      timeChioceIcon: "/images/list/icon-go-black.png",
      chioceTime: false,
      activeTimeName: this.data.timeList[index].value,
      list: [],
      bannersList:[],
      listPriceList:[],
      isCollect:[],
      rent_date: this.data.timeList[index].key,
      rent_mode: this.data.timeList[index].key,
    });
    page = 1;
    GetList(this);
  },
  //价格排序
  HLTime: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      HLChioceIcon: "/images/list/sorting1.png",
      chioceHL: false,
      activeHlName: this.data.height_lowList[index].value,
      list: [],
      bannersList:[],
      listPriceList:[],
      isCollect:[],
      hl_data: this.data.height_lowList[index].key,
      price_sort: this.data.height_lowList[index].key,
    });
    page = 1;
    GetList(this);
  },
  //点击收藏时判断是否已经登录
  onPersonalBtn: function (event) {
    app.aldstat.sendEvent('详情页收藏点击');
    var token = wx.getStorageSync('token');
    var postid = event.currentTarget.dataset.id;
    var idx = event.currentTarget.dataset.idx;
    var isCollect = this.data.isCollect;
    var recommendIsCollect = this.data.recommendIsCollect;
    console.log(recommendIsCollect[idx], 'recommendIsCollectrecommendIsCollect')
    if (!token) {
      //保存跳转链接
      wx.setStorageSync('back_url', '');
     // var to_url = encodeURIComponent('/pages/list/search/search?id=' + postid);

      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
      })

    } else {

      if (isCollect[idx] == 1) {
        this.onCollectC(url3, postid);
        isCollect[idx]=2;
        this.setData({
          isCollect: isCollect,
        })
      } else if (isCollect[idx] == 2){
        this.onCollect(url2, postid);
        isCollect[idx] = 1;
        this.setData({
          isCollect: isCollect,
        })
      }
    }
    if (recommendIsCollect[idx] == 1) {
      this.onCollectC(url3, postid);
      recommendIsCollect[idx] = 2;
      this.setData({
        recommendIsCollect: recommendIsCollect,
      })
      console.log(recommendIsCollect[idx], '1');
    } else if (recommendIsCollect[idx] == 2) {
      this.onCollect(url2, postid);
      recommendIsCollect[idx] = 1;
      this.setData({
        recommendIsCollect: recommendIsCollect,
      })
      console.log(recommendIsCollect[idx], '2');
    }
  },
  //收藏或取消收藏
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  //收藏或取消收藏时icon变化
  showToast: function (postsCollected, postCollected) {
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    })
  },
  //提交收藏状态
  onCollect: function (url2, postid) {
    app.aldstat.sendEvent('收藏房源点击');
    var that = this;
    if (!postid) {
      var postid = that.data.postid;
    }
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url2,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        house_id: postid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
        source: '1',
        sign: '1'
      },
      success: function (res) {
        console.log(res, '收藏')
        if (res.data.ret == 401) {
          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');
          //保存跳转链接
          wx.setStorageSync('back_url', '');
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity',
          })
        }
        else
        {
          var codeId = res.data.code;
          that.setData({
            codeId: codeId,
          });
          wx.showToast({
            title: "收藏成功",
            duration: 1000,
            icon: "success"
          });
        }
      },
      fail: function (error) { }
    })
  },
  //提交取消收藏数据
  onCollectC: function (url3, postid) {
    app.aldstat.sendEvent('取消收藏房源点击');
    var that = this;
    if (!postid) {
      var postid = this.data.postid;
    }
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url3,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        house_id: postid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
        source: '1',
        sign: '1'
      },
      success: function (res) {
        if (res.data.ret == 401) {
          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');
          //保存跳转链接
          wx.setStorageSync('back_url', '');
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity',
          })
        }
        else {
          var codeId = res.data.code;

          that.setData({
            codeId: codeId,
          });
          wx.showToast({
            title: "取消收藏成功",
            duration: 1000,
            icon: "success"
          });
        }
      },
      fail: function (error) { }
    })
  },
  //定时器（1秒后房源总数弹框消失）
  timeOutHouse:function(){
    var that=this;
    setTimeout(function () {
      that.setData({
        hiddenSearch: true
      })
    }, 1000) //延
  },
  bannersListTap:function(event){
    var url = event.currentTarget.dataset.action;
    var dataAdent = event.currentTarget.dataset.id;
    var action = event.currentTarget.dataset.action;
    var posterImg = event.currentTarget.dataset.img;
    if (dataAdent == 1) {
      var url = encodeURIComponent(url + '&posterImg=' + posterImg);
      wx.navigateTo({
        url: '/pages/list/newsList/newsList?url=' + url,
      })
    } else if (dataAdent == 2) {
      wx.navigateTo({
        url: '/pages/list/listDetail/listDetail?id=' + url,
      })
    } else if (dataAdent == 3) {
      wx.navigateTo({
        url: '/pages/list/search/search?list_id=' + url + '&is_show=1',
      })
    } else if (dataAdent == 0) {
      //wx.showToast({
      //  title: '暂无跳转',
      // icon: 'loading'
      //})
    }
    // var util=require('../../utils/util.js');
    // var actionType = util.actionType(dataAdent, url,'00');
  }
})