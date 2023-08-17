<template>
  <div class="ko-mo">
    <el-tabs v-model="active_name" @tab-click="handleClick">
      <el-tab-pane :label="$t('Basic Information')" name="base-config">
        <base-config v-if="active_name === 'base-config'"></base-config>
      </el-tab-pane>
      <el-tab-pane :label="$t('External User Information Synchronization')" name="sym-key">
        <external-user-sync v-if="active_name === 'sym-key'"></external-user-sync>
      </el-tab-pane>
      <el-tab-pane :label="$t('Callback Event Configuration')" name="web-hook-config">
        <web-hook-config v-if="active_name ==='web-hook-config'"></web-hook-config>
      </el-tab-pane>
      <el-tab-pane :label="$t('Callback Logs')" name="web-hook-logs">
        <web-hook-logs v-if="active_name ==='web-hook-logs'"></web-hook-logs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import BaseConfig from "./event-callback/base-config.vue";
import ExternalUserSync from "./event-callback/external-user-sync.vue";
import WebHookConfig from "./event-callback/web-hook-config.vue";
import WebHookLogs from "./event-callback/web-hook-logs.vue";
import {getWebHookEventTypesApi} from "../../api/interface";
export default {
  data() {
    return {
      active_name: 'base-config'
    }
  },
  components: {
    BaseConfig,
    ExternalUserSync,
    WebHookConfig,
    WebHookLogs
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style scoped lang="less">
.ko-mo /deep/ .el-dialog__header {
  padding: 0;
}

.ko-mo /deep/ .el-dialog__body {
  padding: 0;
}

.ko-mo /deep/ .el-tabs__header {
  margin: 0;
}
</style>
