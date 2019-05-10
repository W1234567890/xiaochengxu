import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const list = r => require.ensure([], () => r(require('../h5/list')), 'list');
const detail = r => require.ensure([], () => r(require('../h5/detail')), 'detail');
const report = r => require.ensure([], () => r(require('../h5/report')), 'report');
const login = r => require.ensure([], () => r(require('../h5/login/login')), 'log');
const register = r => require.ensure([], () => r(require('../h5/login/register')), 'register');
const forget = r => require.ensure([], () => r(require('../h5/login/forget')), 'forget');
const warrant = r => require.ensure([], () => r(require('../h5/login/warrant')), 'warrant');

export default new Router({
  mode: 'history',
  routes: [
    //房源列表
    {
      path: '/',
      component: list
    },
    {
      path: '/list',
      component: list
    },
    //房源详情
    {
      path: '/detail',
      component: detail
    },
    //举报
    {
      path: '/report',
      component: report
    },
    //登录
    {
      path: '/login',
      component: login
    },
    //注册
    {
      path: '/register',
      component: register
    },
    //忘记密码
    {
      path: '/forget',
      component: forget
    },
    //授权
    {
      path: '/warrant',
      component: warrant
    },
  ]
})
