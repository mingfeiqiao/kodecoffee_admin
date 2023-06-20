<template>
  <div class="language-switch">
    <el-popover
      placement="bottom-start"
      trigger="hover"
    >
      <div>
        <ul>
          <li v-for="lang in langOptions" :key="lang.short" @click="changeLanguage(lang.short)" style="cursor: pointer;padding: 8px">
            <span>{{ lang.full_name }}</span>
          </li>
        </ul>
      </div>
      <div slot="reference">
        <div>
          <span class="selected-lang">
            {{ selectedLanguage}}
            <i class="el-icon-caret-bottom"></i>
          </span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLanguage: 'en-US',
      langOptions: [
        { short: 'en-US', full_name: 'English' },
        { short: 'zh-CN', full_name: '中文(简体)'},
      ],
    };
  },
  created() {
    this.selectedLanguage = this.$i18n.locale;
  },
  methods: {
    changeLanguage(lang) {
      this.selectedLanguage = lang;
      this.$i18n.locale = lang;
    }
  }
};
</script>

<style scoped>
.language-switch {
}

.selected-lang {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.selected-lang i {
  margin-left: 5px;
}
</style>
