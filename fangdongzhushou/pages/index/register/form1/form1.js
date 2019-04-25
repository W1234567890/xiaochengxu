// pages/index/register/form1/form1.js
const app = getApp()
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var uploadImage = require('../../../../utils/camera/uploadFile.js');
var util = require('../../../../utils/camera/util.js');
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/edit";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/user/authentication";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numForm: 1, 
    identify_pic: '',
    imgUrl: imgUrl,
    id:0,
    timestampStart: '请选择',//起租日期
    timestampEnd: '请选择',//到租日期

    houseIdShow: true,//入住房源提示
    tenantNameShow: true,//姓名提示
    identifyNumShow: true,//身份证提示
    identifyNumShow18: true,//身份证18位提示
    mobileShow: true,//手机号提示
    rentStartShow:true,//起租日期提示
    rentEndShow: true,//到租日期提示
    price:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type=options.type;
    console.log(type,'00001--')
    /*var rent_start = Date.parse(new Date());//日期转时间戳
    var timestampStart = new Date(rent_start).toLocaleDateString().replace(/\//g, "-");//时间戳转日期
    //获取时间戳（去掉毫秒）
    var rent_start = rent_start / 1000;
    console.log(rent_start, 'rent_start')*/
    this.setData({
      type: type,
    })
  },
  onShow:function(){
    var type = this.data.type;
    console.log(type,'0303----')
    var houseId = wx.getStorageSync('houseId');
    var house_name = wx.getStorageSync('house_name');
    var price = wx.getStorageSync('price');
    var tenant_name = wx.getStorageSync('tenant_name');
    var identify_num = wx.getStorageSync('identify_num');
    this.setData({
      houseId: houseId,
      house_name: house_name,
      price: price,
      tenant_name: tenant_name,
      identify_num: identify_num,
    })
    var stepForm = wx.getStorageSync('stepForm');
    var id = wx.getStorageSync('id');
    //1-初次登记，2-编辑保存
    if (!id || id == 0) {
      var type = 1;
    }
    else {
      if(type==3){
        var type=3;
      }
      else {
        var type = 2;
      }
    }
    console.log(type, '00002--')
    this.setData({
      id: id,
      type: type,
      /*timestampStart: timestampStart,
      rent_start: rent_start,*/
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
    console.log(g_uid, 'g_uid');
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
        var houseId = res.data.content.tenant_detail.house_id;   //房源编号
        var landlord = res.data.content.tenant_detail.landlord;    //房东ID
        var mobile = res.data.content.tenant_detail.mobile;
        console.log(mobile, 'mobile333')
        var house_name = res.data.content.tenant_detail.house_name;  //房源名称
        var tenant_name = res.data.content.tenant_detail.tenant_name;  //租客姓名
        var identify_num = res.data.content.tenant_detail.identify_num;//身份证号
        var identify_pic = res.data.content.tenant_detail.identify_pic;//身份证照片
        var rent_start = res.data.content.tenant_detail.rent_start;   //起租日期
        var rent_startTime = rent_start*1000;
        var timestampStart = new Date(rent_startTime).toLocaleDateString().replace(/\//g, "-");//时间戳转日期
        //获取正确的时间格式（xxxx-xx-xx）
        if (timestampStart.split('-')[1]>=10){
          if (timestampStart.split('-')[2] >= 10) {
            var timestampStart = timestampStart.split('-')[0] + '-' + timestampStart.split('-')[1] + '-' + timestampStart.split('-')[2]
          }
          else {
            var timestampStart = timestampStart.split('-')[0] + '-' + timestampStart.split('-')[1] + '-' +'0'+ timestampStart.split('-')[2]
          }
        }
        else {
          if (timestampStart.split('-')[2] >= 10) {
            var timestampStart = timestampStart.split('-')[0] + '-' +'0'+ timestampStart.split('-')[1] + '-' + timestampStart.split('-')[2]
          }
          else {
            var timestampStart = timestampStart.split('-')[0] + '-' + '0' +  timestampStart.split('-')[1] + '-' + '0' + timestampStart.split('-')[2]
          }
        }
        console.log(rent_start, timestampStart, 'rent_start001')
        var rent_end = res.data.content.tenant_detail.rent_end; //截止日期
        var rent_endTime = rent_end * 1000;
        var timestampEnd = new Date(rent_endTime).toLocaleDateString().replace(/\//g, "-");//时间戳转日期
        //获取正确的时间格式（xxxx-xx-xx）
        if (timestampEnd.split('-')[1] >= 10) {
          if (timestampEnd.split('-')[2] >= 10) {
            var timestampEnd = timestampEnd.split('-')[0] + '-' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2]
          }
          else {
            var timestampEnd = timestampEnd.split('-')[0] + '-' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2]
          }
        }
        else {
          if (timestampEnd.split('-')[2] >= 10) {
            var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2]
          }
          else {
            var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2]
          }
        }
        var price = res.data.content.tenant_detail.price;  //租金
        wx.setStorageSync('price', price); 
        that.setData({
          houseId: houseId,    //房源编号
          landlord: landlord,    //房东ID
          mobile: mobile,
          house_name: house_name,
          tenant_name: tenant_name,  //租客姓名
          identify_num: identify_num,//身份证号
          identify_pic: identify_pic,//身份证照片
          rent_start: rent_start,   //起租日期时间戳
          timestampStart: timestampStart,//起租日期
          rent_end: rent_end, //截止日期时间戳
          timestampEnd: timestampEnd,//截止日期
          price: price,  //租金
        })
      }
    })
  },
  //选择房源
  enterHouseTap: function () {
    var that = this;
    that.setData({
      houseIdShow: true,
    })
    wx.navigateTo({
      url: '../../list/list?type=6',
    })
  },
  //起租日期
  bindDateStartChange: function (e) {
    console.log(e.detail.value, '111111')
    //获取日期
    var timestampStart= e.detail.value;
    console.log(timestampStart,'timestampStart')
    //日期转成时间戳
    var rent_start = new Date(timestampStart).getTime(timestampStart) / 1000;
    console.log(rent_start, 'rent_start')
    console.log(timestampStart, rent_start,'pppppp')
    this.setData({
      rent_start: rent_start,
      timestampStart: timestampStart,
      latest_date_value: e.detail.value,
      rentStartShow: true,
    })
  },
  //到租日期
  bindDateStartChange1: function (e) {
    console.log(e.detail.value, '111111')
    //获取日期
    var timestampEnd = e.detail.value;
    //日期转成时间戳
    var rent_end = new Date(timestampEnd).getTime(timestampEnd) / 1000;
    this.setData({
      rent_end: rent_end,
      timestampEnd: timestampEnd,
      latest_date_value1: e.detail.value,
      rentEndShow: true,
    })
  },
  //到租日期（four）
  timeListTap: function (e) {
    var timeListNum = e.currentTarget.dataset.timenum;
    var timestampStart = this.data.timestampStart;
    var type = this.data.type;
    console.log(this.data.rent_start)
    if (!this.data.rent_start)
    {
      this.setData({
        rentStartShow: false,
      })
    }
    else{
      var rent_start = this.data.rent_start*1000;
      var timeYear = timestampStart.split('-')[0];
      var timeMouth = timestampStart.split('-')[1];
      var timeDate = timestampStart.split('-')[2];
      this.setData({
        timestampEnd: '请选择',
      })
      //3个月
      if (timeListNum == 3) {
        if (timeMouth >= 10) {
          var timeYear = parseInt(timeYear) + 1;
          var timeMouth = parseInt(timeMouth) - 12 + 3;
          if (timeMouth == 2 && timeDate == 31) {
            var timeDate = 30;
          }
          var timestampEnd = timeYear + '-' + '0' + timeMouth + '-' + timeDate;
        }
        else {
          var timeMouth = parseInt(timeMouth.split('0')[1]) + 3;
          var timestampEnd = timeYear + '-' + '0' + timeMouth + '-' + timeDate;
        }
        var rent_end = new Date(timestampEnd).getTime(timestampEnd) - 24 * 60 * 60 * 1000;
        console.log(rent_end, timestampEnd, 'timestampEnd111');
        var timestampEnd = new Date(rent_end).toLocaleDateString().replace(/\//g, "-");
        console.log(timestampEnd.split('-')[2])
        if (timestampEnd.split('-')[2] <= 9) {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2];
        }
        else {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2];
        }
        var rent_end = parseInt(rent_end / 1000);
        console.log(rent_end, timestampEnd, 'timestampEnd');
        this.setData({
          rent_end: rent_end,
          timestampEnd: timestampEnd,
        })
      }
      //6个月
      else if (timeListNum == 6){
        if (timeMouth >= 10) {
          var timeYear = parseInt(timeYear) + 1;
          var timeMouth = parseInt(timeMouth) - 12 + 6;
          var timestampEnd = timeYear + '-' + '0' + timeMouth + '-' + timeDate;
        }
        else {
          var timeMouth = parseInt(timestampStart.split('-')[1].split('0')[1]);
          if (timeMouth>=7)
          {
            var timeYear = parseInt(timeYear) + 1;
            var timeMouth = parseInt(timeMouth) - 12 + 6;
            if (timeMouth == 2 && timeDate==31) {
              var timeDate = 30;
            }
            var timestampEnd = timeYear + '-' + '0' + timeMouth + '-' + timeDate;
          }
          else {
            //var timeMouth=timeMouth.split('0')[1];
            console.log(timeMouth,'0003')
            var timeMouth = timeMouth + 6;
            var timestampEnd = timeYear + '-' + '0' + timeMouth + '-' + timeDate;
            console.log(timestampEnd,'timestampEnd001')
          }
        }

        var rent_end = new Date(timestampEnd).getTime(timestampEnd) - 24 * 60 * 60 * 1000;
        console.log(rent_end, timestampEnd, 'timestampEnd111');
        var timestampEnd = new Date(rent_end).toLocaleDateString().replace(/\//g, "-");
        console.log(timestampEnd.split('-')[2])
        if (timestampEnd.split('-')[2] <= 9) {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2];
        }
        else {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2];
        }
        var rent_end = parseInt(rent_end / 1000);
        console.log(rent_end, timestampEnd, 'timestampEnd');
        this.setData({
          rent_end: rent_end,
          timestampEnd: timestampEnd,
        })
      }
      //12个月
      else if (timeListNum == 12) {
        var timeYear = parseInt(timeYear) + 1;
        var timestampEnd = timeYear + '-' +  timeMouth + '-' + timeDate;

        var rent_end = new Date(timestampEnd).getTime(timestampEnd) - 24 * 60 * 60 * 1000;
        console.log(rent_end, timestampEnd, 'timestampEnd111');
        var timestampEnd = new Date(rent_end).toLocaleDateString().replace(/\//g, "-");
        console.log(timestampEnd.split('-')[2])
        if (timestampEnd.split('-')[2] <= 9) {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2];
        }
        else {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2];
        }
        var rent_end = parseInt(rent_end / 1000);
        console.log(rent_end, timestampEnd, 'timestampEnd');
        this.setData({
          rent_end: rent_end,
          timestampEnd: timestampEnd,
        })
      }
      //24个月
      else if (timeListNum == 24) {
        var timeYear = parseInt(timeYear) + 2;
        var timestampEnd = timeYear + '-' +  timeMouth + '-' + timeDate;

        var rent_end = new Date(timestampEnd).getTime(timestampEnd) - 24 * 60 * 60 * 1000;
        console.log(rent_end, timestampEnd, 'timestampEnd111');
        var timestampEnd = new Date(rent_end).toLocaleDateString().replace(/\//g, "-");
        console.log(timestampEnd.split('-')[2])
        if (timestampEnd.split('-')[2] <= 9) {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + '0' + timestampEnd.split('-')[2];
        }
        else {
          var timestampEnd = timestampEnd.split('-')[0] + '-' + '0' + timestampEnd.split('-')[1] + '-' + timestampEnd.split('-')[2];
        }
        var rent_end = parseInt(rent_end / 1000);
        console.log(rent_end, timestampEnd, 'timestampEnd');
        this.setData({
          rent_end: rent_end,
          timestampEnd: timestampEnd,
        })
      }
    }
    this.setData({
      rentEndShow: true,
      timeListNum: timeListNum,
    })
  },
  //上传房源图片
  uploadImgTap: function (e) {
    var that = this;
    var uploadNum = e.currentTarget.dataset.num;
    if (uploadNum==1){
      var uploadType ='camera';
    }
    else if (uploadNum == 2) {
      var uploadType = 'album';
    }
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [uploadType], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());
        for (var i = 0; i < tempFilePaths.length; i++) {
          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'user/' + g_uid+'/rent_user/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] ;
                  console.log(brand_logo, avatar, '图片上传')

                  var identify_pic = avatar;

                  that.setData({
                    brand_logo: brand_logo,
                    avatar: avatar,
                    identify_pic: identify_pic,
                  })
                   wx.navigateTo({
                     url: '../form3/form3?brand_logo=' + brand_logo,
                   })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              wx.hideLoading();

            }, function (result) {
              console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        }

      }
    })
  },
  
  //房源图片删除
  imgCloseTap: function (e) {
    var identify_pic = '';
    this.setData({
      identify_pic: identify_pic,
    })
  },
  //姓名
  tenantNameTap: function (event){
    var tenant_name=event.detail.value;
    console.log(tenant_name,'tenant_name')
    this.setData({
      tenant_name: tenant_name,
      tenantNameShow: true,
    })
  },
  //手机号
  mobileTap: function (event) {
    var mobile = event.detail.value;
    console.log(event, 'identify_num')
    this.setData({
      mobile: mobile,
      mobileShow: true,
    })
  },
  //身份证号
  identifyNumTap: function (event) {
    var identify_num = event.detail.value;
    console.log(event, 'identify_num')
    this.setData({
      identify_num: identify_num,
      identifyNumShow: true,
      identifyNumShow18: true,
    })
  },
  //身份验证并且下一步
  idCardVerificationTap: function () {
    var that = this;

    var id = that.data.id;//租约编号，初次登记时可不传或传0，当type为2时，必传大于0的正整数
    var type = that.data.type;  //1-初次登记，2-编辑保存
    console.log(type,'type-----')
    var house_id = that.data.houseId; //房源编号
    if (!house_id) {
      that.setData({
        houseIdShow: false,
        scrollTop: 0,
      })
      return false;
    }
    var landlord = wx.getStorageSync('g_uid');
    var tenant_name = that.data.tenant_name;
    if (!tenant_name) {
      that.setData({
        tenantNameShow: false,
        scrollTop: 0,
      })
      return false;
    }
    //缓存姓名
    wx.setStorageSync('tenant_name', tenant_name);
    var identify_pic = that.data.identify_pic;  //身份证图片路径
    var identify_num = that.data.identify_num;
    if (!identify_num) {
      that.setData({
        identifyNumShow: false,
        scrollTop: 0,
      })
      return false;
    }
    if (identify_num.length != 18) {
      that.setData({
        identifyNumShow18: false,
        scrollTop: 0,
      })
      return false;
    }
    //缓存身份证号码
    wx.setStorageSync('identify_num', identify_num);
    var mobile = that.data.mobile;
    var mobileIf = this.validatemobile(mobile);
    if (mobileIf == false) {
      return false;
    }
    console.log(mobile, 'mobile11')
    if (!mobile) {
      that.setData({
        mobileShow: false,
      })
      return false;
    }
    var rent_start = that.data.rent_start;
    if (!rent_start) {
      that.setData({
        rentStartShow: false,
      })
      return false;
    }
    var rent_end = that.data.rent_end;
    if (!rent_end) {
      that.setData({
        rentEndShow: false,
      })
      return false;
    }
    var stepForm01 = {
      id: id, //租约编号，初次登记时可不传或传0，当type为2时，必传大于0的正整数
      type: type,   //1-初次登记，2-编辑保存
      house_id: house_id, //房源编号
      landlord: landlord,
      mobile: mobile,
      tenant_name: tenant_name,
      identify_pic: identify_pic,  //身份证图片路径
      identify_num: identify_num,
      rent_start: rent_start,
      rent_end: rent_end,
    }
    //缓存第一页内容
    wx.setStorageSync('stepForm01', stepForm01);

    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid, 'g_uid');
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
        name: tenant_name,
        idCard: identify_num,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ret == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../form2/form2',
            })
          }, 1200);
        }
        else {
          wx.showToast({
            title: res.data.content,
            icon: 'loading',
            duration: 1000
          });
        }
      }
    })
  },
  //验证手机号
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
})