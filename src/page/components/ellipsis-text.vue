<template>
  <div class="ellipsis-container" :style="{ 'max-width': max_width + 'px' }">
    <el-tooltip :disabled="!is_text_overflow" :content="text" placement="top">
      <span class="ellipsis-text" :class="{ 'text-overflow': is_text_overflow }">
        {{ text }}
      </span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    max_width: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      is_text_overflow: false
    };
  },
  mounted() {
    this.is_text_overflow = this.isTextOverflow(this.text, this.max_width);
  },
  methods: {
    isTextOverflow(text, container_max_width) {
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'nowrap';
      span.style.font = 'inherit';
      span.innerText = text;
      document.body.appendChild(span);
      const isOverflow = span.offsetWidth > container_max_width;
      document.body.removeChild(span);
      return isOverflow;
    }
  }
};
</script>

<style scoped lang="less">
.ellipsis-container {
  position: relative;
}

.ellipsis-text {
  display: inline-block;
  overflow: hidden; // 超出的文本隐藏
  text-overflow: ellipsis; // 溢出用省略号显示
  white-space: nowrap; // 溢出不换行
}

.text-overflow {
  max-width: 100%;
}
</style>