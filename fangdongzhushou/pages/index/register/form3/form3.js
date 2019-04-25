// pages/index/register/form1/form1.js
const app = getApp()
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var uploadImage = require('../../../../utils/camera/uploadFile1.js');
var util = require('../../../../utils/camera/util.js');
var url = app.globalDataJson.gyjProductBase + "miniapi/user/user_identity_recognition";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numForm: 1, 
    imgList: [],
    imgListShort: [],
    date: '请选择',//起租日期
    date1: '请选择',//到租日期

    //默认信息
    file: '',
    tenant_name: 'xxx',
    sex: 'x',
    identify_num: 'xxx',
    yearBirth: 'xxxx',
    mounthBirth: 'xx',
    dateBirth: 'xx',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imgList = options.brand_logo;
    this.setData({
      imgList: imgList,
    })
    this.idCardTap();
  },
  //身份证识别
  idCardTap: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var token = wx.getStorageSync('token'); 
    var file = that.data.imgList;
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
        file: file,
        configure: {
          side:'face',
          }  //身份证正反面类型: face / back
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, 'idCard');
        if (res.data.ret == 1) {
          wx.showToast({
            title: res.data.msg,
            duration: 1500
          })
          that.setData({
            file: file,
          })
          //缓存姓名
          wx.setStorageSync('tenant_name', '');
          //缓存身份证号码
          wx.setStorageSync('identify_num', '');
        }
        else{
          var tenant_name = res.data.content.name;//姓名
          var sex = res.data.content.sex;//性别
          var identify_num = res.data.content.num;//身份证号码
          var yearBirth = identify_num.substring(6, 10)//出生年份
          var mounthBirth = identify_num.substring(10, 12)//出生月份
          var dateBirth = identify_num.substring(12, 14)//出生日
          console.log(yearBirth, mounthBirth, dateBirth,'birth');
          that.setData({
            file: file,
            tenant_name: tenant_name,
            sex: sex,
            identify_num: identify_num,
            yearBirth: yearBirth,
            mounthBirth: mounthBirth,
            dateBirth: dateBirth,
          })
          //缓存姓名
          wx.setStorageSync('tenant_name', tenant_name);
          //缓存身份证号码
          wx.setStorageSync('identify_num', identify_num);
        } 
      }
    })
  },
  //下一步
  backformTap:function(e){
    var backNum = e.currentTarget.dataset.num;
    if (backNum == 0) {
      //缓存姓名
      wx.setStorageSync('tenant_name', '');
      //缓存身份证号码
      wx.setStorageSync('identify_num', '');
    }
    wx.navigateBack({
      delta:1,
    })
  },
})