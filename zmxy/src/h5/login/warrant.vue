<template>
  <div class="warrant">
    <div class="warrantBanner">
      <img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/banner.jpg" width="100%">
      <img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/warrantIcon.png" class="zmIcon">
    </div>
    <div class="warrantPd">
      <form id="ajax-form" name="ajax-form" action="{:U('portal/alizm/aliAUth')}" method="post">
        <input type="hidden" name="house_id" id="house_id" value="{$house_id}">
        <input type="hidden" name="chargeone" id="chargeone" value="{$chargeone}">
        <input type="hidden" name="nocharge" id="nocharge" value="{$nocharge}">
        <div class="cw20">
          <div class="logoPdTop">
            <div class="cw">
              <ul class="logPd">
                <li class="logLine">
                  <input type="text" name="real_name" id="real_name" placeholder="请输入真实姓名" v-model="real_name">
                </li>
                <li class="logLine">
                  <div class="login">
                    <input type='number' placeholder="身份证号" v-model="id_card_num" id="id_code" maxlength="18" oninput="if(value.length>18)value=value.slice(0,18)" />
                  </div>
                </li>
                <li>
                  <input type='number' placeholder="手机号" v-model="phone_num" id="mobile" maxlength="11" oninput="if(value.length>11)value=value.slice(0,11)" />
                </li>
              </ul>
            </div>
          </div>
          <ul class="logPd">
            <li>
              <p class="logleft">*芝麻分700分及以上且无不良记录可享押金减免。</p>
              <p class="logleft pt5">*芝麻分650分及以上且无不良记录可享月付。 </p>
            </li>
            <li>
              <a href="javascript:void(0)" class="logCenter" id="btn-ok" @click="authQuery()">授权</a>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import "../../css/warrant.css"
  import $ from "jquery";
  import axios from "axios";
  import * as API from "../../api/api.js";
  import getUrlParams from "../../utils/getUrlParams.js";
  import {
    throws
  } from 'assert';
  export default {
    data() {
      return {
        real_name: "",
        id_card_num: "",
        phone_num: "",
        headerData: {},
        requestData_1: {},
        house_id: "",
      }
    },
    created() {
      this.house_id = this.$route.query.houseId;

    },
    mounted() {

    },
    methods: {
      goToList() {
        this.$router.push({
          path: "/list"
        });
      },
      authQuery() {
        if ((this.real_name == "") || (this.id_card_num == "") || (this.phone_num == "")) {
          alert("姓名、身份证号、手机号码不能为空");
          return;
        }
        var isPhone = this.checkPhone(this.phone_num);
        if (!isPhone) {
          alert("请输入正确的手机号");
          return;
        }
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          cert_no: this.id_card_num, //身份证号
          name: this.real_name, //姓名
          mobile: this.phone_num,
        };
        var _this = this;
        axios
          .post(
            API.AUTH_QUERY, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              if (res.data.content) {
                _this.authInfoQuery();
              } else {
                _this.authAction();
              }
            } else {
              alert("账号输入错误");
            }
          })
          .catch(function (res) {
            alert("数据输入错误");
          });
      },
      checkPhone(value) {
        let re = /^1[34578]\d{9}$/g;
        if (re.test(value)) {
          return true;
        } else {
          return false;
        }
      },
      authAction() {
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          cert_no: this.id_card_num, //身份证号
          name: this.real_name, //姓名
          house: this.house_id, //房源id
        };
        var _this = this;
        axios
          .post(
            API.AUTH_ACTION, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              var url = res.data.content;
              window.location.href = url;
            } else {
              alert("数据输入错误");
            }
          })
          .catch(function (res) {
            alert("数据输入错误");
          });
      },
      authInfoQuery() {
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          cert_no: this.id_card_num, //身份证号
          name: this.real_name, //姓名
          house: this.house_id, //房源id
        };
        var _this = this;
        axios
          .post(
            API.AUTH_INFO_QUERY, requestData,
          )
          .then(function (res) {
             var url = res.data;
              window.location.href = url;
          })
          .catch(function (res) {
            alert("数据输入错误"+res);
          });
      }
    }
  }

</script>
