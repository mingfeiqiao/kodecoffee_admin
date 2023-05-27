<template>
  <div>
    <el-tabs v-model="activeOrderType" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in subscriptionOption" :key="index" :label="option.label" :name="option.value">
        <div>
          <el-table :data="tableData" style="width: 100%" @row-click="openSubscriptionDetail">
            <el-table-column prop="email" label="用户"  width="auto">
            </el-table-column>
            <el-table-column prop="planName" label="产品" width="auto" >
            </el-table-column>
            <el-table-column prop="payStatus" width="auto" label="状态">
            </el-table-column>
            <el-table-column width="auto" prop="nextPayTime" label="下次支付">
            </el-table-column>
            <el-table-column prop="createTime" width="auto" label="创建时间">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeOrderType: 'current subscription',
      subscriptionOption: [
        {
          label: '当前订阅',
          value: 'current subscription'
        },
        {
          label: '全部订阅',
          value: 'all subscription'
        },
        {
          label: '已取消',
          value: 'cancel subscription'
        }
      ],
      tableData:[
        {
          subscriptionId: '9472323',
          email: 'yss@zingfront.com',
          planName: 'planName',
          payStatus: 'payStatus',
          nextPayTime: '2022-10-10',
          createTime: '2022-10-10 20:11:23',
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    openSubscriptionDetail(row) {
      const url = `/pay-subscription/detail/${row.subscriptionId}`;
      this.$router.replace(url);
    }
  },
};
</script>
<style scoped lang="less">

</style>
