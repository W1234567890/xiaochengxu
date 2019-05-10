// // 测试环境
// export const CONTEXT = "http://gyjapitest.gongyujia.com";
// //展示图片前缀
// export const hostSafePicShow="http://restest.gongyujia.com/"

//生产
export const CONTEXT = "https://appapi.gongyujia.com";
//展示图片前缀
export const hostSafePicShow="https://res.gongyujia.com/"


//注册
export const REGISTER = CONTEXT + "/pc/user/register";
//获取验证码
export const GETCODE = CONTEXT + "/api/sms/send";
//登录
export const GETLOGIN = CONTEXT + "/pc/user/login";
//找回密码
export const FINDPASSWORD = CONTEXT + "/pc/user/password_recovery";
//房源列表
export const HOUSELIST = CONTEXT + "/credit/house_list";
//房源详情
export const HOUSEDETAIL = CONTEXT + "/credit/houses/house_detail";
//举报
export const HOUSEREPORT = CONTEXT + "/credit/house_report";
//获取房源类型标签与房源设施
export const GET_CITY_DATAS= CONTEXT + "/credit/house_list/house_param";
//芝麻信用授权查询
export const AUTH_QUERY= CONTEXT + "/credit/auth/authQuery";
//芝麻信用授权
export const AUTH_ACTION= CONTEXT + "/credit/auth/authAction";
//芝麻信用互查
export const AUTH_INFO_QUERY= CONTEXT + "/credit/auth/zhimaAuthInfoApply";
//获取用户信息
export const LOCATION= CONTEXT + "/credit/location";