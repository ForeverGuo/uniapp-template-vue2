<template>
	<div class="select_city">
		<!-- 选择城市 -->
		<u-popup 
			v-model="showCityPop"
			mode="bottom"
			height="45%"
			:mask-close-able="false"
			:safe-area-inset-bottom="true"
		>
			<div class="city_pop">
				<div class="title flex justify_between">
					<div class="fs15 c_666" @tap.stop="handleClose">取消</div>
					<div class="fs15 c_666">选择城市</div>
					<div class="fs15" style="color: #2979ff" @tap.stop="handleCertain">确认</div>					
				</div>
				<div class="content">
					<picker-view :value="valueArr" @change="change" class="picker-view">
						<picker-view-column>
							<view class="item" v-for="(item, index) in provinces" :key="index">
								<view class="line-1">{{ item.areaName }}</view>
							</view>
						</picker-view-column>
						<picker-view-column>
							<view class="item" v-for="(item, index) in citys" :key="index">
								<view class="line-1">{{ item.areaName }}</view>
							</view>
						</picker-view-column>
					</picker-view>
				</div>
			</div>
		</u-popup>
	</div>
</template>
<script>
	import { common } from '@/services/index.js'
	export default {
		props: {
			isShowCity: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showCityPop: false,
				cityList: [],
				provinces: [],
				citys: [],
				valueArr: [],
				city_obj: {
					provice_name: '广东',
					city_name: '深圳',
					city_id: 5
				}
			}
		},
		watch: {
			isShowCity(oVal, nVal) {
				this.showCityPop = oVal;
			}
		},
		mounted() {
			this.getCityList()
		},
		methods: {
			getCityList() {
				common.getCityInfo().then(res => {
				  let list = res.data.area_list;
					for(let [key, item] of Object.entries(list)) {
						let temp = [];
						this.provinces.push({
							areaName: item.areaName,
							areaId: item.areaId
						})
						for(let [_key, _item] of Object.entries(item.children)) {
							temp.push({
								areaName: _item.areaName,
								areaId: _item.areaId
							})
						}
						this.cityList.push(temp);
					}
					this.citys = this.cityList[0]
				})
				
			},
			change(e) {
				console.log(e)
				let [provice_index, city_index] = e.detail.value;
				this.citys = this.cityList[provice_index];
				
				this.city_obj.provice_name = this.provinces[provice_index].areaName;
				this.city_obj.city_name = this.citys[city_index].areaName;
				this.city_obj.city_id = this.citys[city_index].areaId
			},
			handleClose() {
				this.showCityPop = false;
				this.$emit('handleSelectCity', '')
			},
			handleCertain() {
				this.$emit("handleSelectCity", this.city_obj)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.select_city {
		.city_pop {
			padding: 26rpx;
			.content {
				height: 100rpx;
			}
		}
		.picker-view {
			height: 300rpx;
		}
		.item {
			line-height: 70rpx;
			align-items: center;
			justify-content: center;
			text-align: center;
			color: #333;
			font-size: 30rpx;
		}
	}
</style>
