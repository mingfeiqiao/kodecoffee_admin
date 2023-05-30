<template>
  <div class="head-container">
    <div style="display:flex;align-items: center;">
      <div style="padding-left: 12px">
        <el-radio-group v-model="isCollapse">
          <svg @click="changeCollapse" width="16" height="16">
            <use v-if="isCollapse" xlink:href="#menu-open"></use>
            <use v-else xlink:href="#menu-close"></use>
          </svg>
        </el-radio-group>
      </div>
      <div style="padding-left: 30px">
        <el-switch
          style="display: block"
          v-model="isTestMode"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="测试模式"
          @change="checkoutMode"
          inactive-text="正式模式">
        </el-switch>
      </div>
    </div>
    <div>
      <user-info></user-info>
    </div>
  </div>
</template>
<script>
import userInfo from "./user-info.vue";
export default {
  data () {
    return {
      isTestMode: false,
      isCollapse: false
    }
  },
  components: {userInfo},
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    collapseChange: {
      type: Function,
      default: () => {}
    }
  },
  created() {
    this.isCollapse = this.collapse;
    this.isTestMode = this.$mode === this.MODECONFIG.SANDBOX.mode;
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit('collapseChange', this.isCollapse);
    },
    checkoutMode() {
      this.isTestMode = !this.isTestMode;
      if (this.$mode === this.MODECONFIG.SANDBOX.mode) {
        this.$mode = this.MODECONFIG.PRODUCTION.mode;
        // 去掉根路径的/sandbox
        const currentUrl = new URL(window.location.href);
        currentUrl.pathname = currentUrl.pathname.replace(this.MODECONFIG.SANDBOX.basePath, '');
        window.location.href = currentUrl.href;
      } else {
        this.$mode = this.MODECONFIG.SANDBOX.mode;
        // 在path前加入/sandbox
        const currentUrl = new URL(window.location.href);
        currentUrl.pathname = this.MODECONFIG.SANDBOX.basePath + currentUrl.pathname;
        window.location.href = currentUrl.href;
      }
    }
  }
}
</script>
<style scoped lang="less">
.head-container {
  background-color: #EFF2F7;
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
}
</style>