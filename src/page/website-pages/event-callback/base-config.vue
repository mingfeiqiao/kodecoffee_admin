<template>
  <div style="padding: 24px 0">
    <el-descriptions :title="$t('User Information')">
      <el-descriptions-item label="application_id">
        <div style="display: flex;align-items: center">
          <span>{{ application_id }}</span>
          <span style="padding-left: 8px;display: flex;align-items: center;cursor: pointer"
                @click="copy(application_id)" id="copy_text">
                <svg width="16" height="16">
                  <use xlink:href="#copy"></use>
                </svg>
              </span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
      application_id: '',
      user_api_key: '',
    }
  },
  methods: {
    copy(text) {
      let clipboard = new Clipboard('#copy_text', {
        text: () => {
          return text;
        }
      })
      clipboard.on('success', e => {
        this.$message({
          message: this.$t('copy success'),
          type: 'success'
        })
        clipboard.destroy() // 释放内存
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: this.$t('browser not support copy'),
          type: 'warning'
        })
        clipboard.destroy()
      })
    },
  },
  mounted() {
    this.application_id = localStorage.getItem(this.$mode + 'applicationKey')
  }
}
</script>