export default {
	
	//切割url后的参数 格式 ?key1=val1&key2=val2
	getUrlParams() {
		var qs = location.search.length > 0 ? location.search.substring(1) : ""
		var args = {}
		var name = null
		var value = null

		//以&为界，切割字符串
		var item1 = qs.length ? qs.split("&") : []
		var item2 = null;

		//遍历数组，二次切割，以=为界
		for(var i = 0; i < item1.length; i++) {
			item2 = item1[i].split("=")
			name = decodeURIComponent(item2[0])
			value = decodeURIComponent(item2[1])
			if(item2.length) {
				args[name] = value
			}
		}
		return args;
	},
	
}