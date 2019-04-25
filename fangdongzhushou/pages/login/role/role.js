// pages/login/role/role.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/user/auth_status";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    othersHidden:false,
    tsShow:true,
    agentShow: true,
    haveRoles2: '',
    haveRoles3: '',
    haveRoles4: '',
    haveRoles2CheckInfo: '',
    haveRoles3CheckInfo: '',
    haveRoles4CheckInfo: '',
    checkInfoIng: '您的认证信息正在加紧审核中，请耐心等待',
    checkInfoOk: '您的认证信息已经通过审核，点击确定跳转首页',
    checkInfoOver:'您提交的认证资料不符合规范，请重新提交',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aldstat.sendEvent('身份选择页面');
    
    var backUrl = options.backurl;
    var changeKey = options.changeKey;
    if (changeKey==0){
      var othersHidden=true;
    }
    else {
      var othersHidden = false;
    }
    this.setData({
      othersHidden: othersHidden,
      backUrl: backUrl,
      changeKey: changeKey,
    })
    this.statusTap();
  },
  /**选择身份跳转 */
  fbTap: function (event) {
    //身份状态更新
    var that = this;
    var fbNum = event.currentTarget.dataset.id;
    var checkInfoOver = that.data.checkInfoOver;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
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
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, have_roles, '1111111')
        if(res.data.ret == 202)
        {
          if (fbNum == 3) {
            wx.navigateTo({
              url: '../owner/owner?role=3',
            })
          }
          if (fbNum == 4) {
            wx.navigateTo({
              url: '../landlord/landlord?role=4',
            })
          }
        }
        else if (res.data.ret == 0) {
          var have_roles = res.data.content.have_roles;
          wx.setStorageSync('have_roles', res.data.content.have_roles);
          for (var i = 0; i < have_roles.length; i++) {
            if (have_roles[i] == 2) {
              var haveRoles2 = 2;
            }
            else if (have_roles[i] == 3) {
              var haveRoles3 = 2;
            }
            else if (have_roles[i] == 4) {
              var haveRoles4 = 2;
            }
            else {
              var haveRoles2 = '';
              var haveRoles3 = '';
              var haveRoles4 = '';
            }
          }
          that.setData({
            haveRoles2: haveRoles2,
            haveRoles3: haveRoles3,
            haveRoles4: haveRoles4,
          })
        
          for (var i = 0; i < res.data.content.role_list.length; i++) {
            if (res.data.content.role_list[i].role == 3) {
              var haveRoles3 = res.data.content.role_list[i].status;
              if (!res.data.content.role_list[i].check_info) {
                var haveRoles3CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles3CheckInfo = res.data.content.role_list[i].check_info;
              }
            }
            else if (res.data.content.role_list[i].role == 4) {
              var haveRoles4 = res.data.content.role_list[i].status;
              if (!res.data.content.role_list[i].check_info) {
                var haveRoles4CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles4CheckInfo = res.data.content.role_list[i].check_info;
              }
              console.log(haveRoles4CheckInfo, 'haveRoles4CheckInfo')
            }
            else if (res.data.content.role_list[i].role == 2) {
              var haveRoles2 = res.data.content.role_list[i].status;
              if (!res.data.content.role_list[i].check_info) {
                var haveRoles3CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles2CheckInfo = res.data.content.role_list[i].check_info;
              }
            }
          }
          that.setData({
            haveRoles2: haveRoles2,
            haveRoles3: haveRoles3,
            haveRoles4: haveRoles4,
            haveRoles2CheckInfo: haveRoles2CheckInfo,
            haveRoles3CheckInfo: haveRoles3CheckInfo,
            haveRoles4CheckInfo: haveRoles4CheckInfo,
          })

          var num = event.currentTarget.dataset.id;
          //var name = event.currentTarget.dataset.name;
          var checkInfoIng = that.data.checkInfoIng;
          var checkInfoOk = that.data.checkInfoOk;
          console.log(haveRoles2CheckInfo, haveRoles3CheckInfo, haveRoles4CheckInfo, 'haveRoles4CheckInfo')

          var backUrl = that.data.backUrl;
          if (!backUrl) {
            var backUrl = '../../index/index';
          }
          else {
            var backUrl = '../../personal/personal';
          }
          //wx.setStorageSync('name',name);
          var have_roles = wx.getStorageSync('have_roles');
          console.log(backUrl)
          if (num == 3) {
            if (haveRoles3 == 1) {
              wx.showModal({
                title: '待审核',
                content: checkInfoIng,
                showCancel: false,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles3 == 3) {

              wx.showModal({
                title: '未通过原因',
                content: haveRoles3CheckInfo,
                showCancel: true,
                success: function (res) {
                  if (res.confirm == true) {
                    wx.navigateTo({
                      url: '../owner/owner?role=3',
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles3 == 2) {
              wx.setStorageSync('num', '3'); 
              wx.showModal({
                title: '审核通过',
                content: checkInfoOk,
                showCancel: true,
                success: function (res) {
                  if (res.confirm == true) {
                    //跳转首页
                    wx.switchTab({
                      url: '../../index/index',
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              return false;
              /*for (var i = 0; i < have_roles.length; i++) {
                console.log(num, have_roles[i], '000')
                if (num == have_roles[i]) {
                  var num = have_roles[i];
                  wx.setStorageSync('num', num);
                  console.log('1')
                  wx.switchTab({
                    url: backUrl,
                  })
                  return false;
                }
              }*/
            }
            else {
              wx.navigateTo({
                url: '../owner/owner?role=3',
              })
            }
          }
          else if (num == 4) {
            if (haveRoles4 == 1) {
              wx.showModal({
                title: '待审核',
                content: checkInfoIng,
                showCancel: false,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles4 == 3) {
              wx.showModal({
                title: '未通过原因',
                content: haveRoles4CheckInfo,
                showCancel: true,
                success: function (res) {
                  console.log(res, '3333')
                  if (res.confirm == true) {
                    wx.navigateTo({
                      url: '../landlord/landlord?role=4',
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles4 == 2) {
              wx.setStorageSync('num', '4');
              wx.showModal({
                title: '审核通过',
                content: checkInfoOk,
                showCancel: true,
                success: function (res) {
                  if (res.confirm == true) {
                    //跳转首页
                    wx.switchTab({
                      url: '../../index/index',
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              return false;
            }
            else {
              wx.navigateTo({
                url: '../landlord/landlord?role=4',
              })
            }
          }
          else if (num == 2) {
            if (haveRoles2 == 1) {
              wx.showModal({
                title: '待审核',
                content: checkInfoIng,
                showCancel: false,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles2 == 3) {
              wx.showModal({
                title: '未通过原因',
                content: haveRoles2CheckInfo,
                showCancel: true,
                success: function (res) {
                  if (res.confirm == true) {
                    wx.navigateTo({
                      url: '../agent/agent?role=2',
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            else if (haveRoles2 == 2) {

            }
            else {
              wx.navigateTo({
                url: '../agent/agent?role=2',
              })
            }
          }
        }
      }
    })
    /*else {
      console.log('2')
      this.setData({
        tsShow: false,
      })
    }*/
  },

  /**免费发布房源弹框收起 */
  hideTs: function () {
    this.setData({
      tsShow: true,
    })
  },
  /**经纪人弹框收起 */
  hideAgent: function () {
    this.setData({
      agentShow: true,
    })
  },
  /**经纪人弹框收起 */
  showAgent: function () {
    this.setData({
      agentShow: false,
    })
  },
  /**审核认证状态判断 */
  statusTap:function(){
    var that = this;
    var checkInfoOver = that.data.checkInfoOver;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var have_roles = wx.getStorageSync('have_roles');
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
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, have_roles, '1111111')
        wx.setStorageSync('have_roles', res.data.content.have_roles);
        for (var i = 0; i < have_roles.length;i++){
          if (have_roles[i]==2){
            var haveRoles2=2;
          }
          else if (have_roles[i] == 3) {
            var haveRoles3 = 2;
          }
          else if (have_roles[i] == 4) {
            var haveRoles4 = 2;
          }
          else {
            var haveRoles2 = '';
            var haveRoles3 = '';
            var haveRoles4 = '';
          }
        }
        that.setData({
          haveRoles2: haveRoles2,
          haveRoles3: haveRoles3,
          haveRoles4: haveRoles4,
        })
        if (res.data.ret==0){
          for (var i = 0; i < res.data.content.role_list.length; i++) {
            if (res.data.content.role_list[i].role == 3) {
              var haveRoles3 = res.data.content.role_list[i].status;
              if (!res.data.content.role_list[i].check_info)
              {
                var haveRoles3CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles3CheckInfo = res.data.content.role_list[i].check_info;
              }
            }
            else if (res.data.content.role_list[i].role == 4) {
              var haveRoles4 = res.data.content.role_list[i].status; 
              if (!res.data.content.role_list[i].check_info) {
                var haveRoles4CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles4CheckInfo = res.data.content.role_list[i].check_info;
              }
              console.log(haveRoles4CheckInfo,'haveRoles4CheckInfo')
            }
            else if (res.data.content.role_list[i].role == 2) {
              var haveRoles2 = res.data.content.role_list[i].status;
              if (!res.data.content.role_list[i].check_info) {
                var haveRoles3CheckInfo = checkInfoOver;
              }
              else {
                var haveRoles2CheckInfo = res.data.content.role_list[i].check_info;
              }
            }
          }
          that.setData({
            haveRoles2: haveRoles2,
            haveRoles3: haveRoles3,
            haveRoles4: haveRoles4,
            haveRoles2CheckInfo: haveRoles2CheckInfo,
            haveRoles3CheckInfo: haveRoles3CheckInfo,
            haveRoles4CheckInfo: haveRoles4CheckInfo,
          })
        }
      }
    })
  }
})