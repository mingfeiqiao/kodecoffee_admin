<template>
  <div class="head-container">
    <div style="display:flex;align-items: center;">
      <div style="padding-left: 12px;cursor: pointer;">
        <el-radio-group v-model="isCollapse">
          <svg @click="changeCollapse" width="16" height="16">
            <use v-if="isCollapse" xlink:href="#menu-open"></use>
            <use v-else xlink:href="#menu-close"></use>
          </svg>
        </el-radio-group>
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
import userInfo from "@/page/components/user-info.vue";
import languageChange from "@/page/components/language-change.vue";
export default {
  name: "AdminHeadTop",
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
    // this.init()
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit('collapseChange', this.isCollapse);
    },
  }
}
</script>
<style scoped lang="less">
.head-container {
  display: flex;
  height: 40px;
  padding-right: 20px;
  justify-content: space-between;
  align-items: center;
}
</style>