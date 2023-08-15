<template>
  <div class="ko-mo">
    <el-tabs v-model="active_table_name" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="base-config">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="webhook-config">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="日志" name="webhook-logs">
        <router-view></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active_table_name: 'base-config'
    };
  },
  methods: {
    async handleClick(tab) {
      this.$router.push({ path: '/' + tab.name });
      await this.$nextTick(); // 等待路由完成导航
      this.scrollToAnchor(tab.name);
    },
    scrollToAnchor(anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>
<style scoped lang="less">
</style>
