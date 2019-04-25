// pages/index/list/upload/upload01.js
var app = getApp();
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var uploadImage = require('../../../utils/camera/uploadFile.js');
var util = require('../../../utils/camera/util.js');
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_upload/house_param";
var url3 = app.globalDataJson.gyjProductBase + "miniapi/user/agent_auth";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray: [],
    cityIndex: [0],
    decorationData: ['请选择', '身份证', '护照', '港澳台居民身份证'],
    houseCountData: ['请选择', '5套以下', '5-10套', '10-20套', '20-30套', '30-50套', '50-80套', '80-100套', '100套以上'],
    index: 0,
    multiIndex: [0],
    lookIndex: 0,
    decorationIndex: 0,
    houseCountIndex: 0,
    condition: false,
    city: '',
    county: '',
    cityNum: '',
    countyNum: '',
    switchElvator: false,

    credent_type: '',
    credent_num: '',
    company_name: '',

    directionNum: '',
    elvator: 0,

    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    deedImg: '',//房产图片
    imgList: '',//证件正面照
    imgList1: '',//证件反面照
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var role = options.role;
    this.setData({
      role: role,
    })
    console.log(role, 'role')
    this.listTap();
  },
  onShow: function (options) {

  },
  //姓名
  realNameTap: function (e) {
    var real_name = e.detail.value;
    this.setData({
      real_name: real_name,
    })
  },
  //经纪公司名称 
  companyTap: function (e) {
    var company_name = e.detail.value;
    this.setData({
      company_name: company_name,
    })
  },
  //城市切换 
  bindDateStartChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //获取房源设施，标签，省市联动数据列表
  listTap: function () {
    var that = this;
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
        var cityArray = res.data.content.city;
        that.setData({
          cityArray: cityArray,
        })
      }
    })
  },
  //城市选择
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  open: function (e) {
    console.log(e, 'eeee')
    var county = this.data.county;
    console.log(county, 'county')
    if (county == '黄浦区' || !county) {
      var city = '上海市';
      var county = '黄浦区';
      var cityNum = '802';
      var countyNum = '803';
    }
    else {
      var city = this.data.city;
      var county = this.data.county;
      var cityNum = this.data.cityNum;
      var countyNum = this.data.countyNum;
    }
    this.setData({
      condition: !this.data.condition,
      index: 0,
      city: city,
      county: county,
      cityNum: cityNum,
      countyNum: countyNum,
    })
  },
  cityTap: function (e) {
    var cityArray = this.data.cityArray;
    var index = e.detail.value[0];
    var index1 = e.detail.value[1];
    var city = cityArray[index].label;
    var county = cityArray[index].children[index1].label;
    var cityNum = cityArray[index].value;
    var countyNum = cityArray[index].children[index1].value;
    console.log(city, county, cityArray, '11111111111111')
    this.setData({
      index: index,
      index1: index1,
      city: city,
      county: county,
      cityNum: cityNum,
      countyNum: countyNum,
    })
  },
  //保存
  formSubmit: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var house_id = wx.getStorageSync('house_id');
    var phone_bind = wx.getStorageSync('mobile');
    var role = that.data.role;
    console.log(role, 'role')
    var real_name = e.detail.value.real_name;
    if (real_name == "") {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    var credent_type = that.data.credent_type;
    var credent_num = that.data.credent_num;
    var imgList = that.data.imgList;
    var imgList1 = that.data.imgList1;
    var city_id = e.detail.value.city_id;
    var district_id = e.detail.value.district_id;
    console.log(house_id, '111')
    if (city_id == "") {
      wx.showToast({
        title: '请选择城市',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    var company_name = e.detail.value.company_name;
    if (company_name == '') {
      wx.showToast({
        title: '请填写公司名称',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    var house_count = that.data.house_count;
    var deedImg = that.data.deedImg;
    if (deedImg == '') {
      wx.showToast({
        title: '请上传工作名片',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
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
        house_id: house_id,
        real_name: real_name,
        city_id: city_id,
        district_id: district_id,
        credent_type: credent_type,
        company_name: company_name,
        role: role,
        phone_bind: phone_bind,
        credent_num: credent_num,
        house_count: house_count,
        file: [   //文件
          /*{
            "attach_type": "2",//身份证正面,1:名片，2：身份证正面，3：身份证反面，4：房产证
            "attach_file": imgList,
          },
          {
            "attach_type": "3",//身份证反面
            "attach_file": imgList1,
          },*/
          {
            "attach_type": "1",//房产证
            "attach_file": deedImg
          }
        ]
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json',
        'token': token,
      },
      success: function (res) {
        console.log(res, '11111');
        if (res.data.ret == 0) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: '../role/role?changeKey=0',
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
          /* wx.showToast({
             title: res.data.content.msg,
             icon: 'loading',
             duration: 1000
           });*/
        }
        else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: '../role/role?changeKey=0',
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  //上传工作名片
  deedImgTap: function (e) {
    var that = this;
    var deedNum = e.currentTarget.dataset.num;
    var city_id = that.data.city_id;
    var district_id = that.data.district_id;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());
        for (var i = 0; i < tempFilePaths.length; i++) {

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'landlord_mini/user/' + g_uid + '/cert/BusinessCard/' ,
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  console.log(result,'result111')
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] + '/' + result.split('/')[7] + '/' + result.split('/')[8];
                  console.log(avatar, 'result111')
                  console.log(brand_logo, avatar, '图片上传')
                  var deedImg = avatar;
                  console.log(deedImg,'deedImg')

                  that.setData({
                    brand_logo: brand_logo,
                    avatar: avatar,
                    deedImg: deedImg,
                    deedNum: deedNum,
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
  //上传证件照图片
  /*idCardTap: function (e) {
    var that = this;
    var idCardNum = e.currentTarget.dataset.num;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());
        for (var i = 0; i < tempFilePaths.length; i++) {

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'landlord_mini/user/' + g_uid + '/cert/IdCard/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] + '/' + result.split('/')[7] + '/' + result.split('/')[8];
                  console.log(avatar, 'avatar1111')
                  if (idCardNum == 0) {
                    var imgList = avatar;
                    that.setData({
                      imgList: imgList,
                    })
                  }
                  else if (idCardNum == 1) {
                    var imgList1 = avatar;
                    that.setData({
                      imgList1: imgList1,
                    })
                  }
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
        console.log(that.data.imgList);
        console.log(that.data.imgShortList);
        that.setData({
          imgList: that.data.imgList,
          imgShortList: that.data.imgShortList
        })

      }
    })
  },*/
})