<template>
	<view
		v-if="bannerAdList && bannerAdList.length"
		:id="'topbanners_' + sensorsid"
		class="banner-warpper"
		:class="bg"
		:style="{width: width, margin: '0 auto'}"
	>
		<template v-if="bannerAdList.length > 1">
			<u-swiper 
				class="swiper" 
				img-mode="scaleToFill"
				:height="height" 
				:list="bannerAdList"
				@click="handleToDep"
			></u-swiper>
		</template>
		<template v-else>
			<div class="swiper-container" :style="{ height: height + 'rpx' }">
				<div
					v-for="(item, index) in bannerAdList"
				  @click="handleToDetail(item, index)"
					:key="index"
					class="hot-item block backgroundimg"
					:style="{ background: 'url(' + (item.image ? `https://images.91160.com/${item.image}` : noimg) + ')', height: height + 'rpx' }"
				></div>
			</div>
		</template>
	</view>
</template>
<script>
import { common } from '@/services/index.js';
import { customPoint, } from '@/utils/util.js'
import { scAdClick } from '@/utils/adBuPoint.js'
export default {
	props: {
		sensorsid: {
			type: String,
			default: ''
		},
		banner_id: {
			type: [String, Number],
			default: ''
		},
		cat_id: {
			// 公共科室id
			type: [String, Number],
			default: ''
		},
		city_id: {
			type: [String, Number],
			default: ''
		},
		unit_id: {
			// 医院id
			type: [String, Number],
			default: ''
		},
		height: {
			type: [String, Number],
			default: '138.34'
		},
		width: {
			type: String,
			default: '698rpx'
		},
		bg: {
			type: String,
			default: 'bg_white'
		},
		bannerAdList: {
			type: Array,
			default: []
		},
		from_function_id: {
			type:  String,
			default: ''
		},
		from_function_name: {
			type:  String,
			default: ''
		}
	},
	data() {
		return {
			noimg: 'https://wximg.91160.com/wechat/img/miniProgram/default/article_default.png',
			banner: [],
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			cur_function: {
				id: 'GO_AD',
				name: '广告'
			}
		};
	},

	watch: {
		bannerAdList: {
			handler(newVal) {
				this.adExportMethod(newVal)
			},
			deep: true
		}
	},
	methods: {
		handleToDep(i) {
			this.bannerAdList.forEach((it, index) => {
				if(i == index) {	
					let url = it.url || it.links_url;
					this.adMaidian(it, i)
					uni.navigateTo({
						url: `/page/webview/index?url=${encodeURIComponent(JSON.stringify(url))}&from_function=${this.cur_function}`
					})
				}
			})
		},
		handleToDetail(item, index) {
			let url = item.url;
			this.adMaidian(item, index)
			uni.navigateTo({
				url: `/page/webview/index?url=${encodeURIComponent(JSON.stringify(url))}&from_function=${this.cur_function}`
			})
		},
		adMaidian(data, index) {
			scAdClick(data)
			const params = {
				from_function_id: this.from_function_id  || '',
				from_function_name: this.from_function_name || '',
				cur_function_id: '',
				cur_function_name: '',
				bhv_pos: Number(index) + 1,
				location_id:  data.location_id || data.adlocation_id,
				ad_id: data.ad_primary_id || data.ad_id,
				ad_name: data.ad_name || data.ad_title,
				ad_img_url: data.ad_img_url || data.image || '',
				ad_target_url:  data.ad_target_url || data.url || '',
				// bhv_pos: Number(this.index),
				item_type: '广告',
				item_id: '701' ,
				item_name: '广告',
			}
			customPoint('ad_click', params);
		},
		// 曝光
		adExportMethod(list) {
			console.log(list,'dfsasdfd')
			list.forEach((item, index) => {
				const params = {
					from_function_id: this.from_function_id  || '',
					from_function_name: this.from_function_name || '',
					cur_function_id: '',
					cur_function_name: '',
					location_id:  item.location_id || item.adlocation_id,
					location_name:  item.location_name || '',
					// ad_putting_mode: item.location_type ? item.location_type == 1 ? '精确投放' : '固定投放' : '',
					ad_id: item.ad_id || item.ad_primary_id,
					ad_putting_modev: '',
					bhv_pos: Number(index) + 1,
					item_type: '广告',
					item_id: '701' ,
					item_name: '广告',
					// page_tab_name: '首页',
				}
				customPoint('ad_exposure', params)
			})
		},
	}
};
</script>
<style scoped lang="scss">
.banner-warpper {
	overflow: hidden;
}
.banner-warpper /deep/ .u-swiper-indicator .u-indicator-item-round {
	background: #fff !important;
	opacity: 0.5 !important;
	height: 6rpx !important;
}

.banner-warpper /deep/ .u-indicator-item-round {
	height: 6rpx !important;
}


.banner-warpper /deep/ .u-swiper-indicator .u-indicator-item-round-active {
	background-color: #fff !important;
	opacity: 1 !important;
}

.banner-warpper {
	.swiper-container {
		height: auto;
	}

	.swiper-slide {
		height: auto;
	}

	.swiper-pagination {
		bottom: 0;
	}
}

.hot-item {
	display: inline-block;
	width: 100%;
	margin: 0 auto;
	border-radius: 8rpx;
	// box-shadow: 0 8rpx 12rpx 0 rgba(191, 215, 237, 0.75);
	background-size: 100% 100% !important;
	background-repeat: no-repeat !important;
}

.no_bg {
	background-color: rgba(255, 255, 255, 0);
}
</style>
