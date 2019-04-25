var app = getApp();
let isIphoneX = app.globalData.isIphoneX;//手机型号判断
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
    isIpx: isIphoneX ? true : false,
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
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
    collected:true,
  },

  onLoad: function (options) {
    app.aldstat.sendEvent('房源详情页打开');
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
   // var postid = 27640066;
   var postid = options.id;
    console.log(postid,'postid')
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
  onShow: function (options) {
  },
  //点击收藏时判断是否已经登录
  onPersonalBtn: function () {
    app.aldstat.sendEvent('详情页收藏点击');
    var token = wx.getStorageSync('token');
    var postid = this.data.postid;
    var is_collect = this.data.is_collect;
    if (!token) {
      //保存跳转链接
      var to_url = '/pages/list/listDetail/listDetail?id=' + postid;
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
    var area_code = wx.getStorageSync('area_code'); 
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
        console.log(res, '收藏')
        if (res.data.ret == 401) {
          wx.removeStorageSync('user_id');
          wx.removeStorageSync('token');
          wx.removeStorageSync('open_id');
          wx.removeStorageSync('avatar');
          wx.removeStorageSync('mobile');

          //保存跳转链接
          var to_url = '/pages/list/listDetail/listDetail?id=' + postid;
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
    var area_code = wx.getStorageSync('area_code'); 
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
          var to_url = '/pages/list/listDetail/listDetail?id=' + postid;
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
    var area_code = wx.getStorageSync('area_code'); 
    var listBanner=[];
    var listZImg=[];
    var listTImg=[];
    var furnitureList=[];
    var trafficList=[];
    var compareList = [];
    var compareLists=[];
    var tagList = [];
    var facilitiesGreenHidden = that.data.facilitiesGreenHidden;
    var compareListKey = that.data.compareListKey;
    var compareListMore = that.data.compareListMore;
    var compareListShou = that.data.compareListShou;
    var postid = this.data.postid;
    console.log(postid,'postid01');
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
        area_code: area_code,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data,'house');
        if(res.data.ret==0){
          /*房源信息*/
          for (var i = 0; i < res.data.content.main_info.new_tag.length; i++) {
            tagList.push(res.data.content.main_info.new_tag[i]);
          }
          var building_area = res.data.content.main_info.house_info.building_area;
          var house_type = res.data.content.main_info.house_info.house_type;
          var orientation = res.data.content.main_info.house_info.orientation;
          var rent_mode = res.data.content.main_info.house_info.rent_mode;
          var total = res.data.content.main_info.house_info.total;
          var house_id = res.data.content.house_id;
          var house_number = res.data.content.main_info.house_number;
          var tel_num = res.data.content.main_info.tel_num;
          var latitude = res.data.content.location.latitude;
          var longitude = res.data.content.location.longitude;
          var is_collect = res.data.content.main_info.is_collect;
          var house_uid = res.data.content.main_info.house_uid;
          /*小区信息 */
          var community_name = res.data.content.main_info.community_name;
          var city_id = res.data.content.main_info.city_id;
          var community_id_v2 = res.data.content.main_info.community_id_v2;
          /*小区信息结束 */
          if (is_collect == 1) {
            var collected = true;
          } else {
            var collected = false;
          }

          for (var i = 0; i < res.data.content.main_info.compare_list.length; i++) {
            compareLists.push(res.data.content.main_info.compare_list[i]);
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
                //地图
                markers: [{
                  iconPath: "/images/listDetail/others.png",
                  latitude: latitude,
                  longitude: longitude,
                  id: 0,
                  width: 50,
                  height: 50
                }],
            //地图结束
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
          var src_name = res.data.content.main_info.src_name;
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
        /*长租短租*/

        /*周边同类型房源 */
          if (!res.data.content.house_similar)
          {

          }
          else
          {
            var house_countZ = res.data.content.house_similar.house_count;
            for (var i = 0; i < res.data.content.house_similar.house_list.length; i++) {
              listZImg.push(res.data.content.house_similar.house_list[i]);
            }
          }
          /*同小区房源 */
          if (!res.data.content.house_community) {

          }
          else {
            var house_countT = res.data.content.house_community.house_count;
            for (var i = 0; i < res.data.content.house_community.house_list.length; i++) {
              listTImg.push(res.data.content.house_community.house_list[i]);
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
        /*var id_collect = res.data.data.is_collect;
        var partner_id = res.data.data.partnerInfo.partner_id;      
        var listImg = that.data.listImg;
        for (var i = 0; i < res.data.data.pic_url.length; i++) {
          listImg.push(res.data.data.pic_url[i]);
        };
        
        var dataSrc = res.data.data.baseInfo;
        var title = dataSrc.house_name;
        var addres = dataSrc.address;
        var community_name = dataSrc.community_name;
        var eyeNum = dataSrc.view_count;
        var partnerLogo = dataSrc.partner_logo;
        var partnerName = dataSrc.partner_name;
        var price = dataSrc.price;
        var update_time = dataSrc.update_time;
  //      var charge_one = dataSrc.charge_one;
        var on_floor = dataSrc.on_floor;
        var total_floor = dataSrc.total_floor;
        var layout_type = dataSrc.layout_type;
        var building_area = dataSrc.building_area;
        var last_rent_date = dataSrc.last_rent_date;
        var latest_date = dataSrc.latest_date;
        var metro_text = dataSrc.metro_text;
        var house_info = dataSrc.house_info;
        var house_info1 = dataSrc.house_info;
        var contact_phone = dataSrc.contact_phone.toString();
        var contact_name = dataSrc.contact_name;
        var is_collect = dataSrc.is_collect;
        console.log(token);
        if (house_info1.length >= 110) {
          var house_info1 = house_info.substring(0, 110) + "...";
        }
        var list = that.data.list;
        for (var i = 0; i < res.data.data.house_feature.length; i++) {
          list.push(res.data.data.house_feature[i]);
        };
        var listSwiperDetail = that.data.listSwiperDetail;
        for (var i = 0; i < res.data.data.house_list.houses.length; i++) {
          listSwiperDetail.push(res.data.data.house_list.houses[i]);
        };
        var listCommission = that.data.listCommission;
        for (var i = 0; i < res.data.data.commission.length; i++) {
          listCommission.push(res.data.data.commission[i]);
          if (listCommission[i].personal_commission.length >= 5) {
            var listCommission = house_info.substring(0, 5) + "...";
          }
        };
        */
          that.setData({
            building_area: building_area,
            house_type: house_type,
            orientation: orientation,
            rent_mode: rent_mode,
            total: total,
            house_id: house_id,
            house_number: house_number,
            community_name: community_name,
            city_id: city_id,
            community_id_v2: community_id_v2,
            compareLists: compareLists,
            tel_num: tel_num,

            address: address,
            trafficList: trafficList,
            tagList: tagList,

            listBanner: listBanner,
            totalNum: totalNum,
            title: title,
            upon_status: upon_status,
            subtitle: subtitle,
            isautotrophy: isautotrophy,
            src_name: src_name,
            price: price,
            compareList: compareList,
            compareListKey:compareListKey,
            compareListMore:compareListMore,
            compareListShou:compareListShou,

            house_countZ: house_countZ,
            listZImg: listZImg,

            house_countT: house_countT,
            listTImg: listTImg,

            furnitureList: furnitureList,
            facilitiesGreenHidden: facilitiesGreenHidden,

            houseMessage: houseMessage,
            is_collect: is_collect,
            house_uid: house_uid,
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
          console.log(is_collect,'is_collectis_collect')
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
  //小区跳转列表页
  communityTap:function(e){
    var communityid = e.currentTarget.dataset.communityid;
    console.log(communityid,'communityid')
    wx.navigateTo({
      url: '../search/search?communityid=' + communityid,
    })
  },
  //全网比价查看更多
  compareListMoreTap:function(){
    var postid = this.data.postid;
    var compareListMore = true;
    var compareListShou=false;
    var compareListKey = 1;
    this.setData({
      compareListMore: compareListMore,
      compareListShou: compareListShou,
      compareListKey: compareListKey,
      postid: postid,
    })
    this.onHouseDetail();
  },
  //全网比价收起
  compareListShouTap: function () {
    var postid = this.data.postid;
    var compareListMore = false;
    var compareListShou = true;
    var compareListKey = 0;
    this.setData({
      compareListMore: compareListMore,
      compareListShou: compareListShou,
      compareListKey: compareListKey,
      postid: postid,
    })
    this.onHouseDetail();
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
  //房源推荐跳转详情页
  onListDetailTap: function (event) {
    app.aldstat.sendEvent('详情页推荐房源点击');
    var postId = event.target.id;
    wx.navigateTo({
      url: 'listDetail?id=' + postId
    })
  },
  //预约看房跳转
  onlineMsgTap: function (e) {
    app.aldstat.sendEvent('详情页在线预约');
    var token = wx.getStorageSync('token');
    var postid = this.data.postid;
    var city_id = this.data.city_id;
    var listBanner = this.data.listBanner;
    var listBannerImg = listBanner[0];
    var title = this.data.title;
    var subtitle = this.data.subtitle;
    var price = this.data.price;
    var uid = this.data.house_uid;
    if (!token) {
      //保存跳转链接
      var to_url = '/pages/list/listDetail/listDetail?id=' + postid;
      wx.setStorageSync('back_url', to_url);
      //var to_url = encodeURIComponent('/pages/list/listDetail/listDetail?id=' + postid);
      wx.navigateTo({
        url: '/pages/login/ldentity/ldentity'//?url=' + to_url,
      })

    } else {
      wx.navigateTo({
        url: '/pages/list/onlineMsg/onlineMsg?id=' + postid + '&listBannerImg=' + listBannerImg + '&title=' + title + '&subtitle=' + subtitle + '&price=' + price + '&uid=' + uid + '&city_id=' + city_id,
      })
    }
  },
  //获取电话
  onTelTap: function (event) {
    app.aldstat.sendEvent('详情页拨打电话');
    var house_id = this.data.postid;
    var tel_num = this.data.tel_num;
    wx.makePhoneCall({
      phoneNumber: tel_num, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //分享
  onShareAppMessage: function (event) {
    app.aldstat.sendEvent('详情页分享点击');
    var postid = this.data.postid;
    var imgSrc = this.data.imgSrc;
    return {
      title: this.data.title,
      desc: this.data.postid,
      path: '/pages/list/listDetail/listDetail?id=' + postid,
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
  listDetailMapTap: function (event) {
    var latitude = event.currentTarget.dataset.la;
    var longitude = event.currentTarget.dataset.lo;
    wx.navigateTo({
      url: '/pages/list/listDetailOthers/listDetailMap/listDetailMap?latitude=' + latitude + '&longitude=' + longitude,
    })
  },
  backHome: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})