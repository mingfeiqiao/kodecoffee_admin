<template>
  <div>
    <el-tabs v-model="active_subscription_type" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in subscription_option" :key="index" :label="$t(option.label)" :name="option.value">
        <div>
          <div style="display: flex;flex-wrap:wrap">
            <div class="order-btn">
              <date-picker :time_filter_range="date_range" @change="dateRangeChange"></date-picker>
            </div>
            <div class="order-btn">
              <div style="padding-right: 12px">{{$t('Plan') + ':'}}</div>
              <div>
                <el-select size="small" v-model="condition.prod_id" :placeholder="$t('select placeholder')" clearable @change="search" filterable v-loading="plan_list_loading">
                  <el-option
                    v-for="item in plan_list"
                    :key="item.prod_id"
                    :label="$t(item.name)"
                    :value="item.prod_id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="order-btn">
              <div style="padding-right: 12px">
                {{$t('payment email') + ":"}}
              </div>
              <div>
                <el-input size="small" :placeholder="$t('input placeholder')" v-model="condition.q" clearable  @keyup.enter.native="search" @clear="search"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 24px">
          <el-table :data="table_data" style="width: 100%"
                    :empty-text="$t('no data')"
                    v-loading="table_loading"
                    :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"          >
            <el-table-column prop="user_email" :label="$t('customer')"  width="auto">
              <template slot-scope="scope">
                <span class="link" @click="openUserDetail(scope.row.user_id)">{{ scope.row.user_email}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="prod_name" :label="$t('sell plan')" width="auto" >
            </el-table-column>
            <el-table-column width="auto" :label="$t('status')">
              <template slot-scope="scope">
                <span v-if="scope.row.subscription_status_obj" :style="{'color': scope.row.subscription_status_obj.color}">
                  {{ $t(scope.row.subscription_status_obj.message) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="auto" prop="plan_end_time" :label="$t('subscription expired time')">
            </el-table-column>
            <el-table-column prop="created_time" width="auto" :label="$t('create time')">
            </el-table-column>
            <el-table-column width="100" align="center" :label="$t('Operation')">
              <template slot-scope="scope">
                <span class="link" @click="openSubscriptionDetail(scope.row.subscription_id)">{{ $t('detail') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-sizes="[10,20]"
              :page-size="page_size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {timestampToDateString} from "../../utils/dateUtils";
import SUBSCRIPTION_OPTIONS from "../../options/subscription_options.json";
import {planFilterListApi, subscriptionList} from "../../api/interface";
import datePicker from "../components/date-picker.vue";
export default {
  components: {datePicker},
  data() {
    return {
      SUBSCRIPTION_STATUS: SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_OPTIONS,
      SUBSCRIPTION_STATUS_REF: SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS,
      active_subscription_type: 'effective',
      condition: {
      },
      date_range:[],
      page:1,
      page_size:10,
      plan_list:[],
      plan_list_loading:false,
      total:0,
      order:{
        created_time:"desc"
      },
      subscription_option: [
        {
          label: 'effective subscription',
          value: 'effective'
        },
        {
          label: 'all subscription',
          value: 'all'
        },
        {
          label: 'ineffective subscription',
          value: 'ineffective'
        }
      ],
      table_loading: false,
      table_data:[]
    };
  },
  created() {
    // // 默认选中active subscription, 此时应该请求active subscription的数据
    this.initCondition();
    this.getPlanList();
    this.getSubscriptionData();
  },
  methods: {
    /**
     * 搜索
     */
    search() {
      this.resetPageParams();
      this.getSubscriptionData();
    },
    /**
     *
     */
    getPlanList() {
      this.plan_list_loading = true;
      planFilterListApi({order: {'created_time':'desc'}, condition: {'type': 'recurring'}}).then( res => {
        this.plan_list_loading = false;
        if (parseInt(res.data.code) === 100000) {
          this.plan_list = res.data.data;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch( err => {
        console.log(err);
        this.plan_list_loading = false;
      })
    },
    /**
     * 时间筛选范围
     * @param date_range 时间筛选范围
     */
    dateRangeChange(date_range){
      this.resetPageParams();
      this.date_range = date_range;
      this.getSubscriptionData();
    },
    /**
     * 打开详情
     * @param user_id
     */
    openUserDetail (user_id) {
      this.$router.push({path: "/customers/detail/" + user_id});
    },
    /**
     * 设置初始化日期筛选
     */
    initCondition () {
      this.condition = {};
      if (this.active_subscription_type === 'effective') { // 所有生效的订阅
        this.condition.order_status = this.active_subscription_type;
        this.condition.plan_type = 'recurring';
      } else if (this.active_subscription_type === 'all') { // 所有订阅
        this.condition = {};
        this.condition.plan_type = 'recurring';
      } else if (this.active_subscription_type === 'ineffective') { // 所有未生效的订阅
        this.condition = {};
        this.condition.plan_type = 'recurring';
        this.condition.order_status = this.active_subscription_type;
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
     *
     */
    handleClick() {
      this.initCondition();
      this.resetPageParams();
      this.getSubscriptionData();
    },
    /**
     * 获取api参数
     * @param condition
     * @param orders
     * @param page
     * @param page_size
     * @returns {{condition: {}, page, page_size, order: {}}}
     */
    getApiArgs (condition, orders, page, page_size) {
      let condition_temp = {};
      for (let key in condition) {
        if (condition[key]) {
          condition_temp[key] = condition[key];
        }
      }
      let orders_temp = {};
      for (let key in orders) {
        if (orders[key]) {
          orders_temp[key] = orders[key];
        }
      }
      return {
        'page': page,
        'page_size': page_size,
        'condition': condition_temp,
        'order': orders_temp
      }
    },
    /**
     * 格式化table数据
     */
    resetPageParams () {
      this.page = 1;
      this.page_size = 10;
      this.total = 0;
    },
    /**
     *
     * @param subscription_id
     */
    openSubscriptionDetail(subscription_id) {
      this.$router.push({path: `/subscriptions/detail/${subscription_id}`});
    },
    transDateRangeTimestamp(date_range) {
      const created_time_filter = []
      for (const created_time of date_range) {
        console.log(created_time)
        created_time_filter.push(this.convertToUnixTimestamp(created_time))
      }
      return created_time_filter
    },
    convertToUnixTimestamp(dateString) {
      // 将日期字符串转换为JavaScript的Date对象
      const dateObject = new Date(dateString);
      // 获取Unix时间戳（毫秒为单位）
      const unixTimestamp = dateObject.getTime();
      return unixTimestamp / 1000;
    },
    /**
     *
     */
    getSubscriptionData () {
      this.table_loading = true;
      this.table_data = [];
      const condition = Object.assign({}, this.condition);
      if (this.date_range && this.date_range.length > 0) {
        condition['created_time'] = this.transDateRangeTimestamp(this.date_range);
      }
      let args = this.getApiArgs(condition, this.order, this.page, this.page_size);
      subscriptionList(args).then(res => {
        this.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          this.table_data = this.formatTableData(res.data.data);
          this.total = res.data.totalCount;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        this.table_loading = false;
      });
    },
    /**
     *
     * @param data
     * @returns {*}
     */
    formatTableData(data) {
      data.forEach(item => {
        item.subscription_id = item.id;
        item.created_time = item.created_time ? timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS') :"-";
        item.plan_end_time = item.plan_end_time ? timestampToDateString(item.plan_end_time) : "-";
        item.subscription_status_obj = this.SUBSCRIPTION_STATUS[this.SUBSCRIPTION_STATUS_REF[item.order_status]];
        return item;
      });
      return data;
    },
    /**
     * 分页
     */
    handleSizeChange(size) {
      this.resetPageParams();
      this.page_size = size;
      this.getSubscriptionData();
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getSubscriptionData();
    },
  },
};
</script>
<style scoped lang="less">
.order-btn {
  display: flex;
  margin-top: 12px;
  align-items: center;
  margin-right: 24px;
}
</style>
