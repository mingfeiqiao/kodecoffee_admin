<template>
  <div style="width: 100%;height: 100%">
    <router-view></router-view>
    <new-icon></new-icon>
  </div>
</template>
<script>
import NewIcon from "./page/components/new-icon.vue";
export default {
  components: {NewIcon},
  created() {
    let last_mode = localStorage.getItem('lastMode');
    if (last_mode) {
      if (this.$mode !== last_mode) {
        if (last_mode === this.MODECONFIG.PRODUCTION.mode) {
          window.location.href = this.MODECONFIG.PRODUCTION.baseURL;
        } else if (last_mode === this.MODECONFIG.SANDBOX.mode) {
          window.location.href = this.MODECONFIG.SANDBOX.baseURL;
        }
      }
    }
  }
}
</script>
<style lang="less">
  @import 'css/root';
  @import 'css/common';
  .el-table__header {
    background-color: #85ce61; /* 设置表头背景色 */
    /* 添加其他样式设置 */
  }
  .el-table {
    color: #101010;
  }
</style>
