var app = getApp();
var headerData = app.globalHeaderData;
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var url = app.globalDataApp.gyjProductBase + "miniapi/houses/house_detail";
var url2 = app.globalDataApp.gyjProductBase + "miniapi/Collection/user_collect";
var url3 = app.globalDataApp.gyjProductBase + "miniapi/Collection/cancel_collect";
var token = wx.getStorageSync('token');
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
Page({
  data: {
    imgUrl: imgUrl,
    imgUrlLast:imgUrlLast,
    listBanner: [],
    listZImg: [],
    listTImg:[],
    furnitureList:[],
    trafficList:[],
    compareList:[],
    list: [],
    listSwiperDetail: [],
    listCommission: [],
    hiddenList: false,
    indexNum: "1",
    autoplay:false,
    facilitiesGreenHidden:'inline-block',
    compareListMore:true,
    compareListShou:true,
  },

  onLoad: function (options) {
    app.aldstat.sendEvent('房源详情页（多个比价）打开');
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    //var postid = 4635490;
    var postid = options.id;
    var show01 = false;
    var show02 = true;
    this.setData({
      postid: postid,
    })
    this.onHouseDetail();
    var contact_phone = contact_phone;
    //判断是否登录
    var user_id = wx.getStorageSync('user_id');
    var token = wx.getStorageSync('token');
    var nick_name = wx.getStorageSync('nick_name');
    var avatar = wx.getStorageSync('avatar');
    var is_landlord = wx.getStorageSync('is_landlord');

    if (user_id && token) {
      this.setData({
        token: token,
        user_id: user_id,
        nick_name: nick_name,
        avatar: avatar,
        is_landlord: is_landlord,
      });
    }
    this.imageLoad();
    
  },
  //点击收藏时判断是否已经登录
  onPersonalBtn: function () {
    app.aldstat.sendEvent('详情页收藏点击');
    var token = wx.getStorageSync('token');
    var postid = this.data.postid;
    var is_collect = this.data.is_collect;
    if (!token) {
      //保存跳转链接
      var to_url = '/pages/list/listDetailOthers/listDetailOthers?id=' + postid;
      wx.setStorageSync('back_url', to_url);
      //var to_url = encodeURIComponent('/pages/list/listDetail/listDetail?id=' + postid);
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
      })

    } else {

      if (is_collect == 1) {
        this.onCollectC(url3);
        this.setData({
          collected: false,
          is_collect: 2,
        })

      } else {
        this.onCollect(url2);
        this.setData({
          collected: true,
          is_collect: 1,
        })
      }
    }
  },
