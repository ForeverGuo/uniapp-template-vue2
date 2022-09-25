//封装请求
/* 
	微信小程序
	深圳cid => 100012084
	深圳appid => wx41d50f4960b90df8
	
	广州cid => 100013443
	广州appid => wxdcf5bc4dbba74f55
*/
/*
	支付宝小程序
	cid => 100012822
	appid => 2018062060413648
*/
import store from "@/store/store.js"
const service = (url, params = {}, opts) => {
	Object.assign(params, { cid: store.state.common.wx_cid, user_key: store.state.common.userInfo.user_key })
	if (opts.method == 'POST') {
		if(!url.includes('cid')) {
		  url = `${url}&cid=${store.state.common.wx_cid}`
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			data: params,
			method: opts.method || 'GET',
			header: {
				"Content-type": 
				opts.dataType == 'FORM' ?
				'application/x-www-form-urlencoded' : 
				'application/json;charset=UTF-8'
			},
			success: (res) => {
				resolve(res.data)
			}			
		})
	})
}

// export default service

export const get = (url, params, opts = {}) => {
	opts.method = 'GET'
	return service(url, params, opts)
}

export const post = (url, params, opts = {}) => {
	opts.method = 'POST'
	return service(url, params, opts)
}
export const patch = (url, params, opts = {}) => {
	opts.method = 'PATCH'
	return service(url, params, opts)
}
export const put = (url, params, opts = {}) => {
	opts.method = 'PUT'
	return service(url, params, opts)
}
export const del = (url, params, opts = {}) => {
	opts.method = 'DELETE'
	return service(url, params, opts)
}
