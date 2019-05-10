// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/css/reset.css'
import axios from 'axios'
Vue.prototype.$http = axios
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false
import {ListTheme, ListItem, ListOther} from 'vue-ydui/dist/lib.rem/list';
import {InfiniteScroll} from 'vue-ydui/dist/lib.rem/infinitescroll';


Vue.component(InfiniteScroll.name, InfiniteScroll);
Vue.component(ListTheme.name, ListTheme);
Vue.component(ListItem.name, ListItem);
Vue.component(ListOther.name, ListOther);
import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
import {PullRefresh} from 'vue-ydui/dist/lib.rem/pullrefresh';
Vue.component(PullRefresh.name, PullRefresh);
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import Mint from 'mint-ui';
Vue.use(Mint);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
