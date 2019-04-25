// pages/index/list/upload/upload03/upload03.js
const app = getApp()
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
var uploadImage = require('../../../../../utils/camera/uploadFile1.js');
var util = require('../../../../../utils/camera/util.js');
var url = app.globalDataJson.gyjProductBase + "pc/house_upload/get_draft";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_upload/house_param";
var url2 = app.globalDataJson.gyjProductBase + "miniapi/house_operate/drop";
var url3 = app.globalDataJson.gyjProductBase + "miniapi/house_upload";
var copyWriteUtils = require('../../../../../utils/copyWriteUtils.js');
var url4 = app.globalDataJson.gyjProductBase + "miniapi/house_edit/save_house";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    rentData: [{ name: '1', value: '申请加入芝麻信用免押金', checked: false }, { name: '2', value: '申请加入芝麻信用押一付一', checked: false },],
    zmxyMessageHidden:true,
    //房源配置
    deviceData:[],
    deviceIdData:[],
    device_id: [],
    //房源配置结束
    imgList:[],
    imgListShort: [],
    imgListShortDelete: [],
    imgList01: [],
    imgListShort01: [],
    imgListShortDelete01: [],
    imgList02: [],
    imgListShort02: [],
    imgListShortDelete02: [],
    safeShow:true,
    safeNoShow:true,
    house_desc:'',
    zmxyNum:[],
    credit:0,
    pay_one:0,
    user_name:'',
    user_phone: '',
    isShow: false,
    house_coverIndex:0,
    tsNum:0,
    tsNum1:0,
    tsNum2:0,
    btnShow:false,//按钮禁用

    /**提示隐藏 */
    scrollTop: 0,
    photoImgShow: true,
    photoImgShow1: true,
    photoImgShow2: true,
    deviceIdShow:true,
    houseDescShow:true,
    userNameShow: true,
    userPhoneShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var editNum = options.editNum;
    var houseId = options.houseId;
    console.log(editNum,'editNum')
    var step1 = wx.getStorageSync('step1');
    var house_id = wx.getStorageSync('house_id');
    var city_id = step1.city_id;
    var district_id = step1.district_id;
    console.log(district_id,city_id,'district_id')
    this.setData({
      city_id: city_id,
      district_id: district_id,
      house_id: house_id,
      editNum: editNum,
      houseId: houseId,
    })
    this.listTap(); 
  },

  onShow: function (options) {
    var house_cover = wx.getStorageSync('house_cover');
    var user_name = wx.getStorageSync('nickname');
    var user_phone = wx.getStorageSync('mobile');
    console.log(house_cover, 'house_cover11')
    this.setData({
      house_cover: house_cover,
      user_name: user_name,
      user_phone: user_phone,
    })
  },
  //获取草稿
  draftTap: function () {
    var that = this;
    var cityArray = that.data.cityArray;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var tagTab = wx.getStorageSync('tagTab');
    console.log(openid, g_uid, 'openid')
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
        console.log(res.data, 'pc3');
        //是否是草稿
        if (res.data.content.is_draft == 0) {
          console.log('1111');
          return false;
        }
        else {
          console.log('333');
          //房源图片
          var imgList = res.data.content.real_house_pic;
          //房源配置
          var device_id = res.data.content.device_id;
          var deviceData = that.data.deviceData;
          if (!device_id) {
            for (var i = 0; i < deviceData.length; i++) {
              deviceData[i].isSelected = false;
            }
            console.log(deviceData,'0001')
            that.setData({
              deviceData: deviceData,
            })
          }
          else {
            var deviceIdData = device_id.split(',');
            console.log(deviceData, 'deviceData02')
            for (var i = 0; i < deviceIdData.length; i++) {
              deviceData[deviceIdData[i]].isSelected = true;
              console.log(deviceData[deviceIdData[i]], 'deviceData01')
            }
            console.log(deviceIdData, '0002')
          }
          //首次出租
          var first_rent = res.data.content.first_rent;
          if (first_rent == 1) {
            var tsNum = 1;
          }
          else {
            var tsNum = 0;
          }
          //出租超1年
          var one = res.data.content.one;
          if (one == 1) {
            var tsNum1 = 1;
          }
          else {
            var tsNum1 = 0;
          }
          //房东直租
          var direct_rent = res.data.content.direct_rent;
          if (direct_rent == 1) {
            var tsNum2 = 1;
          }
          else {
            var tsNum2 = 0;
          }
          //安心住
          var safe = res.data.content.safe;
          if (safe == 1) {
            var safeShow = false;
          }
          else {
            var safeShow = true;
          }
          //真房源
          var real_house = res.data.content.real_house;
          if (real_house == 1) {
            var safeNoShow = false;
          }
          else {
            var safeNoShow = true;
          }
          //芝麻信用推广——免押金
          var credit = res.data.content.credit;
          var rentData = that.data.rentData;
          if (credit == 1) {
            rentData[0].checked = true;
          }
          else {
            rentData[0].checked = false;
          }
          //芝麻信用推广——押一付一
          var pay_one = res.data.content.pay_one;
          var rentData = that.data.rentData;
          if (pay_one == 1) {
            rentData[1].checked = true;
          }
          else {
            rentData[1].checked = false;
          }
          that.setData({
            imgList: imgList,
            house_cover: res.data.content.house_cover,
            deviceIdData: deviceIdData,
            device_id: device_id,
            first_rent: first_rent,
            tsNum: tsNum,
            one: one,
            tsNum1: tsNum1,
            direct_rent: direct_rent,
            tsNum2: tsNum2,
            safe: safe,
            safeShow: safeShow,
            imgList01: res.data.content.safe_pic,
            real_house: real_house,
            safeNoShow: safeNoShow,
            imgList02: res.data.content.real_house_pic,
            house_desc: res.data.content.house_desc,
            credit: credit,
            pay_one: pay_one,
            rentData: rentData,
            user_name: res.data.content.user_name,
            user_phone: res.data.content.user_phone,
          })
        }
      }
    })
  },
