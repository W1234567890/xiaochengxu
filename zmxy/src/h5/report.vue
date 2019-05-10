<template>
  <div>
    <div class="TitleTop">
      <div class="cw">
        <span>举报</span>
      </div>
    </div>
    <p class="titleLine"></p>
    <div class="cw">
      <h4>举报该房源的理由</h4>
      <div>
        <el-checkbox-group v-model="reportReason">
          <el-checkbox v-for="(item,index) in report_reason_arr" :label="item" :key="index">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <h4>详细描述</h4>
      <textarea v-model="report_desc" name="msg" class="reportTextarea"></textarea>
      <button class="logCenter" id="btn-ok" @click="report">立即提交</button>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import * as API from "../api/api.js";
  import {
    throws
  } from 'assert';
  export default {
    data() {
      return {
        g_uid: 12,
        house_id: 25654141,
        reportReason: [],
        report_desc: "",
        report_reason_arr: [ //举报房源理由
          {
            value: '56',
            label: '房源不存在'
          },
          {
            value: '57',
            label: '租金不真实'
          },
          {
            value: '58',
            label: '图片不真实'
          },
          {
            value: '59',
            label: '押1付1或免租金不真实'
          },
          {
            value: '60',
            label: '其他'
          }
        ],
      }
    },
    created() {
      this.house_id = this.$route.query.houseId;
      this.g_uid = localStorage.getItem('g_uid'); //用户token
    },
    methods: {
      report() {
        var a = this.reportReason;
        var typeArr = new Array()
        for (var i = 0; i < a.length; i++) {
          typeArr.push(a[i].value);
        }
        if ((typeArr == []) || (typeArr.length < 1)) {
          alert("请选择举报理由");
          return;
        }
        if ((typeArr.indexOf("60")) != -1) {
          if (this.report_desc == "") {
            alert("请输入详细描述");
            return;
          }
        }
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          g_uid: this.g_uid,
          house_id: this.house_id, //房源编号
          rule_no: typeArr, //举报原因编号
          rule_detail: this.report_desc, //举报原因详情，非必填
        };
        var _this = this;
        axios
          .post(
            API.HOUSEREPORT, requestData,
          )
          .then(function (res) {
            alert("举报成功");
            _this.goToDetail();
          })
          .catch(function (res) {
            alert("举报成功");
            _this.goToDetail();
          });
      },
      goToDetail() {
        this.$router.push({
          path: "/list"
        });
      },
    }

  }

</script>


<style>
  .cw {
    margin: 0 10px;
  }

  .cw20 {
    margin: 0 20px;
  }

  .logoImg img {
    width: 25%;
    margin: 20px 0;
  }

  .TitleTop {
    position: relative;
    padding: 10px 0;
    height: 24px;
    line-height: 24px;
    width: 100%;
  }

  .TitleTop span {
    display: block;
    text-align: center;
    color: #333;
    font-size: 1.5em;
    width: 100%;
  }



  .cw h4 {
    columns: #000;
    font-size: 1.2em;
    margin-bottom: 10px;
    text-align: left;
    margin-top: 15px;
  }


  .logCenter {
    text-align: center;
    display: block;
    text-decoration: none;
    padding: 8px 0;
    color: #fff;
    background: #fc1624;
    font-size: 1.2em;
    line-height: 24px;
    border-radius: 6px;
    border: none;
    width: 100%;
    outline: none;
    margin-top: 20px;
  }

  p {
    width: 100%;
    text-align: center;
    color: #888;
    font-size: 1em;
  }

  .logoImg {
    text-align: center;
  }

  .logoImg img {
    width: 25%;
    margin: 20px 0;
  }

  .logoPdTop {
    background: #fff;
  }

  .loginPlast {
    display: block;
    text-decoration: none;
    position: absolute;
    bottom: 50px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #333333;
    font-size: 1.2em;
  }

  .loginPlast:hover {
    color: #d0a745;
    text-decoration: none;
  }

  /*report*/

  .titleLine {
    border-bottom: 1px solid #e1e1e1;
  }

  .reportTextarea {
    color: #000;
    font-size: 1em;
    line-height: 20px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #e1e1e1;
    padding: 5px 1%;
    width: 97%;
  }

  .el-checkbox {
    margin-top: 8px;
    margin-left: 0px;
    text-align: left;
    margin-right: 20px;
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0px !important;
  }

</style>
