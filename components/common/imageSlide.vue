<template>
  <div class="imageSlide">
    <div class="container" v-if="overloadTopinfo == true">
			<!-- :list="activeType == 'video' ? videoList : imageList" -->
			<div class="image-container" v-if="imageList.length > 0">
				<u-swiper  
					interval="5000" 
					mode="none"
					img-mode="scaleToFill"
					:list="imageList"
					height="380" 
					indicator-pos="bottomRight"
					@change="onSwiperChange"
				>
				</u-swiper>
				<div  class="number-container flex">
				  <!-- <div  class="video-num" :class="{'active': activeType == 'video'}"
				    @click="handleTypeChange('video')">
				    <span class="iconfont">&#xe696;</span> 视频{{multiMedia.video_num}}
				  </div> -->
				  <div class="image-num"
				    :class="{'active': activeType == 'image', 'blacktrans': blacktrans}" @click="handleTypeChange('image')">
						<!-- {{multiMedia.images_num}} -->
				    图片{{activeIndex + 1}}/{{imageList.length}}
				  </div>
				</div>
				<!-- <div class="play" v-if="activeType == 'video'" :style="{background: 'url('+ playBtn +')'}" @click.stop="goToVideoPage(video)"></div> -->
			</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showNumber: {
      type: Boolean,
      required: false,
      default: true
    },
    multiMedia: {
      type: Object,
      required: true,
      default: () => { }
    },
    square: {//是否正方形
      type: Boolean,
      required: false,
      default: false
    },
    blacktrans: {//是否透明
      type: Boolean,
      required: false,
      default: false
    },
    overloadTopinfo: {//是否加载完
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    const that = this
    return {
      activeIndex: 0,
      activeType: 'image',
      defaultImage: 'https://wximg.91160.com/wechat/img/miniProgram/guahao/unit/unit_cover_default3x.png',
      playBtn: 'https://wximg.91160.com/wechat/img/miniProgram/default/learn-play.png',
    }
  },
  watch: {
    imageNum (val) {
      this.activeType = 'image'
    },
    // videoNum (val) {
    //   if (!val) {
    //     this.activeType = 'image'
    //   } else {
    //     this.activeType = 'video'
    //   }
    // }
  },
  computed: {
    imageNum () {
      return this.imageList.length || 0
    },
    videoNum () {
      return this.videoList.length || 0
    },
    videoList () {
      const temp = []
      if (!this.multiMedia.videos) return []
      this.multiMedia && this.multiMedia.videos.forEach((item, index) => {
        temp.push({
          link: item.link,
          image: item.image,
          file_id: item.file_id
        })
      })
      return temp
    },
    imageList () {
      const temp = []
      if (typeof(this.multiMedia.images) == 'undefined' ||
				this.multiMedia.images.length == 0
			) return [{image: 'https://wximgtest2.91160.com/dist/img/unit_cover_default@3x.a5507a0.png'}]
      this.multiMedia && this.multiMedia.images.forEach((item, index) => {
        temp.push(item)
      })
      return temp
    }
  },
  methods: {
    onSwiperChange (index) {
			if(this.activeType == 'image') {
				this.activeIndex = index	
			}
    },
    handleTypeChange (type) {
      this.activeType = type
    },
    goToVideoPage (video) {
      //this.$router.push({ path: '../video/videoDetail/index.html', query: { file_id: video.file_id } })
    }
  }
}
</script>
<style lang="scss" scoped>
.imageSlide {
  width: 100%;
  overflow: hidden;
  .container {
    position: relative;
  }
	
	.play {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
		width: 61px;
		height: 60px;
	  background-repeat: no-repeat;
	  background-size: cover;
	  background-position: center;
	}
	
	
  // .image-container {
  //   position: relative;
  //   width: 10rem;
  //   height: 4.986667rem;
  // }
  .image-item {
    width: 100%;
    // 兼容 ipad
    max-width: 1125px;
    height: 4.986667rem;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1.28rem;
      height: 1.28rem;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  }
  .number-container {
    position: absolute;
    right: 22rpx;
    bottom: 4rpx;
    z-index: 10;
    .video-num,
    .image-num {
      height: 48rpx;
			padding: 0 18rpx;
			border-radius: 22rpx;
			font-size: 22rpx;
			line-height: 48rpx;
			font-weight: 400;
      text-align: center;
      color: #333;
      background: rgba(255, 255, 255, 0.71);
      &.active {
        color: #fff;
        background: rgba(0, 210, 195, 1);
      }
      &.blacktrans {
        background: rgba(0, 0, 0, 0.4);
      }
    }
    .video-num {
      margin-right: 18rpx;
      color: #333;
      .iconfont {
        font-size: 22rpx;
				margin-right: 4rpx;
      }
    }
  }
  .square-img {
    height: 10rem;
  }
}
</style>

