<template>
	<div class="custom" :style="{background: back_color}">
		<div class="nav" @click="handleBack" style="cursor:pointer"
			:style="{height: navHeight + 'px', paddingTop: statusBarHeight + 'px', background: back_color}">
			<div class="fs15 tc h_top" :style="{background: back_color}">
				<div class="left_icon" v-if="is_show" :class="{left_icon2: show_back || show_home}">
					<span class="back" v-if="back" @click.stop="handleBack"></span>
					<span class="line" v-if="back && home">|</span>
					<span class="home" v-if="home" @click.stop="handleHome"></span>
				</div>
				<span class="tit_style">{{ title }}</span>
			</div>
		</div>
		<div :style="{height: navHeight + 'px', background: back_color}"></div>
	</div>
</template>
<script>
	/*
		home: Boolean 返回首页按钮
		back: Boolean 返回上一级按钮
		以上两个按钮 根据需要进行配置
	*/
	export default {
		props: {
			title: {
				type: String,
				default: '欢迎'
			},
			back: {
				type: Boolean,
				default: false
			},
			back_color: {
				type: String,
				// default: '#D0F4F4'
				default: '#fff'
			},
			home: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: '',
				navHeight: '',
				pad_top: '',
				isShow: true
			}
		},
		computed: {
			is_show() {
				return this.back || this.home;
			},
			show_back() {
				return this.back && !this.home
			},
			show_home() {
				return !this.back && this.home
			}
		},
		methods: {
			handleClickOutside() {
				this.isShow = false
			},
			handleBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			handleHome() {
				uni.reLaunch({
					url: '/page/index/index'
				})
			},
			noHairSreen(top, model) {
				const models = ["iPhone 6", "iPhone 7", "iPhone 8"];
				return top == 24 || top == 28 || models.includes(model);
			},
			hairScreen(res) {
				const {
					model,
					system,
					platform
				} = res;
				const models = ['X', 'XR', 'XS Max', '10', '11', '12', '13', '13 Pro', '13 Max']
				const isIphone = models.some(item => model.indexOf(item) > -1);
				return (system.indexOf('iOS') > -1 || platform == 'ios') && isIphone;
			},
		},
		mounted() {
			// #ifdef MP-WEIXIN
			uni.getSystemInfo({
				success: (res) => {
					const menuButton = uni.getMenuButtonBoundingClientRect() // 胶囊
					const {
						top,
						height
					} = menuButton; // top 可用于区分机型
					console.log('top:' + top);
					const {
						model
					} = res;
					console.log('机型：' + model)

					// barPaddingHeight -> 胶囊距离顶部的距离，用于paddingTop
					// navHeight -> 顶部通栏的高度设置 默认设置是有刘海的高度
					// botMenuHeight -> 底部 tabBar 自定义高度
					let barPaddingHeight, navHeight = height * 2.5,
						botMenuHeight;

					barPaddingHeight = top;

					// 根据非刘海屏来设置顶部通栏的高度
					if (this.noHairSreen(top, model)) {
						navHeight = height * 2;
					}

					// 处理刘海屏
					if (this.hairScreen(res)) {
						botMenuHeight = '160rpx';
						navHeight += 10;
					} else {
						botMenuHeight = '100rpx';
					}

					// offsetTop -> 自定义筛选框吸顶的距离
					let offsetTop = 0,
						topNum = navHeight * 2;

					if (top == 24 || top == 28) {
						offsetTop = topNum;
					} else if (top == 52) {
						offsetTop = topNum - 16;
					} else if (top == 54 || top ==26) {
						offsetTop = topNum - 14;
					} else {
						offsetTop = topNum - 8;
					}

					// return {
					// 	barPaddingHeight,
					// 	navHeight,
					// 	botMenuHeight,
					// 	offsetTop
					// }
						
					this.statusBarHeight = barPaddingHeight;
					this.navHeight = navHeight;
					this.$emit('top', offsetTop)
				}
			})
			// #endif
		},
	}
</script>
<style lang="scss" scoped>
	.custom {
		background: #D0F4F4;
		z-index: 999999;
	}

	.nav {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 9999999999999;
		// background-color: #D0F4F4;
		//background-color: #fff;
		color: #000000;
		/* #ifdef H5 */
		height: 86rpx;

		/* #endif */
		.h_top {
			width: 100%;
			display: flex;
			display: -webkit-flex;
			align-items: baseline;
			justify-content: center;
			text-align: center;
			// background-color: #D0F4F4;
			background-color: #fff;
			position: relative;
		}

		.left_icon {
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			align-self: center;
			width: 87px;
			height: 32px;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 90rpx;
			align-items: center;
			position: absolute;
			z-index: 1;
			left: 14rpx;
			top: 0;
			border: 1px solid #EAEAEA;

			.home {
				margin-right: 20rpx;
			}

			.back {
				margin-left: 22rpx;
			}
		}

		.left_icon2 {
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-self: center;
			width: 87px;
			height: 32px;
			background: rgba(255, 255, 255, 0.6);
			border: 1px solid #EAEAEA;
			border-radius: 90rpx;
			align-items: center;
			position: absolute;
			z-index: 1;
			left: 14rpx;
			top: 0;

			.home {
				margin-right: 0;
			}

			.back {
				margin-left: 0;
			}
		}

		.back {
			display: inline-block;
			width: 48rpx;
			height: 48rpx;
			background: url('https://wximg.91160.com/wechat/img/miniProgram/default/back.png')no-repeat;
			background-size: 100%;
			background-position: center;
		}

		.home {
			display: inline-block;
			width: 48rpx;
			height: 48rpx;
			background: url('https://wximg.91160.com/wechat/img/miniProgram/default/home.png')no-repeat;
			background-size: 100%;
			background-position: center;
		}

		.line {
			display: inline-block;
			border: none;
			width: 2rpx;
			height: 42rpx;
			color: #ccc;
			padding-left: 4rpx;
			padding-right: 8rpx;
		}
	}

	.tit_style {
		font-size: 34rpx;
		color: #000;
		font-weight: 600;
		margin-top: 10rpx;
	}
</style>
