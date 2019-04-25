var app = getApp();
var url = app.globalData.gyjProductBase + "home/user/checkVerifySendCode";
var upload_url = app.globalData.gyjProductBase + "home/user/upload_short_pics";
Page({
  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    check_code: "",
    password:"",
  },
  //重发验证码
  changeCode() {
    var _this = this
    var verify = this.data.verify; 
    let telephone = this.data.telephone;

   //判断手机号不能为空
    if (!telephone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: "loading"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
      return
    }

    //验证手机号格式
    if (telephone.length != 11) {
      wx.showToast({
        title: '手机号错误',
        icon: "loading"
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
      return
    }
    this.setData({
      codeDis: true
    })
    //发送短信验证码
    wx.request({
      url: url,
      data: {
        app_id: app.globalData.app_id,
        channel_id: app.globalData.channel_id,
        sign: app.globalData.sign,
        udid: app.globalData.udid,
        version: app.globalData.version,
        mobile: this.data.telephone,        
        password: this.data.password,
        check_code: this.data.codePhone,
        type: 1,
        verify: verify,
      }, 
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let data = res.data;
        if (data.code != "200") {
          _this.setData({
            codeDis: false
          })
          wx.showToast({
            title: data.msg,
            icon: "loading"
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        } else {
          _this.setData({
            phoneCode: 60
          })
          let time = setInterval(() => {
            let phoneCode = _this.data.phoneCode
            phoneCode--
            _this.setData({
              phoneCode: phoneCode
            })
            if (phoneCode == 0) {
              clearInterval(time)
              _this.setData({
                phoneCode: "获取验证码",
                flag: true,
                codeDis:false
              })
            }
          }, 1000)
        }
      }
    })


  },
  onLoad: function (options) {    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        wx.request({
          url: app.globalData.gyjProductBase + 'home/user/getUserOpenId',
          data: {
            app_id: app.globalData.app_id,
            channel_id: app.globalData.channel_id,
            sign: app.globalData.sign,
            udid: app.globalData.udid,
            version: app.globalData.version,            
            js_code: res.code,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            //保存openid            
            wx.setStorageSync('open_id', res.data.data.openid);  
          }
        })
      }
    })
  },
  
  //获取输入框内容
  phoneinput(e) {
    let value = e.detail.value;
    this.setData({
      telephone: value
    })
  },
  formSubmit: function (e) {
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var check_code = e.detail.value.check_code;
    var avatar = wx.getStorageSync('avatar');
    var real_name = e.detail.value.real_name;
    var open_id = wx.getStorageSync('open_id');
    var pic_url = e.detail.value.pic_url;
    var address = e.detail.value.address;
    var util = require('../../../utils/util.js');
    //验证手机号
    var mobileIf=util.validatemobile(mobile);
    if (mobileIf==false){
        return false;
    }
    //验证验证码
    if (check_code == "") {
      wx.showToast({
        title: '请填写验证码！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    //验证密码
    if (password.length<6){
      wx.showToast({
        title: '密码至少为6位！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    //验证必填项地址
    if (!address) {
      wx.showToast({
        title: '地址必须输入！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }
    //验证必填项名字
    if (!real_name) {
      wx.showToast({
        title: '名字必须输入！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }   
    var utilMd5 = require('../../../utils/md5.js');
    var password = utilMd5.hexMD5(password);

    //请求注册
    wx.request({
      url: app.globalData.gyjProductBase + 'home/user/agencyAdd',
      data: {
        app_id: app.globalData.app_id,
        channel_id: app.globalData.channel_id,
        sign: app.globalData.sign,
        udid: app.globalData.udid,
        version: app.globalData.version,       
        mobile: mobile,
        password:password,
        check_code: check_code,
        real_name:real_name,
        address:address,
        pic_url:pic_url,
        avatar:avatar,
        wx_app_open_id:open_id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code==200){          
          wx.showToast({
            title: '注册成功，等待审核！',
            icon: 'loading',
            duration: 1500
          });
          return false;
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1500
          });
          return false;
        }       
      }
    })
    this.setData({
      mobile: mobile,
      password: password,
      check_code: check_code
    })
  },
  //上传图片
  cardUpload:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          //上传房源
          var formData = {
            app_id: app.globalData.app_id,
            channel_id: app.globalData.channel_id,
            sign: app.globalData.sign,
            udid: app.globalData.udid,
            version: app.globalData.version,
            token: token,
            house_id: that.data.house_id
          };

          wx.uploadFile({
            url: upload_url,
            filePath: tempFilePaths[i],
            name: "pic",
            header: {
              'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: formData,
            success: function (res) {

              wx.showToast({
                title: '上传中.....',
                icon: 'loading'
              });
              that.setData({
                status: false,
                img: tempFilePaths[i],
                imgShort: res.data
              });

              //that.data.imgShortList.push(res.data);
            },
            fail: function (res) {
              console.log('上传失败-=============')
            }
          })
          that.setData({
            img: tempFilePaths[i],
          });
        }
      }
    })
  },
  serviceMessage: function () {
    wx.navigateTo({
      url: '../serviceMessage/serviceMessage',
    })
  }
})