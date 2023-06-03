<template>
  <div>
    <div>
      <div>
        <el-input v-model="input" placeholder="请输入内容"  size="mini"  suffix-icon="el-icon-search"></el-input>
      </div>
      <div>
        <el-table :data="tableData" :pagination="paginationConfig" :sort="sortConfig" @sort-change="handleSortChange" @current-change="handleCurrentChange"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
        >
          <el-table-column prop="email" label="用户邮箱"></el-table-column>
          <el-table-column prop="accumulatedExpense" label="累计消费" sortable></el-table-column>
          <el-table-column prop="totalTransactions" label="消费次数" sortable></el-table-column>
          <el-table-column prop="refundAmount" label="退款" sortable></el-table-column>
          <el-table-column prop="recentExpense" label="上次消费"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: '',
      tableData: [  // 存放表格数据
        {
          email: '1231232143242',
          accumulatedExpense: 'US$59.00',
          totalTransactions: 1,
          refundAmount: '$59.00',
          recentExpense: '2020-12-12 12:12:12',
          createTime: '2020-12-12 12:12:12'
        },
        {
          email: '1231232143242',
          accumulatedExpense: 'US$59.00',
          totalTransactions: 1,
          refundAmount: '$59.00',
          recentExpense: '2020-12-12 12:12:12',
          createTime: '2020-12-12 12:12:12'
        },
        {
          email: '1231232143242',
          accumulatedExpense: 'US$59.00',
          totalTransactions: 1,
          refundAmount: '$59.00',
          recentExpense: '2020-12-12 12:12:12',
          createTime: '2020-12-12 12:12:12'
        },
        {
          email: '1231232143242',
          accumulatedExpense: 'US$59.00',
          totalTransactions: 1,
          refundAmount: '$59.00',
          recentExpense: '2020-12-12 12:12:12',
          createTime: '2020-12-12 12:12:12'
        }
      ],
      paginationConfig: { // 分页配置
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      sortConfig: { // 排序配置
        prop: '',
        order: ''
      }
    }
  },
  mounted() {
    this.getData();
  },
  components: {
  },
  watch: {

  },
  methods: {
    getData() {
      // 发起请求获取数据，包括分页和排序参数
      const params = {
        page: this.paginationConfig.currentPage,
        size: this.paginationConfig.pageSize,
        sortField: this.sortConfig.prop,
        sortOrder: this.sortConfig.order
      };
    },
    handleSortChange({ prop, order }) {
      this.sortConfig.prop = prop;
      this.sortConfig.order = order;
      console.log(this.sortConfig);
      this.getData(); // 根据新的排序参数重新获取数据
    },
    handleCurrentChange(currentPage) {
      this.paginationConfig.currentPage = currentPage;
      this.getData(); // 根据新的分页参数重新获取数据
    }
  }
}
</script>
<style scoped lang="less">

</style>