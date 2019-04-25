// pages/index/reserve/reserveDetail/reserveDetail.js
var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url = app.globalDataJson.gyjProductBase + "miniapi/reserve/reserveDetail";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/reserve/operateReserve";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aldstat.sendEvent('租客预约详情页进入');
    var id =options.id;
    var confirm = options.confirm;
    console.log(confirm,'confirm')
    this.setData({
      id: id,
      confirm: confirm,
    })
    this.reserveDetail();
  },
/**确定 */
  reserveDetailBtnTap:function(e){
    var that=this;
    var type = e.currentTarget.dataset.type;    
    var id=that.data.id;
    that.setData({
      type: type,
      id:id,
    })
    if (type == 1) {
      wx.showModal({
        content: '确定可按租客预约时间看房？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#8A8E98',
        confirmText: '确定',
        confirmColor: '#007AFF',
        success: function (res) {
          console.log(res,'11111111');
          if (res.cancel==false){
            that.operateReserve();
            that.setData({
             confirm:1,
            })
          }
          else{

          }
         },
        fail: function (res) { },
        complete: function (res) { },
      })

    }
    else if(type==2){
      wx.showModal({
        content: '确定取消租客预约时间看房？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#8A8E98',
        confirmText: '确定',
        confirmColor: '#007AFF',
        success: function (res) {
          if (res.cancel == false) {
            that.operateReserve();
            that.setData({
              confirm: 2,
            })
          }
          else{
            
          }
          },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  /**拨打电话 */
  telBtnTap:function(){
    app.aldstat.sendEvent('租客预约拨打电话');
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
  //预约详情页数据
  reserveDetail:function(){
    var that = this;
    var id = that.data.id;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
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
        id: id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        var contact_name = res.data.content.contact_name;
        var house_name = res.data.content.house_name;
        var mobile = res.data.content.mobile;
        var pic_path = res.data.content.pic_path;
        var price = res.data.content.price.split('/')[0];
        var priceUnit = res.data.content.price.split('/')[1];
        var reserve_time = res.data.content.reserve_time;
        var subtitle = res.data.content.subtitle;
        that.setData({
          contact_name: contact_name,
          house_name: house_name,
          mobile: mobile,
          pic_path: pic_path,
          price: price,
          priceUnit: priceUnit,
          reserve_time: reserve_time,
          subtitle: subtitle,
        })
      }
    })
  },
  //预约处理接口
  operateReserve:function(){
    var that = this;
    var id = that.data.id;
    var type = that.data.type;
    console.log(type,'type')
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
        id: id,
        type: type,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  //取消
  reserveDetailCancleBtnTap:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})