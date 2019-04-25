// pages/brand/brandDetail/brandDetail.js
var app = getApp();
let isIphoneX = app.globalData.isIphoneX;//手机型号判断
var brandDetailBtn=1;
var url = app.globalDataJson.gyjProductBase + "miniapi/brand_detail"; 
var urlLike = app.globalDataJson.gyjProductBase + "miniapi/like"; 
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var tabBar = app.tabBar;
var pages = getCurrentPages();
var likeNum=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: isIphoneX ? true : false,
    topBanner:"",
    brand_intro:'',
    brand_logo:"",
    brand_name:"",
    brand_slogen:"",
    house_total:"",
    house_online: "",
    like: "",
    likeNum:0,
    visitor: "",
    tel_num:"",
    furnitureList:[],
    furnitureLength:"",
    facilitiesGreenHidden: 'inline-block',
    recommendList: [],
    dz: 0,
    brandId: "",
    share_info:[],
    areaCode:"",
    // brandId: brandId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var brandId = options.id;
    app.aldstat.sendEvent('进入品牌馆详情页');
    var that = this;
    console.log(brandId,'brandId1111111111111')
    if (options.areaCode){
      var areaCode = options.areaCode;
      wx.setStorageSync('area_codeCity', options.areaCode);
    }
    else {
      var areaCode = wx.getStorageSync('area_codeCity');
    }
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    that.setData({
      brandId: brandId,
      areaCode: areaCode,
    });
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
        "g_uid": g_uid,      //当前登录的OPEN_ID(如果已登录时上传)
        "package_name": "",   //应用包名
        "brand_id": brandId,
        },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {    
        var topBanner = res.data.content.background;
        let brand_intro = res.data.content.brand_intro; 
        console.log(brand_intro.length + "brand_intro");  
        let brand_logo = res.data.content.brand_logo;
        let brand_name = res.data.content.brand_name;
        let brand_slogen = res.data.content.brand_slogen;
        let house_total = res.data.content.house_total;
        let house_online = res.data.content.house_online;
        if (res.data.content.like < 10000) {
          let like = res.data.content.like;
          var likeNum = 0;
          console.log(like, 'like1')
          that.setData({
            like: like,
          })
        }
        else {
          var like1 = res.data.content.like / 10000;
          var like = like1.toFixed(2);
          var likeNum = 1;
          console.log(like, 'like2')
          that.setData({
            like: like,
          })
        }
        let visitor = res.data.content.visitor;
        var tel_num = res.data.content.tel_num;
        var furnitureList = res.data.content.brand_service;
        var furnitureLength =  furnitureList.length;   
        console.log(that.data.facilitiesGreenHidden)  
        if (furnitureLength <= 9 && furnitureLength >= 0){
          var facilitiesGreenHidden = "none"
        } else if (furnitureLength > 9){
          var facilitiesGreenHidden = "block"
        }       
        let recommendList = res.data.content.rec_house;
        for (var i = 0; i < recommendList.length;i++){
          recommendList[i].cover_pic = imgUrl + recommendList[i].cover_pic + imgUrlLast;       
        }
        let dz = res.data.content.dz;
        let share_info = res.data.content.share_info;
        console.log()
        console.log(res.data.content)
        that.setData({
          topBanner: topBanner,
          brand_intro: brand_intro,
          brand_logo: brand_logo,
          brand_name: brand_name,
          brand_slogen: brand_slogen,
          house_total: house_total,
          house_online: house_online,
          likeNum: likeNum,
          visitor: visitor,
          tel_num: tel_num,
          furnitureList: furnitureList,
          furnitureLength: furnitureLength,
          facilitiesGreenHidden: facilitiesGreenHidden,
          recommendList: recommendList,
          dz: dz,
          share_info: share_info,
        });
      },
      fail: function (res) {

      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //品牌描述展开和收起
  brandDetailBtnTap:function(){
    var brandDetailBtn = this.data.brandDetailBtn;
    if (brandDetailBtn==1){
      this.setData({
        brandDetailBtn: 0,
      })
    }
    else {
      this.setData({
        brandDetailBtn: 1,
      })
    }
  },
  //获取电话
  onTelTap: function (event) {
    app.aldstat.sendEvent('进入品牌馆详情页打电话');
    var tel_num = this.data.tel_num;
    wx.makePhoneCall({
      phoneNumber: tel_num, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //分享
  onShareAppMessage: function (event) {
    let that = this;
    app.aldstat.sendEvent('品牌详情页详情页分享点击');
    var areaCode = wx.getStorageSync('area_codeCity');
    var brandId = that.data.brandId;
    var areaCode = that.data.areaCode;
    var title = that.data.share_info.subtitle;
    var imageUrl = that.data.share_info.share_image;
    return {
      title: title,
      path: '/pages/brand/brandDetail/brandDetail?id=' + brandId + '&areaCode=' + areaCode,
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //服务设施查看更多
  facilitiesGreenTap: function () {  
    let that = this;
    let facilitiesGreenHidden = 'none'; 
    that.setData({
      facilitiesGreenHidden: facilitiesGreenHidden,    
    })   
  },
  like:function(){
    app.aldstat.sendEvent('品牌馆详情页点赞');
    let that = this; 
    let dz = 1;
    var brandId = that.data.brandId;
    var areaCode = wx.getStorageSync('area_codeCity');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: urlLike,
      data: {
        'os_type': app.globalDataJson.os_type,
        'os_version': app.globalDataJson.os_version,
        "channel": app.globalDataJson.channel,          //渠道号
        "network": app.globalDataJson.network,        //网络类型，取值范围以可取到的状态为准：        
        "version_code": app.globalDataJson.version_code,     //客户端本号
        "area_code": areaCode,       //行政区号
        "app_device": openid,   //APP运行设备的唯一标识OPEN_ID
        "g_uid": openid,      //当前登录的OPEN_ID(如果已登录时上传)
        "package_name": "",   //应用包名
        "type": 1, //用户行为，取值如下：0-分享，1-喜欢，2-打电话
        "id": brandId, //品牌编号或者是房源编号
        "src": "brand" //取值为house或者brand
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        that.setData({
          dz: dz,
        }) 
      },
      fail: function (res) {

      },
    }) 
  },
  onlineMsgTap() {
    app.aldstat.sendEvent('品牌馆详情页‘查看在租房源’点击');
    var that = this;
    var areaCode = wx.getStorageSync('area_codeCity');
    var brandId = that.data.brandId;
    console.log(areaCode, brandId,'1111')
    wx.navigateToMiniProgram({
      appId: 'wxc29624069daf8890',
      path: 'pages/list/search/search?brandType=2&areaCode=' + areaCode + '&brandId=' + brandId,
      envVersion: 'release',//trial
      success(res) {
        console.log('成功');
      }
    })
  }
})