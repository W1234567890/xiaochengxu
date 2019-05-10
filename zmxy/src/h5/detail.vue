<template>
  <div>
    <div class="bodyBg">
      <div class="slides">
        <div class="slider slider-nav">
          <mt-swipe :show-indicators="false">
            <mt-swipe-item v-for="(item,index) in banner_list" :key="index">
              <img :src="pic_host+item+'@!form_s'" alt="">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <p class="zNum">/12</p>
      </div>
      <!--banner结束-->
      <div class="personListPd">
        <div class="cw">
          <div class="productDetailList">
            <h4>{{house_title}}</h4>
            <p class="eye"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/addressIcon.png" width="20">{{house_address}}</p>
            <p class="eye"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/dt.png" width="20">{{house_traffic}}</p>
            <p class="productP productPTwoLine" v-show="update_time!=''"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/clock.png" width="18">
              {{update_time}}
            </p>
            <p class="productP productPTwoLine" v-show="checkin_time!=''"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/clock.png" width="18">
              {{checkin_time}}</p>
            <div class="productTab">
              <table>
                <tr>
                  <th v-show="(house_louceng!=null)&&(house_louceng!='')"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/lou.png">
                    <p class="spanBlack">{{house_louceng}}</p>
                  </th>
                  <th v-show="(house_room_type!=null)&&(house_room_type!='')"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/fx.png">
                    <p>{{house_room_type}}</p>
                  </th>
                  <th v-show="(house_area!=null)&&(house_area!='')"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/mj.png">
                    <p>{{house_area}}</p>
                  </th>
                  <th v-show="house_louceng!=null"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/data.png">
                    <p>一月起租</p>
                  </th>
                </tr>
              </table>
            </div>
            <div class="productYlist">
              <ul>
                <li><em class="big">{{house_rent_price}}</em>元/月
                  <h4 v-show="(isMsgShow)&&(is_pay_one==1)"> 芝麻信用较好且无不良记录可享月付</h4>
                  <h4 v-show="(isMsgShow)&&(is_deposit_free==1)"> 芝麻信用较好且无不良记录可享押金减免</h4>
                </li>
              </ul>
            </div>
            <p class="productTime">{{house_desc}}</p>
          </div>
        </div>
      </div>

      <div class="personListPd" @click="reportBtn" style="margin-bottom: 51px;">
        <div class="productJb">
          <div class="cw">
            <span>房源信息不真实？</span>
            <a @click="reportBtn">立即举报</a>
          </div>
        </div>
      </div>
      <div class="productTel" id="productTel">
        <div class="cw">
          <table>
            <tr>
              <td>
                <a href="javascript:;" class="TSGreen call" @click="warrantBtn()"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/tel.png">联系房东</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import axios from "axios";
  import * as API from "../api/api.js";
  import getUrlParams from "../utils/getUrlParams.js";
  import {
    Swipe,
    SwipeItem
  } from 'mint-ui'
  import 'mint-ui/lib/style.css'
  import {
    throws
  } from 'assert';
  export default {
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem
    },
    data() {
      return {
        house_id: 25654141,
        g_uid: 12,
        filterBtnArea: false,
        filterBtnRoom: false,
        filterBtnPrice: false,
        rentBg: false,
        house_status: "已租",
        background_pic_url: "",
        banner_list: [],
        house_title: "",
        house_address: "",
        house_traffic: "",
        house_update_tiem: "",
        house_checkin_time: "",
        house_louceng: "",
        house_room_type: "",
        house_area: "",
        house_rent_cycle: "",
        house_rent_price: "",
        house_desc: "",
        house_community: "",
        house_detail_address: "",
        isMsgShow: false,
        landloarPhone: "",
        is_pay_one: 1, //押一付一  1是押一付一
        is_deposit_free: 1, //免押金  1是免押金
        update_time: "",
        checkin_time: "",
        pic_host: ""
      }
    },
    created() {
      this.house_id = this.$route.query.houseId;
      this.g_uid = localStorage.getItem('g_uid'); //用户token
      var status = getUrlParams.getUrlParams().status;
      if (status != null) {
        this.house_id = getUrlParams.getUrlParams().house_id;
        var msg = getUrlParams.getUrlParams().msg;
        if (status == 0) {
          localStorage.setItem("isAuth", 1);
          localStorage.setItem("isMsg", msg);
          var timeCur = Date.now();
          localStorage.setItem("saveTime", timeCur);
        }
      }
      var msgZM = localStorage.getItem('isMsg');
      if ((msgZM != null) && (msgZM != null != "") && (msgZM != null == "信用较好")) {
        this.isMsgShow = true;
      } else {
        this.isMsgShow = false;
      }
      this.pic_host = API.hostSafePicShow;
    },
    mounted() {
      this.getDetailData();
    },
    methods: {
      reportBtn() {
        this.$router.push({
          path: "/report?houseId=" + this.house_id
        });
      },
      warrantBtn() {

          // this.$router.push({
          //   path: "/warrant?houseId=" + this.house_id
          // });
        var isAuth = localStorage.getItem("isAuth");
        if (isAuth == 1) {
          var saveTime = localStorage.getItem("saveTime")
          var timeCur = Date.now();
          var timeInterval = timeCur - saveTime;
          var timeDay = timeInterval / (1000 * 60 * 60 * 24);
          if (timeDay > 7) {
            this.$router.push({
              path: "/warrant?houseId=" + this.house_id
            });
          } else {
            window.location.href = "tel:" + this.landloarPhone;
          }

        } else {
          this.$router.push({
            path: "/warrant?houseId=" + this.house_id
          });
        }
      },
      getDetailData() {
        var timeCur = Date.parse(new Date());
        var house_id = this.house_id;
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          channel: "zmxy",
          app_device: "zmxy",
          area_code: "021",
          g_uid: this.g_uid,
          house_id: house_id, //房源编号
          timestamp: timeCur,
        };
        var _this = this;
        axios
          .post(
            API.HOUSEDETAIL, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              var content = res.data.content;
              var body = res.data.content.main_info;
              _this.background_pic_url = API.hostSafePicShow + res.data.content.banner[0] + '@!form_s';
              _this.banner_list = res.data.content.banner;
              _this.house_title = body.title;
              _this.landloarPhone = body.tel_num;
              _this.is_pay_one = body.is_pay_one;
              _this.is_deposit_free = body.is_deposit_free;
              _this.update_time = body.update_time;
              _this.checkin_time = body.checkin_time;
              _this.house_address = content.location.address;
              var traffic = content.location.traffic;
              console.log(traffic)
              if (traffic) {
                var title = traffic[0].title;
                var subtitle = traffic[0].subtitle;
                if (title) {
                  _this.house_traffic = title + subtitle;
                }
              }

              var price = body.price;
              var price_arr = price.split("/");
              _this.house_rent_price = price_arr[0];
              _this.house_desc = content.introduction.detail;
              _this.house_louceng = body.house_info.total;
              _this.house_room_type = body.house_info.house_type;
              _this.house_area = body.house_info.building_area;
            }

          })
          .catch(function (res) {});
      },
    }
  }

