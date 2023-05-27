<style scoped lang="less">
.content {
  padding: 0 12px;
  cursor: pointer;
  border-width: 1px;
  border-color: #e4e4e4;
  border-style: solid;
  line-height: 32px;
  height: 30px;
}
.left {
  border-radius: 4px 0 0 4px;
  border-right:none;
}
.right {
  border-radius: 0 4px 4px 0;
  border-left:none;
}
.is_active {
  color: #1090FF;
  border: 1px solid rgba(24, 144, 255, 1);
}
</style>
<template>
  <div style="display:flex;align-items: center;height: 32px">
    <div v-for="(item, index) in data" :key="item.value" @click="click(item.value)" :class="['content', parseInt(index) === 0 ? 'left' : parseInt(index) === data.length - 1 ? 'right' : '', item.value == localDevice ? 'is_active' : '']">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localDevice: null
    };
  },
  props: {
    data: null,
    device: {
      type: Number,
      default: null,
    },
    change: {
      type: Function,
      default: null,
    },
  },
  watch: {
    device(newDevice) {
      this.localDevice = newDevice;
    }
  },
  methods: {
    click(value) {
      this.$emit('change', value);
      this.localDevice = value;
    }
  }
};
</script>