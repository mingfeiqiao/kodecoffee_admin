<template>
  <div style="width: 100%;height: 100%">
    <router-view v-if="is_option_load"></router-view>
    <new-icon></new-icon>
  </div>
</template>
<script>
import NewIcon from "./page/components/new-icon.vue";
import {getOptions} from "./api/interface";
import Vue from "vue";
export default {
  data () {
    return {
      is_option_load: false
    }
  },
  components: {NewIcon},
  created() {
    getOptions().then(res => {
      return res.json();
    }).then(res => {
      Vue.prototype.OPTIONS = res;
      this.is_option_load = true;
    }).catch(err => {
      console.log(err);
    })
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
</style>
