// pages/index/list/upload/upload01.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "pc/house_upload/get_draft";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_upload/house_param";
var url2 = app.globalDataJson.gyjProductBase + "miniapi/house_operate/drop";
var url3 = app.globalDataJson.gyjProductBase + "miniapi/house_upload";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rentData: [{ name: '1', value: '整租', checked: 'true' },{ name: '2', value: '合租' }],
    rentDataIndex:0,
    houseTypeData: [],
    houseTypeDataValue: [],
    houseTypeIndex:-1,
    timeData: ['请选择', '1年', '1个月', '1天', '7天', '15天', '3个月', '6个月'],
    timeIndex: 0,
    payData: ['请选择', '月付', '季付', '年付', '日付', '双月付', '半年付'],
    payIndex: 0,
    payIndexNum:0,
    price:'',
    deposit_price:'',
    depositDataDay: ['无需押金', '自定义押金'],
    depositData: ['无需押金', '1个月', '2个月', '3个月', '自定义押金'],
    depositIndex:0,
    deposit_type:-1,
    commissionRateData: ['请选择', '0%', '35%', '50%', '70%', '75%', '100%', '120%', '150%', '200%'],
    commissionRateIndex:0,
    commission_price:0,
    date:'请选择',

    editNum:'',
    step02:'',
    commissionRateDataScale:0,

    /**提示隐藏 */
    scrollTop: 0,
    rentModeShow:true,
    tagShow:'none',
    rentPeriodShow: 'none',
    payTypeShow: 'none',
    priceShow:true,
    depositTypeShow:true,
    depositPriceShow:true,
    checkinTimeShow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var editNum = options.editNum;
    var houseId = options.houseId;
    console.log(houseId,'houseId001')
    var step1 = wx.getStorageSync('step1');
    var house_id = wx.getStorageSync('house_id');
    console.log(house_id, 'house_id001')
    var step02 = wx.getStorageSync('step02');
    if (!step02){}
    else{
      var price = step02.price;
      var commissionRateDataScale = step02.commission_price;
      var commission_price = commissionRateDataScale * price;
      console.log(commissionRateDataScale,'commissionRateDataScale')
      var commissionRateData = this.data.commissionRateData;
      for (var i = 0; i < commissionRateData.length; i++) {
        var commissionRateDataMsg = commissionRateData[i].split('%')[0]/100;
        console.log(commissionRateDataMsg,'commissionRateDataMsg0001')
        if (commissionRateDataScale == commissionRateDataMsg)
        {
          var commissionRateIndex=i;
          break;
        }
        else{
          var commissionRateIndex=0;
        }
        console.log(commissionRateIndex,'commissionRateIndex000001')
      }

      this.setData({
        rentDataIndex: step02.rentDataIndex,
        houseTypeIndex: step02.houseTypeIndex,
        timeIndex: step02.timeIndex,
        payIndex: step02.payIndex,
        payIndexNum: step02.payIndexNum,
        price: step02.price,
        depositIndex: step02.depositIndex,
        depositIndex5: step02.depositIndex5,
        deposit_price: step02.deposit_price,
        payIndexNum: step02.payIndexNum,
        commission_price: commission_price,
        commissionRateIndex: commissionRateIndex,
        date: step02.date,
      })
    }
    this.setData({
      houseId: houseId,
      editNum: editNum,
      house_id: house_id,
      step02: step02,
    })
    this.listTap();
  },
  onShow:function(options){
    wx.setStorageSync('house_cover', '');   
  },
  //出租类型
  radioChange:function(e){
    console.log(e.detail.value,'00001')
    this.setData({
      rentDataIndex: e.detail.value
    })
  },

  //房源类型
  bindDateRentChange: function (e) {
    this.setData({
      houseTypeIndex: e.detail.value
    })
  },
  //起租租期
  bindDateTimeChange: function (e) {
    this.setData({
      timeIndex: e.detail.value
    })
  },
  //付款方式
  bindDatePayChange: function (e) {
    var depositIndex = this.data.depositIndex;
    if(e.detail.value>=4){
      var payIndexNum = parseInt(e.detail.value)+1;
    }
    else{
      var payIndexNum = e.detail.value;
    }
    console.log(depositIndex, payIndexNum, e.detail.value,'payIndexNum')
    this.setData({
      payIndex: e.detail.value,
      payIndexNum: payIndexNum,
      depositIndex:0,
      deposit_price:0,
    })
  },
  //输入租金
  priceTap:function(e){
    var commissionRateDataNum = this.data.commissionRateDataNum; 
    var price = e.detail.value;
    var deposit_type = this.data.depositIndex;
    var payIndexNum = this.data.payIndexNum;
    var commission_price = this.data.commission_price;
    if (commission_price == 0 || !price) {
      var commission_price = 0;
    }
    else {
      var commission_price = commissionRateDataNum / 100 * price;
    }
    console.log(commission_price,'租金')
    if (payIndexNum==5){
      var deposit_price = 0;
      var depositIndex5=4;
    }
    else {
      if (deposit_type == 0 || deposit_type == 4) {
        var deposit_price = 0;
      }
      else {
        var deposit_price = deposit_type * price;
      }
    }
    console.log(deposit_type, deposit_price,'deposit_type')
    this.setData({
      depositIndex5: depositIndex5,
      price: price,
      commission_price: commission_price,
      deposit_type: deposit_type,
      deposit_price: deposit_price,
    })
  },
  //判断租金是否输入
  depositTap: function () {
    console.log('1111')
    var price = this.data.price;
    console.log(price, 'price')
    if (!price || price == '') {
      wx.showToast({
        title: '请填写租金',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    
  },
  //押金方式
  bindDateDepositChange: function (e) {
    var depositIndex = e.detail.value;
    var price = this.data.price;
    var payIndexNum = this.data.payIndexNum;
    if (payIndexNum == 5) {
      if (depositIndex == 1) {
        var depositIndex5=4;
        var deposit_price = 0;
      }
      else {
        var deposit_price = depositIndex * price;
        var depositIndex5 = 0;
      }
      this.setData({
        depositIndex5: depositIndex5,
      })
    }
    else {
      if (depositIndex == 4) {
        var deposit_price = 0;
      }
      else {
        var deposit_price = depositIndex * price;
      }
    }
    this.setData({
      depositIndex: depositIndex,
      deposit_price: deposit_price,
    })
  },
  //佣金比例
  bindDateCommissionRateChange: function (e) {
    console.log(e.detail.value,'e.detail.value');
    var commissionRateData = this.data.commissionRateData;
    var commissionRateDataNum=commissionRateData[e.detail.value];
    var price = this.data.price;
    if (!price){
      wx.showToast({
        title: '请首先填写租金',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    else{
      if (e.detail.value == 0) { }
      else {
        var commissionRateDataNum = commissionRateDataNum.split('%')[0];
        console.log(commissionRateDataNum,'commissionRateDataNum')
        var commission_price = (commissionRateDataNum * 0.01 * price).toFixed(2);
        console.log(commissionRateDataNum * 0.01, commissionRateDataNum, commission_price, 'e.detail.value')
      }
    }
    this.setData({
      commissionRateIndex: e.detail.value,
      commission_price: commission_price,
      commissionRateDataNum: commissionRateDataNum,
    })
  },
  //最早可入住时间
  bindDateStartChange: function (e) {
    this.setData({
      date: e.detail.value,
      latest_date_value: e.detail.value

    })
  },
  //获取房源设施，标签，省市联动数据列表
  listTap: function () {
    var that = this;
    var editNum = that.data.editNum;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var cityArray = that.data.cityArray;
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
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res, 'list');
        var houseTypeData = that.data.houseTypeData;
        var houseTypeDataValue = that.data.houseTypeDataValue;
        for (var i = 0; i < res.data.content.tag.length;i++){
          houseTypeData.push(res.data.content.tag[i].tag);
          houseTypeDataValue.push(res.data.content.tag[i].id);
        }
        that.setData({
          houseTypeData: houseTypeData,
          houseTypeDataValue: houseTypeDataValue,
        })
        console.log(houseTypeData, houseTypeDataValue,'houseTypeData')
        if (editNum==1){

        }
        else {
          that.draftTap();
        }
      }
    })
  },
  //获取草稿
  draftTap: function () {
    var that = this;
    var cityArray = that.data.cityArray;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var tagTab = wx.getStorageSync('tagTab');
    console.log(openid, g_uid, 'openid')
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
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, 'pc');
        //是否是草稿
        if (res.data.content.is_draft == 0) {
          console.log('1111');
          return false;
        }
        else {
          console.log('333');
          //出租类型
          var rentDataIndex = res.data.content.rent_mode;
          //房源类型
          var tag = wx.getStorageSync('tagTab');
          console.log(tag, 'tag001')
          var houseTypeDataValue = that.data.houseTypeDataValue;
          if (!tagTab) {
            var houseTypeIndex = -1;
          }
          else {
            for (var i = 0; i < houseTypeDataValue.length; i++) {
              if (tag == houseTypeDataValue[i]) {
                var houseTypeIndex = i;
                that.setData({
                  houseTypeIndex: houseTypeIndex,
                })
                console.log(houseTypeIndex, 'houseTypeIndex001')
              }
            }
          }
          //起租租期
          var timeIndex = res.data.content.rent_period;
          //付款方式
          var payIndexNum = res.data.content.pay_type;
          if (res.data.content.pay_type>=5){
            var payIndex = res.data.content.pay_type-1;
          }
          else if (res.data.content.pay_type==4){
            var payIndex=0;
          }
          else {
            var payIndex = res.data.content.pay_type;
          }
          //租金
          if (res.data.content.price == 0.00) {
            var price = '';
          }
          else {
            var price = res.data.content.price;
          }
          //押金方式
          if (payIndexNum == 5) {
            if (res.data.content.deposit_type == 4) {
              var depositIndex =1;
            }
            else {
              var depositIndex = res.data.content.deposit_type;
            }
            var depositIndex5 = res.data.content.deposit_type;
          }
          else {
            var depositIndex = res.data.content.deposit_type;
          }
          console.log(depositIndex5, depositIndex,'depositIndexdepositIndex')
          //押金金额
          var deposit_price = res.data.content.deposit_price;
          
          //最早可入住时间
          if (!res.data.content.checkin_time) {
            var date = '请选择';
          }
          else {
            var date = res.data.content.checkin_time;
          }
          that.setData({
            rentDataIndex: rentDataIndex,
            houseTypeIndex: houseTypeIndex,
            timeIndex: timeIndex,
            payIndexNum: payIndexNum,
            payIndex: payIndex,
            price: price,
            depositIndex5: depositIndex5,
            depositIndex: depositIndex,
            deposit_price: deposit_price,
            date: date,
          }) 
          //佣金比例
          var commissionRateData_price = res.data.content.commission_price;
          console.log(payIndexNum, 'commissionRateData_price')
          var commission_price = commissionRateData_price * price;
          var commissionRateData = that.data.commissionRateData;
          if (commissionRateData_price == 0) {
            var commissionRateIndex = 0;
          }
          else{
            for (var i = 0; i < commissionRateData.length; i++) {
              var commissionRateDataNum = commissionRateData[i].split('%')[0] / 100;
              console.log(commissionRateDataNum, 'commissionRateDataNum')
              if (commissionRateData_price == commissionRateDataNum) {
                var commissionRateIndex = i;
                that.setData({
                  commission_price: commission_price,
                  commissionRateIndex: commissionRateIndex,
                })
              }
            }
          }
          console.log(commission_price,commissionRateIndex,'commissionRateIndex')
          that.setData({
            commission_price: commission_price,
            commissionRateIndex: commissionRateIndex,
          })
          
        }
      }
    })
  },
  //重置
  resetTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var house_id = wx.getStorageSync('house_id');
    wx.request({
      url: url2,
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
        house_id: house_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, '0000');
        wx.removeStorageSync('house_id');
        wx.removeStorageSync('tagTab');
        wx.removeStorageSync('step1');
        wx.removeStorageSync('step2');
        that.listTap();
         wx.switchTab({
           url: '/pages/index/list/upload/upload01',
         })
      }
    })
  },
  //下一页
  formSubmit: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var step1 = wx.getStorageSync('step1');
    console.log(step1,'step1')
    var house_id = wx.getStorageSync('house_id');
    var rent_mode = e.detail.value.rent_mode; 
    console.log(rent_mode,'rent_mode')
    if (!rent_mode) {
      var rentModeShow = false;
      that.setData({
        rentModeShow: rentModeShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        rentModeShow: true,
      })
    }
    var tag = e.detail.value.tag;
    console.log(house_id,'house_id002')
    if (tag == "") {
      /*wx.showToast({
        title: '请选择房源类型',
        icon: 'loading',
        duration: 1500
      });*/
      var tagShow = 'block';
      that.setData({
        tagShow: tagShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        tagShow: 'none',
      })
    }
    var rent_period = e.detail.value.rent_period;
    if (rent_period == 0) {
      /*wx.showToast({
        title: '请选择起租租期',
        icon: 'loading',
        duration: 1500
      });*/
      var rentPeriodShow = 'block';
      that.setData({
        rentPeriodShow: rentPeriodShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        rentPeriodShow: 'none',
      })
    }
    var pay_type = e.detail.value.pay_type;
    if (pay_type == 0) {
      /*wx.showToast({
        title: '请选择付款方式',
        icon: 'loading',
        duration: 1500
      });*/
      var payTypeShow = 'block';
      that.setData({
        payTypeShow: payTypeShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        payTypeShow: 'none',
      })
    }
    var price = e.detail.value.price;
    if (price == "") {
      /*wx.showToast({
        title: '请输入租金',
        icon: 'loading',
        duration: 1500
      });*/
      var priceShow = false;
      that.setData({
        priceShow: priceShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        priceShow: true,
      })
    }
    var deposit_type = e.detail.value.deposit_type;
    console.log(deposit_type,'deposit_type')
    if (deposit_type == '') {
      /*wx.showToast({
        title: '请选择押金方式',
        icon: 'loading',
        duration: 1500
      });*/
      var depositTypeShow = false;
      that.setData({
        depositTypeShow: depositTypeShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        depositTypeShow: true,
      })
    }
    var deposit_price = e.detail.value.deposit_price;
    console.log(deposit_price, 'deposit_price')
    if (pay_type==5){
      if (deposit_type == 4) {
        deposit_price == 0;
      }
    }
    else {
      if (deposit_type == 4 && deposit_price == 0) {
        /*wx.showToast({
          title: '请填写押金金额',
          icon: 'loading',
          duration: 1500
        });*/
        var depositPriceShow = false;
        that.setData({
          depositPriceShow: depositPriceShow,
        })
        return false;
      }
      else {
        that.setData({
          depositPriceShow: true,
        })
      }
    }
    var commission_price = e.detail.value.commission_price;
    console.log(commission_price,'commission_priceLast')
    
    var checkin_time = e.detail.value.checkin_time;
    console.log(checkin_time, 'checkin_time')
    if (checkin_time == "请选择") {
      /*wx.showToast({
        title: '请选择入住时间',
        icon: 'loading',
        duration: 1500
      });*/
      var checkinTimeShow = false;
      that.setData({
        checkinTimeShow: checkinTimeShow,
      })
      return false;
    }
    else {
      that.setData({
        checkinTimeShow: true,
      })
    }
    var editNum = that.data.editNum;
    if (editNum == 1) {
      var houseId = that.data.houseId;
      console.log(houseId,'houseId002')
      var step02 = {
        rent_mode: rent_mode,  //出租类型，1整租  2合租
        tag: tag,  //房源类型， 各标签id使用英文逗号连接
        rent_period: rent_period,  //起租租期，1-长租(年) / 2-短租(月付) / 3-短租(日付) /4 -7天/5 -15天/6 -3个月/7- 6个月
        price: price,  //租金
        pay_type: pay_type,    //付款方式， 1-月付 / 2-季付 / 3-年付 / 4-多种 / 5-日付/ 6-2月付/7-半年付
        deposit_type: deposit_type,  //押金方式，0-无需押金， 月份 1 2 3， 4为自定义押金
        deposit_price: deposit_price,    //押金金额
        commission_price: commission_price,  //佣金金额，（租金*佣金比例）
        checkin_time: checkin_time,  //最早入住时间
      }
      //step2
      console.log(step02,'step0202')
      wx.setStorageSync('step02', step02);
      setTimeout(function () {
        wx.navigateTo({
          url: '../upload03/upload03?editNum=' + editNum + '&houseId=' + houseId,
        })
      }, 1200);
    }
    else{
      var step2 = {
        rent_mode: rent_mode,  //出租类型，1整租  2合租
        tag: tag,  //房源类型， 各标签id使用英文逗号连接
        rent_period: rent_period,  //起租租期，1-长租(年) / 2-短租(月付) / 3-短租(日付) /4 -7天/5 -15天/6 -3个月/7- 6个月
        price: price,  //租金
        pay_type: pay_type,    //付款方式， 1-月付 / 2-季付 / 3-年付 / 4-多种 / 5-日付/ 6-2月付/7-半年付
        deposit_type: deposit_type,  //押金方式，0-无需押金， 月份 1 2 3， 4为自定义押金
        deposit_price: deposit_price,    //押金金额
        commission_price: commission_price,  //佣金金额，（租金*佣金比例）
        checkin_time: checkin_time,  //最早入住时间
      }
      //step2
      wx.setStorageSync('step2', step2);
      //请求接口
      wx.request({
        url: url3,
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
          step: 2,
          house_id: house_id,
          step1: step1,
          step2: step2,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'token': token,
        },
        success: function (res) {
          console.log(res, '11111');
          if (res.data.ret == 1) {
            wx.showToast({
              title: res.data.content.msg,
              icon: 'loading',
              duration: 1000
            });
          }
          else
          {
            wx.showToast({
              title: res.data.content.msg,
              icon: 'loading',
              duration: 1000
            });
            setTimeout(function () {
              wx.navigateTo({
                url: '../upload03/upload03?step1=' + step1 + '&step2=' + step2,
              })
            }, 1200);
          }
        }
      })
    }
  },
})