//上传房源图片
  uploadImgTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 10, // 默认10
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());
        for (var i = 0; i < tempFilePaths.length; i++) {
       
          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'landlord_mini/house/sl/6688/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] + '/' + result.split('/')[7];
                  console.log(brand_logo,avatar, '图片上传')

                  that.data.imgList.push(avatar);
                  that.data.imgListShort.push(avatar)
                  console.log(that.data.imgList,'imgList');
                  console.log(that.data.imgListShort);

                  that.setData({
                    brand_logo: brand_logo,
                    avatar: avatar,
                    imgList: that.data.imgList,
                    imgListShort: that.data.imgListShort,
                    house_cover: wx.getStorageSync('house_cover'),
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              wx.hideLoading();

            }, function (result) {
              console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        }

      }
    })
  },
  //房源图片删除
  imgCloseTap: function (e) {
    var imgSrc = e.currentTarget.dataset.id;
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.num;
    if (index==0){
      var imgListShortDelete = this.data.imgListShortDelete;
      var imgList = this.data.imgList;
      var house_cover = this.data.house_cover;
      imgListShortDelete.push(imgList[imgSrc]);
      imgList.splice(imgSrc, 1);
      //imgShortList.splice(imgSrc, 1);
      if (imgList.length == 0 || house_cover == src) {
        //封面图片
        wx.setStorageSync('house_cover', '');
      }
      this.setData({
        imgList: imgList,
        imgListShortDelete: imgListShortDelete,
      })
    }
    else if (index == 1) {
      var imgListShortDelete01 = this.data.imgListShortDelete01;
      var imgShortList01 = this.data.imgShortList01;
      var imgList01 = this.data.imgList01;
      imgListShortDelete01.push(imgList01[imgSrc]);
      imgList01.splice(imgSrc, 1);
      this.setData({
        imgList01: imgList01,
        imgListShortDelete01: imgListShortDelete01,
      })
    }
    else if (index == 2) {
      var imgListShortDelete02 = this.data.imgListShortDelete02;
      var imgShortList02 = this.data.imgShortList02;
      var imgList02 = this.data.imgList02;
      imgListShortDelete02.push(imgList02[imgSrc]);
      imgList02.splice(imgSrc, 1);
      this.setData({
        imgList02: imgList02,
        imgListShortDelete02: imgListShortDelete02,
      })
    }
  },
  //图片设为封面
  photoImgBigTap:function(e){
    var src = e.currentTarget.dataset.src;
    var num = e.currentTarget.dataset.num;
    wx.navigateTo({
      url: '../upload04/upload04?src=' + src + '&num=' + num,
    })
  },
  //上传房产证图片
  deedImgTap: function (e) {
    var that = this;
    var deedNum = e.currentTarget.dataset.num;
    var city_id = that.data.city_id;
    var district_id = that.data.district_id; 
    if (deedNum==0){
      var deedWay ='/safe/'
    }
    else if (deedNum == 1) {
      var deedWay = '/real/'
    }
    var token = wx.getStorageSync('token');
    var uploadImgLoading = false;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var uploadImgLoading = true;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());
        for (var i = 0; i < tempFilePaths.length; i++) {

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'landlord_mini/cert/sl/6688/' + city_id + '/' + district_id + deedWay,
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showLoading({
                title: ' 图片上传成功',
                mask: true,
                success: function (res) {
                  var brand_logo = result;
                  var avatar = result.split('/')[3] + '/' + result.split('/')[4] + '/' + result.split('/')[5] + '/' + result.split('/')[6] + '/' + result.split('/')[7] + '/' + result.split('/')[8] + '/' + result.split('/')[9] + '/' + result.split('/')[10];
                  console.log(res, '图片上传')
                  if (deedNum == 0) {
                    that.data.imgList01.push(avatar);
                    that.data.imgListShort01.push(avatar)
                    console.log(that.data.imgList01, 'imgList');
                    console.log(that.data.imgListShort01);
                    that.setData({
                      imgList01: that.data.imgList01,
                      imgListShort01: that.data.imgListShort01
                    })
                  }
                  else if (deedNum == 1) {
                    that.data.imgList02.push(avatar);
                    that.data.imgListShort02.push(avatar)
                    console.log(that.data.imgList02, 'imgList');
                    console.log(that.data.imgListShort02);
                    that.setData({
                      imgList02: that.data.imgList02,
                      imgListShort02: that.data.imgListShort02
                    })
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              wx.hideLoading();

            }, function (result) {
              console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        }
        console.log(that.data.imgList);
        console.log(that.data.imgShortList);
        that.setData({
          imgList: that.data.imgList,
          imgShortList: that.data.imgShortList
        })

      }
    })
  },
  //房源配置勾选
  deviceBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.deviceData[index];
    item.isSelected = !item.isSelected;
    var deviceData=this.data.deviceData;
    var device_id = [];
    for(var i=0;i<deviceData.length;i++){
      if (deviceData[i].isSelected==true){
        device_id.push(deviceData[i].id);
      }
    }
    var device_id=device_id.join(',');
    console.log(deviceData, device_id, 'deviceData')
    this.setData({
      deviceData: deviceData,
      device_id: device_id,
    });
  },
  //房源特色
  tsBtnTap: function (e) {
    var tsBtnNum = e.currentTarget.dataset.index;
    var tsNum = this.data.tsNum;
    var tsNum1 = this.data.tsNum1;
    var tsNum2 = this.data.tsNum2;
    if (tsBtnNum == 0) {
      if (tsNum==0){
        var tsNum=1;
        var first_rent=1;
      }
      else {
        var tsNum = 0;
        var first_rent = 0;
      }
      this.setData({
        tsNum: tsNum,
        first_rent: first_rent,
      })
    } 
    if (tsBtnNum == 1) {
      if (tsNum1 == 0) {
        var tsNum1 = 1;
        var one=1;
      }
      else {
        var tsNum1 = 0;
        var one = 0;
      }
      this.setData({
        tsNum1: tsNum1,
        one: one,
      })
    }
    if (tsBtnNum == 2) {
      if (tsNum2 == 0) {
        var tsNum2 = 1;
        var direct_rent=1;
      }
      else {
        var tsNum2 = 0;
        var direct_rent = 0;
      }
      this.setData({
        tsNum2: tsNum2,
        direct_rent: direct_rent,
      })
    }
    console.log(tsNum, tsNum1, tsNum2,'1111');
   /* else if (tsNum == 1) {
      var first_rent = 0;
      var one = 1;
      var direct_rent = 0;
    }
    else if (tsNum == 2) {
      var first_rent = 0;
      var one = 0;
      var direct_rent = 1;
    }

    this.setData({
      tsNum: tsNum,
      first_rent: first_rent,
      one: one,
      direct_rent: direct_rent,
    })*/
  },
  //安心住
  safeTap:function(){
    var safeShow = this.data.safeShow;
    if (safeShow==false)
    {
      var safeShow=true;
    }
    else{
      var safeShow=false;
    }
    this.setData({
      safeShow: safeShow,
    })
  },
  //真房源
  safeNoTap: function () {
    var safeNoShow = this.data.safeNoShow;
    if (safeNoShow == false) {
      var safeNoShow = true;
    }
    else {
      var safeNoShow = false;
    }
    this.setData({
      safeNoShow: safeNoShow,
    })
  },
  //芝麻信用帮助icon
  helpTap: function () {
    this.setData({
      zmxyMessageHidden: false,
      isShow:true,
    })
  },
  //关闭弹框
  zmxyMessageHiddenTap: function () {
    this.setData({
      zmxyMessageHidden: true,
      isShow: false,
    })
  },
  //芝麻信用推广勾选
  checkboxChange: function (e) {
    if (!e.detail.value) {
      var zmxyNum = '';
      var credit = 0;
      var pay_one = 0;
    }
    else {
      var zmxyNum = e.detail.value; 
      if (zmxyNum.length == 2) {
        var credit = 1;
        var pay_one = 1;
      }
      else if (zmxyNum.length == 1 && zmxyNum[0] == 1) {
        var credit = 1;
        var pay_one = 0;
      }
      else if (zmxyNum.length == 1 && zmxyNum[0] == 2) {
        var credit = 0;
        var pay_one = 1;
      }
      else if (zmxyNum.length == 0) {
        var credit = 0;
        var pay_one =0;
      }
    }
    console.log(zmxyNum,'zmxyNum');
    
    console.log(credit, pay_one, 'pay_one');
    this.setData({
      credit: credit,
      pay_one: pay_one,
    })
  },
  //获取房源设施，标签，省市联动数据列表
  listTap: function () {
    var that = this;
    var editNum = that.data.editNum;
    console.log(editNum,'editNum001')
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var cityArray = that.data.cityArray;
    wx.request({
      url: url1,
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
        console.log(res, 'list');
        var deviceData = that.data.deviceData;
        for (var i = 0; i < res.data.content.device.length; i++) {
          deviceData.push(res.data.content.device[i]);
          deviceData[i].isSelected=false;
        } 
        var step03 = wx.getStorageSync('step03');
        console.log(step03,'step03step03')
        if (!step03) { }
        else {
          var device_id = step03.device_id;
          var deviceIdData = device_id.split(',');
          console.log(device_id,deviceIdData,'listdevice_id')
          console.log(deviceData, 'deviceData02')
          if (deviceIdData.length <= deviceData.length)
          {
            for (var i = 0; i < deviceIdData.length; i++) {
              var deviceDataList = deviceData[deviceIdData[i] - 1];
              deviceDataList.isSelected = true;
              console.log(deviceDataList, deviceIdData[i], 'deviceData01')
            }
          }          
          //首次出租
          var first_rent=step03.first_rent;
          if (first_rent==1){
            var tsNum=1;
          } 
          else {
            var tsNum = 0;
          }
          //出租超1年
          var one = step03.one;
          if (one == 1) {
            var tsNum1 = 1;
          }
          else {
            var tsNum1 = 0;
          }
          //房东直租
          var direct_rent = step03.direct_rent;
          if (direct_rent == 1) {
            var tsNum2 = 1;
          }
          else {
            var tsNum2 = 0;
          }
          //安心住
          var safe = step03.safe;
          if (safe==1){
            var safeShow=false;
          }
          else {
            var safeShow = true;
          }
          //真房源
          var real_house = step03.real_house;
          if (real_house == 1) {
            var safeNoShow = false;
          }
          else {
            var safeNoShow = true;
          }
          //芝麻信用推广——免押金
          var credit=step03.credit;
          var rentData = that.data.rentData;
          if (credit==1){
            rentData[0].checked=true;
          }
          else {
            rentData[0].checked = false;
          }
          //芝麻信用推广——押一付一
          var pay_one = step03.pay_one;
          var rentData = that.data.rentData;
          if (pay_one == 1) {
            rentData[1].checked = true;
          }
          else {
            rentData[1].checked = false;
          }
          that.setData({
            imgList: step03.imgList,
            house_cover: step03.house_cover,
            deviceIdData: deviceIdData,
            device_id: device_id,
            first_rent: first_rent,
            tsNum: tsNum,
            one: one,
            tsNum1: tsNum1,
            direct_rent: direct_rent,
            tsNum2: tsNum2,
            safe: safe,
            safeShow: safeShow,
            imgList01: step03.imgList01,
            real_house: real_house,
            safeNoShow: safeNoShow,
            imgList02: step03.imgList02,
            house_desc: step03.house_desc,
            credit: credit,
            pay_one: pay_one,
            rentData:rentData,
            deviceData: deviceData,
            user_name: step03.user_name,
            user_phone: step03.user_phone,
          })
        }
        console.log(deviceData,'deviceData')
        console.log(editNum,'editNum002')
        if (editNum == 1) {

        }
        else {
          that.draftTap();
        }
      }
    })
  },
  //获取草稿
  /*draftTap: function () {
    var that = this;
    var cityArray = that.data.cityArray;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var tagTab = wx.getStorageSync('tagTab');
    console.log(openid, g_uid, 'openid')
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
        console.log(res.data, 'pc');
        //是否是草稿
        if (res.data.content.is_draft == 0) {
          console.log('1111');
          return false;
        }
        else {
          console.log('444');
          var house_pics = res.data.content.house_pics;
          if (house_pics == []) {
            wx.setStorageSync('house_cover', '');   
          }*/
          /*//出租类型
          var rentDataIndex = res.data.content.rent_mode;
          //房源类型
          var houseTypeDataValue = that.data.houseTypeDataValue;
          console.log(rentDataIndex, tagTab, 'tagTab')
          if (!tagTab) {
            var houseTypeIndex = -1;
          }
          else {
            for (var i = 0; i < houseTypeDataValue.length; i++) {
              if (tagTab == houseTypeDataValue[i]) {
                var houseTypeIndex = i;
                return false;
              }
              else {
                var houseTypeIndex = -1;
              }
            }
          }
          console.log(houseTypeIndex, 'houseTypeIndex');
          //起租租期
          var timeIndex = res.data.content.rent_period;
          //付款方式
          var payIndexNum = res.data.content.pay_type;
          var payIndex = res.data.content.pay_type;
          //租金
          var price = res.data.content.price;
          //押金方式
          var depositIndex = res.data.content.deposit_type;
          //押金金额
          var deposit_price = res.data.content.deposit_price;

          //最早可入住时间
          var date = res.data.content.checkin_time;
          that.setData({
            rentDataIndex: rentDataIndex,
            houseTypeIndex: houseTypeIndex,
            timeIndex: timeIndex,
            payIndexNum: payIndexNum,
            payIndex: payIndex,
            price: price,
            depositIndex: depositIndex,
            deposit_price: deposit_price,
            date: date,
          })
          //佣金比例
          var commissionRateData_price = res.data.content.commission_price;
          console.log(commissionRateData_price, 'commissionRateData_price')
          var commission_price = commissionRateData_price * price;
          var commissionRateData = that.data.commissionRateData;
          for (var i = 0; i < commissionRateData.length; i++) {
            var commissionRateDataNum = commissionRateData[i].split('%')[0] / 100;
            console.log(commissionRateDataNum, 'commissionRateDataNum')
            if (commissionRateData_price == commissionRateDataNum) {
              var commissionRateIndex = i;
              that.setData({
                commission_price: commission_price,
                commissionRateIndex: commissionRateIndex,
              })
              return false;
            }
            else {
              var commissionRateIndex = 0;
            }
          }
          that.setData({
            commission_price: commission_price,
            commissionRateIndex: commissionRateIndex,
          })*/
        /*}
      }
    })
  },*/
  //重置
  resetTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var house_id = wx.getStorageSync('house_id');
    wx.request({
      url: url2,
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
        house_id: house_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data, '0000')
        that.listTap();
        wx.switchTab({
           url: '/pages/index/list/upload/upload01',
         })
      }
    })
  },
  //下一页
  formSubmit: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var step1 = wx.getStorageSync('step1');
    var step2 = wx.getStorageSync('step2');
    var house_id = wx.getStorageSync('house_id');
    
    var house_pics = that.data.imgList;
    console.log(house_pics,'house_pics')
    if (!house_pics || house_pics.length==0) {
      /*wx.showToast({
        title: '请上传房源图片',
        icon: 'loading',
        duration: 1500
      });*/
      var photoImgShow = false;
      that.setData({
        photoImgShow: photoImgShow,
        photoImgShow1: true,
        photoImgShow2: true,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        photoImgShow: true,
      })
    }
    if (house_pics.length<=2) {
      console.log('111');
      /*wx.showToast({
        title: '房源图最少3张',
        icon: 'loading',
        duration: 1500
      });*/
      var photoImgShow1 = false;
      that.setData({
        photoImgShow1: photoImgShow1,
        photoImgShow: true,
        photoImgShow2: true,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        photoImgShow1: true,
      })
    }
    if (house_pics.length >=11) {
      console.log('111');
      /*wx.showToast({
        title: '房源图最多10张',
        icon: 'loading',
        duration: 1500
      });*/
      var photoImgShow2 = false;
      that.setData({
        photoImgShow2: photoImgShow2,
        photoImgShow1: true,
        photoImgShow: true,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        photoImgShow2: true,
      })
    }
    var house_cover = wx.getStorageSync('house_cover');
    var device_id = e.detail.value.device_id;
    if (!device_id) {
      /*wx.showToast({
        title: '请选择房源配置',
        icon: 'loading',
        duration: 1500
      });*/
      var deviceIdShow = false;
      that.setData({
        deviceIdShow: deviceIdShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        deviceIdShow: true,
      })
    }
    var house_desc = e.detail.value.house_desc;
    if (house_desc == '') {
      /*wx.showToast({
        title: '请填写房源描述',
        icon: 'loading',
        duration: 1500
      });*/
      var houseDescShow = false;
      that.setData({
        houseDescShow: houseDescShow,
      })
      return false;
    }
    else {
      that.setData({
        houseDescShow: true,
      })
    }
    var one = e.detail.value.one;
    var first_rent = e.detail.value.first_rent;
    var direct_rent = e.detail.value.direct_rent;
    var safe = e.detail.value.safe;
    var safe_pic = that.data.imgList01;
    var real_house = e.detail.value.real_house;
    var real_house_pic = that.data.imgList02;

    var credit = that.data.credit;
    var pay_one = that.data.pay_one;

    
    var user_name = e.detail.value.user_name;
    if (user_name =='') {
      /*wx.showToast({
        title: '请填写联系人',
        icon: 'loading',
        duration: 1500
      });*/
      var userNameShow = false;
      that.setData({
        userNameShow: userNameShow,
      })
      return false;
    }
    else {
      that.setData({
        userNameShow: true,
      })
    }
    var user_phone = e.detail.value.user_phone; 
    if (user_phone == '') {
      /*wx.showToast({
        title: '请填写联系电话',
        icon: 'loading',
        duration: 1500
      });*/
      var userPhoneShow = false;
      that.setData({
        userPhoneShow: userPhoneShow,
      })
      return false;
    }
    else {
      that.setData({
        userPhoneShow: true,
      })
    }
    //安心住
    if (safe_pic.length >= 1) {
      var safe = 1;
    }
    else {
      var safe = 0;
    }
    //真房源
    if (real_house_pic.length >= 1) {
      var real_house = 1;
    }
    else {
      var real_house = 0;
    }
    /*var mobileIf = this.validatemobile(user_phone);
    if (mobileIf == false) {
      return false;
    }*/ 
    var editNum = that.data.editNum;
    console.log(editNum,'editNum')
    if (editNum == 1) {
      var houseId = that.data.houseId;
      var step01 = wx.getStorageSync('step01');
      var step02 = wx.getStorageSync('step02');
      var step03 = {
        house_pics: house_pics,    //房源图片地址
        house_cover: house_cover,   //房源封面的图片地址，没有则传空
        device_id: device_id,    //多个设施ID之间使用英文逗号连接
        safe: safe,  //安心住,0-非安心住，1-安心住
        safe_pic: safe_pic,  //如果用户选择安心住，此参数值为安心住房源证书图片
        real_house: real_house, //真房源，0-否，1-是
        real_house_pic: real_house_pic,    //房产证图片
        one: one,    //出租超1年,0-否，1-是
        first_rent: first_rent,     //首次出租，0-否，1-是
        direct_rent: direct_rent,    //房东直租租，0-否，1-是
        house_desc: house_desc,  //房源简介
        user_name: user_name,    //联系人
        user_phone: user_phone,  //联系电话
        credit: credit, //加入芝麻信用免押金，0-否,1-是
        pay_one: pay_one //加入芝麻信用押一付，0-否,1-是
      }
      //删除的图片
      var imgListShortDelete = that.data.imgListShortDelete;
      var imgListShortDelete01 = that.data.imgListShortDelete01;
      var imgListShortDelete02 = that.data.imgListShortDelete02;
      //新增的图片
      var imgListShort = that.data.imgListShort;
      var imgListShort01 = that.data.imgListShort01;
      var imgListShort02 = that.data.imgListShort02;
      console.log(step02.commission_price, one,'step02.commission_price');
      //return false;

      that.setData({
        btnShow: true,
      })
      //请求接口
      wx.request({
        url: url4,
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
          house_id: houseId,
          house_param:{ 
            city_id: step01.city_id,  //城市
            district_id: step01.district_id,  //行政区
            community: step01.community, //小区
            address: step01.address,  //详细地址
            room: step01.room,   //室
            living: step01.living, //厅
            washing: step01.washing,    //卫
            building: step01.building,  //楼栋号
            unit: step01.unit,   //单元号
            room_number: step01.room_number,    //房间号
            building_area: step01.building, //面积
            direction: step01.direction, //朝向,东|西|南|北, 如: 二进制的1000'表示朝东
            decoration_type: step01.decoration_type,  //装修情况,1-精装 2 中等装修, 3-简装, 4-毛坯
            on_floor: step01.on_floor,   //房源楼层
            total_floor: step01.total_floor,    //总楼层
            elvator: step01.elvator,   //电梯房，0-否，1-是
            rent_mode: step02.rent_mode,  //出租类型，1整租  2合租
            tag: step02.tag,  //房源类型， 各标签id使用英文逗号连接
            rent_period: step02.rent_period,  //起租租期，1-长租(年) / 2-短租(月付) / 3-短租(日付) /4 -7天/5 -15天/6 -3个月/7- 6个月
            price: step02.price,  //租金
            pay_type: step02.pay_type,    //付款方式， 1-月付 / 2-季付 / 3-年付 / 4-多种 / 5-日付/ 6-2月付/7-半年付
            deposit_type: step02.deposit_type,  //押金方式，0-无需押金， 月份 1 2 3， 4为自定义押金
            deposit_price: step02.deposit_price,    //押金金额
            commission_price: step02.commission_price,  //佣金金额，（租金*佣金比例）
            checkin_time: step02.checkin_time,  //最早入住时间

            house_pics: house_pics,    //房源图片
            add_house_pics: imgListShort,    //新增的房源图片
            del_house_pics: imgListShortDelete,   //删除的房源图片
            house_cover: house_cover,   //房源封面的图片地址，没有则传空

            device_id: device_id,    //多个设施ID之间使用英文逗号连接

            safe: safe,  //安心住,0-非安心住，1-安心住
            safe_pic: safe_pic, //安心住房源图片
            add_safe_pic: imgListShort01,  //新增安心住房源证书图片
            del_safe_pic: imgListShortDelete01,  //本次编辑删除的安心住图片

            real_house: real_house, //真房源，0-否，1-是
            real_house_pic: real_house_pic, //真房源图片
            add_pic: imgListShort02,    //新增的房产证图片
            del_pic: imgListShortDelete02,    //删除的房产证图片
            one: one,    //出租超1年,0-否，1-是
            first_rent: first_rent,     //首次出租，0-否，1-是
            direct_rent: direct_rent,    //房东直租租，0-否，1-是
            house_desc: house_desc,  //房源简介
            user_name: user_name,    //联系人
            user_phone: user_phone,  //联系电话
            credit: credit, //加入芝麻信用免押金，0-否,1-是
            pay_one: pay_one, //加入芝麻信用押一付，0-否,1-是*/
          }
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'token': token,
        },
        success: function (res) {
          console.log(res, '11111');
          if (res.data.ret == 1) {
            wx.showToast({
              title: res.data.content,
              icon: 'loading',
              duration: 1000
            });
            that.setData({
              btnShow: false,
            })
          }
          else {
            wx.removeStorageSync('house_id');
            wx.removeStorageSync('tagTab');
            wx.removeStorageSync('step1');
            wx.removeStorageSync('step2');
            wx.showToast({
              title: res.data.content,
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1200);
            that.setData({
              btnShow: false,
            })
          }
        }
      })
    }
    else{
      var step3 = {
        house_pics: house_pics,    //房源图片地址
        house_cover: house_cover,   //房源封面的图片地址，没有则传空
        device_id: device_id,    //多个设施ID之间使用英文逗号连接
        safe: safe,  //安心住,0-非安心住，1-安心住
        safe_pic: safe_pic,  //如果用户选择安心住，此参数值为安心住房源证书图片
        real_house: real_house, //真房源，0-否，1-是
        real_house_pic: real_house_pic,    //房产证图片
        one: one,    //出租超1年,0-否，1-是
        first_rent: first_rent,     //首次出租，0-否，1-是
        direct_rent: direct_rent,    //房东直租租，0-否，1-是
        house_desc: house_desc,  //房源简介
        user_name: user_name,    //联系人
        user_phone: user_phone,  //联系电话
        credit: credit, //加入芝麻信用免押金，0-否,1-是
        pay_one: pay_one //加入芝麻信用押一付，0-否,1-是
      }

      that.setData({
        btnShow: true,
      })
      //请求接口
      wx.request({
        url: url3,
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
          step: 3,
          house_id: house_id,
          step1: step1,
          step2: step2,
          step3:step3,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'token': token,
        },
        success: function (res) {
          console.log(res, '11111');
          if(res.data.ret==1){
            wx.showToast({
              title: res.data.content.msg,
              icon: 'loading',
              duration: 1000
            });
            that.setData({
              btnShow: false,
            })
          }
          else{
            wx.removeStorageSync('house_id');
            wx.removeStorageSync('tagTab');
            wx.removeStorageSync('step1');
            wx.removeStorageSync('step2');
            wx.showToast({
              title: res.data.content.msg,
              icon: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1200);
            that.setData({
              btnShow: false,
            })
          }
        }
      })
    }
  },
  //验证手机号
 /* validatemobile: function (mobile) {
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入带看人电话！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }*/
    /*if (mobile.length != 11) {
      wx.showToast({
        title: '手机号码长度有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }*/
    //var myreg = /^(1[34578]\d{9})$/;
    /*var myreg1 = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var re2 = /^(400-([0-9]){1}([0-9-]{6})([0-9]){1})$/;
    console.log(myreg1.test(mobile), re2.test(mobile), '11111111')
    if ((myreg1.test(mobile)) || (re2.test(mobile))) {
      return true;
    }
    else{
      wx.showToast({
        title: '电话号码有误！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
  },*/

  //自动生成
  textareaTap: function () {
    var that=this;
    console.log('111')
    that.autoMakeHouseDesc();
    var house_desc = that.data.args;
    console.log(house_desc);
    that.setData({
      house_desc: house_desc,
    })
  },
  //自动生成文案
  autoMakeHouseDesc: function () {
    var district = wx.getStorageSync('district');
    var business = wx.getStorageSync('business');
    var house_desc = '';
    var house_resource_desc = [
      "1.房屋精装修，房子非常干净，室内统一配置品牌家具家电、接入高速wifi，随时可看房，可随时入住。",
      "1.实景拍摄！紧邻地铁！随时看房！现代简约的室内装潢风格，品牌家具家电，给您带来别致的居住享受，真正的宜居简约不简单。",
      "1.此房格局方正，朝向好，阳光非常充足，面积使用率超高，客厅宽敞大气，简约精装修，提包入住。",
      "1.房间装修精美、环境也干净舒适不吵杂，家电家具齐全，随时拎包入住，住的大多数都是年轻人。",
      "1.屋内家电家具配套齐全，朝向好，房子保养的很不错，随时看房，随时可以签约，随时可以入住。"
    ];
    var house_community_desc = [
      "2.位于" + district + "区" + business+"板块，紧邻核心地段，步行可至地铁占，用“入则宁静,出则繁华”来形容此小区一点也不假。",
      "2.小区环境不错，楼栋采光非常好，前后均无遮挡。周围邻居也很和善，小区有便利店生活也是非常方便的。",
      "2.位于" + district + "区" + business +"板块，中心地段，高品质小区，居住人群素质高，花园式小区，闹中取静。",
      "2.社区环境好，环境优美，适宜居住，人文素质高，物业管理完善；小区的容积率非常小，属于低密度社区，非常适宜居住。",
      "2.小区绿化高，车停车充足、周边配套设施一应俱全，附近有超市菜场购物方便，让您更加舒适的享受生活。",
      "2.风景宜人，小区安静有保安，安全有保障。小区公共设施齐全，配套完善，为您高品质的生活提供贴心的服务。",
    ];
    var house_surround_desc = [
      "3.小区周边配套设施齐全，地理位置优越，离地铁站、公交站都很近、出行是相当方便、可以省去你很多宝贵时间。",
      "3.交通便利，小区门口有多路公交，步行可到地铁站。抬腿即到公交站，早上可以多睡一会；看房随时联系，随时入住。",
      "3.周边配套设施完善，交通很是便利，骑车几分钟就到地铁口！步行几分钟就到菜市，生活娱乐真是超级方便的。",
      "3.交通便利，地铁公交任您选择；房屋周围设施齐全，菜市场、超市、诊所、各种餐馆、网咖、理发店等等应有尽有，相当便利。",
      "3.周边拥有成熟优越的配套设置，高档小区，优雅的小区环境，优质的物业管理，便捷的交通，让您的出行更加方便、快捷、安全。",
    ];
    var a = this.randomNum(5);
    var b = this.randomNum(6);
    var c = this.randomNum(5);
    console.log(a + "--" + b + "---" + c);
    var args = house_resource_desc[a - 1] + "\n" + house_community_desc[b - 1] + "\n" + house_surround_desc[c - 1];
    //var house_desc = args;
    console.log(args,'args');
    this.setData({
      args: args,
      //house_desc: house_desc,
    }) 
  },
  //生成从1到num的随机数
  randomNum:function(num) {
    return parseInt(Math.random() * (num) + 1, 10);
  },
})