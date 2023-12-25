<template>
  <div class="container">
    <div>
      <div>
        <div>{{$t('pay')}}:</div>
        <div class="payment_information_box">
          <span class="title-20" style="flex-shrink: 0;">{{ order_detail.price_format }}</span>
          <span v-if="order_detail.currency" style="color: #929292;font-size: 20px;padding-left: 8px">{{order_detail.currency.toUpperCase()}}</span>
          <span v-if="order_detail.order_status_obj" :style="{
            'border-radius': '4px',
            'margin-left':'20px',
            'padding':'0 10px',
            'color': order_detail.order_status_obj.color,
            'background-color': order_detail.order_status_obj['background-color'],
            'border': '1px solid ' + order_detail.order_status_obj.color,
            'flex-shrink': 0
          }">{{ $t(order_detail.order_status_obj.message) }}</span>
          <span v-if="order_detail.error_msg" style="padding-left: 24px;color: #929292">
            {{order_detail.error_msg}}
          </span>

          <el-button size="mini" v-if="isShowRefund" class="btn_refund" @click="onShowRefund">{{ $t('refund') }}</el-button>
        </div>
      </div>
      <el-descriptions  class="order-descriptions">
        <el-descriptions-item :label="$t('customer')">
          <span class="link" @click="openUserDetail(order_detail.user_id)">{{order_detail.user_email}}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('payment method')">
          <span v-if="order_detail.payment_channel === 'stripe'">
            <span v-if="order_detail.payment_type === 'card'" style="display: flex;align-items: center;">
              <svg width="18" height="18">
                <use xlink:href="#bank-card"></use>
              </svg>
              <span style="padding-left: 8px">
                {{payment_detail.card_number}}
              </span>
          </span>
            <span v-else-if="order_detail.payment_type === 'alipay'" style="display: flex;align-items: center;">
              <svg width="18" height="18">
                <use xlink:href="#alipay"></use>
              </svg>
              <span style="padding-left: 8px">
                {{$t('alipay')}}
              </span>
          </span>
            <span v-else-if="order_detail.payment_type === 'wechat'" style="display: flex;align-items: center;">
              <svg width="18" height="18">
                <use xlink:href="#wechat-pay"></use>
              </svg>
              <span style="padding-left: 8px">
                {{$t('wechat')}}
              </span>
          </span>
          </span>
          <span v-else-if="order_detail.payment_channel === 'paypal'" style="display: flex;align-items: center;">
            <svg width="18" height="18">
              <use xlink:href="#paypal"></use>
            </svg>
            <span>
              paypal
            </span>
          </span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('Pay Time')">{{ order_detail.created_time }}</el-descriptions-item>
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

    <el-dialog :title="$t('refund')"  :visible.sync="dialog_form_visible" width="35%" :modal-append-to-body="false" destroy-on-close >
      <div :class="lang == 'en-US' ? 'refund_tips_box refund_tips_en' : 'refund_tips_box'">
        <i class="el-icon-warning"></i>
        <div>{{ $t('Refund Tips') }}<span style="color: rgba(89, 126, 247, 1);cursor: pointer;">{{ $t('learn more') }}</span></div>
      </div>
      
      <el-form ref="ruleForm" :model="refund"  :label-width="lang == 'en-US' ? '105px' : '55px'" size="mini" :rules="rules" label-position="left">
        <el-form-item :label="$t('refund')" prop="amount">
          <el-col :span="12">
            <el-input placeholder="-" v-model="order_detail.price" @keyup.native="checkNum($event)" :readonly=true>
              <template slot="prepend">{{order_detail.currency.toUpperCase()}}</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('Subscriptions')">
          <el-col :span="18">
            <el-radio-group v-model="refund.unsubscribe_immediately" v-if="isSubscribeChecked">
              <el-radio label="immediate" v-if="!isPayPal">
                {{ $t('End immediately') }}
                <el-tooltip class="item" effect="light" :content="$t('immediately tips')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-radio>
              <el-radio label="expiration">
                {{ $t('expiration') }}
                <el-tooltip class="item" effect="light" :content="$t('expiration tips')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-radio>
            </el-radio-group>

            <el-checkbox v-model="isSubscribeChecked" v-else>{{ $t('unsubscribe') }}</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('reason')">
          <el-col :span="18">
            <el-select v-model="refund.refund_reason">
              <el-option v-for="item in interval_options" :key="item.value" :label="$t(item.label)" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('Refund reason')"
            v-model="refund.refund_more_detail"
            rows="4"
            resize="none"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <div style="float: right;padding-top: 24px">
            <el-button @click="dialog_form_visible = false" >{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')" :loading="save_loading">{{ $t('refund') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
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
          "background-color":"#F0F0F0"
        },
        succeed: {
          "message": "Succeed",
          "color":"rgba(112, 206, 70, 100)",
          "background-color":"rgba(246, 255, 237, 100)"
        },
        failed: {
          "message": "Failed",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"#FFF1F0"
        },
        refunded: {
          "message": "Refunded",
          "color":"rgba(16, 16, 16, 100)",
          "background-color":"#F0F0F0"
        },
        disputed: {
          "message": "Disputed",
          "color":"rgba(247, 72, 82, 1)",
          "background-color":"#FFF1F0"
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
        payment_channel:"",
        user_email:"",
        plan_type: "",
        country: "",
        currency: "",
        price: "",
        price_format: "",
        order_status_obj: {},
        charge:"",
        error_msg: '',
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
      },
      isShowRefund:false,
      dialog_form_visible:false,
      save_loading:false,
      isSubscribeChecked:false,
      isPayPal:false,
      refund:{
        unsubscribe_immediately:'expiration',
        refund_reason:'Customer Request',
        refund_more_detail:'',
      },
      interval_options:[
        {"label":'Customer Request',"value": "Customer Request"},
        {"label":'Duplicate Payment',"value": "Duplicate Payment"},
        {"label":'Fraud Risk',"value": "Fraud Risk"},
        {"label":'Other',"value": "Other"},
      ],
      rules:{},
      lang:this.$i18n.locale
    };
  },
  watch: {
    '$i18n.locale'(newValue) {
      this.lang = newValue;
    }
  },
  created() {
    this.onOrderDetail();
  },
  methods: {
    onOrderDetail() {
      let vm = this;
      if (this.$route.params && this.$route.params.id) {
        orderDetailApi(this.$route.params.id).then((res) => {
          if (res.data && parseInt(res.data.code) === 100000) {
            vm.order_detail = this.formatOrderDetail(res.data.data);
            vm.payment_detail = this.formatPaymentDetail(res.data.data);
            vm.billing_detail = this.formatBillingDetail(res.data.data);
            vm.cost_detail = this.formatCostDetail(res.data.data);

            this.isShowRefund = res.data.data.pay_status == "succeed" ? true : false;
            this.isPayPal = res.data.data.pay_type == "paypal" ? true : false
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
        payment_channel:data.pay_type ||"",
        country: data.country || "",
        currency: data.currency || "",
        price: data.pay_amount || "",
        error_msg:data.error_msg ? data.error_msg.error_message : '',
        price_format: this.formatPrice(data.pay_amount, data.currency),
        order_status_obj: this.formatOrderStatus(data),
        charge: (data.charge_info && data.charge_info.charge) || "",
        order_id: data.transaction_invoice_key || "",
        created_time: this.formatCreatedTime(data.created_time),
        payment_type: this.getPaymentType(data),
        card_number: this.getCardNumber(data),
        transaction_key:data.transaction ? data.transaction.transaction_key : ''
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
      if (data) { // stripe 支付渠道，有charge info
        if (data.charge_info) {
          return data.charge_info.payment_method_details && data.charge_info.payment_method_details.type || "";
        } else {
          return data.pay_type || "";
        }
      }
      return  "";
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
    onShowRefund(){
      this.isSubscribeChecked = false;
      this.refund = {
        unsubscribe_immediately:this.isPayPal ? 'expiration' : 'immediate',
        refund_reason:'Customer Request',
        refund_more_detail:'',
      }
      this.dialog_form_visible = true;
    },
    checkNum($event) {
      console.log('$event =>', $event.target);
      $event.target.value = $event.target.value.replace(/[^\d]/g, '')
      this.input1 = $event.target.value;
    },
    onSubmit(formName) {
      // console.log('ruleForm =>',this.refund);
      // let params = {
      //   transaction_key:this.order_detail.transaction_key,
      //   transaction_invoice_key:this.order_detail.order_id,
      //   type: this.order_detail.plan_type,
      //   refund_reason: this.refund.refund_reason,
      //   refund_more_detail: this.refund.refund_more_detail || '',
      // }
      // if(this.isSubscribeChecked) {
      //   params.unsubscribe_immediately = this.refund.unsubscribe_immediately
      // }
      // refundApi  退款接口

      let params = {
        transaction_invoice_key:this.order_detail.order_id,
        refund_reason: this.refund.refund_reason,
        refund_more_detail: this.refund.refund_more_detail || ''
      }
      console.log('params =>', params);

      //如果要取消订阅  unsubscriptionDetailApi
      // if(this.isSubscribeChecked && (res.code == 10000 || res.code == 100001)) {
      //   let paramsSubscribe = {
      //     unsubscribe_immediately: this.refund.unsubscribe_immediately,
      //     transaction_key: this.subscription.subscription_id
      //   }
      //   console.log('paramsSubscribe =>', paramsSubscribe);
      //   //取消订阅的话去刷新一下目前的订单状态
      //   this.onOrderDetail();
      // }else if(res.code == 10000){
      //   this.$message.success(this.$t('Refund successful'));
      // }else{
      //   this.$message.warning(this.$t('refund failure 2'));
      // }

    //   "refund failure 1":"该订单已经退款，无法再次退款",
    // "refund failure 2":"退款失败，请稍后重试",
    // "Refund successful": "退款失败",
    // "Unsubscribe successfully":"取消订阅成功",
    // "Unsubscribe failure 1":"续订已经取消，无需再次取消订阅",
    // "Unsubscribe failure 2":"取消订阅失败，请稍后在订阅列表中重新操作"
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

/deep/ .el-dialog__body{
  padding: 20px 30px;
}
.payment_information_box{
  display:flex;
  align-items: center;
  padding: 8px 0 24px 0;
  position: relative;
  .btn_refund{
    position: absolute;
    right: 0;
    top: 0;
  }
}

.refund_tips_box{
  width: 100%;
  height: 60px;
  line-height: 20px;
  border-radius: 5px;
  background-color: rgba(240, 245, 255, 1);
  border: 1px solid rgba(89, 126, 247, 1);
  margin-bottom: 30px;
  padding: 10px 8px;
  box-sizing: border-box;
  display: flex;
  gap: 5px;
  i{
    color: rgba(89, 126, 247, 1);
    font-size: 16px;
    margin-top: 2px;
  }
  div{
    line-height: 20px;
  }
}

.refund_tips_en{
  word-wrap: break-word;
  word-break: normal;
  height: 100px;
}
</style>
