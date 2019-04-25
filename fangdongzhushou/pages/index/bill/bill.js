// pages/index/bill/bill.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/billList";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserve0: true,
    reserve1: false,
    reserve2: false,
    type:0,
    communityList: [],
    registerShowNum: 0,
    noCommunityList:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function (options) {
    this.billListTap();
  },

  //小区收起展开
  registerShowTap: function (event) {
    var registerShowNum = event.currentTarget.dataset.num;
    var registerShow = this.data.registerShow;
    if (registerShow == true) {
      var registerShow = false;
      console.log('11111')
    }
    else {
      var registerShow = true;
      console.log('2222')
    }
    this.setData({
      registerShow: registerShow,
      registerShowNum: registerShowNum,
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
        communityList: [],
        type: 1,
      })
      this.billListTap();
    }
    else if (num == 2) {
      this.setData({
        reserve0: false,
        reserve1: false,
        reserve2: true,
        communityList: [],
        type: 2,
      })
      this.billListTap();
    }
    else {
      this.setData({
        reserve0: true,
        reserve1: false,
        reserve2: false,
        communityList: [],
        type: 0,
      })
      this.billListTap();
    }
    this.setData({
      registerShowNum: 0,
    })
  },
  /*跳转账单详情页*/
  billDetailTap: function (e) {
    var bill_id = e.currentTarget.dataset.id;
    var house_name = e.currentTarget.dataset.name;
    var pay_status = e.currentTarget.dataset.paystatus;
    var status = e.currentTarget.dataset.status;
    console.log(pay_status, status, 'status')
    if (pay_status==1){
      var statusNum=1;
    }
    else{
      if (status == 1) {
        var statusNum = 2;
      }
      else {
        var statusNum = 0;
      }
    }
    console.log('1111')
    wx.navigateTo({
      url: 'billDetail/billDetail?bill_id=' + bill_id + '&house_name=' + house_name + '&statusNum=' + statusNum,
    })
  },
  /**账单列表 */
  billListTap:function(){
    var that = this;
    var type = that.data.type;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid, 'g_uid');
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
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        var total = res.data.content.total;
        var had = res.data.content.had;
        var wait = res.data.content.wait;
        var communityList = [];
        for (var i = 0; i < res.data.content.res.length; i++) {
          communityList.push(res.data.content.res[i]);
          for (var j = 0; j < res.data.content.res[i].bill_list.length; j++) {
            var family = res.data.content.res[i].bill_list[j].tenant_name.substring(0, 1);
            communityList[i].bill_list[j].family = family;
          }
        }
        if (communityList.length == 0) {
          var noCommunityList = 0;
        }
        else {
          var noCommunityList = 1;
        }
        console.log(communityList, 'communityList')
        that.setData({
          total: total,
          had: had,
          wait: wait,
          communityList: communityList,
          noCommunityList: noCommunityList,
        })
      }
    })
  },
})