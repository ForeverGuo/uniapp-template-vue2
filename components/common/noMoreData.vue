
<template>
  <div class="no-more-data" v-if="finished && list && list.length">
    <slot name="content">
      <div class="grey-line"></div>
      <div class="text" :class="font">{{text}}</div>
      <div class="grey-line"></div>
    </slot>
  </div>
</template>
<script>
  export default {
    props: {
      finished:{
        type: Boolean,
        required: true,
        default: false
      },
      list: {
        type: Array,
        required: true,
        default: () => []
      },
      text: {
        type: String,
        required: false,
        default: ' 亲，已显示全部哦～ '
      },
      font: {
        type: String,
        default: 'fs14'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .no-more-data {
    display: flex;
		display: -webkit-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    margin-bottom: 6rpx;
		padding: 24rpx 0;
		/* #ifdef MP-WEIXIN */
		width: 100vw;
		/* #endif */
    text-align: center;
    color: #999;
    .text {
      margin: 0 22rpx;
      // font-size: .373333rem;
    }
    .grey-line {
      width: 126rpx;
      height: 2rpx;
      background: #EBEBEB;
    }
  }
</style>


