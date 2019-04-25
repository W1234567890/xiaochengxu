// pages/index/list/upload/upload03/upload03.js
const app = getApp()
var imgUrl = app.globalDataImg.gyjProductBase;
var imgUrlLast = app.globalDataImgLast.gyjProductBase;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    imgUrlLast: imgUrlLast,
    imageShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var src = options.src;
    var num = options.num;
    if(num==1){
      var imageShow=true;
    }
    else {
      var imageShow = false;
    }
    console.log(src,'src')
    this.setData({
      src: src,
      imageShow: imageShow,
    })
  },
  onShow: function (options) {
  },
  //设为封面/取消设为封面
  imageBtnTap:function(){
    var imageShow = this.data.imageShow;
    var src=this.data.src;
    if (imageShow==true){
      var imageShow = false;
      wx.setStorageSync('house_cover', '');   
    }
    else{
      var imageShow = true;
      //封面图片
      wx.setStorageSync('house_cover', src);   
      console.log(src,'src')   
    }
    this.setData({
      imageShow: imageShow,
    })
    console.log(imageShow, 'imageShow')
  },
})