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
  data () {
    return {
    }
  },
  created() {
    const userInfo = localStorage.getItem(this.$mode + 'userInfo') ? JSON.parse(localStorage.getItem(this.$mode + 'userInfo')) : {};
    this.$store.commit('setUserInfo', userInfo)
  },
  methods: {
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
