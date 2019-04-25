// pages/index/bill/recede/recede.js
const app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/quit";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { id: 1, value: '是'},
      { id: 0, value: '否',checked: 'true' },
    ],
    timesEnter: '请选择',//预计可入住时间
    rerent: 0,
    setInShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id,
    })
  },
  //是否需要重新出租单选
  radioChange:function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var rerent = e.detail.value;
    this.setData({
      rerent: rerent,
    })
  },
  //预计可入住时间
  bindDateStartChange1: function (e) {
    console.log(e.detail.value, '111111')
    //获取日期
    var timesEnter = e.detail.value;
    console.log(timesEnter,'timesEnter0000')
    //日期转成时间戳
    //var rent_end = new Date(timesEnter).getTime(timesEnter) / 1000;
    this.setData({
      timesEnter: timesEnter,
      latest_date_value1: e.detail.value,
    })
  },
  //暂不退房
  recedeTap: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**退房 */
  quitTap:function(){
    var that=this;
    var rerent = that.data.rerent;
    var timesEnter = that.data.timesEnter;
    console.log(timesEnter,'timesEntertimesEnter')
    if (rerent == 1 && timesEnter=="请选择"){
      that.setData({
        setInShow: false,
      })
      return false;
    }
    wx.showModal({
      title: '退房确认',
      content: '退房操作将不可恢复，是否确定此操作',
      showCancel: true,
      success: function (res) {
        if (res.confirm == true) {
          that.quitKeyTap();
        }
      },
    })
  },
  /**退房接口调用 */
  quitKeyTap: function () {
    var that = this;
    var id = that.data.id;
    var rerent = that.data.rerent;
    var set_in = that.data.timesEnter;
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
        rerent: rerent,
        set_in: set_in,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, '1100011')
        if(res.data.ret==0){
          wx.showToast({
            title: '退房成功',
            icon: 'success',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/index/bill/bill',
            })
          }, 1000);
        }
      }
    })
  }
})