// pages/index/bill/billDetail/receipt/receipt.js
const app = getApp()
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var uploadImage = require('../../../../../utils/camera/uploadFile.js');
var util = require('../../../../../utils/camera/util.js');
var url = app.globalDataJson.gyjProductBase + "miniapi/tenant_reservation/confirm";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    lookData: ['现金', '微信转账', '支付宝转账', '银行转账'],
    lookIndex: -1,
    imgList:[],
    imgListShortDelete: [],
    timesEnter: '请选择',//收款时间

    payTypeShow: true,
    attachFilesShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bill_id = options.bill_id;
    var money = options.rent_price;
    var timesEnter = options.bill_date;
    var pay_time = new Date(timesEnter).getTime(timesEnter) / 1000;
    this.setData({
      bill_id: bill_id,
      money: money,
      timesEnter: timesEnter,
      pay_time: pay_time,
    })
  },
  //收款日期
  bindDateStartChange1: function (e) {
    console.log(e.detail.value, '111111')
    //获取日期
    var timesEnter = e.detail.value;
    var pay_time=new Date(timesEnter).getTime(timesEnter) / 1000;
    var timesEnter = timesEnter.split('-')[0] + '.' + timesEnter.split('-')[1] + '.' + timesEnter.split('-')[2]
    //日期转成时间戳
    //var rent_end = new Date(timesEnter).getTime(timesEnter) / 1000;
    this.setData({
      timesEnter: timesEnter,
      pay_time: pay_time,
      latest_date_value1: e.detail.value, 
      payTypeShow: true,
      attachFilesShow: true,
    })
  },
  //收款方式 
  bindDateLookChange: function (e) {
    console.log(e, 'llllll')
    this.setData({
      lookIndex: e.detail.value,
      payTypeShow: true,
      attachFilesShow: true,
    })
  },//房源图片删除
  imgCloseTap: function (e) {
    var imgSrc = e.currentTarget.dataset.id;
    var src = e.currentTarget.dataset.src;
    var imgListShortDelete = this.data.imgListShortDelete;
    var imgList = this.data.imgList;
    imgListShortDelete.push(imgList[imgSrc]);
    imgList.splice(imgSrc, 1);
    this.setData({
      imgList: imgList,
      imgListShortDelete: imgListShortDelete,
    })
  },
  //上传收款凭证
  uploadImgTap: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var uploadImgLoading = false;
    that.setData({
      payTypeShow: true,
      attachFilesShow:true,
    })
    wx.chooseImage({
      count: 5,
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
          uploadImage(res.tempFilePaths[i], 'user/' + g_uid + '/rent_user/bill/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] + '/' + result.split('/')[7];
                  console.log(brand_logo, avatar, '图片上传')

                  that.data.imgList.push(avatar);

                  that.setData({
                    brand_logo: brand_logo,
                    avatar: avatar,
                    imgList: that.data.imgList,
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
  //确认收款
  formSubmit:function(e){
    var that = this; 
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(g_uid, 'g_uid');
    var token = wx.getStorageSync('token');
    var bill_id = that.data.bill_id;
    //收款方式
    var pay_type = e.detail.value.pay_type;
    if (pay_type==-1) {
      that.setData({
        payTypeShow: false,
        attachFilesShow: true,
      })
      return false;
    }
    //收款金额
    var money = e.detail.value.money;
    //收款日期
    var pay_time = e.detail.value.pay_time;
    //上传收款凭证
    var attach_files = e.detail.value.attach_files;
    var attach_files = attach_files.split(',');
    if (attach_files.length >= 4) {
      that.setData({
        payTypeShow:true,
        attachFilesShow: false,
      })
      return false;
    }
    console.log(attach_files,'attach_files')
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
        id: bill_id, //账单ID
        money: money,    //收账金额
        pay_time: pay_time,  //收账时间
        attach_files: attach_files,   //收账凭证，最多三张
        pay_type: pay_type,//付款方式，0-现金，1-微信，2-支付宝，3-银行卡
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          payTypeShow: true,
          attachFilesShow: true,
        })
        if(res.data.ret==0){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2,
            })
          }, 1000);
        }        
      }
    })
  }
})