<template>
  <div style="width:100%;height: 100%;">
    <div>
      <div style="display:flex;justify-content: center;align-items: center;padding-bottom:12px" v-if="$store.state.guide_step < 4">
        <div style="width: 100%;background-color: rgba(230, 247, 255, 1);border-radius: 5px;padding: 8px 8px;text-align: left;display: flex;align-items: center">
          <i class="el-icon-warning" style="color: #1990FF"></i>
          <div style="padding-left: 8px">
            <span>{{ `${$t('The onboarding process is completed')} ${$store.state.guide_step}/4`  }}</span>
          </div>
          <div @click="toGuide" class="link" style="padding-left: 12px">
            {{ $t('Continue')}}
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-card-container">
      <dashboard-card v-for="(value, key) in overall_data" :key="key" :data="value"></dashboard-card>
    </div>
    <div style="margin-top: 24px;background-color: #ffffff;height: 100%;padding: 24px">
      <div>
        <div style="display: flex;align-items: center;">
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
          <div style="display: flex;align-items: center;margin-left: 24px;">
            <div style="padding-right: 12px">{{$t('extension') + ':'}}</div>
            <div>
              <el-select size="small" v-model="client_key" :placeholder="$t('select placeholder')" clearable @change="getData" filterable v-loading="client_list_loading">
                <el-option
                  v-for="item in client_list"
                  :key="item.client_key"
                  :label="$t(item.name)"
                  :value="item.client_key">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div style="display: flex;flex-wrap: wrap;justify-content: space-between;align-items: center;">
          <div class="echarts-container" v-for="(value,key) in title_ref" :key="key">
            <div class="echart-title">
              <span style="font-size: 16px">{{ `${$t(value)}`}}</span>
              <span>{{ `(${title_counts[key]})`}}</span>
            </div>
            <div :id="echarts_ids[key]" class="chart"></div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardCard from "../components/dashboard-card.vue";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import {dashBoardApi, planFilterListApi, pluginList} from "../../api/interface";

