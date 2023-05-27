<template>
  <div>
    <div>
      <div>
        <div>支付:</div>
        <div style="display:flex;align-items: center">
          <span>{{ order.price }}</span>
          <span>{{ order.payStatus }}</span>
        </div>
      </div>
      <el-descriptions>
        <el-descriptions-item label="用户邮箱">{{ order.email }}</el-descriptions-item>
        <el-descriptions-item label="支付卡号">{{ order.payMethod + ":" + order.payMethodDetail }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{order.paidTime}}</el-descriptions-item>
        <el-descriptions-item label="产品">{{order.planName}}</el-descriptions-item>
        <el-descriptions-item label="插件">{{order.extensionName}}</el-descriptions-item>
        <el-descriptions-item label="地区">{{order.payCountry}}</el-descriptions-item>
        <el-descriptions-item label="订单ID">{{order.orderId}}</el-descriptions-item>
        <el-descriptions-item label="类型">{{order.payMode}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <div>时间线</div>
      <div class="block">
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div>
      <div>
        <el-descriptions title="支付详情">
          <el-descriptions-item label="金额">
            <span>
                $99.00 ->  US$12.33
            </span>
            <span>
               <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                   <i class="el-icon-info"></i>
                </el-tooltip>
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="费用">
            <span>
              US$12.33
            </span>
            <span>
               <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                   <i class="el-icon-info"></i>
                </el-tooltip>
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="净收入">
            <span>
              US$90.00
            </span>
            <span>
               <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                   <i class="el-icon-info"></i>
                </el-tooltip>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div>
      <div>
        <el-descriptions title="支付方式">
          <el-descriptions-item label="支付方式">{{ order.email }}</el-descriptions-item>
          <el-descriptions-item label="卡号">{{ order.payMethod + ":" + order.payMethodDetail }}</el-descriptions-item>
          <el-descriptions-item label="卡地区">{{order.cardCountry}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div>
      <div>订单详情</div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
          <el-table-column prop="price" label="金额" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
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
      order: {
        price: 'US$59.00',// 价格
        payStatus: 1, // 支付状态，已经完成 、未完成支付
        email: 'yuanshoak@zingfront.com', // 用户邮箱
        payMethod: 'Credit Card', // 支付方式， 信用卡
        payMethodDetail: 'Visa xxxxxx1234', // 支付方式， 信用卡
        cardCountry: 'USA', // 信用卡国家
        paidTime: '2023-02-02 20:20:20', // 支付时间
        planName: 'Plan-A', // 套餐名称
        extensionName: 'Extension Name', // 插件名称
        payCountry: 'USA', // 支付国家
        orderId:'ID-1231232143242',// 订单ID
        payMode: 1
      },
      activities: [{
        content: '发送邮件',
        timestamp: '2018-04-12 20:46',
      }, {
        content: '支付成功',
        timestamp: '2018-04-03 20:46',
      }, {
        content: '完成3DS验证',
        timestamp: '2018-04-03 20:46',
      }, {
        content: '发起付款',
        timestamp: '2018-04-03 20:46'
      }]
    };
  },
  methods: {
  },
};
</script>
<style scoped lang="less">

</style>
