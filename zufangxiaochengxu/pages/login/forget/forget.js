var app = getApp();
var url = app.globalData.gyjProductBase + "home/user/checkVerifySendCode";
var url2 = app.globalData.gyjProductBase + "home/user/getVerifyImg";
Page({
  data: {
    flag: false,
    codeDis: false,
    phoneCode: "获取验证码",
    telephone: "",
    check_code: "",
    password:"",
  },
  changeCode() {
    var _this = this
    let telephone = this.data.telephone

    //验证手机号不为空
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
    this.setData({
      codeDis: true
    })
    //发送短信验证码
    wx.request({
      url: url,
      data: {
        mobile: this.data.telephone,
        app_id: '0001',
        channel_id: '0',
        device: '3',
        sign: '0a475c42fc0505709113968aa7ba9051',
        status: '1',
        token: '9ee0813102472cb27b9b238dbb39ba76',
        udid: 'AE67F78E-A9F6-4C2E-9583-90D0CDBCF280',
        version: '203',
        password: this.data.password,
        check_code: this.data.codePhone,
        type: 2,
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

  /**获取输入的手机号 */
  phoneinput(e) {
    let value = e.detail.value;
    this.setData({
      telephone: value
    })
  },
  /**提交表单 */
  formSubmit: function (e) {
    var mobile = e.detail.value.mobile;
    var password = e.detail.value.password;
    var check_code = e.detail.value.check_code;

    var util = require('../../../utils/util.js');
    var mobileIf = util.validatemobile(mobile);
    if (mobileIf == false) {
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
    if (password.length < 6) {
      wx.showToast({
        title: '密码至少为6位！',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }    
    var utilMd5 = require('../../../utils/md5.js');
    var password = utilMd5.hexMD5(password);

    //请求忘记密码，修改密码
    wx.request({
      url: app.globalData.gyjProductBase + 'home/user/forgetPwd',
      data: {
        app_id: app.globalData.app_id,
        channel_id: app.globalData.channel_id,
        sign: app.globalData.sign,
        udid: app.globalData.udid,
        version: app.globalData.version,       
        mobile: mobile,
        password: password,
        check_code: check_code       
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {       
        if (res.data.code == 200) {
          //跳转到用户中心页面
          wx.switchTab({
            url: '/pages/personal/personal'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1500
          });
          return false;
        }

      }
    }); //请求结束

    
  },
  onLoad: function (options) {
    /**对应修改页面名称 */
     if (options.type==1){
       wx.setNavigationBarTitle({ title: '重置密码' });
       this.setData({
         passwordText: '重置密码'  
       })

     }else{
       wx.setNavigationBarTitle({ title: '修改密码' });
       this.setData({
         passwordText: '修改密码'
       })
     }
   },
})