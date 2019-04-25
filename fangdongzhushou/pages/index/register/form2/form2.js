// pages/index/list/upload/upload01.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/edit";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/registration";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray: [],
    cityIndex:[0],
    multiArray: [['请选择', '1', '2', '3', '4', '5', '6', '7', '8', '9'], '室', ['请选择', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], '厅', ['请选择', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],'卫'],
    lookData: ['请选择', '日付', '月付', '双月付', '季付', '半年付','年付'],
    depositData: ['请选择', '无需押金', '押一个月', '押二个月', '押三个月', '自定义'],
    depositData1: ['请选择', '无需押金', '自定义'],
    decorationData:['请选择','精装','中等装修','简装','毛坯'],
    index: 0,
    multiIndex: [0],
    lookIndex: 0,
    depositIndex: 0,
    decorationIndex: 0,
    condition: false,
    city: '',
    county: '',
    cityNum: '',
    countyNum: '',
    switchElvator: false,
    switchElvator1: false,

    directionNum:'',
    elvator: 0,//收租提醒
    elvator1: 0,//租金和物业等费用分开收取
    date2: '请选择',//收租日期

    index: 0,
    multiArray: [['每期提前', '每期固定'], ['0天', '1天', '2天', '3天', '4天', '5天', '6天', '7天']],
    objectMultiArray: [ [
        {
          id: 0,
          name: '每期提前'
        },
        {
          id: 1,
          name: '每期固定'
        }
      ], [
        {
          id: 0,
          name: '0天'
        },
        {
          id: 1,
          name: '1天'
        },
        {
          id: 2,
          name: '2天'
        },
        {
          id: 3,
          name: '3天'
        },
        {
          id: 4,
          name: '4天'
        },
        {
          id: 5,
          name: '5天'
        },
        {
          id:6,
          name: '6天'
        },
        {
          id: 7,
          name: '7天'
        }
      ]
    ],
    multiIndex: [ 0, 0],

    indexOthers: 0,
    multiArrayOthers: [['周期性费用', '一次性费用'], ['物业费', '宽带费', '其他']],
    multiIndexOthers: [0, 0],

    othersListOne:[],//其他费用列表(一次性)
    onePriceList: ['', '', ''],//其他费用价格列表(一次性)
    othersListCircle: [],//其他费用列表（周期性）
    circlePriceList: ['','',''],//其他费用价格列表（周期性）
    circle_fee:[],
    one_time_fee:[],

    //提示文字隐藏
    payTypeShow: true,
    priceShow: true,
    depositTypeShow: true,
    depositPriceShow: true,
    receiveShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = wx.getStorageSync('id');
    var price = wx.getStorageSync('price');
    if (!wx.getStorageSync('circleFeeListName')[0]){
      othersListCircle = this.data.othersListCircle;
      circlePriceList = this.data.circlePriceList;
    }
    else {
      var othersListCircle = wx.getStorageSync('circleFeeListName');
      var circlePriceList = wx.getStorageSync('circleFeeListPrice');
    }
    if (!wx.getStorageSync('oneTimeFeeListName')[0]) {
      othersListOne = this.data.othersListOne;
      onePriceList = this.data.onePriceList;
    }
    else {
      var othersListOne = wx.getStorageSync('oneTimeFeeListName');
      var onePriceList = wx.getStorageSync('oneTimeFeeListPrice');
    }
    console.log(othersListOne, onePriceList,'circlePriceList1111')
    this.setData({
      id: id,
      price: price,
      othersListCircle: othersListCircle,
      circlePriceList: circlePriceList,
      othersListOne: othersListOne,
      onePriceList: onePriceList,
    })
    if (id) {
      this.registerViewTap();
    }
  },
  //拉取租约信息
  registerViewTap: function () {
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
        console.log(res.data);
        var pay_type = res.data.content.tenant_detail.pay_type;  //支付方式
        var lookIndex = pay_type;
        var deposit_type = res.data.content.tenant_detail.deposit_type;  //押金类型
        var depositIndex = deposit_type;
        var deposit_price = res.data.content.tenant_detail.deposit_price;  //押金金额
        var receive_date = res.data.content.tenant_detail.receive_date;//收租时间
        console.log(receive_date, 'receive_date');
        var receive_type = res.data.content.tenant_detail.receive_type;// 收租类型
        var multiIndex = [receive_type, receive_date]; 
        var multiArray = that.data.multiArray;
        if (multiIndex[0]==0) {
            multiArray[1] = ['0天', '1天', '2天', '3天', '4天', '5天', '6天', '7天'];
        }
        else if (multiIndex[0] == 1) {
          var multiIndex = [receive_type, receive_date-1]; 
        multiArray[1] = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号'];
        }
        that.setData({
          pay_type: pay_type,  //支付方式
          lookIndex: lookIndex,
          deposit_type: deposit_type,  //押金类型
          depositIndex: depositIndex,
          deposit_price: deposit_price,  //押金金额
          receive_date: receive_date,//收租时间
          receive_type: receive_type,// 收租类型
          multiIndex: multiIndex,
          multiArray: multiArray,
        })
      }
    })
  },

  //收租日
  bindMultiPickerChange(e) {
    var multiIndex = e.detail.value;
    var receive_type = multiIndex[0];
    if (receive_type == 1) {
      var receive_date = multiIndex[1]+1;
    }
    else {
      var receive_date = multiIndex[1];
    }
    console.log('picker发送选择改变，携带值为',multiIndex, receive_type, receive_date);
    this.setData({
      multiIndex: multiIndex,
      receive_type: receive_type,
      receive_date: receive_date,
      receiveShow:true,
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log(e,'修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['0天', '1天', '2天', '3天', '4天', '5天', '6天', '7天']
            break
          case 1:
            data.multiArray[1] = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号']
            break
        }
        data.multiIndex[1] = 0
        break
    }
    console.log(data.multiIndex)
    this.setData(data)
  },

  //添加其他费用
  bindMultiPickerChange1(e) {
    var multiIndexOne = e.detail.value[0];
    var multiIndexTwo = e.detail.value[1];
    var othersListCircle = this.data.othersListCircle;
    if (multiIndexOne == 0) {
      if (othersListCircle.length == 0) {
        othersListCircle.push(multiIndexTwo);
      }
      else {
        console.log(othersListCircle, 'othersListCircle1')
        for (var i = 0; i < othersListCircle.length; i++) {
          if (multiIndexTwo == othersListCircle[i]) {
            return;
          }
        }
        othersListCircle.push(multiIndexTwo);
        console.log(othersListCircle, 'othersListCircle')
      }
    }
    
    var othersListOne = this.data.othersListOne;
    if (multiIndexOne == 1) {
      if (othersListOne.length == 0) {
        othersListOne.push(multiIndexTwo);
      }
      else {
        for (var i = 0; i < multiIndexOne.length; i++) {
          if (multiIndexTwo == multiIndexOne[i]) {
            return;          
          }
        }
        othersListOne.push(multiIndexTwo); 
      }
      console.log(othersListOne,'othersListOne0000')
    }
    var multiIndexOthers= e.detail.value;
    var othersList = this.data.othersList;
    //console.log('picker发送选择改变，携带值为', e, multiIndexOthers, multiIndexOne, multiIndexTwo)
    this.setData({
      multiIndexOne: multiIndexOne,
      multiIndexTwo: multiIndexTwo,
      othersListCircle: othersListCircle,
      othersListOne: othersListOne
    })
    console.log(othersListCircle, othersListOne,'qqqqqqq');
  },
  bindMultiPickerColumnChange1(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const dataOthers = {
      multiArrayOthers: this.data.multiArrayOthers,
      multiIndexOthers: this.data.multiIndexOthers
    }
    dataOthers.multiIndexOthers[e.detail.column] = e.detail.value
    
    console.log(dataOthers.multiIndexOthers)
    this.setData(dataOthers)
  },
  //周期性费用添加金额
  costCircleTap:function(e){
    var circleIndex = e.currentTarget.dataset.index;
    var circlePrice = e.detail.value;
    var circlePriceList = this.data.circlePriceList;
    console.log(circlePriceList,'circlePriceList0009')
    circlePriceList.splice(circleIndex, 1, circlePrice);
    this.setData({
      circleIndex: circleIndex,
      circlePrice: circlePrice,
      circlePriceList: circlePriceList,
    })
    console.log( circlePriceList, 'opop')
  },
  //周期性费用删除金额
  costCircleDelTap: function (e) {
    var circleIndex = e.currentTarget.dataset.index;
    var othersListCircle = this.data.othersListCircle;
    var circlePriceList = this.data.circlePriceList;
    var circle_fee = this.data.circle_fee;
    console.log(circlePriceList, 'circlePriceList0009')
    othersListCircle.splice(circleIndex, 1);
    circlePriceList.splice(circleIndex, 1);
    circle_fee.splice(circleIndex, 1);
    this.setData({
      circleIndex: circleIndex,
      othersListCircle: othersListCircle,
      circlePriceList: circlePriceList,
      circle_fee: circle_fee,
    })
    console.log(othersListCircle,circlePriceList, 'opop')
  },
  //一次性费用添加金额
  costOneTap: function (e) {
    var oneIndex = e.currentTarget.dataset.index;
    var onePrice = e.detail.value;
    var onePriceList = this.data.onePriceList;
    onePriceList.splice(oneIndex, 1, onePrice);
    this.setData({
      oneIndex: oneIndex,
      onePrice: onePrice,
      onePriceList: onePriceList,
    })
    console.log(e, oneIndex, onePriceList, 'opop')
  },
  //一次性费用删除金额
  costOneDelTap: function (e) {
    var oneIndex = e.currentTarget.dataset.index;
    var othersListOne = this.data.othersListOne;
    var onePriceList = this.data.onePriceList;
    var one_time_fee = this.data.one_time_fee;
    othersListOne.splice(oneIndex, 1);
    onePriceList.splice(oneIndex, 1);
    one_time_fee.splice(oneIndex, 1);
    this.setData({
      oneIndex: oneIndex,
      othersListOne: othersListOne,
      onePriceList: onePriceList,
      one_time_fee: one_time_fee,
    })
    console.log(othersListOne, onePriceList, 'opop')
  },

  //付款方式 
  bindDateLookChange: function (e) {
    var price='';
    this.setData({
      lookIndex: e.detail.value,
      price: price,
      deposit_price:'',
      depositIndex: 0,
      payTypeShow: true,
      priceShow:true,
      depositTypeShow:true,
      depositPriceShow:true,
    })
  },
  //每期租金
  priceTap: function (event) {
    var price = event.detail.value;
    this.setData({
      price: price,
      priceShow:true,
    })
  },
  //押金方式 
  bindDateDepositChange: function (e) {
    var lookIndex = this.data.lookIndex;
    var price = this.data.price;
    if (!price){
      wx.showLoading({
        title: '请填写每期租金',
        duration: 1500
      })
      return false;
    }
    if (lookIndex==1){
      if (e.detail.value == 1) {
        var deposit_price = 0;
      }
      else if (e.detail.value ==2) {
        var deposit_price = '';
      }
    }
    else{
      if (e.detail.value == 1) {
        var deposit_price = 0;
      }
      else if (e.detail.value == 2) {
        if (lookIndex==2){
          var deposit_price=price;
        }
        else if (lookIndex == 3) {
          var deposit_price = parseInt(price/2);
        }
        else if (lookIndex == 4) {
          var deposit_price = parseInt(price/3);
        }
        else if (lookIndex == 5) {
          var deposit_price = parseInt(price/6);
        }
        else if (lookIndex == 6) {
          var deposit_price = parseInt(price/12);
        }
      }
      else if (e.detail.value == 3) {
        if (lookIndex == 2) {
          var deposit_price = price;
        }
        else if (lookIndex == 3) {
          var deposit_price = parseInt(price / 2);
        }
        else if (lookIndex == 4) {
          var deposit_price = parseInt(price / 3);
        }
        else if (lookIndex == 5) {
          var deposit_price = parseInt(price / 6);
        }
        else if (lookIndex == 6) {
          var deposit_price = parseInt(price / 12);
        }
        var deposit_price = deposit_price*2;
      } 
      else if (e.detail.value == 4) {
        if (lookIndex == 2) {
          var deposit_price = price;
        }
        else if (lookIndex == 3) {
          var deposit_price = parseInt(price / 2);
        }
        else if (lookIndex == 4) {
          var deposit_price = parseInt(price / 3);
        }
        else if (lookIndex == 5) {
          var deposit_price = parseInt(price / 6);
        }
        else if (lookIndex == 6) {
          var deposit_price = parseInt(price / 12);
        }
        var deposit_price = deposit_price * 3;
      }
      else if (e.detail.value == 5) {
        var deposit_price = '';
      } 
    }
    this.setData({
      depositTypeShow:true,
      depositIndex: e.detail.value,
      deposit_price: deposit_price,
    })
  },
  //押金金额
  depositPriceTap: function (event) {
    var deposit_price = event.detail.value;
    this.setData({
      deposit_price: deposit_price,
      depositPriceShow:true,
    })
  },
  
  //下一页
  formSubmit: function (e) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token');
    //付款方式
    var pay_type = e.detail.value.pay_type;
    if (!pay_type || pay_type==0)
    {
      that.setData({
        payTypeShow:false,
      })
      return false;
    }
    //每期租金
    var price = e.detail.value.price;
    if (!price) {
      that.setData({
        priceShow: false,
      })
      return false;
    }
    //押金方式
    var deposit_type = e.detail.value.deposit_type;
    console.log(deposit_type,'yyyy')
    if (!deposit_type || deposit_type == 0)
    {
      that.setData({
        depositTypeShow: false,
      })
      return false;
    }
    //押金金额
    var deposit_price = e.detail.value.deposit_price;
    if (!deposit_price) {
      that.setData({
        depositPriceShow: false,
      })
      return false;
    }
    //收租日
    var receive_type = e.detail.value.receive_type;
    var receive_date = e.detail.value.receive_date;
    if (!receive_type && !receive_date) {
      that.setData({
        receiveShow: false,
      })
      return false;
    }
    //周期性费用数组
    var circlePriceList = that.data.circlePriceList;//价格数组
    var othersListCircle = that.data.othersListCircle;//类型数组
    console.log(circlePriceList, othersListCircle)
    var circle_fee = [];//拼接数组
    for (var i = 0; i < circlePriceList.length;i++){
      if (circlePriceList[i]==0){

      }
      else{
        var circleFee = othersListCircle[i] + '-' + circlePriceList[i];
        circle_fee.push(circleFee);
        console.log(circle_fee,circleFee, 'circleFee')
      }
    }
    //一次性费用数组
    var onePriceList = that.data.onePriceList;//价格数组
    var othersListOne = that.data.othersListOne;//类型数组
    console.log(circlePriceList, othersListCircle)
    var one_time_fee = [];//拼接数组
    for (var i = 0; i < onePriceList.length; i++) {
      if (onePriceList[i] == 0) {

      }
      else {
        var oneTimeFee = othersListOne[i] + '-' + onePriceList[i];
        one_time_fee.push(oneTimeFee);
        console.log(one_time_fee, oneTimeFee, 'oneTimeFee')
      }
    }
    //第一页内容
    var stepForm01 = wx.getStorageSync('stepForm01');
    //请求接口
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
        id: stepForm01.id, //租约编号，初次登记时可不传或传0，当type为2时，必传大于0的正整数
        type: stepForm01.type,   //1-初次登记，2-编辑保存
        house_id: stepForm01.house_id, //房源编号
        landlord: stepForm01.landlord,
        mobile: stepForm01.mobile,
        tenant_name: stepForm01.tenant_name,
        identify_pic: stepForm01.identify_pic,  //身份证图片路径
        identify_num: stepForm01.identify_num,
        rent_start: stepForm01.rent_start,
        rent_end: stepForm01.rent_end,
        price: price,
        deposit_price: deposit_price,
        deposit_type: deposit_type,   //押金方式
        pay_type: pay_type,   //支付方式
        receive_date: receive_date,   //收租日期
        receive_type: receive_type,   //收租类型,0-每期提前，1-每期固定
        one_time_fee: one_time_fee,   //一次性费用,0-物业费，1-宽带费，2-其他费,50为价格
        circle_fee: circle_fee   //一次性费用,0-物业费，1-宽带费，2-其他费,500为价格
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'token':token,
      },
      success: function (res) {
        console.log(res, '11111');
        if (res.data.ret == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'loading',
            duration: 1000
          });
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
          setTimeout(function () {
            wx.navigateTo({
              url: '../register',
            })
          }, 1200);
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1000
          });
        }
      }
    })
  },
})