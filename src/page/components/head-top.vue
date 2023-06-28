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
      <div v-if="$store.state.guide_step < 4" style="background-color: #B7EB8F;margin-left: 24px;padding:3px 12px; border-radius: 4px;cursor: pointer" @click="toGuide">
        <span>{{$t('Setup Guide')}}</span>
        <span>{{  `${$store.state.guide_step}/4`}}</span>
      </div>
    </div>
    <div style="display: flex;align-items: center">
      <div>
        <language-change></language-change>
      </div>
     <div style="margin-left: 20px;">
       <user-info></user-info>
     </div>
    </div>
  </div>
</template>
<script>
import userInfo from "./user-info.vue";
import languageChange from "./language-change.vue";
export default {
  data () {
    return {
      isTestMode: false,
      isCollapse: false,
      is_finish_guide: false,
    }
  },
  components: {
    userInfo,
    languageChange
  },
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
    this.guide_step = localStorage.getItem('guideStep') || 0;
    this.$store.commit('setGuideStep', this.guide_step);
    this.isCollapse = this.collapse;
    this.isTestMode = this.$mode === this.MODECONFIG.SANDBOX.mode;
    if (this.guide_step < 4 && !this.isTestMode) {
      window.location.href = this.MODECONFIG.SANDBOX.baseURL;
    }
  },
  methods: {
    toGuide() {
      this.$router.push('/guide');
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit('collapseChange', this.isCollapse);
    },
    checkoutMode() {
      if (!this.isTestMode && this.$store.state.guide_step < 4) {
        this.isTestMode = true;
        this.$message({
          message: this.$t('Please complete the setup guide first'),
          type: 'warning'
        });
        return;
      }
      // 获取当前 URL 路径
      if(this.$mode === this.MODECONFIG.SANDBOX.mode)  {
        // 跳转到正式环境
        window.location.href = this.MODECONFIG.PRODUCTION.baseURL;
      } else {
        // 跳转到沙箱环境
        window.location.href = this.MODECONFIG.SANDBOX.baseURL;
      }
    }
  }
}
</script>
<style scoped lang="less">
.head-container {
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
}
</style>