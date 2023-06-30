<template>
  <div class="container">
    <div>
      <div>
        <div>{{$t('pay')}}:</div>
        <div style="display:flex;align-items: center;padding: 8px 0 24px 0">
          <span class="title-20">{{ order_detail.price_format }}</span>
          <span v-if="order_detail.currency" style="color: #929292;font-size: 20px;padding-left: 8px" >{{order_detail.currency.toUpperCase()}}</span>
          <span v-if="order_detail.order_status_obj" :style="{
            'border-radius': '4px',
            'margin-left':'20px',
            'padding':'0 10px',
            'color': order_detail.order_status_obj.color,
            'background-color': order_detail.order_status_obj['background-color'],
            'border': '1px solid ' + order_detail.order_status_obj.color
          }">{{ $t(order_detail.order_status_obj.message) }}</span>
        </div>
      </div>
      <el-descriptions  class="order-descriptions">
        <el-descriptions-item :label="$t('customer')">
          <span class="link" @click="openUserDetail(order_detail.user_id)">{{order_detail.user_email}}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('payment method')">
          <span v-if="order_detail.payment_type === 'card'" style="display: flex;align-items: center;">
            <svg width="18" height="18">
              <use xlink:href="#bank-card"></use>
            </svg>
            <span style="padding-left: 8px">
              {{payment_detail.card_number}}
            </span>
          </span>
          <span v-else-if="order_detail.payment_type === 'alipay'">
            <svg width="18" height="18">
                <use xlink:href="#alipay"></use>
            </svg>
          </span>
          <span v-else-if="order_detail.payment_type === 'wechat'">
            <svg width="18" height="18">
              <use xlink:href="#wechat-pay"></use>
            </svg>
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('create time')">{{ order_detail.created_time }}</el-descriptions-item>
        <el-descriptions-item :label="$t('sell plan')">{{ order_detail.prod_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('Type')">{{ $t(order_detail.plan_type)}}</el-descriptions-item>
        <el-descriptions-item :label="$t('extension')">{{ order_detail.client_name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order id')" >{{ order_detail.order_id }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <div>
        <el-descriptions :title="$t('payment details')">
          <el-descriptions-item :label="$t('Amount')">
            <span v-if="order_detail.currency === cost_detail.settle_currency">
              {{order_detail.price_format}}
            </span>
            <span v-else>
              {{`${order_detail.price_format}→${cost_detail.settle_amount_format}`}}
            </span>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('cost')" >{{ cost_detail.cost_format}}</el-descriptions-item>
          <el-descriptions-item :label="$t('net income')">{{ cost_detail.net_income_format }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div>
      <div>
        <el-descriptions :title="$t('payment method')" v-if="payment_detail">
          <el-descriptions-item :label="$t('payment method')" v-if="payment_detail.type">{{ $t(payment_detail.type) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('Type')" v-if="showBrand">{{ payment_detail.brand }}</el-descriptions-item>
          <el-descriptions-item :label="$t('card number')" v-if="payment_detail.card_number">{{ payment_detail.card_number }}</el-descriptions-item>
          <el-descriptions-item :label="$t('card area')" v-if="payment_detail.country">{{ payment_detail.country }}</el-descriptions-item>
          <el-descriptions-item :label="$t('payment email')">{{ billing_detail.pay_email }}</el-descriptions-item>
          <el-descriptions-item :label="$t('payment name')" v-if="billing_detail.pay_name">{{ billing_detail.pay_name }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import ORDER_OPTIONS from "../../options/order_options.json";
import {orderDetailApi} from "../../api/interface";
import {timestampToDateString} from "../../utils/dateUtils";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
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
      billing_detail: {
      },
      payment_detail: {
        type:""
      },
      order_detail: {
        prod_name: "",
        client_name: "",
        user_id:"",
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
      cost_detail: {
        settle_amount:"", // 结算货币的实际金额
        settle_currency:"usd", // 结算币种
        settle_amount_format:"", // 订单实际金额格式化
        cost_format:"", // 费用格式化
        net_income_format:"", // 净收入格式化
      }
    };
  },
  created() {
    let vm = this;
    if (this.$route.params && this.$route.params.id) {
      orderDetailApi(this.$route.params.id).then((res) => {
        if (res.data && parseInt(res.data.code) === 100000) {
          vm.order_detail = this.formatOrderDetail(res.data.data);
          vm.payment_detail = this.formatPaymentDetail(res.data.data);
          vm.billing_detail = this.formatBillingDetail(res.data.data);
          vm.cost_detail = this.formatCostDetail(res.data.data);
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  methods: {
    openUserDetail (user_id) {
      this.$router.push({path: "/customers/detail/" + user_id});
    },
    formatOrderDetail (data) {
      return {
        user_id: data.user_id || "",
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
      };
    },
    formatCostDetail (data) {
      return {
        settle_amount: data.settle_pay_amount || "",
        settle_currency: "usd",
        settle_amount_format: this.formatPrice(data.settle_pay_amount, 'usd'),
        settle_refund_amount_format: this.formatPrice(data.settle_refund_amount, 'usd'),
        cost_format: this.formatPrice(data.settle_platform_off_amount, 'usd'),
        net_income_format: this.formatPrice(data.settlt_real_amount, 'usd'),
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
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          return CURRENCY_OPTIONS[currency_key]['symbol'] + ' ' + price;
        }
      }
      return currency + ' ' + price;
    },
    formatBillingDetail(data) {
      const billing_details = data.charge_info && data.charge_info.billing_details;
      return {
        pay_email: data.pay_email || "",
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
      return this.payment_detail.type === "card" && this.payment_detail.brand;
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
