// pages/personal/about/about.js
var app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
    app.aldstat.sendEvent('关于公寓家页面打开');
  },
})