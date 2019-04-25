var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'CVCBZ-XLER3-MBL3Q-3OT5J-6WWJJ-HQFPY' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapHight:0,
    mapImgNam: [
    {id:1, src: 'bus_normal@2x', srcH: 'bus_select@2x', title: '公交', srcTop: 'positioning_bus@2x'}, 
      { id: 2,src: 'subway_normal@2x', srcH: 'subway_select@2x', title: '地铁', srcTop: 'positioning_subway@2x'},
      { id: 3,src: 'education_normal@2x', srcH: 'education_select@2x', title: '教育', srcTop: 'positioning_education@2x' },
      { id: 4,src: 'hospital_normal@2x', srcH: 'hospital_select@2x', title: '医院', srcTop: 'positioning_hospital@2x' },
      { id: 5,src: 'shopping_normal@2x', srcH: 'shopping_select@2x', title: '购物', srcTop: 'positioning_shopping@2x' },
      { id:6,src: 'bank_normal@2x', srcH: 'bank_select@2x', title: '银行', srcTop: 'positioning_bank@2x' },
      { id:7,src: 'food_normal@2x', srcH: 'food_select@2x', title: '美食', srcTop: 'positioning_food@2x' }],
    mapSrcKey:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.aldstat.sendEvent('周边配套页面打开');
    var latitude = options.latitude;
    var longitude = options.longitude;
    console.log(latitude,'latitudelatitude')
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var mapHight = res.windowHeight-50;
        that.setData({
          mapHight: mapHight,
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
    that.nearby_search();
  },
  // 事件触发，调用接口
  nearby_search: function (event) {
    var latitude=this.data.latitude;
    var longitude=this.data.longitude;
    var mapSrcKey = this.data.mapSrcKey;
    console.log(mapSrcKey,'mapSrcKey')
    if (mapSrcKey==0) {
      var name = '公交';
      var idx = 1;
      var src = '/images/listDetail/positioning_bus@2x.png';
    }
    else {
      var name = event.currentTarget.dataset.name;
      var src = event.currentTarget.dataset.src;
      var idx = event.currentTarget.dataset.ind + 1;
    }
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: name,  //搜索关键词
      location: {latitude, longitude},  //设置周边搜索中心点
      coord_type:3,
      success: function (res) { //搜索成功后的回调
      console.log(res,'res')
        var mks = [{
          iconPath: "/images/listDetail/others.png",
          latitude: latitude,
          longitude: longitude,
          id: 0,
          width: 50,
          height: 50
        }]
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: src, //图标路径
            width: 25,
            height: 31
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks,
          idx: idx,
          mapSrcKey:1,
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }
})