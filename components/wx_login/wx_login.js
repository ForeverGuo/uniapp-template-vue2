import {
	common
} from "@/services/index.js"
import store from '@/store/store.js'
import { mapGetters, mapActions } from 'vuex';
import { scData, getCurrentPath} from '@/utils/util.js'
export default {
	data() {
		return {
			login_params: {
				code: '',
				phoneNumber: '',
				phoneParams: {
					sessionkey: "",
					// 用户唯一标识
					token: '',
					iv: "",
					encryptedData: ""
				},
				authStatus: false,
				encryptedData: '',
				iv: '',
			}
		}
	},
	computed:{
		 ...mapGetters(['userInfo'])
	},
	methods: {
		async jumpLogin() {
			const url = getCurrentPath();
			if(!this.userInfo.user_key && !await this.wxIsLogin()) {
				uni.navigateTo({
					url: '/login/login/index?from_url=' + encodeURIComponent(url)
				})
				return false;
			}
			return true;
		},
		/*
		 * @name wxIsLogin 
		 * @description 各平台统一校验登录入口
		 * 
		*/
		async wxIsLogin(scdata) {
			if(
				this.userInfo.user_key && 
				await this.isLogined()
			) {
				return true;
			}
			// #ifdef MP-WEIXIN
			return this.wxLogin(scdata);
			// #endif
			// #ifdef MP-ALIPAY
			return this.aliLogin();
			// #endif
		},
		/*
		* @name isLogined
		* 判断是否已经登录
		*/
		isLogined() {
			let params = {
				user_key: this.userInfo.user_key || this.userInfo.person_token || ''
			}
			return common.isLogin(params).then(response => {
			  var status = response.state
			  return status == 0 ? false : true;
			})
		},
		/*-------------------微信-----------------------**/
		/*--微信登录--*/
		async wxLogin(scdata) {
			let code = await this.getWxCode(),
				user = await this.getUserInfo();
			const {
				encryptedData,
				iv
			} = user;
			if (code && encryptedData && iv) {
				let params = {
					code: code,
					encryptedData,
					iv,
					city_id: uni.getStorageSync('city_id') || 5
				}
				// 神策
				const _scdata =  scdata ? scData(scdata) : scData()
				uni.setStorageSync('scdata', _scdata)
				params._scdata = _scdata
				return new Promise((resolve, reject) => {
					common.wxGoGetSessionKey(params).then((res) => {
						const {
							result_code,
							data
						} = res;
						if (data.user_id != 0) {
							uni.removeStorageSync('scdata')
							let userInfo = {
								user_key: data.user_key,
								user_id: data.user_id,
								person_token: data.token,
								open_id: data.open_id
							}
							// 重新存储user_key
							store.commit('SETUSERINFO', {
								userInfo: userInfo
							})
							resolve(1)
						} else {
							resolve(0)
						}
					})
				})
			}
		},
		/*
		* @name getUserParams
		* 获取用户token user_key
		* 用于手机号登录
		*/
		async checkLogin() {
			let code = await this.getWxCode(),
				user = await this.getUserInfo();
			const {
				encryptedData,
				iv
			} = user;
			if (code && encryptedData && iv) {
				let params = {
					code: code,
					encryptedData,
					iv,
					city_id: uni.getStorageSync('city_id') || 5
				}
				return new Promise((resolve, reject) => {
					common.wxGoGetSessionKey(params).then((res) => {
						const {
							result_code,
							data
						} = res;
						if (result_code === 1) {
							let userInfo = {
								user_key: data.user_key,
								user_id: data.user_id,
								person_token: data.token,
								open_id: data.open_id
							}
							// 重新存储user_key
							store.commit('SETUSERINFO', {
								userInfo: userInfo
							})
							resolve(1)
						} else {
							resolve(0)
						}
					})
				})
			}
		},
		async getUserParams() {
			let code = await this.getWxCode(),
				user = await this.getUserInfo();
			const {
				encryptedData,
				iv
			} = user;
			if (code && encryptedData && iv) {
				let params = {
					code: code,
					encryptedData,
					iv,
					city_id: uni.getStorageSync('city_id') || 5
				}
				return new Promise((resolve, reject) => {
					common.wxGoGetSessionKey(params).then((res) => {
						 if(res.result_code === 1) {
							 resolve(res.data)
						 } else {
							 resolve({})
						 }
					})
				})
			}
		},
		// 获取微信 用户信息
		getUserInfo() {
			let _this = this;
			// 获取用户信息
			return new Promise((resolve, reject) => {
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						resolve(infoRes);
					},
					fail: function(fail) {
						reject(fail)
					}
				});
			})
		},
		// 获取微信code
		getWxCode() {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						resolve(loginRes.code);
					},
					fail(err) {
						reject(err)
					}
				})
			})
		},
		/*-------------------支付宝-----------------------**/
		// 获取支付宝账号
		getAliCode() {
			return new Promise((resolve, reject) => {
				uni.login({
					scopes: 'auth_user',
					success: function(loginRes) {
						resolve(loginRes.code);
					},
					fail(err) {
						resolve('')
					}
				})
			})
		},
		// 手机登录时需要token
		async getAliToken() {
			let code = await this.getAliCode();
			if(code) {
				code = code.split('&')[0]
				return new Promise((resolve, reject) => {
					common.aliLogin({code}).then(res => {
						let userInfo = {
							user_key: res.user_key,
							user_id: res.user_id,
							person_token: res.token,
							open_id: res.open_id
						}
						// 重新存储user_key
						store.commit('SETUSERINFO', {userInfo})
						if(res.token) {
							resolve(res.token)
						} else {
							resolve(' ')
						}
					})
				})
			}
		},
		// 支付宝登录
		async aliLogin(id) {
			let code = await this.getAliCode();
			if(code) {
				code = code.split('&')[0]
				return new Promise((resolve, reject) => {
					common.aliLogin({code}).then(res => {
						let userInfo = {
							user_key: res.user_key,
							user_id: res.user_id,
							person_token: res.token,
							open_id: res.open_id
						}
						// 重新存储user_key
						store.commit('SETUSERINFO', {userInfo})
						if(res.state == 1) {
							resolve(1)
							if(id == 2) {
								uni.redirectTo({
									url: '/page/index/index'
								})
							}
						} else {
							resolve(0)
						}
					})
				})
			} else {
				// this.aliLogin(2)
				resolve(0)
			}
		}
	}
}
