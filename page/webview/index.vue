<template>
	<div>
		<web-view :src="url" @message="handleViewMess"></web-view>
	</div>
</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getLocation
	} from '@/utils/util.js'
	import CustomHead from '@/components/common/customHead.vue'
	export default {
		name: "index",
		components: {
			CustomHead
		},
		data() {
			return {
				url: '',
				share: {
					title: '健康160',
					path: '/page/webview/index',
					imageUrl: '',
					desc: '',
					content: '',
				},
				locationMap: {}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			handleViewMess(event) {
				console.log('分享信息：------------', event);
				if (event && event.detail && event.detail.data) {
					const item = event.detail.data[event.detail.data.length - 1];
					const {
						title,
						imgUrl,
						link,
						desc
					} = item;
					this.share.title = desc ? desc : '';
					this.share.desc = desc ? desc : '';
					this.share.imageUrl = imgUrl
					this.share.path = `/page/index/index?jumpWebview=${encodeURIComponent(link)}`
				}
			},
			resetUrl(url) {
				const cid = this.$store.state.common.wx_cid;
				let newUrl = url.split("&");
				let w_url = '';
				newUrl.forEach((curr, index) => {
					if (index == 0) {
						if (curr.includes("?")) {
							w_url = `${curr}`;
						} else {
							w_url = `${curr}?`;
						}
					} else {
						if (curr.includes("user_key")) {
							w_url = `${w_url}&user_key=${this.userInfo.user_key}`
						} else if (curr.includes("cid")) {
							w_url = `${w_url}&cid=${cid}`
						} else {
							w_url = `${w_url}&${curr}`
						}
					}
				})
				if (!w_url.includes("user_key")) {
					w_url = `${w_url}&user_key=${this.userInfo.user_key}`
				}

				if (!w_url.includes("cid")) {
					w_url = `${w_url}&cid=${cid}`
				}

				if (!w_url.includes('lat') && !w_url.includes('lng')) {
					w_url = `${w_url}&lat=${this.locationMap.latitude}&lng=${this.locationMap.longitude}`
				}

				if (!w_url.includes('from')) {
					w_url = `${w_url}&from=guahao`
				}

				return w_url;
			}
		},
		async onLoad(val) {
			// 有的H5页面进去不显示title
			uni.setNavigationBarTitle({
				title: ''
			})
			//动态获取的url
			const redirectURL = `/page/webview/index?url=${val.url}`
			this.share.path = `/page/index/index?redirectURL=${encodeURIComponent(redirectURL)}`
			this.locationMap = await getLocation();
			let url = JSON.parse(decodeURIComponent(val.url));
			// 对url参数进行重置
			url = this.resetUrl(url);
			console.log(url, "webview 跳转的url");
			this.url = url;
		}
	}
</script>
<style lang="scss" scoped>
</style>
