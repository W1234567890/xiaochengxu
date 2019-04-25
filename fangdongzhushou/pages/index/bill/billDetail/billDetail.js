// pages/index/bill/billDetail/billDetail.js
const app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/billdetail";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/abort";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_time_fee:[],
    circle_fee:[],
    statusNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bill_id = options.bill_id;
    var house_name = options.house_name;
    var statusNum = options.statusNum;
    this.setData({
      bill_id: bill_id,
      house_name: house_name,
      statusNum: statusNum,
    })
    this.billDetailTap();
  },
  onShow: function (options) {
    this.billDetailTap();
  },
  /**跳转租约详情 */
  registerTap:function(){
    wx.navigateTo({
      url: '../../register/registerView/registerView?tabPayNum=1',
    })
  },
  /**作废 */
  invalidTap:function(){
    var that=this;
    wx.showModal({
      title: '作废确认',
      content: '作废账单将不可恢复，是否确定此操作',
      showCancel: true,
      success: function(res) {
        console.log(res,'lllll')
        if (res.confirm==true){
          that.invalidKeyTap();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**催租 */
  urgeTap:function(){
    app.aldstat.sendEvent('催租');
    var mobile = this.data.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**确认收款 */
  receiptTap: function () {
    var bill_id = this.data.bill_id;
    var rent_price = this.data.rent_price;
    var bill_date = this.data.bill_date;
     wx.navigateTo({
       url: 'receipt/receipt?bill_id=' + bill_id+'&rent_price='+rent_price + '&bill_date=' + bill_date,
     }) 
  },
  /**账单详情 */
  billDetailTap: function () {
    var that = this;
    var bill_id = that.data.bill_id;
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
        bill_id: bill_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data,'0999')
        var bill_period = res.data.content.bill_period; //账单日期
        var bill_date = res.data.content.bill_date; //交租日期
        var tenant_name = res.data.content.tenant_name;  //租客姓名
        var mobile = res.data.content.mobile;     //租客联系电话
        var house_name = res.data.content.house_name;  //房源名称
        var period_num = res.data.content.period_num;  //当前账单期数
        var period_total = res.data.content.period_total;  //账单总期数
        var price_total = res.data.content.price_total;  //账单总额
        var overdue = res.data.content.overdue;//逾期天数
        var rent_price = res.data.content.rent_price;  //租金
        var contact_id = res.data.content.contact_id; //租约ID
        wx.setStorageSync('id', contact_id);
        var deposit_price = res.data.content.deposit_price;  //押金
        //一次性费用
        var one_time_fee=[];
        if (res.data.content.one_time_fee == '') {
          var one_time_fee = [];
        }
        else {
          for (var i = 0; i < res.data.content.one_time_fee.length; i++) {
            one_time_fee.push(res.data.content.one_time_fee[i]);
            one_time_fee[i] = { 'oneName': res.data.content.one_time_fee[i].split('-')[0], 'onePrice': res.data.content.one_time_fee[i].split('-')[1] }
          }
        }
        //周期性费用
        var circle_fee = [];
        if (res.data.content.circle_fee == '') {
          var circle_fee = [];
        }
        else {
          for (var i = 0; i < res.data.content.circle_fee.length; i++) {
            circle_fee.push(res.data.content.circle_fee[i]);
            circle_fee[i] = { 'circleName': res.data.content.circle_fee[i].split('-')[0], 'circlePrice': res.data.content.circle_fee[i].split('-')[1] }
          }
        }
        that.setData({
          bill_period: bill_period,
          bill_date: bill_date,
          tenant_name: tenant_name,
          mobile: mobile,
          house_name: house_name,
          period_num: period_num,
          period_total: period_total,
          price_total: price_total,
          overdue:overdue,
          rent_price: rent_price,
          contact_id: contact_id,
          deposit_price: deposit_price,
          one_time_fee: one_time_fee,
          circle_fee: circle_fee,
        })
      }
    })
  },
  /**作废操作 */
  invalidKeyTap: function () {
    var that = this;
    var bill_id = that.data.bill_id;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
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
        id: bill_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, '1111')
        if (res.data.ret==0){

          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
        }
      }
    })
  }
})