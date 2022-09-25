
import store from '@/store/store.js'
// 获取url路径
export const getPathUrl = () => {
	let page = getCurrentPages()
	let currentPage = page[page.length - 1]
	return currentPage.route;
}

// 获取url参数
export const getPathParams = () => {
	let page = getCurrentPages()
	let currentPage = page[page.length - 1]
	return currentPage.options;
}

// 获取当前页面的路径及参数
export const getCurrentPath = () => {
	let page = getCurrentPages(),
		currentPage = page[page.length - 1],
		// 当前路径
		current_url = currentPage.route,
		// 当前路径参数
		options = currentPage.options,
		// 新拼接url
		url_params = '';
	for (let key in options) {
		url_params += `${key}=${options[key]}&`
	}
	if (url_params) {
		return `/${current_url}?${url_params}`
	} else {
		return `/${current_url}`
	}
}

// uni app 获取当前经纬度
export const getLocation = () => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			// #ifdef MP-WEIXIN
			type: 'wgs84',
			// #endif
			// geocode: true, //设置该参数为true可直接获取经纬度及城市信息
			success: function (res) {
				resolve(res)
			},
			fail: function (e) {
				uni.showToast({
					title: '获取地址失败，将导致部分功能不可用',
					icon: 'none'
				});
				resolve({
					state: 0
				})
			},
		})
	})
}

// 将数组转化成 二位数组
export const twoArray = (arr, count) => {
	const resultArr = []
	const arrCount = Math.ceil(arr.length / count)
	if (arr.length <= count) {
		resultArr.push(arr)
		return resultArr
	}
	for (let i = 0; i < arrCount; i++) {
		const start = 0 + i * count
		const end = count * (i + 1)
		const item = arr.slice(start, end)
		resultArr.push(item)
	}
	console.log(resultArr)
	return resultArr
}

/*
 *	调用腾讯小程序地图
 * lat: 经度
 * lon: 纬度
 * address: 目的地址
 */
export const openWxLocation = (lat, lon, address) => {
	let plugin = requirePlugin('routePlan'),
		key = `${store.state.common.tencent_map_key}`, //使用在腾讯位置服务申请的key
		referer = '预约体检看医生', //调用插件的app的名称
		endPoint = JSON.stringify({ //终点
			'name': `${address}`,
			'latitude': lon,
			'longitude': lat
		});
	uni.navigateTo({
		url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
	});
}


// 底部按钮高度
export const getBottomHeight = () => {
	// #ifdef MP-WEIXIN
	let botMenuHeight
	uni.getSystemInfo({
		success: (res) => {
			if (
				res.model.indexOf('iPhone X') != -1 ||
				res.model.indexOf("iPhone XR") != -1 ||
				res.model.indexOf("iPhone XS Max") != -1 ||
				res.model.indexOf('iPhone 11') > -1 ||
				res.model.indexOf('iPhone 12') > -1 ||
				res.model.indexOf('iPhone 13 ') > -1 ||
				res.model.indexOf('iPhone 13 Max') > -1 ||
				res.model.indexOf('iPhone 13 Pro') > -1
			) {
				botMenuHeight = '130rpx';
			} else {
				botMenuHeight = '100rpx';
			}
		}
	})
	return botMenuHeight
	// #endif
}
/*
 *	百度经纬度转腾讯经纬度
 * lat: 经度
 * lon: 纬度
 * 
 */
export const translateTxLoc = (lat, lon) => {
	let x_pi = Math.PI * 3000.0 / 180.0;
	let x = lon - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let wz = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);

	lon = z * Math.cos(wz);
	lat = z * Math.sin(wz);

	return {lon, lat};
}

// 数据存储操作
export const storage = {
	set(name, data) {
		uni.setStorageSync(`${name}`, JSON.stringify(data))
	},
	get(name) {
		let data = uni.getStorageSync(`${name}`) ? JSON.parse(uni.getStorageSync(`${name}`)) : '';
		return data;
	},
	remove(name) {
		uni.removeStorageSync(`${name}`)
	}
}
