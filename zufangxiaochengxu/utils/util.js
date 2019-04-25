function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(url, callBack) {
  wx.request({
    url: url, 
    data: {
      app_id: '0001',
      channel_id: '0',
      device: '3',
      p: '0',
      sign: '0a475c42fc0505709113968aa7ba9051',
      status: '1',
      token: '9ee0813102472cb27b9b238dbb39ba76',
      udid: 'AE67F78E-A9F6-4C2E-9583-90D0CDBCF280',
      version: '203'
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

function validatemobile(mobile) {
  
  if (mobile.length == 0) {
    console.log('qqqqqqqqqqqqqqqq');
    wx.showToast({
      title: '请输入手机号！',
      icon: 'loading',
      duration: 1500
    })
    return false;
  }
  if (mobile.length != 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'loading',
      duration: 1500
    })
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'loading',
      duration: 1500
    })
    return false;
  }
  return true;
}
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos,
  validatemobile: validatemobile,
}


