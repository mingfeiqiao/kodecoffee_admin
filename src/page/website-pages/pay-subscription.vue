<template>
  <div>
    <el-tabs v-model="active_subscription_type" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in subscription_option" :key="index" :label="$t(option.label)" :name="option.value">
        <div>
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
import {subscriptionList} from "../../api/interface";
export default {
  data() {
    return {
      SUBSCRIPTION_STATUS: SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_OPTIONS,
      SUBSCRIPTION_STATUS_REF: SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS,
      active_subscription_type: 'effective',
      condition: {
      },
      page:1,
      page_size:10,
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
    this.getSubscriptionData();
  },
  methods: {
    openUserDetail (user_id) {
      this.$router.push({path: "/customers/detail/" + user_id});
    },
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
     *
     */
    handleClick() {
      this.initCondition();
      this.getSubscriptionData();
    },
    /**
     *
     * @param subscription_id
     */
    openSubscriptionDetail(subscription_id) {
      this.$router.push({path: `/subscriptions/detail/${subscription_id}`});
    },
    getSubscriptionData () {
      this.table_loading = true;
      this.table_data = [];
      let vm = this;
      let args = {condition:this.condition, order:this.order, page:this.page, page_size:this.page_size};
      subscriptionList(args).then(res => {
        vm.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          vm.table_data = vm.formatTableData(res.data.data);
          vm.total = res.data.totalCount;
        }
      }).catch(err => {
        vm.table_loading = false;
      });
    },
    formatTableData(data) {
      data.forEach(item => {
        item.subscription_id = item.id;
        item.created_time = timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS');
        item.plan_end_time = timestampToDateString(item.plan_end_time);
        item.subscription_status_obj = this.SUBSCRIPTION_STATUS[this.SUBSCRIPTION_STATUS_REF[item.order_status]];
        return item;
      });
      return data;
    },
    /**
     * 分页
     */
    handleSizeChange(size) {
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

</style>
