<template>
  <div class="div_list">
    <p class="rentBg" v-if="rentBg" @click="rentBgBtn"></p>
    <div class="topRent" :class="rentBg?'cur':''">
      <div class="TitleTop">
        <div class="cw">
          <input type="hidden" name="chargeone" id="chargeone" value="1">
          <input type="hidden" name="nocharge" id="nocharge" value="2">
          <a href="javascript:;" class="titleLeft" @click="filterBtnSelectCity()">
            <img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/addressIcon.png" width="24" class="addressImg">{{select_city}}
            <img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/down.png" width="20" class="addressImg1"></a>
          <span>租房</span>
          <a href="javascript:;" class="titleRight" @click="logBtn()"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/personIcon.png" height="24"></a>
        </div>
      </div>
      <div class="rentTabList" v-if="filterBtnCity">
        <ul class="cw">
          <li v-for="(item,index) in city_name_arr" :key="index" class="li_count" @click="clickCitySelect(index,item)">
            <a href="javascript:;">{{item.label}}</a>
          </li>
        </ul>
      </div>
      <p class="titleLine"></p>
      <div class="rentTitleList">
        <table>
          <tr>
            <th><a href="javascript:;" @click="filterBtn01"><span :class="filterBtnArea?'cur':''">{{title_house_region}}</span></a></th>
            <td><a href="javascript:;" @click="filterBtn02"><span :class="filterBtnRoom?'cur':''">{{title_house_type}}</span></a></td>
            <th><a href="javascript:;" @click="filterBtn03"><span :class="filterBtnPrice?'cur':''">{{title_house_price}}</span></a></th>
          </tr>
        </table>
        <div class="rentTabList" v-if="filterBtnArea">
          <ul class="cw">
            <li v-for="(item,index) in city_district_arr" :key="index" class="li_count" @click="clickDistrictSelect(index,item)">
              <a href="javascript:;">{{item.label}}</a>
            </li>
          </ul>
        </div>
        <div class="rentTabList" v-if="filterBtnRoom">
          <ul class="cw">
            <li v-for="(item,index) in house_type_arr" :key="index" class="li_count" @click="clickHouseType(index,item)">
              <a href="javascript:;">{{item}}</a>
            </li>
          </ul>
        </div>
        <div class="rentTabList" v-if="filterBtnPrice">
          <ul class="cw">
            <li v-for="(item,index) in price_arr" :key="index" class="li_count" @click="clickPriceSelect(index,item)">
              <a href="javascript:;">{{item}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <h4 class="searchH4" style="display: none;"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/search.png">未能找到您筛选的房源 </h4>
    <div class="div_house_list">
      <ul v-infinite-scroll="loadList" infinite-scroll-disabled="isLoading" infinite-scroll-distance="10">
        <li v-for="(item, key) in houseList" :key="key" class="div_item" style="overflow:hidden;">
          <div @click="func(item.house_id)">
            <a href="javascript:;">
              <div class="imgTop">
                <img :src="pic_host+item.cover_pic+'@!form_s_w'" class="collectImg">
                <h5>{{item.price}}</h5>
              </div>
              <h4>
                <em>{{item.title}}</em>
                <span class="zmGreen"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/zmIcon.png" width="15" v-show="item.pay_one==1">芝麻信用</span>
              </h4>
              <p>{{item.subtitle}}</p>
              <p>{{item.address}}</p>
            </a>
          </div>
        </li>
      </ul>
      <p v-show="loading_isshow" style="width:90%;height:20px;color:#f00;text-align:center;font-size:18px;">
        加载中...
      </p>

    </div>

  </div>
</template>

<script>
  import $ from "jquery";
  import axios from "axios";
  import * as API from "../api/api.js";
  import "../css/list.css"
  import getUrlParams from "../utils/getUrlParams.js";
  import {
    throws
  } from 'assert';
  export default {
    data() {
      return {
        g_uid: 12,
        pic_host: "",
        filterBtnCity: false,
        filterBtnArea: false,
        filterBtnRoom: false,
        filterBtnPrice: false,
        rentBg: false,
        loading_isshow: false,
        title: '房源列表',
        page: 1,
        pageSize: 5,
        pageNumber: 1,
        houseList: [],
        area_code: "021",
        select_city: "上海市",
        title_house_region: "区域",
        district_id: 0,
        title_house_type: "房型",
        title_house_price: "价格",
        city_name_arr: [],
        city_district_arr: [],
        city_all_arr: [],
        house_type_arr: [
          "全部", "一室", "二室", "三室", "四室及以上",
        ],
        price_arr: [
          "全部", "￥3999以下", "￥4000-￥6000", "￥6001-￥10000", "￥10001及以上",
        ],
        house_type_select: 0,
        house_price_top_select: 0,
        house_price_bottom_select: 0,
        isLoading: true,
      }
    },
    created() {
      var g_uid = localStorage.getItem('g_uid');
      if ((g_uid != null) && (g_uid != "")) {
        this.g_uid = localStorage.getItem('g_uid'); //用户token
      }
    },
    mounted() {
      this.pic_host = API.hostSafePicShow;
      var status = getUrlParams.getUrlParams().status;
      if (status != null) {
        if (status == 1) {
          var city = getUrlParams.getUrlParams().city;
          this.select_city = city;
          this.setCity();
          this.isLoading = false;
          this.getCityData();
        } else if (status == 2) {
          var city = getUrlParams.getUrlParams().city;
          var price_top = getUrlParams.getUrlParams().price_top;
          if (price_top != null) {
            this.house_price_top_select = price_top
          }

          var price_bottom = getUrlParams.getUrlParams().price_bottom;
          if (price_bottom != null) {
            this.house_price_bottom_select = price_bottom
          }
          this.select_city = city;
          this.setCity();
          this.isLoading = false;
          this.getCityData();
        }
      } else {
        this.getLocation();
      }

    },
    methods: {
      //房屋户型选择
      clickHouseType(index, item) {
        this.house_type_select = index;
        this.title_house_type = item;
        this.filterBtn02();
        this.pageNumber = 1;
        this.houseList = [];
        this.loadList();
      },
      //城市选择
      clickCitySelect(index, item) {
        this.select_city = item.label;
        this.filterBtnSelectCity();
        this.setCity();
        this.setDistrictData(index);
        this.pageNumber = 1;
        this.houseList = [];
        this.loadList();
      },

      setDistrictData(index) {
        this.city_district_arr = this.city_all_arr[index].children;
        var obj = new Object();
        obj.value = 0;
        obj.label = "全部"
        if ((this.city_district_arr[0].label) != "全部") {
          this.city_district_arr.unshift(obj)
        }
      },
      //区域选择
      clickDistrictSelect(index, item) {
        this.filterBtn01();
        this.title_house_region = item.label;
        this.district_id = item.value;
        this.pageNumber = 1;
        this.houseList = [];
        this.loadList();
      },
      setCity() {
        var city = this.select_city;
        switch (city) {
          case "上海市": //上海
            this.area_code = "021";
            break;
          case "北京市": //北京
            this.area_code = "010";
            break;
          case "广州市": //广州
            this.area_code = "020";
            break;
          case "深圳市": //深圳
            this.area_code = "0755";
            break;
          case "成都市": //成都
            this.area_code = "028";
            break;
          case "杭州市": //杭州
            this.area_code = "0571";
            break;
          default: //上海
            this.area_code = "021";
            break;
        }
      },
      //价格选择
      clickPriceSelect(index, item) {
        this.title_house_price = item;
        this.filterBtn03();
        switch (index) {
          case 0:
            this.setPrice(0, 0);
            break;
          case 1:
            this.setPrice(0, 3999);
            break;
          case 2:
            this.setPrice(4000, 6000);
            break;
          case 3:
            this.setPrice(6000, 10000);
            break;
          case 4:
            this.setPrice(10000, 0);
            break;
        }
        this.pageNumber = 1;
        this.houseList = [];
        this.loadList();
      },
      setPrice(small, big) {
        this.house_price_top_select = big;
        this.house_price_bottom_select = small;
      },
      setCityData(cityAll) {
        var cityNameArr = [];
        for (var i = 0; i < cityAll.length; i++) {
          var cityName = new Object()
          var city = cityAll[i];
          cityName.value = city.value;
          cityName.label = city.label;
          cityNameArr.push(cityName);
        }
        this.city_name_arr = cityNameArr;
        this.city_all_arr = cityAll;
        this.setDistrictData(0);
      },
      getCityData() {
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          g_uid: this.g_uid,
        }
        var _this = this;
        axios
          .post(
            API.GET_CITY_DATAS, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              //请求数据成功
              var body = res.data.content;
              var cityAll = body.city;
              if (cityAll) {
                _this.setCityData(cityAll);
              }
            }
          })
          .catch(function (res) {});
      },
      loadList() {
        this.loading_isshow = true;
        var layout = this.house_type_select;
        var price_top = this.house_price_top_select;
        var price_bottom = this.house_price_bottom_select;
        var district_id = this.district_id;
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          g_uid: this.g_uid,
          layout: layout, //户型：0: 不限 1: 一居 2: 两居 3: 三居 4: 四居+
          price_top: price_top, //价格筛选最高价, 为0则为不限
          price_bottom: price_bottom, //价格筛选最低价, 为0则为不限
          area_code: this.area_code,
          district_id: district_id, //行政区id，由握手同步协议下发, 为0则为不限
          price_sort: 1, // 0-不限 1从低到高 2 从高到低
          business_code: 0, //商圈代码，由握手同步协议下发, 为0则为不限
          //包含wiki中的“通用请求参数”
          filter_type: "list", //列表基本筛选规则：
          list_id: "31",
          page_size: this.pageSize, //分页请求的单页的数量
          page: this.pageNumber,
          rent_mode: 0, //租赁方式: 0-不限; 1-整租 ; 2-合租
          keyword: 0, //搜索关键词
          index_house_id: 0, //分页请求的起始房源ID
          direction: "", //方向  东西南北 1000
          location: "", //当keyword搜索是 传个经纬度 可为空
          is_show: 0, //是否显示banner，默认为0不显示，1显示
          subwayline_id: "", //地铁id，不选传0
          station_id: "", //地铁站id，不选传0
          address: "", //用户根据关键词提示选择的完整的地址
        };
        var _this = this;
        axios
          .post(
            API.HOUSELIST, requestData,
          )
          .then(function (res) {
            // _this.loading_isshow = false;
            if (res.data.ret == 0) {
              var body = res.data.content;
              var houseList = body.house_list;
              var len = houseList.length;
              var _list = body.recommend;
              if (len < 1) {
                _list = body.recommend;
              } else {
                _list = houseList;
              }
              if (_list.length < 5) {
                _this.isLoading = true;
              } else {
                _this.isLoading = false;
              }
              console.log(_this.isLoading);
              for (var i = 0; i < _list.length; i++) {
                _this.houseList.push(_list[i]);
              }
              _this.pageNumber++;
            }


          })
          .catch(function (res) {});
      },

      filterBtnSelectCity() {
        if (this.filterBtnCity) {
          this.resetDropDownBox(false, 0);
        } else {
          this.resetDropDownBox(true, 0);
        }
      },
      filterBtn01() {
        if (this.filterBtnArea) {
          this.resetDropDownBox(false, 1);
        } else {
          this.resetDropDownBox(true, 1);
        }
      },
      filterBtn02() {
        if (this.filterBtnRoom) {
          this.resetDropDownBox(false, 2);
        } else {
          this.resetDropDownBox(true, 2);
        }
      },
      filterBtn03() {
        if (this.filterBtnPrice) {
          this.resetDropDownBox(false, 3);
        } else {
          this.resetDropDownBox(true, 3);
        }
      },
      resetDropDownBox(isClear, index) {
        this.filterBtnCity = false;
        this.filterBtnArea = false;
        this.filterBtnRoom = false;
        this.filterBtnPrice = false;
        this.rentBg = false;
        if (isClear) {
          switch (index) {
            case 0:
              this.filterBtnCity = true;
              break;
            case 1:
              this.filterBtnArea = true;
              break;
            case 2:
              this.filterBtnRoom = true;
              break;
            case 3:
              this.filterBtnPrice = true;
              break;
          }
        }

      },
      rentBgBtn() {
        this.filterBtnArea = false;
        this.filterBtnRoom = false;
        this.filterBtnPrice = false;
        this.rentBg = false;
      },
      //跳转详情页
      func(house_id) {
        this.$router.push({
          path: "/detail?houseId=" + house_id
        });
      },
      //跳转登录  	
      logBtn() {
        this.$router.push({
          path: "/login"
        });
      },
      getLocation() {
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
        };
        var _this = this;
        axios
          .post(
            API.LOCATION, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              var url = res.data.content;
              window.location.href = url;
            }
          })
          .catch(function (res) {
            alert("数据输入错误" + res);
          });
      }
    }
  }

</script>
