<template>
	<view>
		<movable-area class="moveAdImg">
			 <movable-view :id="sensorsId" class="add" direction="all" :x="wdwidth - 20" :y="wdheight - 210">
				 <a
				   v-if="adData && (adData.img || adData.image)"
				   id="link"
				   :href="adData.url ? adData.url : 'javascript:;'"
					 :url="adData.url ? adData.url : 'javascript:;'"
				   class="block"
				 >
				   <image :src="`https://images.91160.com/${adData.image}`">
				 </a>
				 <!-- 电话 -->
				 <div
				    v-if="icon"
				 	 class="icon block"
				  	 @click.stop="handlePhone"
				 	 :style="{background: `url(${icon}) 0 0 / 100% 100%`}"
				 >
				  </div>
			 </movable-view>
		</movable-area>
	</view>
</template>
<script>
	import { common } from '@/services/index.js';
	export default {
	  props: {
	    sensorsId: {
	      type: String,
	      default: ''
	    },
	    dep_id: {
	      type: [String, Number],
	      default: ''
	    },
	    unit_id: {
	      type: [String, Number],
	      default: ''
	    },
	    city_id: {
	      type: [String, Number],
	      default: ''
	    },
	    onlineAdId: {
	      type: [String, Number],
	      default: ''
	    },
	    testAdId: {
	      type: [String, Number],
	      default: ''
	    },
			icon: {
				type: String,
				default: ''
			}
	  },
	  data() {
	    return {
	      adData: {},
	      ad_id: process.env.NODE_ENV !== 'production' ? this.testAdId : this.onlineAdId,
				wdwidth: '',
				wdheight: ''
	    }
	  },
	  created() {
			let _this = this;
			uni.getSystemInfo({
				success: function (res) {
					console.log(res)
					_this.wdwidth = res.windowWidth
					_this.wdheight = res.windowHeight
				}
			});
	   common.getAdvertData({
	      location_id: this.ad_id,
	      dep_id: this.dep_id,
	      unit_id: this.unit_id,
	      city_id: this.city_id
	    }).then((res) => {
	      if (!res.data) {
	        this.adData = {}
	        return false
	      }
				if (res.data[this.ad_id]) {
					this.adData = res.data[this.ad_id][0]
				}
	    })
	  },
		methods: {
			handlePhone() {
				this.$emit('makeCall')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.moveAdImg {
		width: 100%;
		height: 100vh;
		position: fixed !important;
		z-index: 999999999999999 !important;
		.add {
			position: fixed;
			right: 0;
			bottom: 200rpx;
			z-index: 10000;
			width: 144rpx;
			height: 144rpx;
			text-align: center;
			image {
				display: block;
				width: 144rpx;
				height: 144rpx;
				overflow: hidden;
			}
			.icon {
				display: block;
				width: 144rpx;
				height: 144rpx;
				overflow: hidden;
			}
		}		
	}
</style>
