<template>
  <div v-if="showModal" class="custom-dialog" :class="className">
    <div class="shadow" @click="$emit('hide')"></div>
    <div class="dialog" :style="{top: top}">
      <div v-if="showClose" class="custom-close" @click="$emit('hide')">
        <i class="iconfont">&#xe605;</i>
      </div>
      <div class="dialog-top">
        <slot name="top">
          <h3 v-if="title" class="custom-title">{{ title }}</h3>
        </slot>
      </div>
      <div class="dialog-body">
        <slot name="body">
          <div class="custom-content">
            <!-- eslint-disable-next-line -->
           <!-- <div v-html="content"></div> -->
					 <!-- #ifdef MP-WEIXIN -->
					 <u-parse :html="content"></u-parse>
					 <!-- #endif -->
					 <!-- #ifdef MP-ALIPAY -->
						<div>{{ content }}</div>
					 <!-- #endif -->
          </div>
        </slot>
      </div>
      <div class="dialog-foot">
        <slot name="foot">
          <div class="buttons flex justify_center">
            <div v-if="showCancel" class="btn plain" @click="$emit('cancel')">
              {{ cancelText }}
            </div><div v-if="showConfirm" class="btn primary" @click="$emit('confirm')">
              {{ confirmText }}
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String || Object,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    showConfirmButton: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showClose: {
      type: Boolean,
      default: true
    },
		top: {
			type: String,
			default: '50%'
		}
  },
  computed: {
    showModal: {
      get() {
        return this.show
      },
      set() {
        return this.showModal
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-dialog {
	// height: 100%;
	height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
	z-index: 999;
  .shadow {
    position: relative;
    width: 100vw;
    // height: 100vh;
		height: 100%;
    background: rgba(0, 0, 0, .5);
  }
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 80vw;
		max-width: 80vw;
    border-radius: 24rpx;
    background-color: #FFF;
  }
  .custom-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    padding: .266667rem;
    .iconfont {
      position: relative;
      font-size: .32rem;
      color: #999;
    }
  }
  .dialog-top {
    .custom-title {
			margin-top: 38rpx;
			font-size: 38rpx;
			line-height: 38rpx;
      font-weight: 400;
      text-align: center;
			background: #fff;
			height: 93rpx;
      color: rgba(51, 51, 51, 1);
			/* #ifdef MP-ALIPAY */
			padding-bottom: 18rpx;
			/* #endif */
			/* #ifdef MP-TOUTIAO */
			padding-bottom: 18rpx;
			/* #endif */
    }
  }
  .dialog-body {
    position: relative;
    min-height: 300rpx;
		max-height: 500rpx;
		overflow: auto;
		margin: 16rpx 0;
    .custom-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-height: 400rpx;
      overflow: scroll;
      padding: 0 24rpx;
      font-size: 28rpx;
      line-height: 50rpx;
			/* #ifdef MP-ALIPAY */
			line-height: 38rpx;
			/* #endif */
			/* #ifdef MP-TOUTIAO */
			line-height: 38rpx;
			/* #endif */
      font-weight: 400;
      color: #666;
      color: rgba(102, 102, 102, 1);
			text-align: left;
			padding-bottom: 100rpx;
    }
  }
  .dialog-foot {
    position: relative;
    .buttons {
      bottom: 10rpx;
      width: 100%;
      height: 74rpx;
      border-top: 2rpx solid #F5F5F5;
    }
    .btn {
      position: relative;
      width: 100%;
      font-size: 38rpx;
      line-height: 74rpx;
      font-weight: 400;
      color: rgba(0, 210, 195, 1);
      background-color: #fff;
			border-radius: 12rpx;
      &.plain {
        color: #666;
      }
    }
  }
}
</style>