</script>

<style>
  .mint-swipe {
    height: 450px;
  }

  .cw {
    margin: 0 10px;
    text-align: left;
  }

  .BMap_scaleCtrl {
    left: 55px !important;
  }

  .productTab2 {
    min-height: 300px;
  }

  /*弹框*/

  .imgTan {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
  }

  .markBg {
    background: rgba(0, 0, 0, 0.9);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0;
    z-index: -1;
  }

  .imgTan .slider {
    margin-top: 20%;
    height: 450px;
  }

  .imgTan a.close {
    display: block;
    position: absolute;
    right: 10px;
    top: 15px;
  }

  .imgTan a.close img {
    width: 20px;
  }

  .section .bookPd span.imgTanSpanAll {
    position: absolute;
    left: 50%;
    font-size: 1.3em;
    height: 27px;
    color: #fff;
    display: block;
    top: -110px;
    padding: 3PX 2PX;
  }

  .section .bookPd em.imgTanEmAll {
    position: absolute;
    right: 50%;
    font-size: 1.3em;
    height: 27px;
    color: #fff;
    display: block;
    top: -110px;
    width: 15px;
    text-align: center;
    padding: 2px 0 2PX;
  }

  .sliderTan div {
    height: 450px;
    line-height: 450px;
    text-align: center;
  }

  .sliderTan .sliderImg {
    max-width: 100%;
    max-height: 450px;
    vertical-align: middle;
    display: inline-block;
    margin: auto;
  }

  .imgTanSpanAll {
    position: absolute;
    left: 50%;
    top: 45px;
    color: #fff;
    font-size: 1.3em;
  }

  .slides {
    position: relative;
    height: 250px;
    overflow: hidden;
  }

  .slides div {
    height: 250px;
    background-size: cover;
    padding: 0 !important;
  }

  .slider-nav .slick-dots {
    z-index: 97;
  }

  /*抢*/

  .hotSmall {
    display: block;
    text-decoration: none;
    width: 35%;
    position: fixed;
    right: 0;
    bottom: 80px;
    z-index: 97;
  }

  .hotSmall img {
    width: 100%;
  }

  .tanBg {
    background: #fff;
    width: 80%;
    padding: 10px 0px 30px;
    opacity: 0;
    position: absolute;
    top: 25%;
    left: 10%;
    z-index: -1;
    border-radius: 10px;
  }

  .tanList {
    margin: 20px 30px 0;
  }

  .tanList img.tanTitle {
    margin: 0 auto 20px;
    display: block;
    width: 70%;
    position: relative;
  }

  .tanList p {
    color: #888;
    font-size: 1.1em;
    padding: 0 0 10px;
    margin-top: 10px;
    position: relative;
  }

  #tan02 p {
    padding: 0;
  }

  .tanList p.tanLine {
    border-bottom: 1px solid #d8d8d8;
  }

  .tanList p span {
    display: inline-block;
    color: #000;
    font-size: 1.2em;
    width: 40%;
  }

  .tanList p input {
    display: inline-block;
    width: 60%;
    height: 21px;
    line-height: 21px;
    color: #000;
    font-size: 1.2em;
    border: none;
    padding-bottom: 10px;
    position: absolute;
    padding-left: 40%;
    right: 0;
    bottom: 0;
    background: none;
  }

  .tanList a {
    display: block;
    text-decoration: none;
    width: 40%;
    margin: 0 auto;
  }

  .tanList a img {
    width: 100%;
    position: relative;
  }

  .close01 {
    width: 20px;
    position: absolute;
    right: 20px;
    top: 10px;
  }

  .close01 img {
    width: 20px;
  }

  /*detail*/

  .productDetailList {
    /* border-bottom:1px solid #d8d8d8;*/
  }

  .productDetailList h4 {
    color: #000000;
    font-size: 1.5em;
    margin: 10px 0;
    text-align: center;
  }

  h5.iconBrandsH5 {
    text-align: center;
    margin-bottom: 10px;
  }

  h5.iconBrandsH5 span {
    display: inline-block;
    padding: 3px 10px;
    margin: 0 auto;
    border: 1px solid #000;
    color: #000;
    font-size: 1.2em;
  }

  h5.iconBrandsH5 span img {
    vertical-align: middle;
    width: 20px;
    margin-right: 5px;
  }

  h5.iconBrandsH5 a {
    display: inline-block;
    text-decoration: none;
    padding: 3px 10px;
    margin: 0 auto;
    border: 1px solid #000;
    color: #000;
    font-size: 1.2em;
  }

  h5.iconBrandsH5 a img {
    vertical-align: middle;
    width: 20px;
    margin-right: 5px;
  }

  .productDetailList .productYlist {
    line-height: 40px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .productDetailList .productYlist li {
    height: auto;
    line-height: 35px;
    color: #000000;
    font-size: 1em;
    background: #f6f6f6;
    padding: 3px 10px 3px;
    border-bottom: 1px solid #cfcfcf;
    border-radius: 4px;
  }


  .productDetailList .productYlist h4 {
    padding: 10px 0;
    border-top: 1px solid #cfcfcf;
    color: #888;
    font-size: 1.2em;
    line-height: 24px;
    text-align: left;
    margin: 0;
  }

  .productDetailList .productYlist td {
    width: 110px;
  }

  .productDetailList .productYlist th {
    width: auto;
  }

  .productDetailList .productYlist em {
    display: inline-block;
    margin-right: 10px;
    color: #888888;
    font-size: 1em;
  }

  .productDetailList .productYlist em.big {
    font-size: 2em;
    color: #000000;
    margin-right: 3px;
  }

  .productDetailList .productYlist span {
    display: inline-block;
    margin-left: 10px;
    padding: 4px 8px;
    border-radius: 100px;
    font-size: 1.2em;
    line-height: 20px;
  }

  .productDetailList .productYlist span.red {
    color: #fc1624;
    border: 1px solid #fc1624;
  }

  .productDetailList .productYlist span.green {
    color: #06b32b;
    border: 1px solid #06b32b;
  }

  p.productTime {
    padding-bottom: 10px;
    color: #888888;
    font-size: 1.2em;
  }

  p.productAdd {
    color: #888;
    font-size: 1.2em;
    margin-top: 10px;
  }

  p.productAdd img {
    vertical-align: middle;
    margin-right: 8px;
    width: 20px;
  }

  .productTab {
    padding: 10px;
    /* margin:10px 0; border-bottom:1px solid #d8d8d8;*/
  }

  .productTab table {
    width: 100%;
  }

  .productTab th {
    text-align: center;
  }

  .productTab th img {
    height: 20px;
    margin: 0 auto 5px;
  }

  .productTab th p {
    color: #888888;
    font-size: 1.2em;
    text-align: center;
  }

  P.productP {
    color: #888;
    font-size: 1.2em;
    /*margin-bottom:10px;*/
  }

  P.productPTwoLine {
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    padding: 10px 0;
    text-align: left;
  }

  p.productP img {
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -5px;
  }

  .productLine {
    border-bottom: 10px solid #f6f6f6;
  }

  .productIconList {
    /*border-top:1px solid #d8d8d8;border-bottom:1px solid #d8d8d8;*/
    padding: 10px 0;
  }



  .iconW {
    text-align: center;
  }

  .productTab2 {
    border-top: 1px solid #d8d8d8;
    padding: 10px 0;
  }

  .eye {
    text-align: left;
    color: #888;
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  .eye img {
    margin-right: 5px;
    vertical-align: middle;
  }

  .productJb {
    /*border-top:1px solid #d8d8d8;*/
    border-bottom: 1px solid #d8d8d8;
    padding: 10px 0;
  }

  .productJb a {
    display: block;
    text-decoration: none;
    padding-right: 20px;
    -webkit-tap-highlight-color: transparent;
  }

  .productJb h4 {
    color: #000;
    font-size: 1.2em;
    margin-bottom: 5px;
  }

  .productJb p {
    color: #888;
    font-size: 1em;
  }

  section {
    width: 100%;
  }

  .pb30 {
    padding-bottom: 30px;
  }

  .productTab2 img.tab2Banner {
    width: 100%;
  }

  .productTab2 table {
    width: 100%;
    margin-top: 10px;
  }

  .productTab2 th {
    text-align: left;
  }

  .productTab2 th img {
    max-height: 20px;
    margin: 0 auto 5px;
    display: block;
    max-width: 30px;
  }

  .productTab2 th span {
    display: inline-block;
    width: 24%;
    color: #000;
    font-size: 1em;
    text-align: center;
    margin-bottom: 10px;
  }

  .detailImg {
    margin: 5px 0 15px;
    width: 100%;
  }

  .flexLeft {
    position: absolute;
    left: 15px;
    top: 15px;
    z-index: 1000;
  }

  .flexRight {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 1000;
  }


  .productListTab {
    width: 100%;
    margin: 10px 0 0;
  }

  .productListTab a {
    text-decoration: none;
    display: inline-block;
    width: 24%;
    text-align: center;
    vertical-align: bottom;
    margin-bottom: 10px;
  }

  .productListTab a img {
    max-width: 30%;
    max-height: 25px;
    margin: 0 auto 5px;
  }

  .productListTab a span {
    display: block;
    text-align: center;
    color: #000;
    font-size: 1.2em;
  }


  .productTel {
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    z-index: 11;
  }

  .productTel table {
    width: 100%;
  }

  .productTel table td {
    width: 50%;
    /*padding-right:2%;*/
  }

  .productTel table th {
    padding-left: 2%;
  }

  .productTel a {
    display: block;
    padding: 8px 5px;
    color: #fff;
    font-size: 1em;
    text-align: center;
    border-radius: 4px;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .productTel a img {
    vertical-align: middle;
    height: 18px;
    margin-right: 10px;
  }

  .productTel a.TSRed {
    background: #fc1624;
  }

  .productTel a.TSGreen {
    background: #b69b7d;
  }

  .productJb {
    padding: 10px 0;
    position: relative;
  }

  .productJb span {
    display: inline-block;
    color: #000;
    font-size: 1em;
  }

  .productJb a {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 10px;
    color: #fc1624;
    background: url("https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/rightBlack.png") right center no-repeat;
    padding-right: 20px;
    text-decoration: none;
  }

  span.yzBg {
    display: block;
    background: #000;
    position: absolute;
    width: 100%;
    text-align: center;
    padding: 8px 0;
    color: #fff;
    font-size: 1.2em;
    top: 50%;
    left: 0;
    margin-top: -10px;
    z-index: 999;
  }

  .house-map-list {
    height: 130px;
  }

  .loadImg {
    display: none;
    position: fixed;
    z-index: 110;
    top: 40%;
    left: 40%;
    width: 20%
  }



</style>
