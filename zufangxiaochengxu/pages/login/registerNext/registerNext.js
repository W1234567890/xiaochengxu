var app = getApp();
var url = app.globalDataApp.gyjProductBase + "/sms/send";
var url1 = app.globalDataApp.gyjProductBase + "/user/register";
var url2 = app.globalDataApp.gyjProductBase + "/user/login";
Page({
  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    check_code: "",
    password:"",
    checkValue:1,
  },
  //重发验证码
  changeCode() {
    var _this = this
    var verify = this.data.verify; 
    let telephone = this.data.telephone
  
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
        os_type: app.globalDataApp.os_type,      
        os_version: app.globalDataApp.os_version,       
        channel: app.globalDataApp.channel,      
        network: app.globalDataApp.network, 
        version_code: app.globalDataApp.version_code,    
        country_code: "",
        tel_num: telephone,
        event: 'register',//注册：register，验证码登录：mobilelogin,重置密码：resetpwd，忘记密码：forgetpwd,修改手机号：changemobile
      }, 
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res,'验证码')
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
    
  },

  //获取输入框内容
  phoneinput(e) {
    let value = e.detail.value;
    this.setData({
      telephone: value
    })
  },
  /*获取复选框的选择状态*/
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue,
    })
  },
  formSubmit: function (e) {
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var check_code = e.detail.value.check_code;
    var checkValue = this.data.checkValue;
    var avatar = wx.getStorageSync('avatar');
    var nick_name = wx.getStorageSync('nick_name');
    var open_id = wx.getStorageSync('open_id');
    var util = require('../../../utils/util.js');

    //验证手机号
    var mobileIf=util.validatemobile(mobile);
    if (mobileIf==false){
        return false;
    }
    
    //验证验证码填写
    if (check_code == "") {
      wx.showToast({
        title: '请填写验证码！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }

    //验证密码填写
    if (password.length<6){
      wx.showToast({
        title: '密码至少为6位！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }    
    console.log(checkValue,'checkValue');
    //验证服务协议
    if (checkValue!=1) {
      wx.showToast({
        title: '请同意服务协议',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }    
    var utilMd5 = require('../../../utils/md5.js');
    var password = utilMd5.hexMD5(password);

    //请求注册
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataApp.os_type,   
        os_version: app.globalDataApp.os_version, 
        channel: app.globalDataApp.channel,   
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code, 
        area_code: app.globalDataApp.area_code,          
        reg_info:
        {
          country_code:'',
          tel_num: mobile,
          captcha: check_code,
          g_pwd: password
        }
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"//application/x-www-form-urlencoded
      },
      success: function (res) {
        console.log(res,'zhuce')
        if (res.data.ret==0){       
          
          //保存用户ID,TOKEN
          wx.setStorageSync('g_uid', res.data.content.g_uid);
          wx.setStorageSync('g_token', res.data.content.g_token);
          wx.setStorageSync('nick_name', res.data.content.nickname);
          wx.setStorageSync('phone_bind', res.data.content.phone_bind);
          

          //跳转到用户中心页面
          wx.switchTab({
            url: '/pages/personal/personal',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            } 
          });
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
  serviceMessage:function(){
    wx.navigateTo({
      url: '../serviceMessage/serviceMessage',
    })
  }
})