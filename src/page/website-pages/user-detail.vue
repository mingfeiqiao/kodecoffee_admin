<template>
  <div class="container">
    <div >
      <div >
        <div>{{$t('customer')}}:</div>
        <div style="display:flex;align-items: center;padding: 8px 0 24px 0">
          <span class="title-20">{{ user.user_email }}</span>
          <span style="font-size: 20px;color: rgba(98, 98, 98, 100);margin-left: 12px">{{user.user_key }}</span>
        </div>
      </div>
    </div>
    <div class="border-bottom">
      <el-descriptions>
        <el-descriptions-item :label="$t('create time')">{{ user.created_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('area')">{{ user.country }}</el-descriptions-item>
        <el-descriptions-item :label="$t('last pay time')">{{ user.last_payment }}</el-descriptions-item>
        <el-descriptions-item :label="$t('total spend')" >{{ user.total_spend }}</el-descriptions-item>
        <el-descriptions-item :label="$t('succeed pay times')" >{{ user.pay_success_times }}</el-descriptions-item>
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
            <div style="display: flex;flex-direction: column">
              <span>{{ scope.row.plan_name }}</span>
              <span>{{ scope.row.price_format + '/' + $t('month')}}</span>
            </div>
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
          layout="total, sizes, prev, pager, next, jumper"
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
        <el-table-column prop="order_key" :label="$t('order id')">
          <template slot-scope="scope">
            <span class="link" @click="openOrderDetail(scope.row.order_id)">{{scope.row.order_key}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_amount_format" :label="$t('Amount')">
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
          layout="total, sizes, prev, pager, next, jumper"
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
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import {customerDetailApi, orderList, subscriptionList} from "../../api/interface";
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
        country: "",
        last_payment: "",
        total_spend: "",
        pay_success_times: "",
      },
      subscription_list: [],
      order_list:[],
    };
  },
  created() {
    this.getCustomerInfoData();
    this.getSubscriptionData();
    this.getOrderListData();
  },
  methods: {
    /**
     * 获取订阅列表
     * @param order_id
     */
    openOrderDetail (order_id) {
      this.$router.push({path: "/orders/detail/" + order_id});
    },
    /**
     * 订阅列表分页
     */
    getCustomerInfoData () {
      if (this.$route.params && this.$route.params.id) {
        let vm = this;
        customerDetailApi(this.$route.params.id).then(res => {
          if (!res.data) {
            return;
          }
          if (parseInt(res.data.code) === 100000) {
            vm.user = vm.formatUserData(res.data.data);
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },
    /**
     * 格式化用户数据
     * @param item
     * @returns {{total_spend: string, country: (*|string), created_time: string, user_email: (string|string|RegExp|*), pay_success_times: (*|number), user_id: string, last_payment: string, user_key: (string|*), payments_times: string, refunded_amount: string}}
     */
    formatUserData (item) {
      let user_consumption_statistics = item.user_consumption_statistics;
      if (!user_consumption_statistics) {
        user_consumption_statistics = {};
      }
      let currency = user_consumption_statistics.settle_currency || "usd";
      return {
        user_id: item.id || "",
        user_key: item.user_key || "",
        user_email: item.email || "",
        country: item.country || "",
        total_spend: this.formatPrice(user_consumption_statistics.sum_settle_pay_amount, currency),
        payments_times: this.formatPrice(user_consumption_statistics.sum_settle_pay_count, currency),
        pay_success_times: user_consumption_statistics.sum_settle_pay_success_count || 0,
        refunded_amount:  this.formatPrice(user_consumption_statistics.sum_settle_refund_amount, currency),
        last_payment: this.formatTime(user_consumption_statistics.lasted_pay_time),
        created_time: this.formatTime(item.created_time)
      }
    },
    /**
     * 获取表格数据
     * @returns {*}
     */
    getOrderListData () {
      let args = {
        'page': this.order_args.page,
        'page_size': this.order_args.page_size,
        'condition': {'customer_id': this.$route.params.id},
        'order':{'created_time': 'desc'}
      };
      this.order_args.table_loading = true;
      this.order_args.total = 0;
      this.order_list = [];
      let vm = this;
      orderList(args).then(res => {
        vm.order_args.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          vm.order_list = vm.formatOrderList(res.data.data);
          vm.order_args.total = res.data.totalCount;
        }
      }).catch(err => {
        vm.order_args.table_loading = false;
        console.log(err);
      });
    },
    /**
     * 格式化订单列表数据
     */
    getSubscriptionData () {
      let args = {
        'page': this.order_args.page,
        'page_size': this.order_args.page_size,
        'condition': {'customer_id': this.$route.params.id},
        'order':{'created_time': 'desc'}
      };
      this.subscription_args.table_loading = true;
      this.subscription_list = [];
      this.subscription_args.total = 0;
      let vm = this;
      subscriptionList(args).then(res => {
        vm.subscription_args.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          vm.subscription_list = vm.formatSubscriptionList(res.data.data);
          vm.subscription_args.total = res.data.totalCount;
        }
      }).catch(err => {
        console.log(err);
        vm.subscription_args.table_loading = false;
      });
    },
    /**
     * 格式化订阅列表
     * @param subscription_info_list
     * @returns {*}
     */
    formatSubscriptionList(subscription_info_list) {
      return subscription_info_list.filter(item => item.plan_type === 'recurring' && item.order_status !== 'null').map(item => {
        if (item.plan_end_time) {
          item.plan_end_time = this.formatTime(item.plan_end_time);
        } else {
          item.plan_end_time = '-';
        }
        item.plan_name = item.prod_name || '';
        item.plan_id = item.id || '';
        item.currency = item.currency || '';
        item.price_format = this.formatPrice(item.pay_amount, item.currency) || "";
        item.plan_key = item.transaction_key || '';
        if (item.order_status && SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS[item.order_status]) { // 应该是个OBJECT
          let subscription_status = SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS[item.order_status]
          item.subscription_status_obj = SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_OPTIONS[subscription_status];
        } else {
          item.subscription_status_obj = {};
        }
        if (item.created_time) {
          item.created_time = this.formatTime(item.created_time);
        } else {
          item.created_time = '-';
        }
        return item;
      });
    },
    /**
     * 格式化订单列表
     */
    formatOrderList(data) {
      data.forEach((item) => {
        if (item.id) {
          item.order_id = item.id;
        }
        if (item.transaction_invoice_key) {
          item.order_key = item.transaction_invoice_key;
        }
        if (item.pay_status && ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[item.pay_status]) {
          let order_status = ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[item.pay_status];
          item.order_status_obj = ORDER_OPTIONS.ORDER_STATUS_OPTIONS[order_status];
        } else {
          item.order_status_obj = {};
        }
        if (item.currency && item.pay_amount) {
          item.order_amount_format = this.formatPrice(item.pay_amount, item.currency);
        }
        item.created_time = this.formatTime(item.created_time);
      });
      return data;
    },
    /**
     * 格式化退款金额 格式 US$ 99.00
     */
    formatPrice(price, currency) {
      if (price && currency){
        for (const currency_key in CURRENCY_OPTIONS) {
          if (currency_key.toLowerCase() === currency.toLowerCase()) {
            return CURRENCY_OPTIONS[currency_key]['symbol'] + ' ' + price;
          }
        }
        return currency + ' ' + price;
      }
      return "";
    },
    /**
     * 格式化时间
     */
    formatTime (time) {
      if (time) {
        return timestampToDateString(time, 'yyyy-MM-dd HH:II:SS');
      }
      return "-";
    },
    handleOrderSizeChange() {
      this.getOrderListData();
    },
    handleSubscriptionSizeChange() {
      this.getSubscriptionData();
    },
    handleOrderCurrentChange() {
      this.getOrderListData();
    },
    handleSubscriptionCurrentChange() {
      this.getSubscriptionData();
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