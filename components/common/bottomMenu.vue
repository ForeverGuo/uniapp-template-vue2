<template>
	<div>
		<div class="menus flex justify_around align_center" :style="{height: botMenuHeight}">
			<div class="item" @click.stop="handleSelect(1)">
				<!-- #ifdef MP-ALIPAY -->
				<span class="block" style="height: 12rpx;"></span>
				<!-- #endif -->
				<span class="fs20 block c999 icon2" v-if="!g_flag"></span>
				<span class="fs20 block active icon1" v-if="g_flag"></span>
				<span class="block fs14 icon_text" :style="{color: g_flag ? '#00C6B8' : '#666666'}">健康160</span>
			</div>
			<div class="item" @click.stop="handleSelect(2)">
				<span class="iconfont fs20 block c999" v-if="!d_flag">&#xe616;</span>
				<span class="iconfont fs20 block active" v-if="d_flag">&#xe6a0;</span>
				<span class="block fs14" :style="{color: d_flag ? '#00C6B8' : '#666666'}">订单</span>
			</div>
			<div class="item" @click.stop="handleSelect(3)">
				<span class="iconfont fs20 block c999" v-if="!p_flag">&#xe656;</span>
				<span class="iconfont fs20 block active" v-if="p_flag">&#xe654;</span>
				<span class="block fs14" :style="{color:p_flag ? '#00C6B8' : '#666666'}">个人中心</span>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex';
	import { customPoint, storage } from '@/utils/util.js'
	export default {
		props:{
			// 挂号
			g_flag: {
				type: Boolean,
				default: true
			},
			// 订单
			d_flag: {
				type: Boolean,
				default: false
			},
			// 个人中心
			p_flag: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return  {
				list: [],
				botMenuHeight: '100rpx',
				timer: null
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			async handleSelect(index) {
				// 神策 
				const params = {
					cur_function_name: '首页',
					cur_function_id: 'G0',
				}
				customPoint('index_gh', params)
				let url = '';
				if(index == 1) {
					uni.switchTab({
						url: '/page/index/index',
					})
				} else if(index == 2) {
					if(!this.userInfo.user_key && !await this.wxIsLogin()) {
						let url = '/page/order/orderList'
						uni.navigateTo({
							url: '/login/login/index?from_url=' + encodeURIComponent(url) + '&isSwitch=true'
						})
						return;
					}
					if(uni.getStorageSync('noLogin')) {
						uni.removeStorageSync('noLogin')
					} else {
						uni.switchTab({
							url: '/page/order/orderList',
						})						
					}
				} else if(index == 3) {
					if(uni.getStorageSync('noLogin')) {
						uni.removeStorageSync('noLogin')
						uni.reLaunch({
							url: '/page/person/index'
						})
					} else {
						uni.switchTab({
							url: "/page/person/index",
						})						
					}
				}
			},
			debounce(fn, wait) {
				if(this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(fn, wait);
			}
		},
		async mounted() {
			// #ifdef MP-WEIXIN || MP-ALIPAY
				await uni.getSystemInfo({
					success: (res) => {
						console.log('系统信息:' + res)
						const menuButton = uni.getMenuButtonBoundingClientRect()  // 胶囊
						const navBarPadding = (menuButton.top - res.statusBarHeight) *2;
						this.statusBarHeight = menuButton.top;
						this.navHeight = menuButton.height * 2;
						const models = ['X', 'XR', 'XS Max', '10', '11', '12', '13', '14']
						const isIphone = models.some(item => res.model.indexOf(item) > -1)
						if (
							(res.system.indexOf('iOS') > -1 || res.platform == 'ios') && isIphone
						) {
							this.botMenuHeight = '160rpx';
						} else {
							this.botMenuHeight = '100rpx';
						}
					}
				})			
			// #endif
		}
	}
</script>
<style lang="scss" scoped>
	.menus {
		height: 100rpx;
		// padding-bottom: 14rpx;
		width: 100vw;
		position: fixed;
		bottom: 0;
		z-index: 999;
		background-color: #fff;
		border-top: 2rpx solid #F5F5F5;
		.item {
			text-align: center;
			width: 190rpx;
		}
		.active {
			color: #00C6B8;
		}
		.icon1 {
			display: inline-block;
			background: url('@/static/image/home-iconed.png')no-repeat center;
			background-size: 100%;
			width: 48rpx;
			height: 48rpx;
		}
		.icon2 {
			display: inline-block;
			background: url('@/static/image/home-icon.png')no-repeat center;
			background-size: 100%;
			width: 48rpx;
			height: 48rpx;
		}
		.iconfont {
			display: inline-block;
			width: 48rpx;
			height: 48rpx;
		}
		.icon_text {
			/* #ifdef MP-ALIPAY */
			margin-top: -8rpx;
			/* #endif */
		}
	}
</style>
