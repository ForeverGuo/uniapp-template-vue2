<template>
	<div
		class="textc to-top-btn"
		:class="isShow ? 'hide' : 'show'"
		ref="scrollBtn"
		:style="{bottom: bottom}"
		@click="scrollTop()"
	>
		<span class="iconfont js_scroll_top "></span>
	</div>
</template>
<script>
export default {
	props: {
		is_show_top: {
			type: Boolean,
			default: false
		},
		bottom: {
			type: [Number, String],
			default: '4%'
		}
	},
	data() {
		return {
			isShow: true
		};
	},
	watch: {
		is_show_top: {
			handler(oVal, nVal) {
				if(!oVal) {
					this.isShow = false;
				} else {
					this.isShow = true;
				}
			},
			deep: true
		}
	},
	methods: {
		scrollTop() {
			uni.pageScrollTo({
				duration: 100,
				scrollTop: 0
			});
			// 实现在scroll-view 中 回到顶部
			this.$emit('handleTop')
		}
	}
};
</script>
<style lang="scss" scoped>
.hide {
	display: none;
}
.show {
	display: block;
}

.to-top-btn {
	position: fixed;
	right: 4.8%;
	bottom: 4%;
	z-index: 222;
	width: 72rpx;
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.5);
	text-align: center;
	/* #ifdef H5 */
	z-index: 9997 !important;
	/* #endif */
}

.js_scroll_top {
	color: #fff;
	font-size: 36rpx;
}
</style>