//收藏或取消收藏
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  //收藏或取消收藏时icon变化
  showToast: function (postsCollected, postCollected) {
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    })
  },
  //提交收藏状态
  onCollect: function (url2, postid) {
    var that = this;
    if (!postid) {
      var postid = this.data.postid;
    }
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url2,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        house_id: postid,
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
          var to_url = '/pages/list/listDetailOthers/listDetailOthers?id=' + postid;
          wx.setStorageSync('back_url', to_url);
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
          })
        }
        else {
          var codeId = res.data.code;
          that.setData({
            codeId: codeId,
          });
          wx.showToast({
            title: "收藏成功",
            duration: 1000,
            icon: "success"
          });
        }
      },
      fail: function (error) { }
    })
  },
  //提交取消收藏数据
  onCollectC: function (url3, postid) {
    var that = this;
    if (!postid) {
      var postid = this.data.postid;
    }
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url3,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
        house_id: postid,
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
          var to_url = '/pages/list/listDetailOthers/listDetailOthers?id=' + postid;
          wx.setStorageSync('back_url', to_url);
          wx.navigateTo({
            url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
          })
        }
        else {
          var codeId = res.data.code;

          that.setData({
            codeId: codeId,
          });
          wx.showToast({
            title: "取消收藏成功",
            duration: 1000,
            icon: "success"
          });
        }
      },
      fail: function (error) { }
    })
  },
  //接口请求数据
  onHouseDetail: function (src) {
    //获取时间戳 
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var that = this;
    var token = wx.getStorageSync('token');
    var g_uid = wx.getStorageSync('g_uid');
    var listBanner=[];
    var listZImg=[];
    var listTImg=[];
    var furnitureList=[];
    var trafficList=[];
    var compareList = [];
    var tagList=[];
    var compareListAll=[];
    var deviceTags=[];
    var priceBJ=[];
    var actionType=[];
    var poster=[];
    var houseTitle=[];
    var action=[];
    var actionSmalle=[];
    var facilitiesGreenHidden = that.data.facilitiesGreenHidden;
    var compareListKey = that.data.compareListKey;
    var compareListMore = that.data.compareListMore;
    var compareListShou = that.data.compareListShou;
    var postid = this.data.postid;
    console.log(postid);
    var facilitiesGreenKey = that.data.facilitiesGreenKey;
    console.log(app.globalData.udid, app.globalData.version)
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url,
      data: {
        os_type: app.globalDataApp.os_type,
        os_version: app.globalDataApp.os_version,
        channel: app.globalDataApp.channel,
        network: app.globalDataApp.network,
        version_code: app.globalDataApp.version_code,
        house_id: postid,
        timestamp: timestamp,
        app_device: openid,   //APP运行设备的唯一标识OPEN_ID
        package_name: "",   //应用包名
        g_uid: g_uid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data,'house');
        if(res.data.ret==0){
       /* var status = res.data.data.baseInfo.status;*/
       /*房源信息*/
          for (var i = 0; i < res.data.content.main_info.tag.length; i++) {
            tagList.push(res.data.content.main_info.tag[i]);
          }
          var building_area = res.data.content.main_info.house_info.building_area;
          var house_type = res.data.content.main_info.house_info.house_type;
          var orientation = res.data.content.main_info.house_info.orientation;
          var rent_mode = res.data.content.main_info.house_info.rent_mode;
          var total = res.data.content.main_info.house_info.total;
          var house_id = res.data.content.house_id;
          var house_number = res.data.content.main_info.house_number;
          var is_collect = res.data.content.main_info.is_collect;
          if (is_collect == 1) {
            var collected = true;
          } else if (is_collect == 2){
            var collected = false;
          }
          console.log(is_collect, collected,'collectedcollected')
        /*全网比价*/ 
          for (var i = 0; i < res.data.content.main_info.compare_list.length; i++) {
            compareListAll.push(res.data.content.main_info.compare_list[i]);
            priceBJ.push(res.data.content.main_info.compare_list[i].price.split("/")[0]);
            actionType.push(res.data.content.main_info.compare_list[i].action_type);
            poster.push(res.data.content.main_info.compare_list[i].poster);//全网比价封面图
            houseTitle.push(res.data.content.main_info.compare_list[i].title);//全网比价标题
            action.push(res.data.content.main_info.compare_list[i].action);
            actionSmalle.push(res.data.content.main_info.compare_list[i].action.split('|'));
            console.log(actionSmalle,'actionSmalle')
          }

       /*地图*/
        var address = res.data.content.location.address; 
        for (var i = 0; i < res.data.content.location.traffic.length; i++) {
          trafficList.push(res.data.content.location.traffic[i]);
        }

          // 实例化API核心类
          var demo = new QQMapWX({
            key: 'CVCBZ-XLER3-MBL3Q-3OT5J-6WWJJ-HQFPY' // 必填
          });
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: res.data.content.location.latitude,
              longitude: res.data.content.location.longitude
            },
            coord_type: 3,//baidu经纬度
            success: function (res) {
              var latitude = res.result.ad_info.location.lat;
              var longitude = res.result.ad_info.location.lng;
              that.setData({
                latitude: latitude,
                longitude: longitude,
              })
              console.log(latitude, longitude, '222')
            }
          });

        /*banner图片切换*/
        for (var i = 0; i < res.data.content.banner.length;i++){
          listBanner.push(imgUrl + res.data.content.banner[i] + imgUrlLast);
        }
        var totalNum = listBanner.length;
        
          var title = res.data.content.main_info.title;
          var upon_status = res.data.content.main_info.upon_status;
        var subtitle = res.data.content.main_info.subtitle;
        var isautotrophy = res.data.content.main_info.isautotrophy;
          var price = res.data.content.main_info.price.split("/"); 
          var price = price[0];
          var compareListNum = res.data.content.main_info.compare_list.length;
          if (compareListNum<=3)
          {
            for (var i = 0; i < compareListNum; i++) {
              compareList.push(res.data.content.main_info.compare_list[i]);
            }
          }
          else{
            if (compareListKey == 1) {
              for (var i = 0; i < res.data.content.main_info.compare_list.length; i++) {
                compareList.push(res.data.content.main_info.compare_list[i]);
                var compareListMore = true;
                var compareListShou = false;
              }
            }
            else
            {
              for (var i = 0; i < 3; i++) {
                compareList.push(res.data.content.main_info.compare_list[i]);
                var compareListMore = false;
                var compareListShou = true;
              }
            }
          }
        /*服务设施 */
        var furnitureLength = res.data.content.furniture.length;
          console.log(furnitureLength);
        if (furnitureLength <= 9) {
          for (var i = 0; i < res.data.content.furniture.length; i++) {
            furnitureList.push(res.data.content.furniture[i]);
          }
          var facilitiesGreenHidden='none';
        }
        else{
          if (facilitiesGreenKey == 1) {
            for (var i = 0; i < res.data.content.furniture.length; i++) {
              furnitureList.push(res.data.content.furniture[i]);
            }
            var facilitiesGreenHidden = 'none';
          }
          else {
            for (var i = 0; i < 9; i++) {
              furnitureList.push(res.data.content.furniture[i]);
            }
          }
        }
        //房源介绍
        var houseMessage = res.data.content.introduction.detail;
          that.setData({
            building_area: building_area,
            house_type: house_type,
            orientation: orientation,
            rent_mode: rent_mode,
            total: total,
            house_id: house_id,
            house_number: house_number,
            compareListAll: compareListAll,
            priceBJ: priceBJ,
            actionType: actionType,
            poster: poster,
            houseTitle: houseTitle,
            action: action,
            actionSmalle: actionSmalle,

            address: address,
            trafficList: trafficList,
            tagList:tagList,
            listBanner: listBanner,
            totalNum: totalNum,
            title:title,
            upon_status: upon_status,
            subtitle:subtitle,
            isautotrophy:isautotrophy,
            price: price,
            compareList: compareList,
            compareListKey:compareListKey,
            compareListMore:compareListMore,
            compareListShou:compareListShou,

            /*house_countZ: house_countZ,
            listZImg: listZImg,

            house_countT: house_countT,
            listTImg: listTImg,*/

            furnitureList: furnitureList,
            facilitiesGreenHidden: facilitiesGreenHidden,

            houseMessage: houseMessage,
            is_collect: is_collect,
            collected: collected,
            /*listImg: listImg,
            list: list,
            listSwiperDetail: listSwiperDetail,
            listCommission: listCommission,
            title: title,
            addres: addres,
            community_name: community_name,
            eyeNum: eyeNum,
            partnerLogo: partnerLogo,
            partnerName: partnerName,
            price: price,
            update_time: update_time,
    //        charge_one: charge_one,
            on_floor: on_floor,
            total_floor: total_floor,
            layout_type: layout_type,
            building_area: building_area,
            last_rent_date: last_rent_date,
            latest_date: latest_date,
            metro_text: metro_text,
            house_info: house_info,
            house_info1: house_info1,
            contact_phone: contact_phone,
            contact_name: contact_name,
            phone: contact_phone,
            postid: postid,
            report: postid,
            partner_id: partner_id,
            collected: collected,
            imgSrc: imgSrc,
            status: status, */
            
          });
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            mask: true
          })
        }
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },
  //服务设施查看更多
  facilitiesGreenTap: function () {
    var postid = this.data.postid;
    var facilitiesGreenHidden='none';
    var facilitiesGreenKey = 1;
    this.setData({
      facilitiesGreenHidden: facilitiesGreenHidden,
      facilitiesGreenKey: facilitiesGreenKey,
      postid: postid,
    })
    console.log(facilitiesGreenHidden, facilitiesGreenKey, postid)
    this.onHouseDetail();
  },
  //banner大图查看
  previewImage: function (event) {
    app.aldstat.sendEvent('详情页海报点击');
    var src = event.currentTarget.dataset.id;
    var listBanner = this.data.listBanner;
    wx.previewImage({
      current: listBanner[src],
      urls: listBanner,
    })
  },
  //预约看房跳转
  onlineMsgTap: function (e) {
    app.aldstat.sendEvent('详情页在线预约');
    var token = wx.getStorageSync('token');
    console.log(token);
    var postid = this.data.postid;
    if (!token) {
      //保存跳转链接
      var to_url = '/pages/list/listDetailOthers/listDetailOthers?id=' + postid;
      wx.setStorageSync('back_url', to_url);
      //var to_url = encodeURIComponent('/pages/list/listDetail/listDetail?id=' + postid);
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
      })

    } else {
      wx.navigateTo({
        url: '/pages/list/onlineMsg/onlineMsg?id=' + postId
      })
    }
  },
  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('详情页分享点击');
    var postid = this.data.postid;
    var imgSrc = this.data.imgSrc;
    return {
      title: this.data.title,
      desc: this.data.postid,
      path: '/pages/list/listDetailOthers/listDetailOthers?id=' + postid,
      imageUrl: imgSrc,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //banner切换获取当前显示第几个
  swiperChange: function (current) {
    var detail = {
      current: current
    };
    var index = detail.current.detail.current;
    var indexNum = index + 1;
    this.setData({
      indexNum: indexNum,
    })
  },
  /*获取屏幕宽度*/
  imageLoad: function () {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    })
  },
  //地图
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  //地图结束

  //跳转地图页面
  listDetailMapTap:function(event){
    var latitude = event.currentTarget.dataset.la;
    var longitude = event.currentTarget.dataset.lo;
    wx.navigateTo({
      url: 'listDetailMap/listDetailMap?latitude=' + latitude + '&longitude=' + longitude,
    })
  },
  //全网比价房源跳转
  compareListTap: function (event) {
    app.aldstat.sendEvent('全网比价房源点击');
    var token = wx.getStorageSync('token');
    var idx = event.currentTarget.dataset.idx;
    var actionType = this.data.actionType;
    var poster = this.data.poster;
    var action = this.data.action;
    var houseTitle = this.data.houseTitle;
    if(!token){
      var token = '';
    }
  
    if (actionType[idx] == 1)//跳转h5页面
    {
      var actionId = encodeURIComponent(action[idx] + '&token=' + token + '&poster=' + poster[idx] + '&houseTitle=' + houseTitle[idx]);
      console.log(actionId,"actionId");
      wx.navigateTo({
        url: "/pages/list/listDetailOthers/h5/h5?url=" + actionId,
      })
    }
    else if (actionType[idx] == 2)//跳转第三方详情页
    {
      wx.makePhoneCall({
        phoneNumber: action[idx], //此号码并非真实电话号码，仅用于测试
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    }
    else if (actionType[idx] ==0){
      /*wx.showToast({
        title: '暂无跳转',
        icon:'loading'
      })*/
    }
  },
  backHome:function(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})