<template>
    <div class="picker">
      <el-date-picker
        size="small"
        v-model="date_range"
        type="daterange"
        format="yyyy-MM-dd"
        popper-class="my-date-picker"
        value-format="yyyy-MM-dd"
        @change="dateRangeChange"
        :picker-options="picker_options"
        :range-separator="$t('to')"
        :start-placeholder="$t('start date')"
        :end-placeholder="$t('end date')">
      </el-date-picker>
    </div>
</template>
<script>
export default {
  data () {
    return {
      date_range: [],
      picker_options : {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
    this.updateShortcuts();
  },
  created() {
    this.date_range = this.time_filter_range
  },
  watch: {
    time_filter_range () {
      this.date_range = this.time_filter_range
    }
  },
  props: {
    time_filter_range:[],
    change: {
      type: Function,
      default: () => {
      }
    }
  },
  methods : {
    updateShortcuts () {
      this.$set(this.picker_options, 'shortcuts', this.getShortcuts());
    },
    getShortcuts () {
      return  [
        {
          text: this.$t('Last week'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: this.$t('Last month'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('Last three months'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
    },
    /**
     *
     */
    dateRangeChange () {
      this.$emit('change', this.date_range);
    },
  }
}
</script>
<style scoped lang="less">

</style>