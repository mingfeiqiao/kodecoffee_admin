<template>
  <div>
    <el-tabs v-model="activeOrderType" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in orderTypeOption" :key="index" :label="option.label" :name="option.value">
        <div>
          <div>
            <div style="display: flex">
              <div style="display: flex;align-items: center">
                <div>用户邮箱:</div><div><el-input size="mini" placeholder="请输入" v-model="filter.email"></el-input></div>
              </div>
              <div style="display: flex;align-items: center">
                <div>状态:</div><div>
                <el-select size="mini" v-model="filter.status" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
              </div>
              <div style="display: flex;align-items: center">
                <div>类型:</div><div>
                <el-select size="mini" v-model="filter.type" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select></div>
              </div>
            </div>
            <div>
              <div style="display: flex;align-items: center">
                <el-button type="primary" size="small">查询</el-button>
                <el-button size="small">重置</el-button>
              </div>
            </div>
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="planName" label="产品"  width="auto">
              </el-table-column>
              <el-table-column prop="price" label="金额" width="auto" >
              </el-table-column>
              <el-table-column prop="payMode" width="auto" label="类型">
              </el-table-column>
              <el-table-column width="auto" prop="subscriptType" label="订阅类型">
              </el-table-column>
              <el-table-column width="auto" prop="subscriptionStatus" label="状态">
              </el-table-column>
              <el-table-column prop="subscriptionTime" width="auto" label="时间">
              </el-table-column>
              <el-table-column prop="email" width="auto" label="用户">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeOrderType: 'all order',
      orderTypeOption:[
        {
          label: '全部订单',
          value: 'all order'
        },
        {
          label: '争议订单',
          value: 'dispute order'
        }
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      filter: {
        email: '',
        status: '',
        type: ''
      },
      tableData:[
        {
          planName: 'plan1',
          planId: '1',
          price: 'US $ 100',
          payMode: 1,
          subscriptType: 1,
          subscriptionStatus: 1,
          subscriptionTime: '2020-01-01 00:00:00',
          email:'ligoog@gmail.com',
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
};
</script>
<style scoped lang="less">

</style>
