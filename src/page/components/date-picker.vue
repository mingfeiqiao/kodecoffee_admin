<template>
  <el-popover
    placement="bottom-start"
    trigger="manual"
    v-model="visible">
    <div>
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
      <el-select size="small" v-model="timezone" :placeholder="$t('Choose Timezone')" @change="handleTimezoneChange" style="width: 100px">
        <el-option
          v-for="zone in timezone_options"
          :key="zone.value"
          :label="zone.label"
          :value="zone.value"
          ></el-option>
        </el-select>
    </div>
    <div
      slot="reference"
      style="width: 200px;height:30px;display: flex;align-items: center;justify-content:center;border: 1px solid #dcdfe6;cursor: pointer;
    border-radius: 4px"
      @click="visible = !visible"
      class="selected-dates-text"
    >
      {{ formatDateRange(date_range) ? formatDateRange(date_range) : "xxx"}}
    </div>
  </el-popover>
</template>
<script>
export default {
  data () {
    return {
      visible:false,
      date_range: [],
      timezone: '',
      timezone_options: [
        { label: 'UTC+0', value: 'UTC+0' }
      ],
      picker_options : {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
    this.updateShortcuts();
    this.setTimeZone();
  },
  created() {
    this.date_range = this.time_filter_range
  },
  watch: {
    time_filter_range () {
      this.date_range = this.time_filter_range;
    },
    time_zone () {
      this.setTimeZone();
    }
  },
  props: {
    time_filter_range:[],
    time_zone:"",
    change: {
      type: Function,
      default: () => {
      }
    }
  },
  methods : {
    setTimeZone() {
      if (this.time_zone) {
        this.timezone = this.time_zone;
        let is_find_time_zone = false;
        this.timezone_options.forEach(option => {
          if (option.label === this.timezone) {
            is_find_time_zone = true;
          }
        })
        if (!is_find_time_zone) {
          this.timezone_options.push({label: this.timezone, value: this.timezone})
        }
      }
    },
    formatDateRange(dateRange) {
      if (dateRange && Array.isArray(dateRange)) {
        if (dateRange.length === 0) {
          return this.$t('Date Selection')
        } else {
          const start = dateRange[0] || "";
          const end = dateRange[1] || "";
          return `${start} ~ ${end}`;
        }
      } else {
        return this.$t('Date Selection')
      }
    },
    handleTimezoneChange(value) {
      console.log('xxx');
      this.$emit('change', this.date_range, value);
    },
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
      this.visible = false;
      this.$emit('change', this.date_range, this.timezone);
    },
  }
}
</script>
<style scoped lang="less">
.picker {
  display: flex;
}
</style>