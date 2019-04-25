// pages/index/reserve/reserve.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/reserve/reverseList";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserve0: true,
    list: [],
    type: 0,
    noList:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aldstat.sendEvent('租客预约列表页进入');
  },
  onShow:function(){
    this.reserveTap();
  },
  /**预约列表 */
  reserveTap:function(){
    var that = this;
    var type = that.data.type;
    var noList = that.data.noList;
    console.log(type);
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid,'g_uid');
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
        type: type, 
        identify: "landlord"     //固定值：landlord  表示房东
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        var list = res.data.content.list;
        console.log(list,'list')
        if(list.length==0){
          var noList=0;
        }
        else {
          var noList = 1;
        }
        that.setData({
          list: list,
          noList: noList,
        })
      }
    })
  },
  /**切换table */
  allTab: function (event) {
    var num = event.currentTarget.dataset.id;
    if (num == 1) {
      this.setData({
        reserve0: false,
        list:[],
        type:1,
      })
      this.reserveTap();
    }
    else {
      this.setData({
        reserve0: true,
        list: [],
        type:0,
      })
      this.reserveTap();
    }
  },
  /**跳转预约详情 */
  reserveDetailTap: function (e) {
    app.aldstat.sendEvent('跳转租客预约详情页');
    var id = e.currentTarget.dataset.id;
    var confirm = e.currentTarget.dataset.confirm;
    wx.navigateTo({
      url: 'reserveDetail/reserveDetail?id=' + id + '&confirm=' + confirm,
    })
  },
})