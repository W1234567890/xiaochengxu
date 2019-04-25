// pages/index/list/again/again.js
var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_operate";
var dateTimePicker = require('../../../../utils/dateTimePicker.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    //日历
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    dateTime2: null,
    startYear: 2018,
    endYear: 2050,
    changeDataKey: 0,
    //日历结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var houseId = options.houseId;
    var house_name = options.house_name;
    var pic = options.pic;
    var price = options.price.split('/')[0];
    var priceD = options.price.split('/')[1];
    var update_time = options.update_time;
    var reasonKey = options.reasonKey;
    var type = options.type;
    if(type==2){
      wx.setNavigationBarTitle({
        title: '再次出租'
      })
    }
    else{
      if (reasonKey == 1) {
        wx.setNavigationBarTitle({
          title: '未通过原因'
        })
      }
      else if (reasonKey == 2) {
        wx.setNavigationBarTitle({
          title: '下架原因'
        })
      }
    }
    var removal_reason = options.removal_reason;
    var check_memo = options.check_memo;
   console.log(houseId, house_name, pic, price, priceD, update_time, reasonKey, type, removal_reason, check_memo)

    //日历
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    var dateTime2 = obj1.dateTime
    //日历结束

    this.setData({
      //日历      
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
    //日历结束


      houseId: houseId,
      house_name: house_name,
      pic: pic,
      price: price,
      update_time: update_time,
      reasonKey: reasonKey,
      type: type,
      removal_reason: removal_reason,
      check_memo: check_memo,
      priceD: priceD,
    })
  },
  //日历
  changeDateTime1(e) {
    var changeDataKey = 1;
    this.setData({ dateTime1: e.detail.value, changeDataKey: changeDataKey });
  },
  changeDateTimeColumn1(e) {
    var changeDataKey = 1;
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      changeDataKey: changeDataKey
    });
  },
  //日历结束

  //房源上下架操作
  upDownTap: function (e) {
    app.aldstat.sendEvent('房源上下架操作');
    var that = this;
    var changeDataKey = that.data.changeDataKey;
    if (changeDataKey == 0) {
      wx.showToast({
        title: '请选择时间!',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    var set_time = e.currentTarget.dataset.time;
    var type = that.data.type;
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
        set_time: set_time,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res,'1');
        if (res.data.ret==1){
          wx.showModal({
            content: res.data.content,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../list',
                })
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        else {
          wx.navigateTo({
            url: '../list',
          })
        }
      }
    })
  },
})