// pages/index/register/form1/form1.js
const app = getApp()
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/edit";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveTypeName:'',
    receiveTypeUnit:'',
    imgUrl: imgUrl,
    circleFeeListName: [],
    circleFeeListPrice: [],
    oneTimeFeeListName: [],
    oneTimeFeeListPrice: [],
    lookData: ['请选择', '日付', '月付', '双月付', '季付', '半年付', '年付'],
    depositData: ['请选择', '无需押金', '押一个月', '押二个月', '押三个月', '自定义'],
    depositData1: ['请选择', '无需押金', '自定义'],
    reserve0:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id =wx.getStorageSync('id');
    if (options.tabPayNum==1){
      var reserve0=true
    }
    else {
      var reserve0 = this.data.reserve0;
    }
    this.setData({
      id:id,
      reserve0: reserve0,
    })
    this.registerViewTap();
  },
  /**切换table */
  allTab: function (event) {
    var num = event.currentTarget.dataset.id;
    if (num == 1) {
      this.setData({
        reserve0: true,
      })
      //this.registerTap();
    }
    else {
      this.setData({
        reserve0: false,
      })
      //this.registerTap();
    }
  },
  //拉取租约信息
  registerViewTap:function(){
    var that = this;
    var id = that.data.id;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid, 'g_uid');
    var token = wx.getStorageSync('token');
    var lookData = that.data.lookData;
    var depositData = that.data.depositData;
    var depositData1 = that.data.depositData1;
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
        var house_id = res.data.content.tenant_detail.house_id;   //房源编号
        var landlord = res.data.content.tenant_detail.landlord;    //房东ID
        var mobile = res.data.content.tenant_detail.mobile;
        var house_name = res.data.content.tenant_detail.house_name;
        var tenant_name = res.data.content.tenant_detail.tenant_name;  //租客姓名
        var status = res.data.content.tenant_detail.status;//退房1，未退房0
        var identify_num = res.data.content.tenant_detail.identify_num;//身份证号
        var identify_pic = res.data.content.tenant_detail.identify_pic;//身份证照片
        var rent_start = res.data.content.tenant_detail.rent_start*1000;   //起租日期 
        var timestampStart = new Date(rent_start).toLocaleDateString().replace(/\//g, "-");//时间戳转日期
        console.log(timestampStart,'timestampStart')
        var rent_end = res.data.content.tenant_detail.rent_end*1000; //截止日期
        var timestampEnd = new Date(rent_end).toLocaleDateString().replace(/\//g, "-");//时间戳转日期
        var price = res.data.content.tenant_detail.price;  //租金
        var pay_type = res.data.content.tenant_detail.pay_type;  //支付方式
        var pay_type = lookData[pay_type];
        var deposit_type = res.data.content.tenant_detail.deposit_type;  //押金类型
        if (pay_type == '日付') {
          var deposit_type = depositData1[deposit_type];
        }
        else {
          var deposit_type = depositData[deposit_type];
        }
        var deposit_price = res.data.content.tenant_detail.deposit_price;  //押金金额
        var receive_date = res.data.content.tenant_detail.receive_date;//收租时间
        var receive_type = res.data.content.tenant_detail.receive_type;// 收租类型
        var circle_fee = res.data.content.tenant_detail.circle_fee;//周期性费用
        var circleFeeListName = [];//周期性费用列表
        var circleFeeListPrice = [];
        for (var i = 0; i < circle_fee.length;i++){
          circleFeeListName.push(circle_fee[i].split('-')[0]);
          circleFeeListPrice.push(circle_fee[i].split('-')[1]);
        }
        console.log(circleFeeListName, circleFeeListPrice,'circleFeeListPrice')
        var one_time_fee = res.data.content.tenant_detail.one_time_fee;//一次性费用
        var oneTimeFeeListName = [];//一次性费用列表
        var oneTimeFeeListPrice = [];
        for (var i = 0; i < one_time_fee.length; i++) {
          oneTimeFeeListName.push(one_time_fee[i].split('-')[0]);
          oneTimeFeeListPrice.push(one_time_fee[i].split('-')[1]);
        }
        console.log(oneTimeFeeListName, oneTimeFeeListPrice[0], 'oneTimeFeeListPrice')
        if (receive_type==0)
        {
          var receiveTypeName = "每期提前";
          var receiveTypeUnit = "天";
        }
        else {
          var receiveTypeName = "每期固定";
          var receiveTypeUnit = "日";
        }

        //账单
        var bill_list = [];  //账单列表
        var circle_fee=[];//周期性价格列表
        var one_time_fee=[];//一次性价格列表
        for (var i = 0; i < res.data.content.bill_list.length;i++){
          bill_list.push(res.data.content.bill_list[i]);
          for (var j = 0; j < res.data.content.bill_list[i].circle_fee.length; j++) {
            var circleName = res.data.content.bill_list[i].circle_fee[j].split('-')[0];
            var circlePrice = res.data.content.bill_list[i].circle_fee[j].split('-')[1];
            bill_list[i].circle_fee[j] = { 'circleName': circleName, 'circlePrice': circlePrice }
          }
          //console.log( bill_list[i].one_time_fee, 'oneName111');
          for (var k = 0; k < res.data.content.bill_list[i].one_time_fee.length; k++) {
            var oneName = res.data.content.bill_list[i].one_time_fee[k].split('-')[0];
            var onePrice = res.data.content.bill_list[i].one_time_fee[k].split('-')[1];
            bill_list[i].one_time_fee[k]={ 'oneName': oneName, 'onePrice': onePrice}
          }
        }
        console.log(bill_list, 'oneName0000');

        that.setData({
          house_id:house_id,    //房源编号
          landlord:landlord,    //房东ID
          mobile:mobile,
          house_name: house_name,//房源名称
          tenant_name:tenant_name,  //租客姓名
          status: status,//退房状态                                      
          identify_num:identify_num,//身份证号
          identify_pic: identify_pic,//身份证照片
          rent_start:rent_start,   //起租日期
          timestampStart: timestampStart,
          rent_end:rent_end, //截止日期
          timestampEnd: timestampEnd,
          price:price,  //租金
          pay_type:pay_type,  //支付方式
          deposit_type:deposit_type,  //押金类型
          deposit_price:deposit_price,  //押金金额
          receive_date:receive_date,//收租时间
          receive_type:receive_type,// 收租类型
          receiveTypeName: receiveTypeName,
          receiveTypeUnit:receiveTypeUnit,
          circleFeeListName: circleFeeListName,//周期性费用列表
          circleFeeListPrice: circleFeeListPrice,//周期性费用列表
          oneTimeFeeListName: oneTimeFeeListName,//一次性费用列表
          oneTimeFeeListPrice: oneTimeFeeListPrice,//一次性费用列表

          //账单列表
          bill_list: bill_list,
        })
        wx.setStorageSync('circleFeeListName', circleFeeListName);
        wx.setStorageSync('circleFeeListPrice', circleFeeListPrice);
        wx.setStorageSync('oneTimeFeeListName', oneTimeFeeListName);
        wx.setStorageSync('oneTimeFeeListPrice', oneTimeFeeListPrice);
      }
    })
  },
  registerImgTelTap:function(){
    app.aldstat.sendEvent('租客登记信息详情客服电话');
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
  
  //编辑
  editBtnTap:function(){
    var id = this.data.id;
    var address = this.data.address;
    wx.navigateTo({
      url: '../form1/form1?house_name=' + address,
    })
  },

  ////////////账单
  //退房
  recedeTap: function () {
    var id = this.data.id;
   wx.navigateTo({
     url: '../../bill/recede/recede?id=' + id,
   }) 
  },
  //续租
  renewalTap: function () {
    var id = this.data.id;
    var address = this.data.address;
    wx.navigateTo({
      url: '../form1/form1?house_name=' + address+'&type=3',
    }) 
  },
})