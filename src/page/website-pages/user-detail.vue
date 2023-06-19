<template>
  <div class="container">
    <div >
      <div >
        <div>{{$t('customer')}}:</div>
        <div style="display:flex;align-items: center;padding: 8px 0 24px 0">
          <span class="title-20">{{ user.user_email }}</span>
          <span style="font-size: 20px;color: rgba(98, 98, 98, 100);margin-left: 12px">{{user.user_id }}</span>
        </div>
      </div>
    </div>
    <div class="border-bottom">
      <el-descriptions>
        <el-descriptions-item :label="$t('create time')">{{ user.created_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('area')">{{ user.area }}</el-descriptions-item>
        <el-descriptions-item :label="$t('last pay time')">{{ user.last_pay_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('total spend')" >{{ user.total_spend }}</el-descriptions-item>
        <el-descriptions-item :label="$t('succeed pay times')" >{{ user.succeed_pay_times }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="border-bottom">
      <div class="title-20" style="padding: 24px 0">
        {{$t('subscriptions info')}}
      </div>
      <el-table :data="subscription_list"
                :empty-text="$t('no data')"
                v-loading="subscription_args.table_loading"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column :label="$t('subscriptions')">
          <template slot-scope="scope">
            <span>{{ scope.row.prod_name }}</span>
            <span>{{ scope.row.price_format }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('status')">
          <template slot-scope="scope">
            <span v-if="scope.row.subscription_status_obj" :style="{'color': scope.row.subscription_status_obj.color}">
              {{ $t(scope.row.subscription_status_obj.message) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('subscription expired time')" prop="plan_end_time">
        </el-table-column>
        <el-table-column :label="$t('create time')" align="center" prop="created_time">
        </el-table-column>
      </el-table>
      <div style="padding:12px;display: flex;align-items: center;justify-content: center;">
        <el-pagination
          background
          @size-change="handleSubscriptionSizeChange"
          @current-change="handleSubscriptionCurrentChange"
          :current-page.sync="subscription_args.page"
          :page-sizes="[10,20]"
          :page-size="subscription_args.page_size"
          layout="prev, pager, next"
          :total="subscription_args.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <div class="title-20" style="padding: 24px 0">
        {{$t('orders record')}}
      </div>
      <el-table :data="order_list"
                :empty-text="$t('no data')"
                v-loading="order_args.table_loading"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="order_id" :label="$t('order id')">
        </el-table-column>
        <el-table-column prop="price_format" :label="$t('Amount')">
        </el-table-column>
        <el-table-column :label="$t('status')">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status_obj" :style="{'color': scope.row.order_status_obj.color}">
              {{ $t(scope.row.order_status_obj.message)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('create time')" prop="created_time" align="center">
        </el-table-column>
      </el-table>
      <div style="padding:12px;display: flex;align-items: center;justify-content: center;">
        <el-pagination
          background
          @size-change="handleOrderSizeChange"
          @current-change="handleOrderCurrentChange"
          :current-page.sync="order_args.page"
          :page-sizes="[10,20]"
          :page-size="order_args.page_size"
          layout="prev, pager, next"
          :total="order_args.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {timestampToDateString} from "../../utils/dateUtils";
import SUBSCRIPTION_STATUS_OPTIONS from "../../options/subscription_options.json";
import ORDER_OPTIONS from "../../options/order_options.json";
export default {
  data() {
    return {
      subscription_args : {
        page:1,
        page_size:10,
        total:0,
        table_loading:false,
      },
      order_args : {
        page:1,
        page_size:10,
        total:0,
        table_loading:false,
      },
      user: {
        user_id: "",
        user_email: "",
        created_time: "",
        area: "",
        last_pay_time: "",
        total_spend: "",
        succeed_pay_times: "",
      },
      subscription_list: [],
      order_list:[],
    };
  },
  created() {
  },
  methods: {
    formatUser(data) {
       return {
          user_id: data.user_id,
          user_email: data.user_email,
          created_time: this.formatTime(data.created_time),
          area: data.area,
          last_pay_time: this.formatTime(data.last_pay_time),
          total_spend: data.total_spend,
          succeed_pay_times: data.succeed_pay_times,
       }
    },
    formatSubscriptionList(subscription_info_list) {
      return subscription_info_list.filter(item => item.plan_type === 'recurring' && item.order_status !== 'null').map(item => {
        if (item.plan_end_time) {
          item.plan_end_time = this.formatTime(item.plan_end_time);
        } else {
          item.plan_end_time = '-';
        }
        if (SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_REF[item.order_status]) { // 应该是个OBJECT
          item.subscription_status_obj = SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_REF[item.order_status];
        }
        return item;
      });
    },
    formatOrderList() {
      this.order_list.forEach((item) => {
        item.order_status_obj = ORDER_OPTIONS[item.pay_status];
        item.order_status_message = item.order_status_obj.message;
        item.order_status_color = item.order_status_obj.color;
        item.created_time = this.formatTime(item.created_time);
      });
    },
    formatPrice () {

    },
    formatTime (time) {
      if (time) {
        return timestampToDateString(time, 'yyyy-MM-dd HH:II:SS');
      }
      return "";
    },
    handleOrderSizeChange() {
    },
    handleSubscriptionSizeChange() {
    },
    handleOrderCurrentChange() {
    },
    handleSubscriptionCurrentChange() {
    },
  },
};
</script>
<style scoped lang="less">
.container {
}
.container /deep/ .el-descriptions-item__cell {
  padding-bottom: 24px;
}
.border-bottom {
  border-bottom: 1px solid #ebeef5;
}
</style>