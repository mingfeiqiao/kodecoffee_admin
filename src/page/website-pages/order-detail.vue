<template>
  <div class="container">
    <div>
      <div>
        <div>{{$t('pay')}}:</div>
        <div style="display:flex;align-items: center;padding: 8px 0 24px 0">
          <span class="title-20">{{ order.price_format }}</span>
          <span v-if="order.order_status_obj" :style="{
            'border-radius': '4px',
            'margin-left':'20px',
            'padding':'0 10px',
            'color': order.order_status_obj.color,
            'background-color': order.order_status_obj['background-color'],
            'border': '1px solid ' + order.order_status_obj.color
          }">{{ $t(order.order_status_obj.message) }}</span>
        </div>
      </div>
      <el-descriptions  class="order-descriptions">
        <el-descriptions-item :label="$t('customer')">{{order.order_detail.user_email}}</el-descriptions-item>
        <el-descriptions-item :label="$t('payment method')">
          <span v-if="order.order_detail.payment_type === 'card'" style="display: flex;align-items: center;">
            <svg width="18" height="18">
              <use xlink:href="#bank-card"></use>
            </svg>
            <span style="padding-left: 8px">
              {{order.payment_detail.card_number}}
            </span>
          </span>
          <span v-else-if="order.order_detail.payment_type === 'alipay'">
            <svg width="18" height="18">
                <use xlink:href="#alipay"></use>
            </svg>
          </span>
          <span v-else-if="order.order_detail.payment_type === 'wechat'">
            <svg width="18" height="18">
              <use xlink:href="#wechat-pay"></use>
            </svg>
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('create time')">{{ order.order_detail.created_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('sell plan')">{{ order.order_detail.prod_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('Type')">{{ $t(order.order_detail.plan_type)}}</el-descriptions-item>
        <el-descriptions-item :label="$t('extension')">{{ order.order_detail.client_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order id')" >{{ order.order_detail.order_id }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <div>
        <el-descriptions :title="$t('payment method')" v-if="order.payment_detail">
          <el-descriptions-item :label="$t('payment method')" v-if="order.payment_detail.type">{{ $t(order.payment_detail.type) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('Type')" v-if="showBrand">{{ order.payment_detail.brand }}</el-descriptions-item>
          <el-descriptions-item :label="$t('card number')" v-if="order.payment_detail.card_number">{{ order.payment_detail.card_number }}</el-descriptions-item>
          <el-descriptions-item :label="$t('card area')" v-if="order.payment_detail.country">{{ order.payment_detail.country }}</el-descriptions-item>
          <el-descriptions-item :label="$t('payment email')" v-if="order.billing_detail.pay_email">{{ order.billing_detail.pay_email }}</el-descriptions-item>
          <el-descriptions-item :label="$t('payment name')" v-if="order.billing_detail.pay_name">{{ order.billing_detail.pay_name }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import ORDER_OPTIONS from "../../options/order_options.json";
import {orderDetailApi} from "../../api/interface";
import {timestampToDateString} from "../../utils/dateUtils";
export default {
  data() {
    return {
      ORDER_STATUS_BUTTON: {
        un_completed: {
          "message": "unCompleted",
          "color":"rgba(16, 16, 16, 100)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        succeed: {
          "message": "Succeed",
          "color":"rgba(112, 206, 70, 100)",
          "background-color":"rgba(246, 255, 237, 100)"
        },
        failed: {
          "message": "Failed",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        refunded: {
          "message": "Refunded",
          "color":"rgba(16, 16, 16, 100)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
        disputed: {
          "message": "Disputed",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"rgba(198, 198, 198, 100)"
        },
      },
      order: {
        order_detail: {
          prod_name: "",
          client_name: "",
          user_email:"",
          plan_type: "",
          country: "",
          currency: "",
          price: "",
          price_format: "",
          order_status_obj: {},
          charge:"",
          order_id: "",
          created_time: "",
          payment_type:"",
          card_number:"",
        },
        payment_detail: {
          type:""
        },
        billing_detail: {
        }
      }
    };
  },
  created() {
    let vm = this;
    if (this.$route.params && this.$route.params.id) {
      orderDetailApi(this.$route.params.id).then((res) => {
        if (res.data && parseInt(res.data.code) === 100000) {
          vm.order = this.formatOrderData(res.data.data);
          console.log(vm.order);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  methods: {
    formatOrderData(data) {
      return {
        order_detail: {
          prod_name: data.prod_name || "",
          client_name: data.client_name || "",
          user_email: data.user_email || "",
          plan_type: data.plan_type || "",
          country: data.country || "",
          currency: data.currency || "",
          price: data.pay_amount || "",
          price_format: this.formatPrice(data.pay_amount, data.currency),
          order_status_obj: this.formatOrderStatus(data),
          charge: (data.charge_info && data.charge_info.charge) || "",
          order_id: data.transaction_invoice_key || "",
          created_time: this.formatCreatedTime(data.created_time),
          payment_type: this.getPaymentType(data),
          card_number: this.getCardNumber(data),
        },
        payment_detail: this.formatPaymentDetail(data),
        billing_detail: this.formatBillingDetail(data),
      };
    },
    formatCreatedTime (created_time) {
      if (created_time) {
        return timestampToDateString(created_time, 'yyyy-MM-dd HH:II:SS');
      }
      return "";
    },
    getPaymentType (data) {
      return data && data.charge_info && data.charge_info.payment_method_details && data.charge_info.payment_method_details.type || "";
    },
    getCardNumber (data) {
      let number = data && data.charge_info && data.charge_info.payment_method_details && data.charge_info.payment_method_details.card && data.charge_info.payment_method_details.card.last4 || "";
      if (number) {
        return this.formatCard(number);
      }
      return "";
    },
    formatOrderStatus (data) {
      if (data.pay_status && ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[data.pay_status]) {
        return this.ORDER_STATUS_BUTTON[ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS[data.pay_status]];
      }
      return "";
    },
    formatPrice(price, currency) {
      return currency ? `${price} ${currency.toUpperCase()}` : `${price}`;
    },
    formatBillingDetail(data) {
      const billing_details = data.charge_info && data.charge_info.billing_details;
      return {
        pay_email: (billing_details && billing_details.email) || "",
        pay_name: (billing_details && billing_details.name) || "",
      };
    },
    formatPaymentDetail(data) {
      const payment_method = data.charge_info && data.charge_info.payment_method_details;
      if (payment_method && payment_method.type === "card") {
        return {
          type: payment_method.type || "",
          brand: (payment_method.card && payment_method.card.brand + " " + payment_method.card.funding) || "",
          card_number: (payment_method.card && this.formatCard(payment_method.card.last4)) || "",
          country: (payment_method.card && payment_method.card.country) || "",
        };
      } else {
        return {
          type: payment_method && payment_method.type || "",
        };
      }
    },
    formatCard (last4) {
      if (last4) {
        return `**** **** **** ${last4}`;
      }
      return "";
    },
  },
  computed: {
    showBrand() {
      return this.order.payment_detail.type === "card" && this.order.payment_detail.brand;
    },
  },
};
</script>

<style scoped lang="less">
.container{
  padding: 24px;
}
.container /deep/ .el-descriptions-item__cell {
  padding-bottom: 24px;
}
</style>
