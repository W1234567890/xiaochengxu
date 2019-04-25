var app = getApp();
var url = app.globalDataApp.gyjProductBase + "/sms/send";
var url1 = app.globalDataApp.gyjProductBase + "/user/phone_bind";
Page({
  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    check_code: "",
  },
  changeCode() {
    var _this = this
    var verify = this.data.verify; 
    let telephone = this.data.telephone

    //验证图片手机号不为空
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

    /*获取access_token */
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
      data: {
        grant_type: 'client_credential',
        appid: 'wxc29624069daf8890',
        secret: 'e317bc0c0b61ab83d3864038114961c5',
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data,'grant_type')
        //保存openid            
        wx.setStorageSync('access_token', res.data.access_token);
      }
    })
  },
  /**获取输入的手机号 */
  phoneinput(e) {
    let value = e.detail.value;
    this.setData({
      telephone: value
    })
  },
  formSubmit: function (e) {
    var utilMd5 = require('../../../utils/md5.js');
    var mobile = e.detail.value.mobile;
    var check_code = e.detail.value.check_code;
    var nick_name = wx.getStorageSync('nick_name');
    var open_id = wx.getStorageSync('open_id');
    var union_id = wx.getStorageSync('union_id');
    var access_token = wx.getStorageSync('access_token');
    var util = require('../../../utils/util.js');
    var mobileIf=util.validatemobile(mobile);
    if (mobileIf==false){
        return false;
    }
    if (check_code == "") {
      wx.showToast({
        title: '请填写验证码！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }

    //绑定手机
    wx.request({
      url: url1,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        bind_info:
          {
            g_uid: "",
            g_pwd: '',
            g_token: "",
            user_type: 0,
            tel_num: mobile,
            country_code: access_token, //微信assess_token
            captcha: check_code,
            openid: open_id,//微信openid
            platform: "wechat" //平台名称,微信：wechat
          }
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data,'bindMobile')
        if (res.data.ret==0){       
          
          //保存用户ID,TOKEN
          wx.setStorageSync('user_id', res.data.data.id);
          wx.setStorageSync('token', res.data.data.token);
          wx.setStorageSync('nick_name', res.data.data.user_nickname);
          wx.setStorageSync('mobile', res.data.data.mobile);
          

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
})