export default {
  components: {DashboardCard},
  data () {
    return {
      echarts_ids : {
        amount_total: 'kodepay_amount_total-chart',
        revenue: 'kodepay-revenue-chart',
        order: 'kodepay-order-chart',
        success_pay: 'kodepay-success-pay-chart',
        new_subscription: 'kodepay-new-subscription-chart',
        new_customer: 'kodepay-new-customer-chart',
      },
      picker_options : {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      data_field_ref:{
        amount_total: "all_pay_amount_list",
        revenue: "real_amount_list",
        order:"transaction_list",
        success_pay:"pay_success_list",
        new_subscription:"active_recurring_list",
        new_customer:"user_count_list",
      },
      title_ref:{ // 图标的title
        amount_total: "gross volume",
        revenue: "net volume",
        order:"orders",
        success_pay:"successful payments",
        new_subscription:"new subscriptions",
        new_customer:"new customers",
      },
      title_counts:{ // 图表的总额
        amount_total: "",
        revenue: "",
        order:"",
        success_pay:"",
        new_subscription:"",
        new_customer:"",
      },
      echarts_instances: {
        amount_total: null,
        revenue: null,
        order: null,
        success_pay: null,
        new_subscription: null,
        new_customer: null,
      },
      overall_data : {},
      date_range: [],
      common_options: {
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        color: ['#2F54EB'],
        series: [
          {
            data: [],
            type: 'line'
          }
        ]
      },
      // 设置loading的配置
      loading_options :{
        text: 'loading', // 自定义加载文本
        color: '#2F54EB', // 自定义加载颜色
        textColor: '#999', // 自定义加载文本颜色
        maskColor: 'rgba(255, 255, 255, 0.8)', // 自定义加载遮罩层颜色
        zlevel: 0 // loading的层级，设置为和图表层级相同
      },
      client_key:'',
      client_list_loading:false,
      client_list:[],
    }
  },
  watch: {
    '$i18n.locale'() {
      this.updateShortcuts();
    }
  },
  mounted() {
    this.guide_step = this.$store.state.guide_step;
    if (this.guide_step < 4) {
      this.toGuide();
    } else {
      this.setDefaultTime();
      this.initEchartsInstance();
      this.getData();
      this.updateShortcuts();
      window.addEventListener('resize', this.changeSize);
    }
  },
  created() {
    this.getPluginList();
  },
  methods: {
    getPluginList() {
      this.client_list_loading = true;
      this.client_list = [];
      pluginList().then(res => {
        this.client_list_loading = false;
        if (parseInt(res.data.code) === 100000) {
          this.client_list = res.data.data;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        this.client_list_loading = false;
        console.log(err);
      });
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
     * 跳转到guide页面
     */
    toGuide () {
      this.$router.push({path: '/guide'})
    },
    /**
     *
     */
    dateRangeChange () {
      this.getData();
    },
    /**
     *
     */
    changeSize () {
      for (let key in this.echarts_instances) {
        this.echarts_instances[key].resize();
      }
    },
    /**
     * @param data
     * @returns {{total_revenue_data: {title_value: string, bottom: string, bottom_value: string, title: string}, balance: {title_value: string, bottom: string, bottom_value: string, title: string}, current_subscription: {title_value: (number), bottom: string, bottom_value: number, title: string}, total_customers: {title_value: (number), bottom: string, bottom_value: (number), title: string}}}
     */
    formatOverallData (data) {
      return {
        total_revenue_data: {
          title: 'total revenue',
          title_value:  this.formatPrice(data.real_pay_amount_sum || 0),
          bottom: 'yesterday revenue',
          bottom_value:  this.formatPrice(data.real_amount_yesterday || 0),
        },
        current_subscription: {
          title: 'current subscriptions',
          title_value: data.active_recurring_all_count || 0,
          bottom: 'yesterday new additions',
          bottom_value: data.active_recurring_yesterday_add_count || 0,
        },
        total_customers: {
          title: 'total customers',
          title_value: data.user_all_count || 0,
          bottom: 'yesterday new additions',
          bottom_value: data.user_yesterday_add_count || 0,
        },
        balance: {
          title: 'balance',
          title_value: this.formatPrice(data.left_amount || 0),
          bottom: 'withdrawable balance',
          bottom_value:   this.formatPrice(data.real_amount_withdraw || 0),
        }
      }
    },
    /**
     * 设置默认时间
     */
    setDefaultTime () {
      // 设置默认时间为从昨天开始的前一个月
      const start_date = new Date();
      start_date.setDate(start_date.getDate() - 1);
      start_date.setMonth(start_date.getMonth() - 1);
      const end_date = new Date();

      // 格式化日期为 yyyy-MM-dd
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      this.date_range = [formatDate(start_date), formatDate(end_date)];
    },
    /**
     * 获取图表数据
     */
    getOptions (x_data, y_data, is_price = false) {
      const options = JSON.parse(JSON.stringify(this.common_options));
      options.xAxis.data = x_data;
      options.series[0].data = y_data;
      if (is_price) {
        // tooltip 格式化
        options.tooltip.formatter = (params) => {
          return `${params[0].name}: ${this.formatPrice(params[0].value)}`;
        };
        // Y 轴格式化
        options.yAxis.axisLabel = {
          formatter: (value) => {
            return this.formatPrice(value);
          }
        }
      }
      return options;
    },
    /**
     * 设置价格
     * @param price
     * @param currency
     * @returns {string}
     */
    formatPrice (price, currency = 'usd') {
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency.toLowerCase()) {
          return CURRENCY_OPTIONS[currency_key]['symbol'] + ' ' + price;
        }
      }
      return  'US$ ' + price;
    },
    /**
     * 初始化图表实例
     */
    initEchartsInstance () {
      this.$nextTick(() => {
        for (let key in this.echarts_instances) {
          this.echarts_instances[key] = this.$echarts.init(document.getElementById(this.echarts_ids[key]));
        }
      })
    },
    getData () {
      this.showLoading();
      let args = {
        start_time: this.date_range[0],
        end_time: this.date_range[1],
        client_key:this.client_key
      };
      let vm = this;
      dashBoardApi(args).then(res => {
        vm.hideLoading();
        if (parseInt(res.data.code) === 100000) {
          vm.overall_data = vm.formatOverallData(res.data.data);
          vm.formatEchartsData(res.data.data);
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
          vm.setDefaultOptions();
        }
      }).catch(err => {
        vm.hideLoading();
        vm.setDefaultOptions();
      })
    },
    setDefaultOptions () {
      for (let data_field_ref_key in this.data_field_ref) {
        const options = this.getOptions([], []);
        this.setOptions(options, this.echarts_instances[data_field_ref_key]);
      }
    },
    formatEchartsData(data) {
      this.title_counts = {};
      const is_price_fields = ['amount_total', 'revenue'];
      for (let data_field_ref_key in this.data_field_ref) {
        const data_field = this.data_field_ref[data_field_ref_key];
        const x_data = [];
        const y_data = [];
        if (data[data_field] && Array.isArray(data[data_field]) && data[data_field].length > 0) {
          for (let i = 0; i < data[data_field].length; i++) {
            const item = data[data_field][i];
            x_data.push(item['date']);
            y_data.push(item['count']);
          }
        }
        if (!!is_price_fields.includes(data_field_ref_key)) {
          this.title_counts[data_field_ref_key] = this.formatPrice(Number(y_data.reduce((a, b) => a + b, 0).toFixed(2)));
        } else {
          this.title_counts[data_field_ref_key] = Number(y_data.reduce((a, b) => a + b, 0).toFixed(2));
        }
        const options = this.getOptions(x_data, y_data, !!is_price_fields.includes(data_field_ref_key));
        this.setOptions(options, this.echarts_instances[data_field_ref_key]);
      }
    },
    setOptions (options, echarts_instance) {
      this.$nextTick(() => {
        echarts_instance.setOption(options);
      })
    },
    hideLoading () {
      this.$nextTick(() => {
        for (let key in this.echarts_instances) {
          this.echarts_instances[key].hideLoading();
        }
      })
    },
    /**
     * 显示加载动画
     */
    showLoading () {
      this.$nextTick(() => {
        for (let key in this.echarts_instances) {
          this.echarts_instances[key].showLoading(this.loading_options);
        }
      })
    },
  }
}
</script>
<style scoped lang="less">
.dashboard-card-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
}
.echarts-container {
  height: 350px;
  margin-top: 24px;
  width: calc((100% - 172px)/ 2);
}
.chart {
  width: 100%;
  height: 300px;
}
.echart-title {
  margin: 12px 12px;
}
</style>
<style>
.el-picker-panel__sidebar {
  width: 120px;
}
</style>
