<template>
  <div class="main">
    {{ msg }}
  </div>
</template>
<script>
export default {
  data() {
    return {
        msg: 'hello uniapp vue2'  
    }
  }
}
</script>
<style scoped lang="scss">
.main {
  padding: 300rpx 0;
  text-align: center;
}
</style>
