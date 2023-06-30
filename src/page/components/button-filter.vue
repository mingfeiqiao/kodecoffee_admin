<style scoped lang="less">
.content {
  padding: 0 12px;
  cursor: pointer;
  border-width: 1px;
  border-color: #e4e4e4;
  border-style: solid;
  line-height: 32px;
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
  color: #2f54eb;
  border: 1px solid #2f54eb;
}
</style>
<template>
  <div style="display:flex;align-items: center;height: 32px">
    <div v-for="(item, index) in data" :key="item.value" @click="click(item.value)" :class="['content', parseInt(index) === 0 ? 'left' : parseInt(index) === data.length - 1 ? 'right' : '', item.value == local_device ? 'is_active' : '']">
      {{ $t(item.name)}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      local_device: null
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
      this.local_device = newDevice;
    }
  },
  created() {
    this.local_device = this.device;
  },
  methods: {
    click(value) {
      this.$emit('change', value);
      this.local_device = value;
    }
  }
};
</script>