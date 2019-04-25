var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/brand/list_brand";
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var page=1;
var time=0;
var idxPrice = 0;//综合筛选项选中的索引
var idxHl = 0;//在租数筛选项选中的索引
var idxTime = 0;//入驻时间筛选项选中的索引
var keyword = '';
var hidden=true;
var hidden1=true;
var hidden2=true;
var list_brand=[];
Page({
  data: {
    hiddenSearch: true,
    hidden: true,
    priceList: [{
      key: 0,
      value: "默认",
      message: 0,
    },
    {
      key: 1,
      value: "点赞数从高到低",
      message: 1
    },
    {
      key: 2,
      value: "点赞数从低到高",
      message: 2
    },
    {
      key: 3,
      value: "访问量从高到低",
      message: 3
    },
    {
      key: 4,
      value: "访问量从低到高",
      message: 4
    }
    ],
    HlList: [{
      key: 0,
      value: "默认"
    },
    {
      key: 1,
      value: "在租数从高到低"
    },
    {
      key: 2,
      value: "在租数从低到高"
    },
    ],
    timeList: [{
      key: 0,
      value: "默认"
    },
    {
      key: 1,
      value: "品牌入驻时间正序"
    },
    {
      key: 2,
      value: "品牌入驻时间倒序"
    },
    ],
    districtChioceIcon: "/images/brand/icon-go-black.png",
    priceChioceIcon: "/images/brand/icon-go-black.png",
    typeChioceIcon: "/images/brand/icon-go-black.png",
    timeChioceIcon: "/images/brand/icon-go-black.png",
    HLChioceIcon: "/images/brand/sorting.png",
    chiocePrice: false,
    chioceHl: false,
    chioceTime: false,
    activeDistrictParentIndex: -1,
    activeDistrictChildrenIndex: -1,
    scrollTop: 0,
    scrollIntoView: 0,
    activePriceIndex: -1,
    activeHlNameIndex: -1,
    activeTimeIndex: -1,
    activePriceName: "综合",
    activeHlName: "在租数",
    activeTimeName: "入驻时间 ",
    list_brand:[],
    all_like: 0,   //按喜欢数 1 从高到底 2 从低到高 (综合)
    all_visit: 0,   //按访问量 1 从高到底 2 从低到高 (综合)
    online: 0,  // 1 从高到底 2 从低到高（在租数）
    total: 0,      // 1 从高到底 2 从低到高（经营数）
    time: 0,    // 1 从高到底 2 从低到高（入驻时间）
    page: 1,
    hiddenSearch: false,
    hidden: true,
    hidden1: true,
    hidden2:true,
    brandLength:"",
    areaCode:"",
    keyword:'',
    idxPrice:0,//综合筛选项选中的索引
    idxHl: 0,//在租数筛选项选中的索引
    idxTime: 0,//入驻时间筛选项选中的索引
  },
  onLoad: function (options) {
    let that = this;
    app.aldstat.sendEvent('进入品牌馆列表页');
    var openid = wx.getStorageSync('openid');
    var areaCode = wx.getStorageSync('area_codeCity');
    that.setData({
      areaCode: areaCode,    
    });
    page=1;
    that.GetList();
  },
  //输入框内容获取
  keywordsInputEvent: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var cityKeyWord = keywords;
    that.setData({
      keywords: keywords,
      chioceDistrict: false,
      cityKeyWord: cityKeyWord,
    })
  },
  //输入框获取焦点
  searchFocus:function(){
    this.setData({
      PriceChioceIcon: "/images/list/icon-go-black.png",
      chiocePrice: false,
      chioceTime: false,
      chioceHl: false,
    })
  },
  GetList:function(){
    let that = this;
    var openid = wx.getStorageSync('openid');
    if (!that.data.cityKeyWord){
      var keyword ='';
    }
    else {
      var keyword = that.data.cityKeyWord;
    }
    console.log(keyword,'keyword');
    var all_like = that.data.all_like;
    var all_visit = that.data.all_visit;
    var online = that.data.online;
    var total = that.data.total;
    var time = that.data.time;
    console.log(time,'time')
    var areaCode = wx.getStorageSync('area_codeCity');
    wx.request({
      url: url,
      data: {
        'os_type': app.globalDataJson.os_type,
        'os_version': app.globalDataJson.os_version,
        "channel": app.globalDataJson.channel,      //渠道号
        "network": app.globalDataJson.network,        //网络类型，取值范围以可取到的状态为准：        
        "version_code": app.globalDataJson.version_code,     //客户端本号
        "area_code": areaCode,       //行政区号
        "app_device": openid,   //APP运行设备的唯一标识OPEN_ID
        "g_uid": openid,      //当前登录的OPEN_ID(如果已登录时上传)
        "package_name": "",   //应用包名
        "all_like": all_like,   //按喜欢数 1 从高到底 2 从低到高 (综合)
        "all_visit": all_visit,   //按访问量 1 从高到底 2 从低到高 (综合)
        "online":online,  // 1 从高到底 2 从低到高（在租数）
        "total":total,      // 1 从高到底 2 从低到高（经营数）
        "time":time,    // 1 从高到底 2 从低到高（入驻时间）
        "keyword": keyword, //品牌馆名称，或者简介
        "page":page,
        "pagesize": 10
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        console.log(res.data,'1111111111')
        var list_brand = that.data.list_brand;
        for (var i = 0; i < res.data.content.list_brand.length;i++){
          list_brand.push(res.data.content.list_brand[i]);
        }
        if (list_brand.length>0&&res.data.content.list_brand.length == 0) {
          that.setData({
            hidden1: false,
          })
        } 
        if (list_brand.length == 0 && res.data.content.list_brand.length == 0) {
          that.setData({
            hidden2: false,
          })
        }
        page++;
        that.setData({
          list_brand: list_brand,
          hidden: true,
        })
      },
    })
  },
  //条件选择
  choiceItem: function (e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chiocePrice) {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-go-black.png",
            typeChioceIcon: "/images/brand/icon-go-black.png",
            timeChioceIcon: "/images/brand/icon-go-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-go-black.png",
            typeChioceIcon: "/images/brand/icon-go-black.png",
            timeChioceIcon: "/images/brand/icon-down-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: true,
            chioceTime: false,
            chioceHl: false,
          });
        }
        break;
      case "2":
        if (this.data.chioceHl) {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-go-black.png",
            typeChioceIcon: "/images/brand/icon-go-black.png",
            timeChioceIcon: "/images/brand/icon-go-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-go-black.png",
            typeChioceIcon: "/images/brand/icon-down-black.png",
            timeChioceIcon: "/images/brand/icon-go-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: true,
          });
        }
        break;
      case "3":
        if (this.data.chioceTime) {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-go-black.png",
            typeChioceIcon: "/images/brand/icon-go-black.png",
            timeChioceIcon: "/images/brand/icon-go-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/brand/icon-go-black.png",
            priceChioceIcon: "/images/brand/icon-down-black.png",
            typeChioceIcon: "/images/brand/icon-go-black.png",
            timeChioceIcon: "/images/brand/icon-go-black.png",
            HLChioceIcon: "/images/brand/sorting.png",
            chiocePrice: false,
            chioceTime: true,
            chioceHl: false,
          });
        }
        break;
    }
  },
  hideAllChioce: function () {
    this.setData({
      districtChioceIcon: "/images/brand/icon-go-black.png",
      priceChioceIcon: "/images/brand/icon-go-black.png",
      typeChioceIcon: "/images/brand/icon-go-black.png",
      timeChioceIcon: "/images/brand/icon-go-black.png",
      HLChioceIcon: "/images/brand/sorting.png",
      chiocePrice: false,
      chioceTime: false,
      chioceHl: false,
    });
  },
  //选择综合
  selectPrice: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      hidden1: true,
      hidden2: true,
      list_brand:[],
    })
    switch (index) {
      case 0:
        var all_like = 0;
        var all_visit = 0;
        that.setData({
          all_like: all_like,
          all_visit: all_visit,
        });
        page=1;
        that.GetList();
        break;
      case 1:
        var all_like = 1;
        that.setData({
          all_like: all_like,
        });
        page = 1;
        that.GetList();
        break;
      case 2:
        var all_like = 2;
        that.setData({
          all_like: all_like,
        });
        page = 1;
        that.GetList();
        break;
      case 3:
        let all_visit = 1;
        that.setData({
          all_visit: all_visit,
        });
        page = 1;
        that.GetList();
        break;
      case 4:
        var all_visit = 2;
        that.setData({
          all_visit: all_visit,
        });
        page = 1;
        that.GetList();
        break;
    };
    if (this.data.priceList[index].value.length > 4) {
      var activePriceName = this.data.priceList[index].value.substring(0, 4) + "...";
    }
    else {
      var activePriceName = this.data.priceList[index].value;
    }
    that.setData({
      PriceChioceIcon: "/images/list/icon-go-black.png",
      chiocePrice: false,
      activePriceName: activePriceName,
      activePriceMessage: this.data.priceList[index].message,
      priceKey: this.data.priceList[index].key,
      idxPrice: e.currentTarget.dataset.index,
    });
  },
  //选择在租数
  selectHl: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      hidden1: true,
      hidden2: true,
      list_brand: [],
    })
    switch (index) {
      case 0:
        var online = 0;
        that.setData({
          online: online,
        });
        page = 1;
        that.GetList();
        break;
      case 1:
        var online = 1;
        that.setData({
          online: online,
        });
        page = 1;
        that.GetList();
        break;
      case 2:
        var online = 2;
        that.setData({
          online: online,
        });
        page = 1;
        that.GetList();
        break;
    };
    if (this.data.HlList[index].value.length > 4) {
      var activeHlName = this.data.HlList[index].value.substring(0, 4) + "...";
    }
    else
    {
      var activeHlName = this.data.HlList[index].value;
    }
    this.setData({
      HLChioceIcon: "/images/list/sorting1.png",
      chioceHl: false,
      activeHlName: activeHlName,
      hl_data: this.data.HlList[index].key,
      HlKey: this.data.HlList[index].key,
      idxHl: e.currentTarget.dataset.index,
    });
  },
  //选择入驻时间
  selectTime: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      hidden1: true,
      hidden2:true,
      list_brand: [],
    })
    switch (index) {
      case 0:
        var time = 0;
        that.setData({
          time: time,
        });
        page = 1;
        that.GetList();
        break;
      case 1:
        var time = 1;
        that.setData({
          time: time,
        });
        page = 1;
        that.GetList();
        break;
      case 2:
        var time = 2;
        that.setData({
          time: time,
        });
        page = 1;
        that.GetList();
        break;
    };   
    if (this.data.timeList[index].value.length > 4) {
      var activeTimeName = this.data.timeList[index].value.substring(0, 4) + "...";
    }
    else{
      var activeTimeName = this.data.timeList[index].value;
    }
    this.setData({
      timeChioceIcon: "/images/brand/icon-go-black.png",
      chioceTime: false,
      activeTimeName: activeTimeName,
      TimeKey: this.data.timeList[index].key,
      idxTime: e.currentTarget.dataset.index,
    });
  },

  //触底加载
  onReachBottom: function () {
    var that = this;
    this.setData({
      scrollTop: 0,
      hidden:false,
    });
    that.GetList();
  },
  brandTap: function (e){
    var that = this;
    app.aldstat.sendEvent('品牌馆列表页跳转到品牌馆详情页');
    var url = e.currentTarget.dataset.url;
    var areaCode = that.data.areaCode;
    console.log(that.data);
    var dataAdent = e.currentTarget.dataset.adent;
    if (dataAdent == 4) {
      wx.navigateTo({
        url: '/pages/brand/brandDetail/brandDetail?id=' + url + "&areaCode=" + areaCode,
      })
    }    
  },
  onSearchBtn: function () {
    app.aldstat.sendEvent('品牌馆列表页搜索');
    var that = this;
    that.setData({
      hidden1: true,
      hidden2:true,
      list_brand: [],
    })
    page=1;
    that.GetList();
  }
})