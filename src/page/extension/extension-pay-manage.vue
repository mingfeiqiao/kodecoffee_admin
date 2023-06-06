<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding-bottom: 24px">
          <div class="title-28">支付管理</div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账单信息" name="1">
            <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;">
              <div>
                <div style="padding-bottom: 16px" class="title-20">账号信息</div>
                <div>
                  <div style="display: flex;padding-bottom: 16px" class="title-14">
                    <span>用户ID:</span>
                    <span>{{user_info.user_id}}</span>
                  </div>
                  <div style="display: flex;padding-bottom: 16px" class="title-14">
                    <span>邮箱:</span>
                    <span>{{user_info.email}}</span>
                  </div>
                </div>
              </div>
              <div style="border: 1px solid rgba(232, 232, 232, 1);"></div>
              <div style="padding: 16px 0;" class="title-16">当前订阅信息</div>
              <div class="tab-container">
                <el-table :data="subscription_list" style="width: 100%"
                          :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
                >
                  <el-table-column prop="plan_name" :label="$t('Subscriptions')" min-width="120" max-width="180">
                  </el-table-column>
                  <el-table-column :label="$t('Status')">
                    <template slot-scope="scope">
                      <span :style="{'color:': PAY_STATUS[scope.row.status].color}">
                        {{PAY_STATUS[scope.row.status].message}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column  width="120" >
                    <template slot="header" slot-scope="scope">
                      <div style="display: flex;align-items: center">
                        <span>
                        {{$t('subscription_expired_time')}}
                      </span>
                        <span>
                          <el-tooltip class="item" content="当前生效的订阅到期的日期，如果没有取消，则到期后会自动续订" effect="light" placement="top">
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
                  <el-table-column :label="$t('Operation')" width="80px">
                    <template slot-scope="scope">
                      <span style="color:#2F54EB;cursor: pointer" @click="PAY_STATUS[scope.row.status].function(scope.row)">
                         {{PAY_STATUS[scope.row.status].operation}}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="支付记录" name="2">
            <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;">
              <div style="padding: 16px 0;" class="title-16">成功支付记录</div>
              <div class="tab-container">
                <el-table :data="payRecordTableData" style="width: 100%"
                          :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
                >
                  <el-table-column prop="planName" label="产品" min-width="120" max-width="180">
                  </el-table-column>
                  <el-table-column prop="payStatus" label="状态"  width="80">
                  </el-table-column>
                  <el-table-column prop="payTime" label="交易时间" width="120" >
                  </el-table-column>
                  <el-table-column prop="账单" :label="$t('Operation')">
                    <template slot-scope="scope">
                      <span style="color: #1980ff;cursor: pointer" @click="openBillUrl(scope.row.billUrl)">
                        查看
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
  </div>
</template>
<script>
import {extensionUserInfo, extensionCancelSubscription} from "../../api/interface";
export default {
  data() {
    return {
      user_info: {},
      common_headers:{},
      PAY_STATUS: {
        active: {
          message: '生效中',
          color: '#08A81F',
          operation: '取消',
          function: this.cancelSubscription
        },
        canceling: {
          message: '取消中',
          color: '#101010'
        },
        canceled: {
          message: '已取消',
          color: '#101010'
        },
        pastdue: {
          message: '已过期',
          color: '#E14040',
        },
        invalid: {
          message: '已失效',
          color: '#101010'
        },
      },
      PAY_STATUS_REF:{
        created: 'active',
        updated: 'active',
        canceling: 'canceling',
        canceled: 'canceled',
        pastdue: 'pastdue',
        invalid: 'invalid',
      },
      subscription_list:[],
      activeName: '1',
      payRecordTableData:[
      ]
    };
  },
  created() {
    this.common_headers = this.getCommonHeaders();
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
            "plan_end": 456,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "updated", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": 456,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "canceling", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": 456,  //套餐权限结束时间，时间戳
            "plan_id": 1,  //套餐id
            "plan_name": "产品测试", //套餐名称
            "pay_time": 1234567890,//支付时时间戳
          },
          {
            "transaction_id": "5ff57734-0041-11ee-9e17-0242ac120003",
            "plan_type": "recurring",//套餐类型:'one_time':"一次性支付",'recurring':"订阅"
            "order_status": "canceled", //订阅状态:null：无订阅,created：首次订阅,updated：续订,canceling：取消中,canceled：取消成功,pastdue：已过期，invalid：已失效
            "pay_status": "succeed", //支付状态,created:支付创建;succeed:支付成功;failed:支付失败;refunded:退款
            "plan_end": 456,  //套餐权限结束时间，时间戳
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
        ]
      };
      if (parseInt(resData.code) === 100000) {
        this.user_info = resData.userinfo;
        this.subscription_list = this.formatSubscriptionListFromRes(resData.payinfo);
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
        }
      });
    },
    /**
     * 从接口返回的数据中筛选出订阅列表，筛选的规则是plan_type = recurring，同时把plan_end（时间戳）转换成当前时间， 并且把pay_status转换成对应的前端状态PAY_STATUS_REF
     * @param pay_info
     * @returns {*[]}
     */
    formatSubscriptionListFromRes (pay_info) {
      if (!pay_info) {
        return [];
      }
      // 筛选出来所有的plan_type = recurring的记录, 并把plan_end（时间戳）转换成当前时间
      let sub = pay_info.filter(item => item.plan_type === 'recurring').map(item => {
        item.plan_end = this.timestampToDateString(item.plan_end);
        item.status = this.PAY_STATUS_REF[item.order_status];
        return item;
      });
      console.log(sub);
      return sub;
    },
    /**
     * 时间戳转换为日期
     * @param timestamp
     * @returns {string}
     */
    timestampToDateString(timestamp) {
      const date = new Date(timestamp * 1000); // 将秒级别的时间戳转换为毫秒级别
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
.tab-container {
  max-width: 800px;
  min-width: 500px;
}
</style>