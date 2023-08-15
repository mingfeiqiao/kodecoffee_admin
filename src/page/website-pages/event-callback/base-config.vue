<template>
  <div class="ko-mo" id="base-config">
    <div>
      <el-descriptions title="基础信息" direction="vertical">
        <el-descriptions-item label="application_id">
          <div style="display: flex;align-items: center">
              <span>
                {{ application_id }}
              </span>
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
    <div>
      <el-descriptions title="用户同步" direction="vertical">
        <el-descriptions-item label="UserApi-Key">
          <div style="display: flex;align-items: center">
                <span>
                  {{ application_id }}
                </span>
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
    <div style="background-color: #FAFAFA;padding: 24px">
      <div class="title-16">
        用户同步:
      </div>
      <div>
            <span>
              1. 当开发者拥有自己的用户登录和账号系统时，用户同步帮助用户把Kodepay的用户支付相关信息同步给开发者自己的账号系统中，完成绑定，更多请参考&nbsp;
            </span>
        <span class="link">用户同步说明文档</span>
      </div>
    </div>
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