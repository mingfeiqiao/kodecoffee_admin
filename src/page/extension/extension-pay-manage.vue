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
                    <span>{{userInfo.user_id}}</span>
                  </div>
                  <div style="display: flex;padding-bottom: 16px" class="title-14">
                    <span>邮箱:</span>
                    <span>{{userInfo.email}}</span>
                  </div>
                </div>
              </div>
              <div style="border: 1px solid rgba(232, 232, 232, 1);"></div>
              <div style="padding: 16px 0;" class="title-16">当前订阅信息</div>
              <div class="tab-container">
                <el-table :data="subscription_list" style="width: 100%">
                  <el-table-column prop="plan_name" :label="$t('Subscriptions')" min-width="120" max-width="180">
                  </el-table-column>
                  <el-table-column prop="pay_status" :label="$t('Status')" width="80">
                    <template slot-scope="scope">
                      <span>
                        {{scope.row.pay_status}}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="plan_end" :label="$t('Next-pay-time')" width="120" >
                    <template slot-scope="scope">
                      <span style="color: #1980ff;cursor: pointer;display: flex;flex-direction: column;align-items: center;">
                        <span>
                          {{scope.row.order_status}}
                        </span>
                        <span>
                          {{scope.row.plan_end}}
                        </span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('Operation')">
                    <template slot-scope="scope">
                      <span style="color: #1980ff;cursor: pointer" @click="cancelSubscription(scope.row)">
                         取消
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
                <el-table :data="payRecordTableData" style="width: 100%">
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
import {extensionUserInfo} from "../../api/interface";
export default {
  data() {
    return {
      userInfo: {},
      subscription_list:[],
      activeName: '1',
      payRecordTableData:[
        {
          planName: 'planName',
          payStatus: 1,
          payTime: '2016-05-03',
          billUrl:'https://www.baidu.com'
        }
      ]
    };
  },
  created() {
    let headers = {};
    for (let key in this.$route.query) {
      let newKey = key.replace(/_/g, "-");
      headers[newKey] = this.$route.query[key];
    }
    headers["Content-Type"] = "application/json";
    extensionUserInfo(headers).then(res => {
      let resData = res.data;
      if (parseInt(resData.code) === 100000) {
        this.userInfo = data.userinfo;
        // 筛选出来所有的plan_type = recurring的记录, 并把plan_end（时间戳）转换成当前时间
        this.subscription_list = data.payinfo.filter(item => item.plan_type === 'recurring').map(item => {
          item.plan_end = this.timestampToDateString(item.plan_end);
          return item;
        });
      }
    });
  },
  methods: {
    timestampToDateString(timestamp) {
      const date = new Date(timestamp * 1000); // 将秒级别的时间戳转换为毫秒级别
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    cancelSubscription (row) {
      console.log(row)
    },
    handleClick(tab, event) {
      console.log(this.activeName);
      console.log(tab, event);
    },
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