<template>
  <div>
    <el-tabs v-model="active_order_type" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in order_option" :key="index" :label="$t(option.label)" :name="option.value">
        <div>
          <div>
            <div style="display: flex;flex-wrap:wrap">
              <div class="order-btn">
                <date-picker :time_filter_range="date_range" :time_zone="timezone" @change="dateRangeChange"></date-picker>
              </div>
              <div class="order-btn" v-if="active_order_type === 'all order'">
                <div style="padding-right: 12px">{{$t('status') + ":"}}</div><div>
                <el-select size="small" multiple v-model="condition.pay_status" :placeholder="$t('select placeholder')" @visible-change="onBlur" @remove-tag="onDelTags">
                  <el-option
                      v-for="item in order_status_options"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
              </div>
              <div class="order-btn">
                <div style="padding-right: 12px">{{$t('extension') + ':'}}</div>
                <div>
                  <el-select size="small" multiple v-model="condition.client_id" :placeholder="$t('select placeholder')" @visible-change="onBlur" @remove-tag="onDelTags"  @change="search" filterable v-loading="client_list_loading">
                    <el-option
                      v-for="item in client_list"
                      :key="item.client_id"
                      :label="$t(item.name)"
                      :value="item.client_id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="order-btn">
                <div style="padding-right: 12px">{{$t('Plan') + ':'}}</div>
                <div>
                  <el-select size="small" multiple v-model="condition.prod_id" :placeholder="$t('select placeholder')" @visible-change="onBlur" @remove-tag="onDelTags" filterable v-loading="plan_list_loading">
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
                <div style="padding-right: 12px">{{$t('Type') + ':'}}</div>
                <div>
                  <el-select size="small" multiple v-model="condition.plan_type" :placeholder="$t('select placeholder')" @visible-change="onBlur" @remove-tag="onDelTags" filterable>
                    <el-option
                      v-for="item in order_type_options"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value">
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
          <div style="display: flex;justify-content: flex-end;margin: 12px 0">
            <el-button type="primary" icon="el-icon-download" @click="exportBill" :loading="export_loading" size="small">{{$t('Export to CSV')}}</el-button>
          </div>
          <div style="display: flex;flex-direction: column;">
            <el-table v-loading="table_loading" :data="table_data" style="width: 100%"
                      :empty-text="$t('no data')"
                      :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
            >
              <el-table-column prop="prod_name" :label="$t('Plan')"  width="auto">
              </el-table-column>
              <el-table-column prop="order_amount_format" :label="$t('Amount')" width="auto" >
              </el-table-column>
              <el-table-column prop="plan_type" width="auto" :label="$t('Type')">
                <template slot-scope="scope" >
                  <span v-if="scope.row.plan_type_obj">
                    {{$t(scope.row.plan_type_obj)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="auto"  :label="$t('status')" >
                <template slot-scope="scope" >
                  <span v-if="scope.row.order_status_obj" :style="{'color': scope.row.order_status_obj.color}">
                    {{ $t(scope.row.order_status_obj.message)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('Pay Time')" prop="created_time" width="auto" >
              </el-table-column>
              <el-table-column prop="pay_email" width="auto" :label="$t('payment email')">
              </el-table-column>
              <el-table-column width="100" :label="$t('Operation')" align="center">
                <template slot-scope="scope">
                  <span class="link" @click="openOrderDetail(scope.row.order_id)">{{ $t('detail') }}</span>
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
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SUBSCRIPTION_OPTIONS from "../../options/subscription_options.json";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import ORDER_OPTIONS from "../../options/order_options.json";
import {timestampToDateString} from "../../utils/dateUtils";
import {orderList, planFilterListApi, exportBillApi, pluginList} from "../../api/interface";
import datePicker from "../components/date-picker.vue";
export default {
  data() {
    return {
      SUBSCRIPTION_TYPE_OPTIONS : SUBSCRIPTION_OPTIONS.SUBSCRIPTION_TYPE_OPTIONS,
      ORDER_STATUS : ORDER_OPTIONS.ORDER_STATUS_OPTIONS,
      ORDER_STATUS_REF : ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS,
      active_order_type: 'all order',
      page: 1,
      page_size: 10,
      total: 0,
      date_range:[],
      timezone:"",
      user_default_time_zone:"",
      condition: {},
      order:{
        created_time:"desc"
      },
      order_option:[
        {
          label: 'All Orders',
          value: 'all order'
        },
        {
          label: 'Disputes',
          value: 'disputed'
        }
      ],
      order_type_options:[
        {
          label: "one_time",
          value: "one_time"
        },
        {
          label: "Initial Subscription",
          value: "created"
        },
        {
          label: "Renewal",
          value: "updated"
        }
      ],
      plan_list:[],
      plan_list_loading:false,
      client_list:[],
      client_list_loading:false,
      export_loading: false,
      order_status_options:[
        {
          label: 'Succeed',
          value: 'succeed'
        },
        {
          label: 'Failed',
          value: 'failed'
        },
        {
          label: 'Refunded',
          value: 'refunded'
        }
      ],
      CSV_NAME_MAP: {
        'customer email': {
          'zh-CN':"客户邮箱",
          'en-US':'Customer Email'
        },
        'payment email': {
          'zh-CN':"支付邮箱",
          'en-US':'Payment Email'
        },
        'payment method': {
          'zh-CN':'支付方式',
          'en-US':'Payment Method'
        },
        'plan name': {
          'zh-CN':'套餐名称',
          'en-US':'Plan Name'
        },
        'plan type': {
          'zh-CN':'套餐类型',
          'en-US':'Plan type'
        },
        'created time': {
          'zh-CN':'创建时间',
          'en-US':'Created Time'
        },
        'extension name': {
          'zh-CN':'插件',
          'en-US':'Extension Name'
        },
        'order id': {
          'zh-CN':'订单ID',
          'en-US':'Order ID'
        },
        'payment amount' : {
          'zh-CN':'支付金额',
          'en-US':'Payment Amount'
        },
        'charge free': {
          'zh-CN':'收取费用',
          'en-US':'Charge Free'
        },
        'net income': {
          'zh-CN':'净收入',
          'en-US':'Net Income'
        },
        'payment type': {
          'zh-CN':'支付类型',
          'en-US':'Payment Type'
        },
        'card number': {
          'zh-CN':'卡号',
          'en-US':'Card Number'
        },
        'card country': {
          'zh-CN':'卡地区',
          'en-US':'card country'
        },
        'payment name': {
          'zh-CN':'支付名称',
          'en-US':'Payment Name'
        },
        'order status': {
          'zh-CN':'订单状态',
          'en-US':'Order Status'
        },
        'pay currency': {
          'zh-CN':'支付币种',
          'en-US':'Pay Currency'
        }
      },
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
      table_data:[],
      table_loading:false,
      isDelTags:null
    };
  },
  created() {
    this.getPluginList()
    this.getPlanList();
    this.table_data = this.getTableData();
    this.timezone = this.getUserTimezone();
    this.user_default_time_zone = this.timezone;
  },
  components: {
    datePicker
  },
  methods: {
    getUserTimezone() {
      const offset = new Date().getTimezoneOffset() / -60; // 获取当前时区偏移量，转换为 UTC 偏移量
      // 根据当前时区偏移量生成显示格式
      return 'UTC' + (offset >= 0 ? '+' : '') + offset;
    },
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
    formatExportDataCsv (data) {
      const order_detail = this.formatOrderDetail(data);
      const bill_detail = this.formatBillingDetail(data);
      const cost_detail = this.formatCostDetail(data);
      const payment_detail = this.formatPaymentDetail(data);
      return {
        'payment amount':this.formatPrice(data.pay_amount, data.currency) || "",
        'currency': data.currency || "",
        'order status': order_detail.order_status_obj.message || "",
        'customer email': data.user_email || "",
        'payment method':order_detail.payment_type || "",
        'created time':this.formatCreatedTime(data.created_time) || "",
        'plan name':data.prod_name || "",
        'plan type':data.plan_type || "",
        'extension name': data.client_name || "",
        'order id': data.transaction_invoice_key || "",
        'charge free': cost_detail.cost_format || "",
        'net income': cost_detail.net_income_format || "",
        'payment type': payment_detail.brand || "",
        'card number': payment_detail.card_number || "",
        'card country': payment_detail.country || "",
        'payment name': bill_detail.pay_name || "",
        'payment email':bill_detail.pay_email || "",
      }
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
        price_format: this.formatPrice(data.pay_amount, data.currency) ,
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
    createCsv (header, data) {
      //表头数据
      let csvContent = header + '\n';
      //遍历list将数据排列好
      data.forEach((item, index) => {
        let dataString = '';
        header.forEach((i) => {
          let str = item[i];
          // 是否包含了逗号(,)
          // 是否包含了引号(")
          if ((String(str).indexOf(',') !== -1)) {
            str = String(str).replaceAll('"', '""');
          }
          dataString +=  '"' + str + '"' + ',';
        });
        //如果没到最后一条数据就换行添加，如果是最后一条就直接添加
        csvContent += index < data.length ? dataString.replace(/,$/, '\n') : dataString;
      });
      let filename = (new Date()).valueOf();
      this.export(csvContent, filename)
    },
    export (data, filename) {
      let blob = new Blob([data], {type: 'text/csv'});
      let url = window.URL.createObjectURL(blob);
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      }
    },
    formatExportData (data) {
      const result = [];
      data.forEach(item => {
        result.push(this.formatExportDataCsv(item))
      });
      return result;
    },
    exportBill() {
      const condition = Object.assign({}, this.condition);
      if (this.date_range && this.date_range.length > 0) {
        condition['created_time'] = this.transDateRangeTimestamp(this.date_range);
      }
      let args = this.getApiArgs(condition, this.order);
      this.export_loading = true;
      exportBillApi(args).then(res => {
        this.export_loading = false;
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          const csv_data = this.formatExportData(res.data.data)
          console.log((csv_data))
          const header = [
            'payment amount',
            'currency',
            'order status',
            'customer email',
            'payment method',
            'created time',
            'plan name',
            'plan type',
            'extension name',
            'order id',
            'charge free',
            'net income',
            'payment type',
            'card number',
            'card country',
            'payment name',
            'payment email'];
          this.createCsv(header, csv_data)
        }
      })
    },
    getPlanList() {
      this.plan_list_loading = true;
      planFilterListApi({order: {'created_time':'desc'}}).then( res => {
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
    resetPageParams () {
      this.page = 1;
      this.page_size = 10;
      this.total = 0;
    },
    /**
     * tab切换
     */
    handleClick() {
      this.condition = {};
      this.resetPageParams();
      if (this.active_order_type === 'disputed') {
        this.condition.is_dispute = 1
      }
      this.getTableData();
    },
    openOrderDetail (order_id) {
      this.$router.push({path: "/orders/detail/" + order_id});
    },
    /**
     * 改变每页显示条数
     */
    reset() {
      this.condition = {};
      this.resetPageParams();
      this.getTableData();
    },
    /**
     * 搜索
     */
    search() {
      this.resetPageParams();
      this.getTableData();
    },
    //隐藏下拉框（也就是选好了确认）
    onBlur(event) {
      if(!event) {
        this.resetPageParams();
        this.getTableData();
      }
    },
    //移除多选框Tags触发，需要增加防抖事件。
    onDelTags(){
      if(this.isDelTags) clearTimeout(this.isDelTags);
      this.isDelTags = setTimeout(() => {
        this.isDelTags = null;
        this.resetPageParams();
        this.getTableData();
      }, 1000)
    },
    /**
     * 获取api参数
     * @param condition
     * @param orders
     * @returns {{condition: {}, order: {}}}
     */
    getApiArgs (condition, orders) {
      let condition_temp = {};
      for (let key in condition) {
        if (condition[key]) {
          if (Array.isArray(condition[key]) && condition[key].length === 0) {
            continue
          }
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
        'condition': condition_temp,
        'order': orders_temp
      }
    },
    dateRangeChange(date_range, timezone){
      this.timezone = timezone;
      this.date_range = date_range;
      this.resetPageParams();
      this.getTableData();
    },
    /**
     * 获取表格数据
     * @returns {*}
     */
    getTableData () {
      const condition = Object.assign({}, this.condition);
      if (this.date_range && this.date_range.length > 0) {
        condition['created_time'] = this.transDateRangeTimestamp(this.date_range);
      }
      let args = this.getApiArgs(condition, this.order);
      args['page'] = this.page;
      args['page_size'] = this.page_size;
      this.table_loading = true;
      this.table_data = [];
      orderList(args).then(res => {
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
        console.log(err);
      });
    },
    transDateRangeTimestamp(date_range) {
      if (date_range) {
        if (date_range.length === 2) {
          return [this.convertToUnixTimestamp(date_range[0] + ' 00:00:00'), this.convertToUnixTimestamp(date_range[1] + ' 23:59:59')];
        } else {
          return [this.convertToUnixTimestamp(date_range[0] + ' 00:00:00')]
        }
      } else {
        return [];
      }
    },
    convertToUnixTimestamp(dateString) {
      if (this.timezone === this.user_default_time_zone) {
        // 将时间字符串转换为本地时间戳（单位：秒）
        return Math.floor(new Date(dateString).getTime() / 1000);
      } else {
        // 将时间字符串转换为 UTC+0 时间戳（单位：秒）
        return Math.floor(new Date(dateString + ' UTC').getTime() / 1000);
      }
    },
    /**
     * 格式化表格数据
     * @param data
     * @returns {*}
     */
    formatTableData (data) {
      const order_status_option = ['created', 'updated'];
      data.forEach(item => {
        if (item.id) {
          item.order_id = item.id;
        }
        if (item.created_time) {
          item.created_time = timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS');
        }
        if (item.currency && item.pay_amount) {
          item.order_amount_format = this.formatPrice(item.pay_amount, item.currency);
        }
        if (item.plan_type) {
          if (item.plan_type === 'one_time') {
            item.plan_type_obj = item.plan_type
          } else {
            let order_status = item.order_status
            if (!order_status_option.includes(item.order_status)) {
              order_status = item.multiple_transactions_flag
            }
            if (order_status === 'null') {
              order_status = 'created';
            }
            for (const plan_type of this.order_type_options) {
              if (order_status === plan_type.value) {
                item.plan_type_obj = plan_type.label
              }
            }
          }
        }
        if (this.ORDER_STATUS_REF[item.pay_status]) {
          item.order_status_obj = this.ORDER_STATUS[this.ORDER_STATUS_REF[item.pay_status]];
        }
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
      this.getTableData();
    },
    formatPrice (price, currency) {
      let symbol = '';
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          symbol = CURRENCY_OPTIONS[currency_key]['symbol'];
          return symbol + ' ' + price;
        }
      }
      return currency + ' ' + price;
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
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
.el-picker-panel__sidebar {
  width: 120px;
}
</style>
