// pages/personal/personal.js
var app = getApp();
var imgUrl = app.globalDataImgLogo.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
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
    app.aldstat.sendEvent('个人中心页面');

  },
  onShow: function (options) {
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    else {
      var avatar = wx.getStorageSync('avatar');
      var nickname = wx.getStorageSync('nickname');
      var mobile = wx.getStorageSync('mobile');
      var have_roles = wx.getStorageSync('have_roles');
     // var name = wx.getStorageSync('name');
      var num = wx.getStorageSync('num');
      if(num==2){
        var name='经纪人';
      }
      else if (num == 3) {
        var name = '业主';
      }
      else if (num == 4) {
        var name = '职业房东';
      }
      else {
        var name = '';
      }
      console.log(avatar, nickname, mobile,name,num,'1111');
      this.setData({
        avatar: avatar,
        nickname: nickname,
        mobile: mobile,
        have_roles: have_roles,
        name: name,
        num: num,
      })
      console.log(nickname, mobile, have_roles, name)
    }
  },
  /**切换身份 */
  identityTap: function () {
    app.aldstat.sendEvent('跳转切换身份页面');
    wx.navigateTo({
      url: '../login/role/role?changeKey=1&backurl=pages/personal/personal',
    })
  },
  /**编辑资料 */
  editTap: function () {
    app.aldstat.sendEvent('跳转编辑资料页面');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: 'setting/edit/edit',
      })
    }
  },
  /**跳转意见反馈 */
  suggestTap: function () {
    app.aldstat.sendEvent('跳转意见反馈页面');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: 'suggest/suggest',
      })
    }
  },
  /**客服电话 */
  telTap: function () {
    app.aldstat.sendEvent('个人中心客服电话');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: '400-160-5660', //此号码并非真实电话号码，仅用于测试
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    }
    
  },
  /**设置 */
  settingTap: function () {
    app.aldstat.sendEvent('跳转设置');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: 'setting/setting'
      })
    }
  },
  //退出登录
  logOutTap: function () {
    app.aldstat.sendEvent('退出账号点击');
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.showModal({
        content: '是否退出当前帐号',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击确定
            wx.removeStorageSync('token');
            wx.removeStorageSync('open_id');
            wx.removeStorageSync('mobile');
            var token = '';
            var mobile = '';
            wx.clearStorage();
            //跳转到登录页面
            wx.navigateTo({
              url: '../login/login',
            })
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
    
  },
})