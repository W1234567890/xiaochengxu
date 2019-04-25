// pages/personal/setting/edit/edit.js
const app = getApp()
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var uploadImage = require('../../../../utils/camera/uploadFile.js');
var util = require('../../../../utils/camera/util.js');
var url = app.globalDataJson.gyjProductBase + "miniapi/user/save_datum";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mobile = wx.getStorageSync('mobile');
    var nickname = wx.getStorageSync('nickname');
    var num = wx.getStorageSync('num');
    var avatar = wx.getStorageSync('avatar');
    var imgUrl = this.data.imgUrl;
    if (avatar == '') {
      if (num == 2) {
        var brand_logo = '/images/login/middleman_head.png';
      }
      else if (num == 3) {
        var brand_logo = '/images/login/individual_landlordI_head.png';
      }
      else if (num == 4) {
        var brand_logo = '/images/login/specialty_landlordI_head.png';
      }
    }
    else{
      var brand_logo = imgUrl+avatar;
    }
    
    this.setData({
      nickname: nickname,
      brand_logo: brand_logo,
    })
  },

  chooseImageTap: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认最多一次选择9张图
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());

        //支持多图上传
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          //显示消息提示框
          wx.showLoading({
            title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
            mask: true
          })

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'landlord_mini/userImg/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function(res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5];
                  
                  that.setData({
                    brand_logo: brand_logo,
                    avatar: avatar,
                  })
                },
                fail: function(res) {},
                complete: function(res) {},
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
  //昵称修改
  nicknameTap:function(e){
    var nickname=e.detail.value;
    this.setData({
      nickname: nickname,
    })
  },
  //提交更新
  brandlogoTap:function(){
    var nickname = this.data.nickname;
    var avatar = this.data.avatar;
    var openid = wx.getStorageSync('openid');
    var mobile = wx.getStorageSync('mobile');
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
        phone_bind: mobile,
        avatar: avatar,
        nickname: nickname,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res)
        wx.setStorageSync('nickname', nickname);
        wx.setStorageSync('avatar', avatar);
        if(res.data.ret==0){
          wx.showToast({
            title: '修改成功！',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../../personal/personal',
            })
          }, 1200);
        }
      }
    })
  }
})