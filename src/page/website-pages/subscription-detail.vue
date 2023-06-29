<template>
  <div class="container">
    <div>
      <div>
        <div>{{$t('pay')}}:</div>
        <div style="display:flex;align-items: center;padding: 8px 0 24px 0">
          <span class="title-20">{{subscription.prod_name}}</span>
          <span v-if="subscription.price_format" style="color: #929292;font-size: 20px;padding-left: 8px">{{ subscription.price_format }}</span>
          <span v-if="subscription.subscription_status_obj" :style="{
            'border-radius': '4px',
            'margin-left':'20px',
            'padding':'0 10px',
            'color': subscription.subscription_status_obj.color,
            'background-color': subscription.subscription_status_obj['background-color'],
            'border': '1px solid ' + subscription.subscription_status_obj.color
          }">{{ $t(subscription.subscription_status_obj.message) }}</span>
          <span v-if="subscription.subscription_status_obj && subscription.subscription_status_obj.message === 'Canceled'">
            <span style="display: flex;align-items: center;color: rgba(146, 146, 146, 100)">
              <span style="margin-left: 20px">{{$t('canceled time')}}:</span>
              <span style="margin-left: 5px">{{subscription.canceled_time}}</span>
            </span>
              <el-descriptions-item :label="$t('canceled time')">{{subscription.canceled_time}}</el-descriptions-item>
          </span>
        </div>
      </div>
      <el-descriptions  class="order-descriptions">
        <el-descriptions-item :label="$t('customer')"><span class="link" @click="openUserDetail">{{subscription.user_email}}</span></el-descriptions-item>
        <el-descriptions-item :label="$t('create time')">{{ subscription.created_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('subscription expired time')">{{ subscription.plan_end_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('sell plan')">{{ subscription.prod_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('extension')">{{ subscription.client_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('subscription id')" >{{ subscription.subscription_id }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <div class="title-16" style="padding: 24px 0">{{ $t('orders record') }}</div>
      <div>
        <el-table :data="order_list" style="width: 100%"
                  v-loading="table_loading"
                  :empty-text="$t('no data')"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"        >
          <el-table-column prop="invoice_id" :label="$t('order id')"  width="auto">
            <template slot-scope="scope">
              <span class="link" @click="openOrderDetail(scope.row.order_id)">{{scope.row.invoice_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price_format" :label="$t('Amount')" width="auto">
          </el-table-column>
          <el-table-column  :label="$t('status')" width="auto">
            <template slot-scope="scope">
              <span :style="{'color': scope.row.order_status_obj.color}">
                {{ $t(scope.row.order_status_obj.message) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" :label="$t('create time')" width="auto" >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {timestampToDateString} from "../../utils/dateUtils";
import SUBSCRIPTION_STATUS_OPTIONS from "../../options/subscription_options.json";
import {subscriptionDetailApi} from "../../api/interface";
import ORDER_OPTIONS from "../../options/order_options.json";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
export default {
  data() {
    return {
      subscription: {
        user_id:"",
        prod_name:"",
        price_format:"",
        subscription_status_obj: null,
        user_email:"",
        card_number:"",
        created_time:"",
        canceled_time:"",
        client_name:"",
        plan_end_time:"",
        user_area:"",
        subscription_id:"",
      },
      table_loading: false,
      order_list :[],
      SUBSCRIPTION_STATUS_BUTTON: {
        canceling: {
          "message": "Canceling",
          "color":"rgba(16, 16, 16, 100)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        active: {
          "message": "Active",
          "color":"rgba(112, 206, 70, 100)",
          "background-color":"rgba(246, 255, 237, 100)"
        },
        pastdue: {
          "message": "Failed",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        canceled: {
          "message": "Canceled",
          "color":"rgba(16, 16, 16, 100)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        invalid: {
          "message": "Expired",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
      }
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      let vm = this;
      vm.table_loading = true;
      subscriptionDetailApi(this.$route.params.id).then((res) => {
        vm.table_loading = false;
        if (res.data && parseInt(res.data.code) === 100000) {
          vm.subscription = this.formatSubscription(res.data.data);
          vm.order_list = this.formatOrderList(res.data.data.transaction_invoice);
        }
      }).catch((err) => {
        vm.table_loading = false;
        console.log(err);
      });
    }
  },
  methods: {
    openUserDetail () {
      this.$router.push({path: "/customers/detail/" + this.subscription.user_id});
    },
    openOrderDetail (order_id) {
      this.$router.push({path: "/orders/detail/" + order_id});
    },
    formatOrderList (transaction_invoice) {
      if (transaction_invoice && Array.isArray(transaction_invoice) && transaction_invoice.length > 0) {
        return transaction_invoice.map((item) => {
          return {
            order_id: item.id || "",
            invoice_id: item.transaction_invoice_key || "",
            price_format: this.formatPrice(item.pay_amount, item.currency) || "",
            order_status_obj: this.formatOrderStatus(item.pay_status),
            created_time: this.formatTime(item.created_time),
          }
        })
      }
      return [];
    },
    formatSubscription (data) {
      return {
        user_id: data.user_id || "",
        prod_name: data.prod_name || "",
        price_format: this.formatPrice(data.pay_amount, data.currency) || "",
        user_email: data.user_email || "",
        subscription_status_obj: this.formatSubscriptionObj(data.order_status) || "",
        plan_end_time: this.formatTime(data.plan_end_time) || "",
        canceled_time: this.formatTime(data.updated_time) || "",
        created_time: this.formatTime(data.created_time) || "",
        subscription_id: data.transaction_key || "",
      }
    },
    formatCard (last4) {
      if (last4) {
        return `**** **** **** ${last4}`;
      }
      return "";
    },
    formatTime (time) {
      if (time) {
        return timestampToDateString(time, 'yyyy-MM-dd HH:II:SS');
      }
      return "-";
    },
    formatOrderStatus (pay_status) {
      if (pay_status && ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[pay_status]) {
        return ORDER_OPTIONS.ORDER_STATUS_OPTIONS[ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[pay_status]];
      }
      return "";
    },
    formatSubscriptionObj (order_status) {
      let op = SUBSCRIPTION_STATUS_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS[order_status];
      if (order_status !== 'null' && order_status && op) {
        return this.SUBSCRIPTION_STATUS_BUTTON[op];
      }
      return {};
    },
    formatPrice(price, currency) {
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          return CURRENCY_OPTIONS[currency_key]['symbol'] + ' ' + price;
        }
      }
      return currency + ' ' + price;
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
</style>