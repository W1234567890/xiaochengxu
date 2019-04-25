var app = getApp();
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var headerData = app.globalHeaderData;
var url = app.globalDataApp.gyjProductBase + "miniapi/Collection/collect_list";
var page = 1;
var page_size =10;
var GetList = function (that) {
  console.log(page,'page_size111')
  var list = that.data.list;
  var listPriceList = that.data.listPriceList;
  var priceCount = that.data.priceCount; 
  var token = wx.getStorageSync('token');
  var g_uid = wx.getStorageSync('g_uid');
  var openid = wx.getStorageSync('openid');
  var area_code = wx.getStorageSync('area_code');
  that.setData({
    hidden: false,
  });  
  wx.request({
    url: url,
    data: {
      os_type: app.globalDataApp.os_type,
      os_version: app.globalDataApp.os_version,
      channel: app.globalDataApp.channel,
      network: app.globalDataApp.network,
      version_code: app.globalDataApp.version_code,
      app_device: openid,   //APP运行设备的唯一标识OPEN_ID
      package_name: "",   //应用包名
      page: page,
      page_size: page_size,
      g_uid: g_uid,
      area_code: area_code,      
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/json",
      token: token,
      source: '1',
      sign: '1'
    },
    success: function (res) {
      if (res.data.ret == 401) {
        wx.removeStorageSync('user_id');
        wx.removeStorageSync('token');
        wx.removeStorageSync('open_id');
        wx.removeStorageSync('avatar');
        wx.removeStorageSync('mobile');

        //保存跳转链接
        var to_url = '/pages/personal/collect/collect';
        wx.setStorageSync('back_url', to_url);
        wx.navigateTo({
          url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
        })
      }
      else {
        console.log(res)
        console.log(list,'list01',page)
        if (!res.data.content.house_list.length){

        }
        else{
          for (var i = 0; i < res.data.content.house_list.length; i++) {
            list.push(res.data.content.house_list[i]);
            priceCount.push(res.data.content.house_list[i].price_count);
            listPriceList.push(res.data.content.house_list[i].price.split('/')[0]);
          }
        }
        page++;
          that.setData({
            list: list,
            listPriceList: listPriceList,
            searchConaiver:false,
            priceCount: priceCount,

        });
        that.setData({
          hidden: true,
          noMessage: '暂无收藏房源'
        }); 
      }
    }
  });
}
Page({
  data: {
    hidden: true,
    list: [],
    listPriceList:[],
    priceCount:[],
    scrollTop: 0,
    scrollHeight: 0,
    typeID: 0,
    isLoading: true,
    loadOver: false,
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    page_size:5,
    noMessage:''
  },
  onLoad: function (options) {  
    app.aldstat.sendEvent('我的收藏页面打开');
    var Pagetoken = wx.getStorageSync('token');
    if (!Pagetoken) {
      wx.redirectTo({
        url: '/pages/login/login/login',
      })

    }
    page = 1;

    this.setData({     
      list: [],
      listPriceList:[],
      priceCount:[],
      scrollTop: 0,
    });
    GetList(this);

  },
  onShow:function(options){
    this.setData({
      noMessage:'',
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: [],
      listPriceList:[],
      priceCount: [],
      scrollTop: 0,
      noMessage:'',
    });
    page = 0;
    GetList(this);
    wx.stopPullDownRefresh()
  },
  //触底加载
  onReachBottom: function () {
    console.log('1111')
    var that = this;
    this.setData({     
      scrollTop: 0    
    });
    GetList(that);
  },
  //跳转详情页
  onListDetailTap: function (event) {
    app.aldstat.sendEvent('收藏页面房源点击');
    var postId = event.currentTarget.dataset.id;
    var idx = event.currentTarget.dataset.idx;
    var priceCount = this.data.priceCount;
    console.log(idx,'idx')
    if (priceCount[idx] == -1 || priceCount[idx]==1) {
      console.log(priceCount[idx]);
      wx.navigateTo({
        url: '/pages/list/listDetail/listDetail?id=' + postId
      })
    }
    else {
      console.log(priceCount[idx],'111');
      wx.navigateTo({
        url: '/pages/list/listDetailOthers/listDetailOthers?id=' + postId
      })
    }
  }
})