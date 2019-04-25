var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url = app.globalDataJson.gyjProductBase + "miniapi/upload_house_list";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_operate";
var page = 1;
var time = 0;
var idxPrice = 0;//综合筛选项选中的索引
var idxHl = 0;//在租数筛选项选中的索引
var idxTime = 0;//入驻时间筛选项选中的索引
var keyword = '';
var hidden = true;
var hidden1 = true;
var hidden2 = true;
var list_brand = [];
var lstTipImg ='/images/list/renter_arrow_open.png';
var num=0;
var tsShow=true;
var communityList=[];
var cityNum=1;
var price_bottom=0;
var price_top=0;
var choodeMessageHidden=true;
var houseListLength=1;
Page({
  data: {
    houseListLength: houseListLength,
    price_bottom: price_bottom,   //最低价，0-不限
    price_top: price_top,   //最高价，0-不限
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    chooseSize: false,//底部弹框
    animationData: {},//底部弹框
    tsShow: tsShow,//免费发布房源弹框
    hiddenSearch: true,
    hidden: true,
    priceList: [{
      key: 0,
      value: "全部",
      message: 0,
    },
    {
      key: 1,
      value: "在租",
      message: 1
    },
    {
      key: 2,
      value: "已租",
      message: 2
    },
    {
      key: 3,
      value: "待审核",
      message: 3
    },
    {
      key: 4,
      value: "审核未通过",
      message: 4
      },
      {
        key: 5,
        value: "下架",
        message: 5
      }
    ],
    HlList: [{
      key: 0,
      value: "默认"
    },
    {
      key: 1,
      value: "小区1"
    },
    {
      key: 2,
      value: "小区2"
    },
    ],
    timeList: [{
      key: 0,
      value: "默认"
    },
    {
      key: 1,
      value: "33333"
    },
    {
      key: 2,
      value: "3333"
    },
    ],
    districtChioceIcon: "/images/list/icon-go-black.png",
    priceChioceIcon: "/images/list/icon-go-black.png",
    typeChioceIcon: "/images/list/icon-go-black.png",
    timeChioceIcon: "/images/list/icon-go-black.png",
    HLChioceIcon: "/images/list/sorting.png",
    chiocePrice: false,
    chioceHl: false,
    chioceTime: false,
    activeDistrictParentIndex: -1,
    activeDistrictChildrenIndex: -1,
    scrollTop: 0,
    scrollIntoView: 0,
    type:0,
    activePriceIndex: 0,
    activeHlNameIndex: -1,
    activeTimeIndex: -1,
    activePriceName: "全部",
    activeHlName: "小区",
    activeTimeName: "价格 ",
    list_brand: [],
    all_like: 0,   //按喜欢数 1 从高到底 2 从低到高 (综合)
    all_visit: 0,   //按访问量 1 从高到底 2 从低到高 (综合)
    online: 0,  // 1 从高到底 2 从低到高（在租数）
    total: 0,      // 1 从高到底 2 从低到高（经营数）
    time: 0,    // 1 从高到底 2 从低到高（入驻时间）
    page: 1,
    hiddenSearch: false,
    hidden: true,
    hidden1: true,
    hidden2: true,
    brandLength: "",
    areaCode: "",
    keyword: '',
    idxPrice: 0,//状态筛选项选中的索引
    idxHl:-1,//小区筛选项选中的索引
    indexHl:-1,
    //idxTime: 0,//价格筛选项选中的索引
    lstTipImg: lstTipImg,//小区收起展开
    num: num,
    communityList: communityList,
    cityNum: cityNum,
    choodeMessageHidden: choodeMessageHidden,
    tanShowNum:true,//毛玻璃效果
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('进入房源管理列表页');
    let that = this;
    if (!options.type){
      var type = 0;
      console.log(type, 'type01')
    }
    else if (options.type==6){
      var type = options.type;
    }
    else{
      var type = options.type;
      if (that.data.priceList[type].value.length > 4) {
        var activePriceName = that.data.priceList[type].value.substring(0, 4) + "...";
      }
      else {
        var activePriceName = that.data.priceList[type].value;
      }
      console.log(type, 'type21')
    }
    that.setData({
      type: type, 
      idxPrice: type,
      activePriceName: activePriceName,
    })
    that.GetList();
  },
  onReady:function(){
    var that=this;
    that.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 200,
      timingFunction: 'ease-out',
      success: function (res) {
        console.log(res)
      }
    })
    that.animation1 = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 200,
      timingFunction: 'ease-out',
      success: function (res) {
        console.log(res)
      }
    })
  },
  //小区房源展开收起
  listTipTap:function(event){
    var num = event.currentTarget.dataset.id;
    console.log(num,'num')
      this.setData({
        num: num,
      })
  },
  //房源列表弹框展示
  houseListTap: function (e) {
    var check_status = e.currentTarget.dataset.check;
    var upon_status = e.currentTarget.dataset.upon;
    var status = e.currentTarget.dataset.status;
    var check_memo = e.currentTarget.dataset.checkmemo;
    var removal_reason = e.currentTarget.dataset.removalreason;
    var removal_user = e.currentTarget.dataset.removaluser;

    var houseId = e.currentTarget.dataset.houseid;
    var house_name = e.currentTarget.dataset.name;
    console.log(house_name,'house_name')
    var pic = e.currentTarget.dataset.pic;
    var price = e.currentTarget.dataset.price;
    var update_time = e.currentTarget.dataset.updatetime;

    this.setData({
      check_status: check_status,
      upon_status: upon_status,
      status: status,
      check_memo: check_memo,
      removal_reason: removal_reason,
      removal_user: removal_user,
      houseId: houseId,
      house_name: house_name,
      pic: pic,
      price: price,
      update_time: update_time,
    })
    console.log(house_name, check_memo,'1111', removal_reason, 'houseId')
  },
  //房源列表选择房源跳回
  houseListForm1Tap: function (e) {
    var houseId = e.currentTarget.dataset.houseid;
    var house_name = e.currentTarget.dataset.name;
    var price = e.currentTarget.dataset.price;
    var price = price.split('¥')[1].split('/')[0];
    console.log(price,'price0000')
    wx.setStorageSync('houseId', houseId);
    wx.setStorageSync('house_name', house_name);
    wx.setStorageSync('price', price); 

    this.setData({
      houseId: houseId,
      house_name: house_name,
      price: price,
    })
    wx.navigateBack({
      delta:1,
    })
   /* wx.navigateTo({
      url: '../register/form1/form1?houseId=' + houseId + '&house_name=' + house_name + '&price=' + price,
    })*/
  },
  //跳转租房小程序
  preview: function () {
    app.aldstat.sendEvent('房源预览');
    var that=this;
    var id = that.data.houseId;
    console.log(id,'id')
    wx.navigateToMiniProgram({
      appId: 'wxc29624069daf8890',
      path: 'pages/list/listDetail/listDetail?id=' + id,
      envVersion: 'release', //trial
      success(res) {
        console.log('成功');
      }
    })
  },
  //原因页面
  reasonTap:function(e){

    var houseId = this.data.houseId;
    var house_name = this.data.house_name; 
    var pic = this.data.pic;
    var price = this.data.price;
    var update_time = this.data.update_time;
    var reasonKey = e.currentTarget.dataset.reasonkey;
    var type = e.currentTarget.dataset.type;
    var removal_user = this.data.removal_user;
    if (removal_user==0){
      var removal_reason ='无'
    }
    else {
      var removal_reason = this.data.removal_reason;
    }
    var check_memo = this.data.check_memo;
    console.log(removal_user, type, removal_reason, check_memo)
    wx.navigateTo({
      url: 'again/again?reasonKey=' + reasonKey + '&houseId=' + houseId + '&house_name=' + house_name + '&pic=' + pic + '&price=' + price + '&update_time=' + update_time + '&type=' + type + '&removal_reason=' + removal_reason + '&check_memo=' + check_memo,
    })
  },
  //编辑
  editViewTap:function(){
    var houseId = this.data.houseId;
    wx.showModal({
      title: '编辑确认',
      content: '编辑后需要重新审核，是否继续？',
      showCancel: true,
      confirmColor: '#5876AB',
      success: function(res) {
        console.log(res,'000000000')
        if (res.confirm==true){
          wx.reLaunch({
            url: 'upload/upload01?editNum=1&house_id=' + houseId,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
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
  //最低价格
  priceBottom: function (e) {
    var that = this;
    var price_bottom = e.detail.value;
    that.setData({
      price_bottom: price_bottom,
    })
  },
  //最高价格
  priceTop: function (e) {
    var that = this;
    var price_top = e.detail.value;
    that.setData({
      price_top: price_top,
    })
  },
  //提交价格区间
  priceBtnTap:function(){
    var that = this; 
    that.setData({
      house_list: [],
      cityNum: 0,
    })
    this.setData({
      priceChioceIcon: "/images/list/icon-go-black.png",
      chioceTime: false,
    });
    that.GetList();
  },
  //输入框获取焦点
  searchFocus: function () {
    this.setData({
      PriceChioceIcon: "/images/list/icon-go-black.png",
      chiocePrice: false,
      chioceTime: false,
      chioceHl: false,
    })
  },
  GetList: function () {
    let that = this;
    var type=that.data.type;
    console.log(type,'type11')
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token'); 
    var status=that.data.status; //状态，0-不限
    var community_name = that.data.community_name;    //小区名
    var price_bottom = that.data.price_bottom;   //最低价，0-不限
    var price_top = that.data.price_top;  //最高价，0-不限
    var cityNum = that.data.cityNum;
    if (!that.data.cityKeyWord) {
      var keyword = '';
    }
    else {
      var keyword = that.data.cityKeyWord;
    }
   /* console.log(keyword, 'keyword');
    var all_like = that.data.all_like;
    var all_visit = that.data.all_visit;
    var online = that.data.online;
    var total = that.data.total;
    var time = that.data.time;
    console.log(time, 'time')*/
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
        type:type,
        keyword: keyword,
        status: status, //状态，0-不限
        community_name: community_name,    //小区名
        price_bottom: price_bottom,   //最低价，0-不限
        price_top: price_top,   //最高价，0-不限
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token:token,
      },
      success: function (res) {
        console.log(res.data, '1111111111')
        var house_list = res.data.content.house_list;
        if (house_list.length==0){
          var houseListLength=0;
        }
        else {
          var houseListLength = 1;
        }
        if (cityNum == 1) {
          var communityList=[];
          for (var i = 0; i < house_list.length; i++) {
            communityList.push(house_list[i].community);
          }
          that.setData({
            communityList: communityList,
          })
        }
        console.log(communityList)
        that.setData({
          house_list: house_list,
          houseListLength: houseListLength,
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
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-down-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chiocePrice: true,
            chioceTime: false,
            chioceHl: false,
          });
        }
        break;
      case "2":
        if (this.data.chioceHl) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-down-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: true,
          });
        }
        break;
      case "3":
        if (this.data.chioceTime) {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-go-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
            chiocePrice: false,
            chioceTime: false,
            chioceHl: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/list/icon-go-black.png",
            priceChioceIcon: "/images/list/icon-down-black.png",
            typeChioceIcon: "/images/list/icon-go-black.png",
            timeChioceIcon: "/images/list/icon-go-black.png",
            HLChioceIcon: "/images/list/sorting.png",
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
      districtChioceIcon: "/images/list/icon-go-black.png",
      priceChioceIcon: "/images/list/icon-go-black.png",
      typeChioceIcon: "/images/list/icon-go-black.png",
      timeChioceIcon: "/images/list/icon-go-black.png",
      HLChioceIcon: "/images/list/sorting.png",
      chiocePrice: false,
      chioceTime: false,
      chioceHl: false,
    });
  },
  //选择状态
  selectPrice: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      house_list: [],
      cityNum:1,
      num:0,
    })
    switch (index) {
      case 0:
        var type = 0;
        that.setData({
          type: type,
        });
        that.GetList();
        break;
      case 1:
        var type = 1;
        that.setData({
          type: type,
        });
        that.GetList();
        break;
      case 2:
        var type = 2;
        that.setData({
          type: type,
        });
        that.GetList();
        break;
      case 3:
        let type = 3;
        that.setData({
          type: type,
        });
        that.GetList();
        break;
      case 4:
        var type = 4;
        that.setData({
          type: type,
        });
        that.GetList();
        break;
      case 5:
        var type =5;
        that.setData({
          type: type,
        });
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
      timeChioceIcon: "/images/list/icon-go-black.png",
      chiocePrice: false,
      activePriceName: activePriceName,
      activePriceMessage: this.data.priceList[index].message,
      priceKey: this.data.priceList[index].key,
      idxPrice: e.currentTarget.dataset.index,
    });
  },
  //选择小区
  selectHl: function (e) {
    var that = this;
    var idxHl = e.currentTarget.dataset.index;
    var community_name = e.currentTarget.dataset.community;
    that.setData({
      house_list: [],
      community_name: community_name,
      cityNum: 0,
      num:0,
    })
    if (community_name.length > 4) {
      var activeHlName = community_name.substring(0, 4) + "...";
    }
    else {
      if (idxHl == -1) {
        var activeHlName = '小区';
        var indexHl=-1;
      }
      else {
        var activeHlName = community_name;
        var indexHl=-2;
      }
    }
    this.setData({
      typeChioceIcon: "/images/list/icon-go-black.png",
      chioceHl: false,
      activeHlName: activeHlName,
      idxHl: idxHl,
      indexHl: indexHl,
    });
    console.log(indexHl,'indexHl')
    that.GetList();
  },
  //选择价格
  selectTime: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      house_list: [],
      cityNum: 0,
      num:0,
    })
    switch (index) {
      case 0:
        var time = 0;
        that.setData({
          time: time,
        });
        page = 1;
        //that.GetList();
        break;
      case 1:
        var time = 1;
        that.setData({
          time: time,
        });
        page = 1;
        //that.GetList();
        break;
      case 2:
        var time = 2;
        that.setData({
          time: time,
        });
        page = 1;
       // that.GetList();
        break;
    };
    if (this.data.timeList[index].value.length > 4) {
      var activeTimeName = this.data.timeList[index].value.substring(0, 4) + "...";
    }
    else {
      var activeTimeName = this.data.timeList[index].value;
    }
    this.setData({
      priceChioceIcon: "/images/list/icon-go-black.png",
      chioceTime: false,
      activeTimeName: activeTimeName,
      TimeKey: this.data.timeList[index].key,
      idxTime: e.currentTarget.dataset.index,
    });
  },

  onSearchBtn: function () {
    app.aldstat.sendEvent('房东助手列表搜索');
    var that = this;
    that.setData({
      house_list: [],
      cityNum: 0,
      num:0,
    })
    that.GetList();
  },
  /**底部弹框 */
  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  }, 
  /**隐藏弹框 */
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  /**免费发布房源弹框弹出 */
  tsTanTap: function () {
    app.aldstat.sendEvent('房源列表页免费发布房源'); 
    wx.reLaunch({
      url: 'upload/upload01?editNum=0&house_id=0',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    /*this.setData({
      tsShow:false,
    })*/
  },
  /**免费发布房源弹框收起 */
  hideTs: function () {
    this.setData({
      tsShow: true,
    })
  },
  //房源上下架操作
  upDownTap: function (e) {
    app.aldstat.sendEvent('房源上下架操作');
    var that=this;
    var type = e.currentTarget.dataset.type;
    that.setData({
      type: type,
    })
    if (type==3){
      wx.showModal({
        title: '修改为已租',
        content: '房源状态改为已租后，72小时内将无法重新上架，确定要改为已租吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.upDownApiTap();
          } else if (res.cancel) {
            console.log('用户点击取消')
            return false
          }
        }
      })
    }
    else{
      console.log(type,'type');
      that.upDownApiTap();
    }
  },
  //房源上下架接口
  upDownApiTap: function () {
    var that = this;
    console.log('1111');
    var idxPrice = that.data.idxPrice;
    var type = that.data.type;
    console.log(type, 'type1');
    var house_id = that.data.houseId;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataJson.os_type,
        os_version: app.globalDataJson.os_version,
        channel: app.globalDataJson.channel,
        network: app.globalDataJson.network,
        version_code: app.globalDataJson.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        area_code: app.globalDataJson.area_code,
        type: type,
        house_id: house_id,

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          type: idxPrice,
        })
        that.hideModal();
        that.GetList();
      }
    })
  },
  //毛玻璃显示
  tanShow: function () {
    var that=this;
    that.animation.rotate(45).step();
    that.animation1.right(13).step().scale(1).bottom(90).step().opacity(1).step();
    that.setData({
      //输出动画
      animation: that.animation.export(),
      animation1: that.animation1.export(),
    })
    setTimeout(function () {
      that.setData({
        tanShowNum:false,
      })
    }, 310);
  },
  //毛玻璃隐藏
  tanHidden: function () {
    var that = this;
    that.animation.rotate(0).step();
    that.animation1.opacity(0).step().bottom(21).step().scale(0.25).right(-50).step();
    that.setData({
      //输出动画
      animation: that.animation.export(),
      animation1: that.animation1.export(),
    })
    setTimeout(function () {
      that.setData({
        tanShowNum: true,
      })
    }, 310);
  },

  /**跳转预约详情 */
  addRegisterBtnTap: function (e) {
    var houseId = this.data.houseId;
    var house_name = this.data.house_name;
    var price = this.data.price;
    var price = price.split('¥')[1].split('/')[0];
    console.log(houseId,house_name,price, 'price0000')
    wx.setStorageSync('houseId', houseId);
    wx.setStorageSync('house_name', house_name);
    wx.setStorageSync('price', price);

    this.setData({
      houseId: houseId,
      house_name: house_name,
      price: price,
    })
    app.aldstat.sendEvent('跳转租客预约详情页');
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('id', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: '/pages/index/register/form1/form1',
    })
  },
})