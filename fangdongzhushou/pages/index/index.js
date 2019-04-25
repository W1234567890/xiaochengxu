// 引用百度地图微信小程序JSAPI模块 
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "miniapi/landlord_index";
var bmap = require('../../utils/bmap-wx.min.js');
var agentShow = true;
Page({
  data: {
    weatherData: '',
    weatherMessage:'',
    weatherStatues:'',
    wweatherStatues1: [],
    wweatherStatues2: [],
    wweatherStatues3: [],
    wweatherStatues4: [],
    wweatherStatues5: [],
    wweatherStatues6: [],
    wweatherStatues7: [],
    index:'',
    waitConfirm:0,
    agentShow: agentShow,
    timeWord:'',
  },
  onLoad: function () {
    app.aldstat.sendEvent('房东助手首页进入');
    var date = new Date();
    var hour = date.getHours();
    console.log(hour,'hour');
    if(hour<=11){
      var timeWord='上午';
    }
    else if (hour >=13)
    {
      var timeWord = '下午';
    }
    else {
      var timeWord = '中午';
    }
     this.setData({
       timeWord: timeWord,
     })
  },
  onShow: function () {
    var token = wx.getStorageSync('token');
    var num = wx.getStorageSync('num');
    console.log(num,'num')
    console.log(token)
    if (!token)
    {
      wx.navigateTo({
        url: '../login/login',
      })
      return false
    }
    else if (token&&!num) {
      wx.navigateTo({
        url: '../login/role/role?changeKey=0',
      })
      return false
    }
    else{
      var nickname = wx.getStorageSync('nickname');
      var that = this;
      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({
        ak: 'MYzKlmcoKskYfTXI0alhT1kgmZa4z2rg'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        console.log(data,'1111')
        var weatherData = data.currentWeather[0];
        weatherData = weatherData.weatherDesc + weatherData.temperature;
        if (data.originalData.results[0].index.length==0){
          var weatherMessage='';
        }
        else {
          var weatherMessage = data.originalData.results[0].index[0].des;
        }
        var weatherStatues = data.currentWeather[0].weatherDesc;
        var dayPictureUrl = data.originalData.results[0].weather_data[0].dayPictureUrl;
        var nightPictureUrl = data.originalData.results[0].weather_data[0].nightPictureUrl;

        that.setData({
          weatherData: weatherData,
          weatherMessage: weatherMessage,
          weatherStatues: weatherStatues,
          dayPictureUrl: dayPictureUrl,
          nightPictureUrl: nightPictureUrl,
        });
        /**自定义天气icon */
        var wweatherStatues1 = ["雾", "霾"];
        var wweatherStatues2 = ['雨夹雪', '冻雨'];
        var wweatherStatues3 = ['中雨', '小雨转中雨'];
        var wweatherStatues4 = ['大雨', '暴雨', '大暴雨', '特大暴雨', '中雨转大雨', '大雨转暴雨', '暴雨转大暴雨', '大暴雨转特大暴雨'];
        var wweatherStatues5 = ['中雪', '小雪转中雪'];
        var wweatherStatues6 = ['大雪', '中雪转大雪', '暴雪', '大雪转暴雪'];
        var wweatherStatues7 = ['浮尘', '扬沙', '强沙尘暴', '沙尘暴'];
        for (var i = 0; i < wweatherStatues1.length; i++) {
          if (weatherStatues == wweatherStatues1[i]) {
            that.setData({
              index: 11,
            });
            return false;
          }
          else
          {
            var index='';
          }
        } 
        for (var i = 0; i < wweatherStatues2.length; i++) {
          if (weatherStatues == wweatherStatues2[i]) {
            that.setData({
              index: 21,
            });
            return false;
          }
          else {
            var index = '';
          }
        }
        for (var i = 0; i < wweatherStatues3.length; i++) {
          if (weatherStatues == wweatherStatues3[i]) {
            that.setData({
              index: 31,
            });
            return false;
          }
          else {
            var index = '';
          }
        }
        for (var i = 0; i < wweatherStatues4.length; i++) {
          if (weatherStatues == wweatherStatues4[i]) {
            that.setData({
              index: 41,
            });
            return false;
          }
          else {
            var index = '';
          }
        }
        for (var i = 0; i < wweatherStatues5.length; i++) {
          if (weatherStatues == wweatherStatues5[i]) {
            that.setData({
              index: 51,
            });
            return false;
          }
          else {
            var index = '';
          }
        }
        for (var i = 0; i < wweatherStatues6.length; i++) {
          if (weatherStatues == wweatherStatues6[i]) {
            that.setData({
              index: 61,
            });
            return false;
          }
          else {
            var index = '';
          }
        }

        for (var i = 0; i < wweatherStatues7.length; i++) {
          if (weatherStatues == wweatherStatues7[i]) {
            that.setData({
              index: 71,
            });
            return false;
          }
          else {
            var index = '';
          }
        }
      }
      // 发起weather请求 
      BMap.weather({
        fail: fail,
        success: success
      });
      this.indexTap();
      this.setData({
        nickname: nickname,
      })
    }
  },
  /**首页数据接口 */
  indexTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    console.log(openid, g_uid,'openid')
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
        token:token,
      },
      success: function (res) {
        console.log(res);
        var had_rent = res.data.content.house_count.had_rent;
        var on_rent = res.data.content.house_count.on_rent;
        var reject_check = res.data.content.house_count.reject_check;
        var total = res.data.content.house_count.total;
        var down = res.data.content.house_count.down;
        var wait_check = res.data.content.house_count.wait_check;

        var pos=res.data.content.pos;
        var wait_confirm = res.data.content.wait_confirm;
        if (wait_confirm==0){
            var waitConfirm=0;
          }
        else {
          var waitConfirm = 1;
        }
        var wait_bill = res.data.content.wait_bill;
        that.setData({
          had_rent: had_rent,
          on_rent: on_rent,
          reject_check: reject_check,
          total: total,
          down: down,
          wait_check: wait_check,

          pos: pos,
          wait_confirm: wait_confirm,
          waitConfirm: waitConfirm,
          wait_bill: wait_bill,
        })
      }
    })
  },
  /**管理房源 */
  listTap: function (event) {
    app.aldstat.sendEvent('跳转房源管理');
    var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: 'list/list?type=' + type,
    })
  },
  /**租客预约 */
  reserveTap: function () {
    app.aldstat.sendEvent('跳转租客预约');
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('price', '');
    wx.setStorageSync('houseId', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: 'reserve/reserve',
    })
  },
  /*活动页跳转h5*/
  newsListTap: function (event) {
    app.aldstat.sendEvent('首页运营位点击');
    var url = event.currentTarget.dataset.url;
    var adNum = event.currentTarget.dataset.adnum;
    var img = event.currentTarget.dataset.img;
    var title = event.currentTarget.dataset.title;
    console.log(url, adNum, img, title, 'url')
    
    /*if (dataAdent == 1) {*/
    var url = encodeURIComponent(url + '?img=' + img + '&title=' + title);
      wx.navigateTo({
        url: '/pages/index/h5/h5?url=' + url,
      })
    /*} else if (dataAdent == 2) {
      wx.navigateTo({
        url: '../listDetail/listDetail?id=' + url,
      })
    } else if (dataAdent == 3) {
      wx.navigateTo({
        url: 'search/search?list_id=' + url + '&is_show=1',
      })
    } else if (dataAdent == 0) {
      //wx.showToast({
      //  title: '暂无跳转',
      // icon: 'loading'
      //})
    }*/
    // var util=require('../../utils/util.js');
    // var actionType = util.actionType(dataAdent, url,'00');

  },
  //租约管理
  registerTap: function () {
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('price', '');
    wx.setStorageSync('houseId', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: 'register/register',
    })
  },
  //账单管理
  BillTap: function () {
    //清除缓存内容
    wx.setStorageSync('stepForm01', '');
    wx.setStorageSync('price', '');
    wx.setStorageSync('houseId', '');
    wx.setStorageSync('tenant_name', '');
    wx.setStorageSync('identify_num', '');
    wx.setStorageSync('circleFeeListName', '');
    wx.setStorageSync('circleFeeListPrice', '');
    wx.setStorageSync('oneTimeFeeListName', '');
    wx.setStorageSync('oneTimeFeeListPrice', '');
    wx.navigateTo({
      url: 'bill/bill',
    })
  },
  //建设中页面弹框弹出
  buildTap: function () {
    this.setData({
      agentShow: false,
    })
  },

  /**建设中页面弹框收起 */
  hideAgent: function () {
    this.setData({
      agentShow: true,
    })
  },
})