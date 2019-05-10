<template>
  <div>
    <div class="logoImg"><img src="https://client-op.oss-cn-shanghai.aliyuncs.com/zmxy/logo.png"> </div>
    <div class="cw20">
      <form id="ajax-form">
        <div class="logoPdTop">
          <div class="cw">
            <ul class="logPd">
              <li class="logLine">
                <input type="hidden" name="request_uri" value="1">
                <input type="number" name="mobile" id="mobile" placeholder="手机号码" v-model="phone_num">
              </li>
              <li>
                <div class="login">
                  <input class="login-field login-field-password passcode validate[required,minSize[6]]" id="password-1"
                    type="password" placeholder="密码" name="user_pass" v-model="password">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </form>
      <ul class="logPd">
        <li>
          <a href="javascript:void(0)" class="logRight" @click="forgetBtn()">忘记密码？点此找回</a>
        </li>
        <li>
          <a href="javascript:void(0)" class="logCenter" id="btn-ok" @click="login()">登录</a>
        </li>
      </ul>
    </div>
    <a href="register" class="loginPlast" @click="registerBtn()">注册公寓家 ></a>
  </div>
</template>

<script>
  import $ from "jquery";
  import axios from "axios";
  import * as API from "../../api/api.js";
  import {
    throws
  } from 'assert';
  export default {
    data() {
      return {
        phone_num: "",
        password: "",
        headerData: {},
        requestData_1: {},
      }
    },
    mounted() {
      this.headerData = {
        'token': this.g_token,
        sign: this.$md5('f4b36b276562c00dd22dddb9436882f2' + '9465c5d8c954415c164b3327f8d47d0c'),
        source: '89757'
      };
      this.requestData_1 = {
        network: "sc",
        os_type: "sc",
        os_version: "sc",
        version_code: "sc"
      };
    },
    methods: {
      registerBtn() {
        this.$router.push({
          path: "/register"
        });
      },
      forgetBtn() {
        this.$router.push({
          path: "/forget"
        });
      },
      goToList() {
        this.$router.push({
          path: "/list"
        });
      },
      login() {
        if (this.phone_num == "" || this.password == "") {
          alert("手机号码或密码不能为空");
          return;
        }
        var requestData = {
          network: "sc",
          os_type: "sc",
          os_version: "sc",
          version_code: "sc",
          login_type: 1,
          phone_bind: this.phone_num,
          g_pwd: this.password,
        };
        var _this = this;
        axios
          .post(
            API.GETLOGIN, requestData,
          )
          .then(function (res) {
            if (res.data.ret == 0) {
              //登录成功
              var body = res.data.content;
              localStorage.setItem('g_token', body.user_info.g_token); //用户token
              localStorage.setItem('g_uid', body.user_info.g_uid); //用户id
              _this.goToList();
            } else {
              alert("手机号码或密码输入错误");
            }
          })
          .catch(function (res) {});
      }
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

  body {
    background: #f6f6f6;
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

  /*log*/

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

  .titleH4 {
    background: #000;
    padding: 10px 0;
    text-align: center;
    width: 100%;
    position: relative;
    height: 24PX;
  }

  .titleH4 div {
    color: #fff;
    font-size: 1.5em;
  }

  .titleH4 img {
    float: left;
    width: 10px;
  }

  .titleH4 a {
    display: block;
    text-decoration: none;
    position: absolute;
    top: 10px;
    -webkit-tap-highlight-color: transparent;
  }

  .titleH4 a.addHA {
    color: #ffffff;
    font-size: 1em;
    right: 15px;
  }

  .titleH4 a.titleLeft {
    left: 5%;
    /*width:10px;*/
    color: #fff;
    font-size: 1em;
    vertical-align: middle;
  }

  .titleH4 a.titleLeft img {
    margin-right: 5px;
    vertical-align: middle;
    float: none;
    margin-top: -3px;
  }

  .titleH4 a.titleRight {
    right: 5%;
    color: #fff;
    font-size: 1em;
  }

  .titleH4 a.titleRight img {
    width: 20px;
  }

  div.searchDiv {
    margin: 0 25px;
    height: 26px;
    width: 75%;
    background: #fff;
    position: relative;
    border-radius: 4px;
  }

  div.searchDiv input {
    position: absolute;
    left: 0;
    top: 0;
    height: 24px;
    border: none;
    padding: 0 5px;
    line-height: 24px;
    width: 85%;
  }

  div.searchDiv a {
    display: block;
    position: absolute;
    right: 5px;
    height: 20px;
    width: 20px;
    background-size: 20px;
    top: 3px;
  }

  .logPd li {
    padding: 10px 0;
    position: relative;
  }

  .logPd li.logLine {
    border-bottom: 1px solid #e1e1e1;
  }

  .logPd li.logLine h5 {
    color: #000;
    margin: 0PX 0 5px;
    font-size: 1.2em;
  }

  .logPd li input {
    width: 96%;
    padding: 5px 2%;
    border: none;
    font-size: 1.2em;
  }

  .logPd li a.logRight {
    text-align: right;
    display: block;
    text-decoration: none;
    color: #888;
    font-size: 1.2em;
  }

  .logPd li a.logCenter {
    text-align: center;
    display: block;
    text-decoration: none;
    padding: 8px 0;
    color: #fff;
    background: #fc1624;
    font-size: 1.2em;
    line-height: 24px;
    border-radius: 6px;
  }

  .logPd li p {
    width: 100%;
    text-align: center;
    color: #888;
    font-size: 1em;
  }

  /*PASSWORD*/

  .logPd li a.yzmBtn {
    display: block;
    width: 30%;
    padding: 5px 0;
    background: #fc1624;
    color: #fff;
    font-size: 1.2em;
    text-align: center;
    position: absolute;
    right: 0;
    top: 10px;
    z-index: 10;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .logPd li input.yzmBtn {
    display: block;
    width: 30%;
    padding: 5px 0;
    background: #fc1624;
    color: #fff;
    font-size: 1.2em;
    text-align: center;
    position: absolute;
    right: 0;
    top: 10px;
    z-index: 10;
    text-decoration: none;
  }

</style>
