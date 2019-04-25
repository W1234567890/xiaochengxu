Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //跳转租客注册页
  zkBtnTap: function () {
    wx.navigateTo({
      url: '../registerNext/registerNext',
    })
  },
  //跳转经纪人注册页
  jjrBtnTap: function () {
    wx.navigateTo({
      url: '../zjRegister/zjRegister',
    })
  },
  //跳转房东助手小程序注册页
  fdBtnTap: function () {
    wx.navigateToMiniProgram({
      appId:'wx0abe913781110fb2', // 要跳转的小程序的appid
      path:'pages/list/list', // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功  
      }
      
    })
  },
})