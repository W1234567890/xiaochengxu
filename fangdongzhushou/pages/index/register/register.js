// pages/index/reserve/reserve.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/getLists";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserve0: true,
    reserve1: false,
    reserve2: false,
    list: [],
    type: 0,
    noList:1,
    keywords:'',
    listNei:[],
    registerShow:true,
    registerShowNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aldstat.sendEvent('租客登记列表页进入');
  },
  onShow:function(){
    this.registerTap();
  },
  //小区收起展开
  registerShowTap: function (event){
    var registerShowNum = event.currentTarget.dataset.num;
    var registerShow = this.data.registerShow;
    if (registerShow==true){
      var registerShow = false;
      console.log('11111')
    }
    else{
      var registerShow = true;
      console.log('2222')
    }
    this.setData({
      registerShow: registerShow,
      registerShowNum: registerShowNum,
    })
  },
  //输入框内容获取
  keywordsInputEvent: function (e) {
    var that = this;
    var keywords = e.detail.value;
    that.setData({
      keywords: keywords,
    })
  },
  /**登记列表 */
  registerTap:function(){
    var that = this;
    var type = that.data.type;
    var noList = that.data.noList;
    console.log(type);
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid,'g_uid');
    var token = wx.getStorageSync('token');
    var keyword = that.data.keywords;
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
        area_code: app.globalDataJson.area_code,
        type: type, 
        keyword: keyword,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        var list = [];
        var listNei=[];
        var total_num = res.data.content.total_num;
        var had_end = res.data.content.had_end;
        var will_end = res.data.content.will_end;
        for (var i = 0; i < res.data.content.houses.length; i++) {
          list.push(res.data.content.houses[i]);
          for (var j = 0; j < res.data.content.houses[i].house_list.length; j++) {
            var family = res.data.content.houses[i].house_list[j].tenant_name.substring(0, 1);
            list[i].house_list[j].family = family;
          }
        }
        console.log(list, 'ppppppppp')
        if (list.length == 0) {
          var noList = 0;
        }
        else {
          var noList = 1;
        }
        that.setData({
          list: list,
          noList: noList,
          total_num: total_num,
          had_end: had_end,
          will_end: will_end,
        })
      }
    })
  },
  //跳转登记列表信息确认页
  registerListTap: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.setStorageSync('id', id);
    var house_name = event.currentTarget.dataset.name;
    wx.setStorageSync('house_name', house_name);
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('price', '');
    wx.setStorageSync('houseId', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: 'registerView/registerView',
    })
  },
  /**切换table */
  allTab: function (event) {
    var num = event.currentTarget.dataset.id;
    if (num == 1) {
      this.setData({
        reserve0: false,
        reserve1: true,
        reserve2: false,
        list:[],
        type:1,
      })
      this.registerTap();
    }
    else if (num == 2) {
      this.setData({
        reserve0: false,
        reserve1: false,
        reserve2: true,
        list: [],
        type: 2,
      })
      this.registerTap();
    }
    else {
      this.setData({
        reserve0: true,
        reserve1: false,
        reserve2: false,
        list: [],
        type:0,
      })
      this.registerTap();
    }
    this.setData({
      registerShowNum: 0,
    })
  },
  /**跳转预约详情 */
  addRegisterBtnTap: function (e) {
    app.aldstat.sendEvent('跳转租客预约详情页');
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('id', '');
    wx.setStorageSync('price', '');
    wx.setStorageSync('houseId', '');
    wx.setStorageSync('house_name', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: 'form1/form1',
    })
  },
})