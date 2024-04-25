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

          <el-button size="mini" v-if="is_show_refund" class="btn_refund" @click="onShowRefund">{{ $t('refund') }}</el-button>
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
      <div v-if="isShowDispute" class="disputed-box" style="padding: 24px 0;border-top: 1px solid rgba(232, 232, 232, 1);border-bottom: 1px solid rgba(232, 232, 232, 1);">
        <div class="disputed-box-title">{{ $t('Order Dispute') }}</div>
        <div style="display: flex;margin-top: 20px;">
          <div class="disputed-box-left">
            <div>{{ $t('Dispute Amount') }}: {{ dispute_detail.amount_value / 100 }} {{ dispute_detail.amount_currency ? dispute_detail.amount_currency.toUpperCase() : ''}}</div>
            <div>{{ $t('Reason') }}: {{ dispute_detail.reason }}</div>
            <div>{{ $t('Dispute Time') }}: {{ formatCreatedTime(dispute_detail.created_time) }}</div>
            <div>{{ $t('Response Deadline') }}: {{ formatCreatedTime(dispute_detail.due_by) }}</div>
            <div>{{ $t('Dispute Fee') }}:</div>
            <div>{{ $t('Remarks') }}:</div>
            <div>ID: {{ dispute_detail.dispute_id }}</div>
            
          </div>
          <div class="disputed-box-right">
            <div class="disputed-box-title">{{ $t('Regarding disputes') }}</div>
            <ol>
              <li>{{ $t('Regarding disputes 1') }}</li>
              <li>{{ $t('Regarding disputes 2') }}</li>
              <li>{{ $t('Regarding disputes 3') }}</li>
            </ol>
          </div>
        </div>
        <div class="disputed-box-btn">
          <el-button type="primary" @click="dialogRefuteDispute = true">{{ $t('Refute Dispute') }}</el-button>
          <el-button @click="dialogAcceptDispute = true">{{ $t('Accept dispute') }}</el-button>
        </div>
      </div>
      <div style="padding: 24px 0;border-top: 1px solid rgba(232, 232, 232, 1);border-bottom: 1px solid rgba(232, 232, 232, 1);" v-if="activities.length > 0">
        <div class="title-16">{{$t('Timeline')}}</div>
        <div style="padding-top: 24px">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <div style="padding-top: 24px">
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
        <el-form-item :label="$t('Subscriptions')" v-if="is_support_unsubscribe">
          <el-col :span="18">
            <el-checkbox v-model="is_unsubscribe_checked">{{ $t('unsubscribe') }}</el-checkbox>
            <el-radio-group v-model="refund.unsubscribe_immediately" v-if="is_unsubscribe_checked">
              <el-radio label="immediately" v-if="!is_paypal">
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
            <el-button type="primary" @click="onSubmit('ruleForm')" :loading="refund_loading">{{ $t('refund') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogAcceptDispute"
      width="30%"
    >
      <p class="dispute-title"><i class="el-icon-warning" style="color: #faad14;font-size: 24px;"></i><span>{{ $t('Accept dispute refund') }}</span></p>
      <p style="line-height: 24px;padding-left: 32px;">{{ $t('accepting dispute tips') }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAcceptDispute = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onDialogAcceptDispute">{{ $t('Ok') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogRefuteDispute"
      width="35%"
    >
      <span slot="title" style="font-size: 18px;font-weight: 700;">{{ $t('Refute Dispute') }}</span>
      <div>
          <div class="dispute-top-box">
            <span style="width: 20%;">{{ $t('Basic Description') }}:</span>
            <el-input
              type="textarea"
              :rows="2"
              :placeholder="$t('Please enter content')"
              v-model="dispute_form.product_description">
            </el-input>
          </div>
          <div style="font-size: 16px;font-weight: 600; margin-bottom: 10px;">{{ $t('Proof materials') }}</div>

          <el-form ref="form" :model="dispute_form" label-width="80px" label-position="left">
            <el-form-item :label="$t('Service Certificate')">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileServiceCertificate"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Customer Signature')">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileCustomerSignature"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Receipt')">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileReceipt"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Agreement Terms')" v-if="is_paypal">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileAgreementTerms"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Term Disclosure')" v-if="is_paypal">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileTermDisclosure"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Other')">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileOther"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('Trial Log')">
              <el-upload
                class="upload-demo"
                action=""
                :on-remove="handleRemove"
                :before-upload="onFileTrialLog"
              >
                <el-button size="small" icon="el-icon-upload2">Upload</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuteDispute = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onDialogRefuteDispute">{{ $t('Ok') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ORDER_OPTIONS from "../../options/order_options.json";
import {orderDetailApi, refundApi, unsubscriptionDetailApi, refutedisputeStripe, acceptDisputeStripe, uploadFile, disputeDetails } from "../../api/interface";
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
        transaction_invoice_key: "",
      },
      dispute_detail:{
        amount_value:"",
        created_time:"",
        due_by:"",
        reason:"",
        id:"",
      },
      activities: [],
      cost_detail: {
        settle_amount:"", // 结算货币的实际金额
        settle_currency:"usd", // 结算币种
        settle_amount_format:"", // 订单实际金额格式化
        cost_format:"", // 费用格式化
        net_income_format:"", // 净收入格式化
      },
      dialog_form_visible:false,
      refund_loading:false,
      is_show_refund:false,
      is_support_unsubscribe:false,
      is_unsubscribe_checked:false,
      is_paypal:false,
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
      lang:this.$i18n.locale,
      dialogAcceptDispute:false,
      dialogRefuteDispute:false,
      dispute_form:{
        product_description:'', //描述
        service_documentation:'', //服务证明
        customer_signature:'',  //客户签名
        receipt:'', //收据
        uncategorized_file:'',  //其他
        access_activity_log:''  //试用日志
      },
      dispute_id:'',
      isShowDispute:false
    };
  },
  watch: {
    '$i18n.locale'(newValue) {
      this.lang = newValue;
    }
  },
  created() {
    if(location.href.indexOf('?') != -1) {
      let urlString = location.href.split('?')[1];
      const [key, value] = urlString.split('=');
      const params = {
        [key]: value
      };
      this.dispute_id = params.disputeid;
      this.isShowDispute = true;
      this.onDisputeDetails();
    }
    this.onOrderDetail();
  },
  methods: {
    getUserEmail () {
      const user_info = localStorage.getItem(this.$mode + 'userInfo') ? JSON.parse(localStorage.getItem(this.$mode + 'userInfo')) : {};
      return user_info.email;
    },
    formatTimeLine(data) {
      // 首次订阅的和一次性付费的，需要将下单时间补充，其他不需要补充
      // 如何判断是首次订阅？该transaction_invoice记录中 1.multiple_transactions_flag为created 或者为null的
      const active_time_line = [];
      if (data.plan_type === 'one_time' || (data.plan_type === 'recurring' && (data.multiple_transactions_flag === 'created' || data.multiple_transactions_flag === 'null'))) {
        active_time_line.push({
          content:this.$t('User initiates payment'),
          timestamp:timestampToDateString(data.transaction.created_time, 'yyyy-MM-dd HH:II:SS')
        })
      }
      const transaction_flows = data.transaction_flows;
      transaction_flows.forEach(item => {
        const time_lien = {};
        time_lien.timestamp = timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS');
        let content = '';
        if (item.pay_status === 'succeed') {
          content = this.$t('pay success');
        } else if (item.pay_status === 'invalid') {
          content = this.$t('The order has expired');
        } else if (item.pay_status === 'refunded') {
          if (item.refunded_reason) {
            content = this.$t('You have processed the refund in the background, refund reason:', {email: this.getUserEmail()}) +  this.$t(item.refunded_reason)
          } else {
            content = this.$t('Platform refund completed')
          }
          if (item.refunded_additional_details) {
            content = content + ',' + this.$t('Special reason description:') +  item.refunded_additional_details
          }
        } else if (item.pay_status === 'failed') {
          content = this.$t('Payment failed, reason for failure:') + this.order_detail.error_msg;
        }
        time_lien.content = content;
        active_time_line.push(time_lien)
      });
      return active_time_line;
    },
    onOrderDetail() {
      if (this.$route.params && this.$route.params.id) {
        orderDetailApi(this.$route.params.id).then(res => {
          if (res.data && parseInt(res.data.code) === 100000) {
            this.order_detail = this.formatOrderDetail(res.data.data);
            this.payment_detail = this.formatPaymentDetail(res.data.data);
            this.billing_detail = this.formatBillingDetail(res.data.data);
            this.cost_detail = this.formatCostDetail(res.data.data);
            this.activities = this.formatTimeLine(res.data.data)
            this.is_show_refund = res.data.data.pay_status === "succeed";
            this.is_paypal = res.data.data.pay_type === "paypal";
            this.id = res.data.data.id;
            this.is_support_unsubscribe = this.isSupportUnSubscribe(res.data.data.transaction.order_status)
          } else {
            if (res && res.data && res.data.message) {
              this.$message.warning(res.data.message)
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    onDisputeDetails(){
      disputeDetails(this.dispute_id).then(res => {
        let {data :{data, code}} = res;
        if(code == 100000){
          this.dispute_detail = data;
        }
      }).catch(err =>{  
        console.log('err =>', err);
      })
    },
    isSupportUnSubscribe(transaction_order_status) {
      return transaction_order_status === 'created' || transaction_order_status === 'updated'
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
        transaction_key:data.transaction ? data.transaction.transaction_key : '',
        transaction_invoice_key: data.transaction_invoice_key || ""
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
      this.is_unsubscribe_checked = false;
      this.refund = {
        unsubscribe_immediately:this.is_paypal ? 'expiration' : 'immediately',
        refund_reason:'Customer Request',
        refund_more_detail:'',
      }
      this.dialog_form_visible = true;
    },
    checkNum($event) {
      $event.target.value = $event.target.value.replace(/[^\d]/g, '')
    },
    onSubmit() {
      this.refund_loading = true;
      // 先进行退款操作，后进行取消订阅
      const refund_params = {
        transaction_invoice_key: this.order_detail.transaction_invoice_key,
        refund_reason:this.refund.refund_reason,
        refund_more_detail: this.refund.refund_more_detail
      }
      // 进行退款
      refundApi(refund_params).then(res => {
        const { data } = res || {};
        const { code = 0 , message} = data || {};
        if (parseInt(code) === 100000) {
          this.$message.success(this.$t('Refund Successful'));
          this.dialog_form_visible = false;
          if (this.is_unsubscribe_checked) { // 需要取消订阅
            const un_subscribe_params = {
              transaction_key:this.order_detail.transaction_key,
              unsubscribe_type:this.refund.unsubscribe_immediately
            }
            unsubscriptionDetailApi(un_subscribe_params).then(res => {
              const { data } = res || {};
              const { code = 0 , message} = data || {};
              if (parseInt(code) === 100000) {
                this.$message.success(this.$t('Unsubscription Successful'))
              } else {
                this.$message.warning(message)
              }
              this.refund_loading = false;
              this.onOrderDetail();
            })
          } else {
            this.dialog_form_visible = false;
            this.refund_loading = false;
            this.is_show_refund = false;
            this.onOrderDetail();
          }
        } else {
          this.$message.warning(message)
        }
      });
    },
    //反驳争议
    onDialogRefuteDispute(){
      if(this.is_paypal){

      }else{
        let param = {};
        for (let key in this.dispute_form) {
            if (this.dispute_form[key]) {
              param[key] = this.dispute_form[key];
            }
        }
        refutedisputeStripe(this.id,param).then(res=>{
          let {data :{code, message}} = res;
          if(code == '100000') {
            this.$message.success('Successful');
            this.dialogRefuteDispute = false;
          }
        })
      }
    },
    //接受争议
    onDialogAcceptDispute(){
      console.log('接受争议');
      //判断一下当前的支付类型
      if(this.is_paypal){

      }else{
        acceptDisputeStripe(this.id).then(res=>{
          this.dialogAcceptDispute = false;
          let {data :{code, message}} = res;
          if(code == '100000') {
            this.$message.success('Successful');
          }
        }).catch((err)=>{
          console.log('err =>', err);
        })
      }
    },
    //服务证明
    async onFileServiceCertificate(file) {
      this.dispute_form.service_documentation = await this.getIconUrl('plugin', file);
      return false; // 阻止上传动作
    },
    //客户签名文件
    async onFileCustomerSignature(file) {
      this.dispute_form.customer_signature = await this.getIconUrl('dispute', file);
      return false; // 阻止上传动作
    },
    //收据文件
    async onFileReceipt(file) {
      this.dispute_form.receipt = await this.getIconUrl('dispute', file);
      return false; // 阻止上传动作
    },
    //协议条款
    async onFileAgreementTerms(file) {
      return false; // 阻止上传动作
    },
    //条款披露
    async onFileTermDisclosure(file) {
      return false; // 阻止上传动作
    },
    //其他
    async onFileOther(file) {
      this.dispute_form.uncategorized_file = await this.getIconUrl('dispute', file);
      return false; // 阻止上传动作
    },
    //试用日志
    async onFileTrialLog(file) {
      this.dispute_form.access_activity_log = await this.getIconUrl('dispute', file);
      return false; // 阻止上传动作
    },
    handleRemove(){

    },
    async getIconUrl(path, file) {
      let response = await uploadFile({path: path, icon: file});
      if (parseInt(response.data.code) === 100000) {
        return response.data.data.url;
      } else {
        this.$message({
          message: 'upload error',
          type: 'error'
        });
      }
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
.disputed-box{
  position: relative;
  .disputed-box-title{
    font-size: 16px;
    font-weight: 700;
  }
  .disputed-box-left{
    width: 50%;
  }
  .disputed-box-right{
    line-height: 24px;
    width: 50%;
  }
  .disputed-box-btn{
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
.disputed-box-left >div{
  margin-bottom: 20px;
}
.dispute-title{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}
.dispute-top-box{
  display: flex;
  border-bottom: 1px solid #F2F3F5;
  padding-bottom: 20px;
  margin-bottom: 10px;
}
::v-deep .el-dialog__title{
  font-weight: 700;
}
</style>
