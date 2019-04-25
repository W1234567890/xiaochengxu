// pages/index/list/upload/upload01.js
var app = getApp();
var url = app.globalDataJson.gyjProductBase + "pc/house_upload/get_draft";
var url1 = app.globalDataJson.gyjProductBase + "miniapi/house_upload/house_param";
var url2 = app.globalDataJson.gyjProductBase + "miniapi/house_operate/drop";
var url3 = app.globalDataJson.gyjProductBase + "miniapi/house_upload";
var url4 = app.globalDataJson.gyjProductBase + "miniapi/house_edit";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray: [],
    cityIndex:[0],
    multiArray: [['请选择', '1', '2', '3', '4', '5', '6', '7', '8', '9'], '室', ['请选择', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], '厅', ['请选择', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],'卫'],
    lookData: ['请选择', '东', '西', '南', '北', '南北'],
    decorationData:['请选择','精装','中等装修','简装','毛坯'],
    index: 0,
    multiIndex: [0],
    lookIndex:0,
    decorationIndex: 0,
    condition: false,
    city: '',
    county: '',
    cityNum: '',
    countyNum: '',
    switchElvator:false,

    directionNum:'',
    elvator:0,

    editNum:'',
    houseTypeDataValue:[],
    //step02
    depositIndex:0,

    /**提示隐藏 */
    cityShow:true,
    scrollTop:0,
    addressShow:true,
    buildingShow:true,
    roomNumberShow:true,
    roomShow:true,
    directionShow:true,
    onFloorShow:'none',
    totalFloorShow: 'none',  
    buildingAreaShow: true,
    decorationTypeShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var editNum = options.editNum;
    var houseId = options.house_id;
    console.log(editNum, 'editNum')
    this.setData({
      editNum: editNum,
      houseId: houseId,
    })
  },
  onShow: function (options) {
    var editNum = this.data.editNum;
    console.log(editNum, 'editNum')
    this.setData({
      editNum: editNum,
    })
    wx.setStorageSync('house_cover', ''); 
      this.listTap();
  },


  //城市切换 
  bindDateStartChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //户型 
  bindMultiPickerChange(e) {
    console.log(e)
    var multiIndex1 = e.detail.value[0];
    if (multiIndex1 != 0) {
      this.setData({
        multiIndex: e.detail.value,
      })
    }
  },

  //朝向 
  bindDateLookChange: function (e) {
    console.log(e,'llllll')
    if (e.detail.value==1){
      var directionNum = '1000'
    }
    else if (e.detail.value ==2) {
      var directionNum = '0100'
    }
    else if (e.detail.value ==3) {
      var directionNum = '0010'
    }
    else if (e.detail.value == 4) {
      var directionNum = '0001'
    }
    else if (e.detail.value == 5) {
      var directionNum = '0011'
    }
    else {
      var directionNum = '请选择';
    }
    this.setData({
      lookIndex: e.detail.value,
      directionNum: directionNum,
    })
  },
  //装修情况 
  bindDateDecorationChange: function (e) {
    this.setData({
      decorationIndex: e.detail.value
    })
  },
  //电梯房
  switch2Change:function(e){
    console.log(e);
    if(e.detail.value==true){
      var elvator=1;
    }
    else {
      var elvator = 0;
    }
    this.setData({
      elvator: elvator,
    })
  },
  //获取草稿
  draftTap: function () {
    var that = this;
    var cityArray = that.data.cityArray;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
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
        console.log(res.data,'pc');
        //是否是草稿
        var is_draft = res.data.content.is_draft;
        if (is_draft==0){
          var multiIndex = [0];
          var community_name='';
          var address='';
          var on_floor = '';
          var total_floor = ''; 
          that.setData({
            multiIndex: multiIndex,
            community_name: community_name,
            address: address,
            on_floor: on_floor,
            total_floor: total_floor,
          })
        }
        console.log('222');
        //房源id
        var house_id = res.data.content.house_id;
        wx.setStorageSync('house_id', house_id);
        //小区
        var community_name = res.data.content.community_name;
        //详细地址
        var address = res.data.content.address;
        //楼栋门牌
        if (res.data.content.building == 0 || !res.data.content.building) {
          var building = '';
        }
        else {
          var building = res.data.content.building;
        }
        if (res.data.content.unit == 0 || !res.data.content.unit)
        {
          var unit ='';
        }
        else {
          var unit = res.data.content.unit;
        }

        if (res.data.content.room_number == 0 || !res.data.content.room_number) {
          var room_number = '';
        }
        else {
          var room_number = res.data.content.room_number;
        }
        //户型
        var room = res.data.content.room;
        var living = res.data.content.living;
        var washing = res.data.content.washing;
        var multiIndex = that.data.multiIndex;
        console.log(room, living, washing, 'washing')
        if (room == 0 || !room) {
          multiIndex = [0, 0];
          console.log(multiIndex, 'multiIndex')
        }
        else {
          multiIndex = [room, 0, living+1, 0, washing+1, 0];
          console.log(multiIndex, 'multiIndex')
        }
        //朝向
        var direction = res.data.content.direction;
        var directionNum = res.data.content.direction;
        if (direction=='1000')
        {
          var lookIndex=1;
        }
        else if (direction == '0100')
        {
          var lookIndex = 2;
        }
        else if (direction == '0010') {
          var lookIndex = 3;
        }
        else if (direction == '0001') {
          var lookIndex = 4;
        }
        else if (direction == '0011') {
          var lookIndex = 5;
        }
        else {
          var lookIndex = 0;
        }
        console.log(lookIndex,'lookIndex')
        //楼层
        var on_floor = res.data.content.on_floor;
        if (res.data.content.total_floor==0){
          var total_floor = '';
        }
        else {
          var total_floor = res.data.content.total_floor;
        }
        //面积
        if (res.data.content.building_area == 0.00 || !res.data.content.building_area){
          var building_area = '';
        }
        else {
          var building_area = res.data.content.building_area;
        }
        //装修
        if (!res.data.content.decoration_type){
          var decorationIndex = 0;
        }
        else {
          var decorationIndex = res.data.content.decoration_type;
        }
        console.log(decorationIndex, 'decorationIndex')
        //电梯房
        var elvator = res.data.content.elvator;
        if (elvator==0){
          var switchElvator=false;
        }
        else {
          var switchElvator = true;
        }
        //房源类型
        var tagTab = res.data.content.tag;
        console.log(tagTab,'tagTab001')
        wx.setStorageSync('tagTab', tagTab);
        that.setData({
          is_draft: is_draft,
          house_id: house_id,
          community_name: community_name,
          address: address,
          building: building,
          unit: unit,
          room_number: room_number,
          room: room,
          living: living,
          washing: washing,
          multiIndex: multiIndex,
          lookIndex: lookIndex,
          direction: direction,
          directionNum: directionNum,
          on_floor: on_floor,
          total_floor: total_floor,
          building_area: building_area,
          decorationIndex: decorationIndex,
          switchElvator: switchElvator,
          elvator: elvator,
        }) //城市
        var city_id = res.data.content.city_id;
        var district_id = res.data.content.district_id; 
        var cityNum = res.data.content.city_id;
        var countyNum = res.data.content.district_id;
        for (var i = 0; i < cityArray.length; i++) {
          if (city_id == cityArray[i].value) {
            var city = cityArray[i].label;
            for (var j = 0; j < cityArray[i].children.length; j++) {
              if (district_id == cityArray[i].children[j].value) {
                var county = cityArray[i].children[j].label;
                that.setData({
                  city_id: city_id,
                  district_id: district_id,
                  city: city,
                  county: county,
                  cityNum: cityNum,
                  countyNum: countyNum,
                })
                return false;
              }
              else {
                var county = ''
              }
            }
            return false;
          }
          else {
            var city = ''
            console.log(city, 'city2')
          }
        } 
        that.setData({
          city: city,
          county: county,
          house_id: house_id,
        }) //城市
      }
    })
  },
  //获取房源信息
  houseTap: function () {
    var that = this;
    var cityArray = that.data.cityArray;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var house_id = that.data.houseId;
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
        house_id: house_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json",
        token: token,
      },
      success: function (res) {
        console.log(res.data,'houseEdit')
        //城市
        var cityNum = res.data.content.city_id;
        var countyNum = res.data.content.district_id;
        for (var i = 0; i < cityArray.length;i++){
          if (cityNum == cityArray[i].value)
          {
            var city = cityArray[i].label;
            for (var j = 0; j < cityArray[i].children.length;j++){
              if (countyNum == cityArray[i].children[j].value)
              {
                var county = cityArray[i].children[j].label;
              }
            } 
          }
        }
        //小区名称
        var community_name = res.data.content.community_name;
        //地址
        var address = res.data.content.address;
        //楼栋门牌
        var building = res.data.content.building;
        var unit = res.data.content.unit;
        var room_number = res.data.content.room_number;
        //户型
        var multiIndex = [res.data.content.room, 0, res.data.content.living+1, 0, res.data.content.washing+1];
        //朝向
        var directionNum = res.data.content.direction;
        if (directionNum =='1000') {
          var lookIndex=1;
        }
        else if (directionNum == '0100') {
          var lookIndex = 2;
        }
        else if (directionNum == '0010') {
          var lookIndex = 3;
        }
        else if (directionNum == '0001') {
          var lookIndex = 4;
        }
        else if (directionNum == '0011') {
          var lookIndex = 5;
        }
        else {
          var lookIndex = 0;
        }
        //楼层
        var on_floor = res.data.content.on_floor;
        var total_floor = res.data.content.total_floor;
        //面积
        var building_area = res.data.content.building_area;
        //装修情况
        var decorationIndex = res.data.content.decoration_type;
        //电梯房
        var elvator = res.data.content.elvator;
        if (elvator==1){
          var switchElvator=true;
        }
        else{
          var switchElvator=false;
        }

        //step02
        //出租类型
        var rentDataIndex = res.data.content.rent_mode;
        //房源类型
        var houseTypeDataValue = that.data.houseTypeDataValue;
        console.log(res.data.content.tag,'res.data.content.tag')
        for (var i = 0; i < houseTypeDataValue.length;i++){
          if (res.data.content.tag == houseTypeDataValue[i]) {
            var houseTypeIndex = i;
            break;
          }
          else{
            var houseTypeIndex=-1;
          }
        }
        //起租租期
        var timeIndex = res.data.content.rent_period;
        //付款方式
        var payIndexNum = res.data.content.pay_type;
        if (payIndexNum>=5){
          var payIndex = payIndexNum-1;
        }
        else {
          var payIndex = payIndexNum;
        }
        //租金
        var price = res.data.content.price;
        //押金方式
        var depositIndex = res.data.content.deposit_type
        if (payIndexNum == 5) {
          if (depositIndex == 1) {
            var depositIndex5 = 4;
          }
          else {
            var depositIndex5 = 0;
          }
          this.setData({
            depositIndex5: depositIndex5,
          })
        }
        //押金金额
        var deposit_price = res.data.content.deposit_price;
        //佣金比例
        var commission_price = res.data.content.commission_price;
        //最早可入住时间
        var date = res.data.content.checkin_time;

        var step02 = {
          //出租类型
          rentDataIndex: rentDataIndex,
          //房源类型
          houseTypeIndex: houseTypeIndex,
        //起租租期
          timeIndex: timeIndex,
        //付款方式
          payIndexNum: payIndexNum,
          payIndex: payIndex,
        //租金
          price: price,
        //押金方式
          depositIndex: depositIndex,
          depositIndex5: depositIndex5,
        //押金金额
          deposit_price: deposit_price,
        //佣金比例
          commission_price: commission_price,
        //最早可入住时间
          date: date,
        }
        wx.setStorageSync('step02', step02);

        //step03
        //房源图片
        var imgList = res.data.content.house_pics;
        var house_cover = res.data.content.house_cover;
        //房源配置
        var device_id = res.data.content.device_id;
        //房源特色
        var first_rent = res.data.content.first_rent;
        var one = res.data.content.one;
        var direct_rent = res.data.content.direct_rent;
        var safe = res.data.content.safe;
        var imgList01 = res.data.content.safe_pic;
        var real_house = res.data.content.real_house;
        var imgList02 = res.data.content.real_house_pic;
        //房源描述
        var house_desc = res.data.content.house_desc;
        //芝麻信用推广
        var credit = res.data.content.credit;
        var pay_one = res.data.content.pay_one;
        //带看联系人
        var user_name = res.data.content.user_name;
        //联系电话
        var user_phone = res.data.content.user_phone;

        var step03 = {
          //房源图片
          imgList: imgList,
          house_cover: house_cover,
          //房源配置
          device_id: device_id,
          //房源特色
          first_rent: first_rent,
          one: one,
          direct_rent: direct_rent,
          imgList01: imgList01,
          safe: safe,
          imgList02: imgList02,
          real_house: real_house,
          //房源描述
          house_desc: house_desc,
          //芝麻信用推广
          credit: credit,
          pay_one: pay_one,
          //带看联系人
          user_name: user_name,
          //联系电话
          user_phone: user_phone,
          }
        console.log(step03, 'step0301')
        wx.setStorageSync('step03', step03);

        that.setData({
          cityNum: cityNum,
          countyNum: countyNum,
          city: city,
          county: county,
          community_name: community_name,

          address: address,

          building: building,
          unit: unit,
          room_number: room_number,
          multiIndex: multiIndex,

          directionNum: directionNum,
          lookIndex: lookIndex,

          on_floor: on_floor,
          total_floor: total_floor,

          building_area: building_area,

          decorationIndex: decorationIndex,
          elvator: elvator,
          switchElvator: switchElvator,
        })

      }
    })
  },
  //获取房源设施，标签，省市联动数据列表
  listTap: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var g_uid = wx.getStorageSync('g_uid');
    var cityArray = that.data.cityArray;
    var editNum = that.data.editNum;
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
        var cityArray = res.data.content.city; 
        var houseTypeDataValue = that.data.houseTypeDataValue;
        for (var i = 0; i < res.data.content.tag.length; i++) {
          houseTypeDataValue.push(res.data.content.tag[i].id);
        }
        console.log(houseTypeDataValue,'houseTypeDataValue')
        that.setData({
          cityArray: cityArray,
          houseTypeDataValue: houseTypeDataValue,
        })
        if (editNum == 1) {
          that.houseTap();
        }
        else {
          that.draftTap();
          wx.setStorageSync('step01', '');
          wx.setStorageSync('step02', '');
          wx.setStorageSync('step03', '');   
        }
      }
    })
  },
  //城市选择
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  open: function (e) {
    console.log(e,'eeee')
    var county = this.data.county;
    console.log(county,'county')
    if (county == '黄浦区' || !county)
    {
      var city = '上海市';
      var county = '黄浦区';
      var cityNum = '802';
      var countyNum = '803';
    }
    else {
      var city = this.data.city;
      var county = this.data.county;
      var cityNum = this.data.cityNum;
      var countyNum = this.data.countyNum;
    }
    this.setData({
      condition: !this.data.condition,
      index: 0,
      city: city,
      county: county,
      cityNum: cityNum,
      countyNum: countyNum,
    })
  },
  cityTap:function(e){
    var cityArray = this.data.cityArray;
    var index=e.detail.value[0];
    var index1 = e.detail.value[1];
    var city = cityArray[index].label;
    var county = cityArray[index].children[index1].label;
    var cityNum = cityArray[index].value;
    var countyNum = cityArray[index].children[index1].value;
    console.log(city, county, cityArray,'11111111111111')
    this.setData({
      index: index,
      index1: index1,
      city: city,
      county: county,
      cityNum: cityNum,
      countyNum: countyNum,
    })
  },
  //重置
  resetTap:function(){
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
        wx.removeStorageSync('house_id');
        wx.removeStorageSync('tagTab');
        wx.removeStorageSync('step1');
        wx.removeStorageSync('step2');
        that.listTap();
       /* wx.navigateTo({
          url: '/pages/index/list/upload/upload01',
        })*/
      }
    })
  },
  //下一页
  formSubmit: function (e) {
    var that = this;
    var city_id = e.detail.value.city_id;
    var district_id = e.detail.value.district_id;
    console.log(house_id, '111')
    if (city_id == "") {
      /*wx.showToast({
        title: '请选择城市',
        icon: 'loading',
        duration: 1500
      });*/
      var cityShow = false;
      that.setData({
        cityShow: cityShow,
        scrollTop:0,
      })
      console.log(cityShow,'cityShow')
      return false;
    }
    else {
      that.setData({
        cityShow: true,
      })
    }
    var community_name = e.detail.value.community_name;
    /*if (community_name == "") {
      wx.showToast({
        title: '请填写小区名称',
        icon: 'loading',
        duration: 1500
      });
      return false;
    }*/
    var address = e.detail.value.address;
    if (address == "") {
      /*wx.showToast({
        title: '请填写详细地址',
        icon: 'loading',
        duration: 1500
      });*/
      var addressShow = false;
      that.setData({
        addressShow: addressShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        addressShow: true,
      })
    }
    var building = e.detail.value.building;
    if (building == "") {
      /*wx.showToast({
        title: '请填写栋',
        icon: 'loading',
        duration: 1500
      });*/

      var buildingShow = false;
      that.setData({
        buildingShow: buildingShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        buildingShow: true,
      })
    }
    var unit = e.detail.value.unit;
    var room_number = e.detail.value.room_number;
    if (room_number == "") {
      /*wx.showToast({
        title: '请填写室',
        icon: 'loading',
        duration: 1500
      });*/
      var roomNumberShow = false;
      that.setData({
        roomNumberShow: roomNumberShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        roomNumberShow: true,
      })
    }
    var room = e.detail.value.room;
    var living = e.detail.value.living;
    var washing = e.detail.value.washing;
    if (room == "请选择") {
      /*wx.showToast({
        title: '请选择户型',
        icon: 'loading',
        duration: 1500
      });*/
      var roomShow = false;
      that.setData({
        roomShow: roomShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        roomShow: true,
      })
    }
    var direction = e.detail.value.direction;
    console.log(direction, 'direction')
    if (direction == "请选择" || !direction) {
      /*wx.showToast({
        title: '请选择朝向',
        icon: 'loading',
        duration: 1500
      });*/
      var directionShow = false;
      that.setData({
        directionShow: directionShow,
        scrollTop: 0,
      })
      return false;
    }
    else {
      that.setData({
        directionShow: true,
      })
    }
    var on_floor = e.detail.value.on_floor;
    var total_floor = e.detail.value.total_floor;
    if (on_floor == "") {
      /*wx.showToast({
        title: '请填写楼层',
        icon: 'loading',
        duration: 1500
      });*/
      var onFloorShow = 'block';
      that.setData({
        onFloorShow: onFloorShow,
      })
      return false;
    }
    else {
      that.setData({
        onFloorShow:'none',
      })
    }
    if (total_floor == "") {
      /*wx.showToast({
        title: '请填写楼层',
        icon: 'loading',
        duration: 1500
      });*/
      var totalFloorShow = 'block';
      that.setData({
        totalFloorShow: totalFloorShow,
      })
      return false;
    }
    else {
      that.setData({
        totalFloorShow: 'none',
      })
    }
    if (on_floor == 0 || total_floor == 0) {
      wx.showToast({
        title: '楼层不能为0',
        icon: 'none',
        duration: 1500
      });
      return false;
    }
    var building_area = e.detail.value.building_area;
    if (building_area == "") {
      /*wx.showToast({
        title: '请填写面积',
        icon: 'loading',
        duration: 1500
      });*/
      var buildingAreaShow = false;
      that.setData({
        buildingAreaShow: buildingAreaShow,
      })
      return false;
    }
    else {
      that.setData({
        buildingAreaShow: true,
      })
    }
    var decoration_type = e.detail.value.decoration_type;
    console.log(decoration_type,'decoration_type')
    if (decoration_type == "请选择" || decoration_type==0) {
      /*wx.showToast({
        title: '请选择装修情况',
        icon: 'loading',
        duration: 1500
      });*/
      var decorationTypeShow = false;
      that.setData({
        decorationTypeShow: decorationTypeShow,
      })
      return false;
    }
    else {
      that.setData({
        decorationTypeShow: true,
      })
    }
    var elvator = e.detail.value.elvator;  
    var editNum = that.data.editNum;
    var houseId = that.data.houseId;
    if (editNum == 1) {
      var house_id = that.data.houseId;
      var step01 = {
        city_id: city_id,  //城市
        district_id: district_id,  //行政区
        community: community_name, //小区
        address: address,  //详细地址
        room: room,   //室
        living: living, //厅
        washing: washing,    //卫
        building: building,  //楼栋号
        unit: unit,   //单元号
        room_number: room_number,    //房间号
        building_area: building_area, //面积
        direction: direction, //朝向,东|西|南|北, 如: 二进制的1000'表示朝东
        decoration_type: decoration_type,  //装修情况,1-精装 2 中等装修, 3-简装, 4-毛坯
        on_floor: on_floor,   //房源楼层
        total_floor: total_floor,    //总楼层
        elvator: elvator,   //电梯房，0-否，1-是
      }
      console.log(step01, 'step01');
      //step01
      wx.setStorageSync('step01', step01); 
      setTimeout(function () {
        wx.navigateTo({
          url: 'upload02/upload02?editNum=' + editNum + '&houseId=' + houseId,
        })
      }, 1000);
    }
    else {
      var house_id = wx.getStorageSync('house_id');
      var token = wx.getStorageSync('token');
      var openid = wx.getStorageSync('openid');
      var g_uid = wx.getStorageSync('g_uid');
      var step1 = {
        city_id: city_id,  //城市
        district_id: district_id,  //行政区
        community: community_name, //小区
        address: address,  //详细地址
        room: room,   //室
        living: living, //厅
        washing: washing,    //卫
        building: building,  //楼栋号
        unit: unit,   //单元号
        room_number: room_number,    //房间号
        building_area: building_area, //面积
        direction: direction, //朝向,东|西|南|北, 如: 二进制的1000'表示朝东
        decoration_type: decoration_type,  //装修情况,1-精装 2 中等装修, 3-简装, 4-毛坯
        on_floor: on_floor,   //房源楼层
        total_floor: total_floor,    //总楼层
        elvator: elvator,   //电梯房，0-否，1-是
      }
      //step1
      wx.setStorageSync('step1', step1);
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
          step: 1,
          house_id: house_id, 
          step1: step1,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'token':token,
        },
        success: function (res) {
          console.log(res, '11111');
          that.setData({
            step1: step1,
          })
          if (res.data.ret == 0) {
            wx.showToast({
              title: res.data.content.msg,
              icon: 'loading',
              duration: 1000
            });
            //商圈板块
            wx.setStorageSync('district', res.data.content.district);
            wx.setStorageSync('business', res.data.content.business);
            setTimeout(function () {
              wx.navigateTo({
                url: 'upload02/upload02?step1=' + step1,
              })
            }, 1200);
          }
          else{
            wx.showToast({
              title: res.data.content.msg,
              icon: 'loading',
              duration: 1000
            });
          }
        }
      })
    }
  },
})