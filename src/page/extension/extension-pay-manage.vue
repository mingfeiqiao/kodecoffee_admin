<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding-bottom: 24px">
          <div class="title-28">{{$t('billing management')}}</div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('subscriptions info')" name="1">
            <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;">
              <div>
                <div style="padding-bottom: 16px" class="title-20">{{$t('account info')}}</div>
                <div>
                  <div style="display: flex;padding-bottom: 16px" class="title-14">
                    <span>{{$t('email:')}}</span>
                    <span>{{user_info.email}}</span>
                  </div>
                </div>
              </div>
              <div style="border: 1px solid rgba(232, 232, 232, 1);"></div>
              <div style="padding: 16px 0;" class="title-16">{{$t('subscriptions info')}}</div>
              <div class="tab-container">
                <el-table :data="subscription_list" style="width: 100%;" height="300"
                          :empty-text="$t('no data')"
                          :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
                >
                  <el-table-column prop="plan_name" :label="$t('subscriptions')" min-width="80" max-width="120">
                  </el-table-column>
                  <el-table-column :label="$t('status')" align="center">
                    <template slot-scope="scope">
                      <span :style="{'color': scope.row.color}">
                        {{ $t(scope.row.subscription_status_message) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column  width="120" align="center">
                    <template slot="header" slot-scope="scope">
                      <div style="display: flex;align-items: center;justify-content: center;">
                        <span>
                        {{$t('subscription expired time')}}
                        </span>
                        <span>
                          <el-tooltip class="item" :content="$t('subscription expired tip')" effect="light" placement="top">
                            <i class="el-icon-info" style="color: #c4c4c4"></i>
                          </el-tooltip>
                        </span>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <span>
                        <span>
                          {{scope.row.plan_end}}
                        </span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('Operation')" width="80px" align="center">
                    <template slot-scope="scope">
                      <span :style="{'color': scope.row.operation ? scope.row.operation.color : '', 'cursor': 'pointer'}"
                            @click="scope.row.operation ? scope.row.operation.function(scope.row) : ''"
                      >
                         {{ scope.row.operation ? $t(scope.row.operation.message) : '' }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('orders record')" name="2">
            <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;">
              <div style="padding: 16px 0;" class="title-16">{{$t('orders record')}}</div>
              <div class="tab-container">
                <el-table :data="order_list" style="width: 100%"  height="400"
                          :empty-text="$t('no data')"
                          :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
                >
                  <el-table-column prop="plan_name" :label="$t('sell plan')" max-width="160" align="center" >
                  </el-table-column>
                  <el-table-column prop="order_status" :label="$t('status')"  width="100"  align="center">
                    <template slot-scope="scope">
                      <span :style="{'color': scope.row.order_status_color}">
                        {{ $t(scope.row.order_status_message)}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('create time')" prop="created_time" align="center">
                  </el-table-column>
                  <el-table-column :label="$t('receipt')" align="center" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.order_operation" :style="{'color': scope.row.order_operation.color, 'cursor':'pointer'}"
                            @click="scope.row.order_operation.function(scope.row.invoice_pdf_url)">
                        {{$t(scope.row.order_operation.message)}}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <language-change></language-change>
      </div>
    </main>
  </div>
</template>
<script>
import {extensionCancelSubscription, extensionUserInfo} from "../../api/interface";
import SUBSCRIPTION_OPTIONS from '../../options/subscription_options.json'
import ORDER_OPTIONS from '../../options/order_options.json'
import languageChange from "../components/language-change.vue";

export default {
  components: {languageChange},
  data() {
    return {
      user_info: {},
      common_headers:{},
      SUBSCRIPTION_TYPE_OPTIONS: {},
      SUBSCRIPTION_OPERATION_MAP: {
        active: {
          message: 'cancel',
          color: '#1980ff',
          function: this.cancelSubscription
        }
      },
      SUBSCRIPTION_STATUS: {},
      SUBSCRIPTION_STATUS_REF:{},
      subscription_list:[],
      activeName: '1',
      ORDER_STATUS: {},
      ORDER_STATUS_REF:{},
      ORDER_OPERATION_MAP:{
        succeed: {
          message: 'download',
          color: '#1980ff',
          function: this.openBillUrl
        },
        refunded: {
          message: 'download',
          color: '#1980ff',
          function: this.openBillUrl
        },
        disputed: {
          message: 'download',
          color: '#1980ff',
          function: this.openBillUrl
        }
      },
      order_list:[],
    };
  },
  created() {
    this.common_headers = this.getCommonHeaders();
    this.SUBSCRIPTION_STATUS = SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_OPTIONS;
    this.SUBSCRIPTION_STATUS_REF = SUBSCRIPTION_OPTIONS.SUBSCRIPTION_STATUS_REF_OPTIONS;
    this.SUBSCRIPTION_TYPE_OPTIONS = SUBSCRIPTION_OPTIONS.SUBSCRIPTION_TYPE_OPTIONS;
    this.ORDER_STATUS = ORDER_OPTIONS.ORDER_STATUS_OPTIONS;
    this.ORDER_STATUS_REF = ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS;
    // this.testUserInfo();
    this.getUserInfo();
  },
  methods: {
    /**
     * 获取通用header
     * @returns {{}}
     */
    getCommonHeaders() {
      let headers = {};
      for (let key in this.$route.query) {
        let newKey = key.replace(/_/g, "-");
        headers[newKey] = this.$route.query[key];
      }
      return headers;
    },
    testUserInfo () {
      let resData = {
        "code": 100000,
        "message": "success",
        "userinfo": {
          "application_id": "519a73da-0f6e-4bd4-ae2a-add09b26ba01",
          "extension_id": "008b09de-28f1-377d-b6aa-0cce36c50fc4",
          "user_id": "c765a5c4-0041-11ee-bb5d-0242ac120003",
          "email": "kh@zingfront.com",
          "created_at": "2023-06-01 06:01:41.680654+00:00",
          "last_login_time": null
        },
        "payinfo": [
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "created", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": '',  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "updated", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": '',  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "canceling", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": '',  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "canceled", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": null,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "pastdue", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": 456,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "invalid", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": 456,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          }
        ],
        "invoice_list": [
          {
            "pay_type": "stripe",
            "plan_type": "one_time", //一次性支付
            "currency": "usd",
            "pay_amount": 199,  //单位分
            "pay_time": 1686195875, //付款时间戳
            "plan_start_time": null,
            "plan_end_time": null,
            "order_status": "created",
            "pay_status": "succeed",
            "created_at": "2023-06-08 05:52:47",
            "updated_at": "2023-06-08 13:52:47",
            "plan_name": "mfei02",
            "transaction_id": "c3380844-05ae-11ee-b72a-0242ac150002" //订单key
          },
          {
            "pay_type": "stripe",
            "plan_type": "recurring", //订阅
            "currency": "usd",
            "pay_amount": 399, //单位分
            "pay_time": 1686195453, //付款时间戳
            "plan_start_time": 1686195453,
            "plan_end_time": 1686281853,
            "created_time": 1686195453,
            "order_status": "created",
            "pay_status": "failed",
            "created_at": "2023-06-08 03:37:46",
            "updated_at": "2023-06-08 11:37:46",
            "plan_name": "kodepay-mfei",
            "transaction_id": "c0d145ee-05ad-11ee-9d68-0242ac150002" //订单key
          },
          {
            "pay_type": "stripe",
            "plan_type": "recurring", //订阅
            "currency": "usd",
            "pay_amount": 399, //单位分
            "pay_time": 1686195453, //付款时间戳
            "plan_start_time": 1686195453,
            "plan_end_time": 1686281853,
            "created_time": 1686195453,
            "order_status": "created",
            "pay_status": "created",
            "created_at": "2023-06-08 03:37:46",
            "updated_at": "2023-06-08 11:37:46",
            "plan_name": "kodepay-mfei",
            "transaction_id": "c0d145ee-05ad-11ee-9d68-0242ac150002" //订单key
          },
          {
            "pay_type": "stripe",
            "plan_type": "recurring", //订阅
            "currency": "usd",
            "pay_amount": 399, //单位分
            "pay_time": 1686195453, //付款时间戳
            "plan_start_time": 1686195453,
            "plan_end_time": 1686281853,
            "created_time": 1686195453,
            "order_status": "created",
            "pay_status": "refunded",
            "created_at": "2023-06-08 03:37:46",
            "updated_at": "2023-06-08 11:37:46",
            "plan_name": "kodepay-mfei",
            "transaction_id": "c0d145ee-05ad-11ee-9d68-0242ac150002" //订单key
          },
          {
            "pay_type": "stripe",
            "plan_type": "recurring", //订阅
            "currency": "usd",
            "pay_amount": 399, //单位分
            "pay_time": 1686195453, //付款时间戳
            "plan_start_time": 1686195453,
            "plan_end_time": 1686281853,
            "created_time": 1686195453,
            "order_status": "created",
            "pay_status": "dispute",
            "created_at": "2023-06-08 03:37:46",
            "updated_at": "2023-06-08 11:37:46",
            "plan_name": "kodepay-mfei",
            "transaction_id": "c0d145ee-05ad-11ee-9d68-0242ac150002" //订单key
          }
        ]
      };
      if (parseInt(resData.code) === 100000) {
        this.user_info = resData.userinfo;
        this.subscription_list = this.formatSubscriptionListFromRes(resData.payinfo);
        this.order_list = this.formatOrderListFromRes(resData.invoice_list);
      }
    },
    /**
     * 获取用户信息
     */
    getUserInfo () {
      let vm = this;
      extensionUserInfo(vm.common_headers).then(res => {
        console.log(res);
        let resData = res.data;
        if (parseInt(resData.code) === 100000) {
          vm.user_info = resData.userinfo;
          vm.subscription_list = vm.formatSubscriptionListFromRes(resData.payinfo);
          vm.order_list = vm.formatOrderListFromRes(resData.invoice_list);
        } else {
          vm.$router.push({
            path: "/extension/login",
            query: vm.$route.query
          });
        }
      });
    },
    /**
     *
     * @param order_list
     * @returns {*|*[]}
     */
    formatOrderListFromRes(order_list) {
      if (!order_list) {
        return [];
      }
      order_list.map(item => {
        if (item.created_time) {
          item.created_time = this.timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS');
        }
        if (this.ORDER_STATUS_REF[item.pay_status]) {
          item.order_status = this.ORDER_STATUS_REF[item.pay_status];
          item.order_status_message = this.ORDER_STATUS[item.order_status].message;
          item.order_status_color = this.ORDER_STATUS[item.order_status].color;
        }
        if (this.ORDER_OPERATION_MAP[item.order_status]) {
          item.order_operation = this.ORDER_OPERATION_MAP[item.order_status];
        }
        return item;
      });
      return order_list;
    },
    /**
     * 从接口返回的数据中筛选出订阅列表，筛选的规则是plan_type = recurring，同时把plan_end（时间戳）转换成当前时间， 并且把pay_status转换成对应的前端状态PAY_STATUS_REF
     * @param subscription_info_list
     * @returns {*[]}
     */
    formatSubscriptionListFromRes (subscription_info_list) {
      if (!subscription_info_list) {
        return [];
      }
      // 筛选出来所有的plan_type = recurring的记录, 并把plan_end（时间戳）转换成当前时间
      return subscription_info_list.filter(item => item.plan_type === this.SUBSCRIPTION_TYPE_OPTIONS['recurring'] && item.order_status !== 'null').map(item => {
        if (item.plan_end) {
          item.plan_end = this.timestampToDateString(item.plan_end);
        } else {
          item.plan_end = '-';
        }
        if (this.SUBSCRIPTION_STATUS_REF[item.order_status]) { // 应该是个OBJECT
          item.subscription_status = this.SUBSCRIPTION_STATUS_REF[item.order_status];
          // item.subscription = this.SUBSCRIPTION_STATUS[item.subscription_status];
          item.color = this.SUBSCRIPTION_STATUS[item.subscription_status].color;
          item.subscription_status_message = this.SUBSCRIPTION_STATUS[item.subscription_status].message;
        }
        if (this.SUBSCRIPTION_OPERATION_MAP[item.subscription_status]) {
          item.operation = this.SUBSCRIPTION_OPERATION_MAP[item.subscription_status];
        }
        return item;
      });
    },
    /**
     * 时间戳转换为日期
     * @param timestamp
     * @param format
     * @returns {string}
     */
    timestampToDateString(timestamp, format = 'yyyy-MM-dd') {
      const date = new Date(timestamp * 1000); // 将秒级别的时间戳转换为毫秒级别
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let dateString = `${year}-${month}-${day}`;

      if (format === 'yyyy-MM-dd HH:II:SS') {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        dateString += ` ${hours}:${minutes}:${seconds}`;
      }

      return dateString;
    },
    /**
     * 取消订阅
     * @param row
     */
    cancelSubscription (row) {
      let vm = this;
      extensionCancelSubscription(vm.common_headers,{transaction_id: row.transaction_id}).then(res => {
        console.log(res);
        let resData = res.data;
        if (parseInt(resData.code) === 100000) {
          vm.$message({
            message: '取消中，请稍后',
            type: 'success'
          });
          vm.getUserInfo();
        } else {
          vm.$message({
            message: resData.message,
            type: 'error'
          });
        }
      }).catch(err => {
        vm.$message({
          message: 'error',
          type: 'error'
        });
        console.log(err);
      });
    },
    /**
     * tab切换
     * @param tab
     * @param event
     */
    handleClick(tab, event) {
      console.log(this.activeName);
      console.log(tab, event);
    },
    /**
     * 打开账单链接
     * @param url
     */
    openBillUrl (url) {
      window.open(url);
    }
  }
};
</script>
<style scoped lang="less">
.container {
  max-width: 1080px;
  padding: 24px 32px;
  min-width: 600px;
  min-height: 600px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}
</style>