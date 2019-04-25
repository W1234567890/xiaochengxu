var app = getApp();
var url = app.globalDataApp.gyjProductBase + "/sms/send";
var url1 = app.globalDataApp.gyjProductBase + "/user/login";
var disabledBtn = true;
Page({
  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    check_code: "",
    password:"",
    disabledBtn:true,
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
        event: 'mobilelogin',//注册：register，验证码登录：mobilelogin,重置密码：resetpwd，忘记密码：forgetpwd,修改手机号：changemobile
      }, 
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        let data = res.data;
        if (data.ret != "0") {
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
    if (!value){
      var disabledBtn=true;
    }
    else {
      var disabledBtn = false;
    }
    this.setData({
      telephone: value,
      disabledBtn: disabledBtn,
    })
  },
  formSubmit: function (e) {
    var mobile = e.detail.value.mobile;
    var check_code = e.detail.value.check_code;
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
    var utilMd5 = require('../../../utils/md5.js');

    //请求注册
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        login_info:
          {
            user_type: 1,
            g_uid: "",                  //静默登录时传入uid
            g_pwd: '',                  //用户使用手机号密码登录时传入MD5后的密码
            g_token: "",                //用户静默登录时传入保存本地的g_token
            phone_bind: mobile,     //手机号登录时传入手机号
            captcha: check_code,                 //验证码快捷登录时传入验证码
            login_type:2                 //登录来源,1:密码及账号登录,2:手机验证码登录,3:静默登录
          }
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
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
      check_code: check_code
    })
  },
  registerBtn:function(){
    wx.navigateTo({
      url: '../loginTel/loginTel',
    })
  }
})