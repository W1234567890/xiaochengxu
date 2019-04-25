
var app = getApp();
var url = app.globalDataApp.gyjProductBase + "miniapi/reserve";
var dateTimePicker = require('../../../utils/dateTimePicker.js'); 
var headerData = app.globalHeaderData;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
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
    changeDataKey:0,
    //日历结束
    headerData: headerData,
    idx:1,
    sex:1,
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('预约看房页面打开');
    console.log(headerData, 'headerData111')
    var mobile = wx.getStorageSync('mobile'); 
    var listBannerImg = options.listBannerImg;
    var title = options.title;
    var subtitle = options.subtitle;
    var price = options.price;
    var house_uid = options.uid;
    var city_id = options.city_id;
    var dataOne = new Date();
    console.log(house_uid,'house_uid1111111');
    var house_id=options.id;   

    //日历
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    var dateTime2 = obj1.dateTime
    //日历结束

    this.setData({
      house_id:house_id,

      //日历      
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
    //日历结束
      listBannerImg: listBannerImg,
      title: title,
      subtitle: subtitle,
      price: price,
      headerData: headerData,
      mobile: mobile,
      house_uid: house_uid,
      city_id: city_id,
    });
  },
  //日历
  changeDateTime1(e) {
    var changeDataKey = 1;
    this.setData({ dateTime1: e.detail.value, changeDataKey: changeDataKey });
  },
  changeDateTimeColumn1(e) {
    var changeDataKey=1;
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      changeDataKey: changeDataKey
    });
  },
  //日历结束
  onlineSexTap: function (event) {
    var idx = event.currentTarget.dataset.id;
    this.setData({
      idx: idx,
      sex: idx,
    })
  },
  /*radioChange: function (e) {   
    this.setData({
      sex: e.detail.value      
    });

  },*/
  formSubmit: function (e) {
    app.aldstat.sendEvent('在线预约');
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    var headerData = this.data.headerData;
    var house_uid = this.data.house_uid;
    console.log(house_uid,'house_uid')
    var mobile = e.detail.value.mobile;
    var house_id = e.detail.value.house_id;
    var real_name = e.detail.value.real_name;
    var pickerTime = e.detail.value.pickerTime;
    var pickerTime = pickerTime.replace(/-/g, '/')
    console.log(pickerTime,'pickerTime');
    var timestamp21 = new Date(pickerTime).getTime();
    var timestamp31 = new Date().getTime();
    if (timestamp21 <= timestamp31){
      wx.showToast({
        title: '请选择正确时间！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    var timestamp2 = Date.parse(new Date(pickerTime));
    console.log(timestamp2.get, 'timestamp21111');
    timestamp2 = timestamp2 / 1000;
    console.log(timestamp2,'timestamp2');
    var city_id = this.data.city_id;
    var sex = this.data.sex;
    var changeDataKey = this.data.changeDataKey;
    console.log(g_uid,'g_uid')
    if (changeDataKey == 0) {
      wx.showToast({
        title: '请选择看房时间！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (real_name==''){
      wx.showToast({
        title: '请输入您的姓名！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (sex == '') {
      wx.showToast({
        title: '请选择性别！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    
    wx.request({
      url: url,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        mobile:mobile,
        contact_name:real_name,
        house_id: house_id,
        appointment: timestamp2,
        sex: sex,
        house_uid: house_uid,
        city_id: city_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data,'online');
        /*console.log(res.data.code);
        console.log(res.data.msg);
        /*if(res.data){

        }*/
        if (res.data.ret == 401) {
          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');
          //保存跳转链接
          wx.setStorageSync('back_url', '');
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity',
          })
        }
        else if (res.data.ret == 1){
          wx.showToast({
            title: "预约失败",
            icon: 'loading',
            duration: 1500,
            //cb:this.goto(house_id)
          });
        }
        else {
          if (res.data.ret == 0&&res.data.content=='repeat'){
            wx.showToast({
              title: "请勿重复预约",
              icon: 'loading',
              duration: 1500,
              //cb:this.goto(house_id)
            });
          }
          else{
            wx.showToast({
              title: "预约成功",
              icon: 'loading',
              duration: 1500,
              //cb:this.goto(house_id)
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }
        }
      }
    })
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机格式有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    return true;
  }
};

Page(conf);
