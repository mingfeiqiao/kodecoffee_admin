<template>
  <div>
    <div>
      <div>
        <div>订阅:</div>
        <div style="display:flex;align-items: center">
          <span>{{ subscription.planName }}</span>
          <span>{{ subscription.price }}</span>
          <span>{{ subscription.payStatus }}</span>
        </div>
      </div>
      <el-descriptions>
        <el-descriptions-item label="用户邮箱">{{ subscription.email }}</el-descriptions-item>
        <el-descriptions-item label="支付卡号">{{'xxx'}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{subscription.createTime}}</el-descriptions-item>
        <el-descriptions-item label="产品">{{subscription.planName}}</el-descriptions-item>
        <el-descriptions-item label="插件">{{subscription.extensionName}}</el-descriptions-item>
        <el-descriptions-item label="地区">{{subscription.payCountry}}</el-descriptions-item>
        <el-descriptions-item label="订阅ID">{{subscription.subscriptionId}}</el-descriptions-item>
        <el-descriptions-item label="下次支付">{{'xxx'}}</el-descriptions-item>
      </el-descriptions>

    </div>
    <div>
      <div>订单记录</div>
      <div>
        <el-table :data="tableData" style="width: 100%"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"        >
          <el-table-column prop="orderId" label="编号ID"  width="auto">
          </el-table-column>
          <el-table-column prop="price" label="金额" width="auto">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="auto">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="auto" >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          orderId: 'ID-1231232143242',
          price: 'US$59.00',
          status: 1,
          createTime: '2020-12-12 12:12:12'
        },
        {
          orderId: 'ID-1231232143242',
          price: 'US$59.00',
          status: 1,
          createTime: '2020-12-12 12:12:12'
        },
        {
          orderId: 'ID-1231232143242',
          price: 'US$59.00',
          status: 1,
          createTime: '2020-12-12 12:12:12'
        },
        {
          orderId: 'ID-1231232143242',
          price: 'US$59.00',
          status: 1,
          createTime: '2020-12-12 12:12:12'
        }
      ],
      subscription: {
        email: 'yuanshoak@zingfront.com',
        planName: 'Plan-A',
        extensionName: 'Extension Name',
        payMethod: 'Credit Card',
        subscriptionId:'ID-1231232143242',// 订阅ID
        price: 'US$59.00',
        payCountry: 'USA',
        payStatus: 1,
        createTime: '2020-12-12 12:12:12'
      }
    };
  },
  methods: {
  },
  computed: {
    subscriptionId() {
      return this.$route.params.id;
    }
  }
};
</script>
<style scoped lang="less">

</style>
