<!-- 公用组件：公共banner
  /**
  * 公共banner
  * @module personalMainPage/components
  * @desc 首页通用banner
  * @author 樊帆
  * @date 2019年8月3日10:30
  * @interface 无
  * @document 无
  * @example 调用示例
  * <commonBanner></commonBanner>
  */ -->
<template>
  <div v-if="bannerAdList && bannerAdList.length" :id="'topbanners_' + sensorsid" class=" boradius4 banner-warpper" :class="bg">
    <template v-if="bannerAdList.length > 1">
      <swiper ref="swiper" :style="{height: `${height}`}" :options="swiperOption">
        <swiper-item v-for="(item, index) in bannerAdList" :key="index" v-adexport="item" :bhv_pos="index + 1">
          <div
            class="hot-item block backgroundimg"
            :data-growing-title="item.ad_name"
						:style="{'background-image':`url(${fixUrl(item.image)})`,height: `${height}`}"
            data-sensors-click
            data-event-BI="click"
            data-track="true"
            :data-url="item.url ? item.url : ''"
            :data-BI-params="JSON.stringify({
              item_type: '',
              item_id: '',
              item_name: '',
              from_function_id: from_function_id,
              from_function_name: from_function_name,
              cur_function_id: cur_function_id,
              cur_function_name: cur_function_name,
              location_id: item.locate_id,
              bhv_pos: item.position,
              ad_id: item.id,
              ad_name: item.ad_name,
              ad_img_url: item.image,
              ad_target_url: item.url,
              serving_dep_name: item.serving_dep_name,
              serving_project_name: item.serving_project_name,
              serving_ill_name: item.serving_ill_name,
              ad_putting_mode: item.location_type,
              is_ad: 1,
              ev_name:ev_name
            })"
          ></div>
        </swiper-item>
        <div slot="pagination" class="swiper-pagination"></div>
      </swiper>
    </template>
    <template v-else>
      <div class="swiper-container">
        <div
          v-for="(item, index) in bannerAdList"
          :key="index"
          class="hot-item block backgroundimg"
					:style="{'background-image':`url(${fixUrl(item.image)}), url(${noimg})`, height: `${height}`}"
          data-sensors-click
          data-event-BI="click"
          data-track="true"
          :data-url="item.url ? item.url : ''"
          v-adexport="item" 
          :bhv_pos="index + 1"
          :data-BI-params="JSON.stringify({
            item_type: '',
            item_id: '',
            item_name: '',
            from_function_id: from_function_id,
            from_function_name: from_function_name,
            cur_function_id: cur_function_id,
            cur_function_name: cur_function_name,
            location_id: item.locate_id,
            bhv_pos: item.position,
            ad_id: item.id,
            ad_name: item.ad_name,
            ad_img_url: item.image,
            ad_target_url: item.url,
            is_ad: 1,
            serving_dep_name: item.serving_dep_name,
            serving_project_name: item.serving_project_name,
            serving_ill_name: item.serving_ill_name,
            ad_putting_mode: item.location_type,
            ev_name: ev_name
          })"
        ></div>
      </div>
    </template>
  </div>
</template>
<script>
import service from '@/services'
import { fixImageUrl } from '@/utils/util.js'
export default {
  props: {
    sensorsid: {
      type: String,
      default: ''
    },
    bannerId: {
      type: [String, Number],
      default: ''
    },
    cat_id: {// 公共科室id
      type: [String, Number],
      default: ''
    },
    unit_id: {// 医院id
      type: [String, Number],
      default: ''
    },
    height: {
      type: String,
      default: '172rpx'
    },
    bg: {
      type: String,
      default: 'bg_white'
    },
    from_function_id: {
      type: String,
      default:''
    },
    from_function_name: {
      type: String,
      default:''
    },
    cur_function_id: {
      type: String,
      default:''
    },
    cur_function_name: {
      type: String,
      default:''
    },
    ev_name: {
      type: String,
      default:''
    }
  },
  data() {
    return {
      noimg: 'https://wximg.91160.com/wechat/img/miniProgram/default/article_default.png',
      swiperOption: {
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        coverflowEffect: {
          rotate: 0,
          stretch: -20,
          depth: 0,
          modifier: 1,
          slideShadows: false
        },
        autoplay: {
          delay: 5000, // 自动切换的时间间隔，单位ms
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      bannerAdList: []
    }
  },
  mounted() {
    this.getBannerAdList()
  },
  methods: {
		fixUrl(url) {
			return fixImageUrl(url)
		},
    _getAdvertData(params) {
      return service.common.getAdvertData(params)
    },
    // 顶部banner切换
    getBannerAdList() {
      this._getAdvertData({
        location_id: this.bannerId,
        dep_id:this.cat_id,
        unit_id: this.unit_id
      }).then((res) => {
        if (res.code == 1) {
          this.bannerAdList = res.data[this.bannerId]
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.banner-warpper {
  overflow: hidden;
}
.banner-warpper {
  min-height: 138rpx;
  .swiper-container {
    height: auto;
  }
  .swiper-slide {
    width: 690rpx;
    height: auto;
  }
  .swiper-pagination{
    bottom:0;
  }
}
.h93 {
  height: 186rpx;
}
.hot-item {
  width: 690rpx;
  height: 172rpx;
  margin: auto;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 	12rpx 0 rgba(191, 215, 237, .75);
}
.no_bg {
  background-color: rgba(255,255,255,0)
}
</style>
