<template>
	<view>
		<!-- 底部弹窗授权 -->
		<u-popup v-model="authStatus" border-radius="12" mode="bottom" height="580" :mask-close-able="false">
			<div class="login_content">
				<div class="logo"></div>
				<div class="text">申请获取以下权限</div>
				<div class="text">获得你的公开信息(昵称，头像、地区等)</div>
				<div class="btns">
					<div class="cancel" @click="handlerCancel">取消</div>
					<!-- #ifdef MP-WEIXIN -->
					<button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="certain">
						允许
					</button>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<button type="primary" open-type="getAuthorize" @getAuthorize="getAliPhoneNumber" class="certain"
						scope='phoneNumber'>允许</button>
					<!-- #endif -->
				</div>
			</div>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { common } from "@/services/index.js"
import store from '@/store/store.js'
import { mapActions, mapGetters } from 'vuex';
import { scData } from '@/utils/util.js'
export default {
	props: {
		isLoginStatus: {
			type: Boolean,
			requird: true,
			default: false
		}
	},
	computed:{
		 ...mapGetters(['userInfo'])
	},
	watch: {
		isLoginStatus: {
			async handler(oVal, nVal) {
				// 检查user_key 是否过期，如果过期进行重新登录
				//console.log(oVal, nVal)
				if(oVal) {
					let checkUserKey = '';
					// #ifdef MP-WEIXIN
					if(this.userInfo.user_key) {
						checkUserKey = await this.isLogin({user_key: this.userInfo.user_key })
					}
					if(!checkUserKey) {
						this.initWx()
					}
					// #endif
					// #ifdef MP-ALIPAY
					this.initAli()
					// #endif
					// #ifdef H5
					if(!this.userInfo.user_key) {
						this.initH5()
					}
					// #endif
				}
			},
			deep: true,
			// immediate: true
		}
	},
	data() {
		return {
			code: '',
			phoneNumber: '',
			phoneParams:{
				sessionkey:"",
				// 用户唯一标识
				token: '',
				iv:"",
				encryptedData:""
			},
			authStatus: false,
			encryptedData: '',
			iv: '',
		};
	},
	methods: {
		...mapActions(['isLogin']),
		handlerCancel() {
			this.authStatus = false;
			this.$emit('closePop')
			
			// let page = getCurrentPages(),
			// 	 currentPage = page[page.length - 1],
			// 	 // 当前路径
			// 	 current_url = currentPage.route;
			// if(!current_url.includes('page/index/index')) {
			// 	uni.redirectTo({
			// 		url: '/page/index/index'
			// 	})				
			// }
		},
		refreshPage() {
			let page = getCurrentPages(),
				 currentPage = page[page.length - 1],
				 // 当前路径
				 current_url = currentPage.route,
				 // 当前路径参数
				 options = currentPage.options,
				 // 新拼接url
				 url_params = '';
			for(let key in options) {
				url_params += `${key}=${options[key]}&`
			}
			if(url_params) {
			 uni.reLaunch({
				url: `/${current_url}?${url_params}`
			 })
			} else {
			 uni.reLaunch({
				url: `/${current_url}`
			 })
			}
		},
		initH5() {
			let userInfo = {
				 user_id: 222901911,
				 user_key: "a65afba56fc83a8a02d4de7b9e8c9f75I5rbfSfj20210518201310",
				 person_token: '',
				 open_id: ''
			}
			// 重新存储user_key
			store.commit('SETUSERINFO', {userInfo: userInfo})
			this.authStatus = false;
			setTimeout(() => {
				this.refreshPage()
			},1000)
		},
		async initWx() {
			this.code = await this.wxLogin();
			const user = await this.wxGetUserInfo();
			const { encryptedData, iv} = user;
			if(this.code && encryptedData && iv) {
				const _scdata = scData()
				 let key = await common.wxGoGetSessionKey(
				 {
					 code: this.code,
					 encryptedData,
					 iv,
					 _scdata,
					 city_id: uni.getStorageSync('city_id') || 5
				 })
				 if (key.result_code == 1) {
					 let userInfo = {
						 user_key: key.data.user_key,
						 user_id: key.data.user_id,
						 person_token: key.data.token,
						 open_id: key.data.open_id
					 }
					 // 重新存储user_key
					 store.commit('SETUSERINFO', {userInfo: userInfo})
					 this.authStatus = false;
					 return 1;
				 } else if (key.data.session_key || key.data.token) {
					 this.phoneParams.sessionkey = key.data.session_key;
					 this.phoneParams.token = key.data.token;
					 this.authStatus = true;
				 } else {
					 this.authStatus = true;
				 }
			} else {
				this.$refs.uToast.show({
				 title: '请登录后重试',
				 type: 'warning'
				})
			}
		},
		// 微信授权登陆
		async getPhoneNumber(e){
			 uni.showLoading({
			 	title: '登录中...'
			 });
			 if(e.detail.errMsg.indexOf('ok') > -1) {
				 this.phoneParams.encryptedData = e.detail.encryptedData
				 this.phoneParams.iv = e.detail.iv
         this.phoneParams._scdata = scData()
				 this.city_id = uni.getStorageSync('city_id') || 5
				 try{
					 let phone_data = await common.wxGoGetPhoneNumber(this.phoneParams)
					 if(phone_data.result_code === 1) {
						 let userInfo = {
						 	 user_key: phone_data.data.user_key,
						 	 user_id: phone_data.data.user_id,
						 	 person_token: phone_data.data.token || '',
						 	 open_id: phone_data.data.open_id || ''
						 }
						 // 重新存储user_key
						 store.commit('SETUSERINFO', {userInfo: userInfo})
					 }
				 }catch(e){
				 	//TODO handle the exception
				 }
			 } else {
				 this.$refs.uToast.show({
					 title: '授权失败',
					 type: 'warning'
				 })
				 uni.redirectTo({
				 	url: '/page/index/index'
				 })
			 }
			 uni.hideLoading();
			 this.authStatus = false;
			 this.refreshPage()
		},
		wxGetUserInfo() {
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
		wxLogin() {
			return new Promise((resolve, reject) => {
				uni.login({
						provider: 'weixin',
						success: function(loginRes) {
								resolve(loginRes.code);
						},
						fail(err) {
								reject(err)
								uni.hideLoading();
						}
				})
			})
		},
		// 支付宝授权登陆
		async initAli() {
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
							this.authStatus = false;
						} else {
							this.authStatus = true;
						}
					})
				})
			}
		},
		async getAliPhoneNumber(res) {
			this.$refs.uToast.show({
				title: '登陆中...'
			})
			let token = await this.getAliToken() || '';
			my.getPhoneNumber({
				scopes: 'auth_user',
				success: (res) => {
					let encryptedData = res.response;
					let params = {
						token,
						encryptedData
					};
					common.aliMobileLogin(params).then((item) => {
						if(item.state == 1) {
							let userInfo = {
								user_key: item.user_key,
								user_id: item.user_id,
								person_token: item.token,
								open_id: item.open_id || item.open_id
							}
							// 重新存储user_key
							store.commit('SETUSERINFO', {
								userInfo: userInfo
							})
							//this.handleBack(item.user_key)
						} else {
							uni.showToast({
								title: `${item.msg}`,
								icon: 'none'
							})
							uni.redirectTo({
								url: '/page/index/index'
							})
						}
					})
				},
				fail: (res) => {
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					})
					uni.redirectTo({
						url: '/page/index/index'
					})
				},
			});
			
			uni.hideLoading();
			this.authStatus = false;
			this.refreshPage()
		},
	}
};
</script>
<style scoped lang="scss">
.login_content {
	padding: 40rpx 54rpx;
	color: #666;
	font-size: 30rpx;
	.logo {
		background: url('https://wximg.91160.com/wechat/img/miniProgram/guahao/unit/logo2x.png');
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
		width: 200rpx;
		height: 90rpx;
		margin: 0 auto;
	}
	.btns {
		padding: 20rpx 26rpx;
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		.cancel {
			width: 200rpx;
			border: 2rpx solid #ddd;
			text-align: center;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 8rpx;
			font-size: 30rpx;
			letter-spacing: 19rpx;
			text-indent: 19rpx;
		}
		.certain {
			width: 200rpx;
			text-align: center;
			height: 100rpx;
			line-height: 100rpx;
			background: #62cd02;
			color: #fff;
			font-size: 34rpx;
			border-radius: 8rpx;
			letter-spacing: 19rpx;
			text-indent: 19rpx;
		}
	}
	.text {
		padding-bottom: 50rpx;
	}
}
button::after {
	border: none;
}
</style>
