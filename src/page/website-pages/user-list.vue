<template>
  <div>
    <div>
      <div style="max-width: 300px;">
        <el-input v-model="condition.q" :placeholder="$t('please input email')"  size="mini"  suffix-icon="el-icon-search"></el-input>
      </div>
      <div style="padding-top: 24px">
        <el-table :data="table_data"
                  :empty-text="$t('no data')"
                  v-loading="table_loading"
                  @sort-change="handleSortChange"
                  :header-cell-class-name="handleHeaderCellClass"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
        >
          <el-table-column prop="user_id" :label="$t('id')"></el-table-column>
          <el-table-column prop="user_email" :label="$t('customer')"></el-table-column>
          <el-table-column prop="total_spend" :label="$t('total spend')" sortable ></el-table-column>
          <el-table-column prop="payments_times" :label="$t('payments times')" sortable></el-table-column>
          <el-table-column prop="refunded_amount" :label="$t('refunded amount')" sortable></el-table-column>
          <el-table-column prop="last_payment" :label="$t('last payments')"></el-table-column>
          <el-table-column prop="created_time" :label="$t('create time')"></el-table-column>
        </el-table>
        <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-sizes="[10,20]"
            :page-size="page_size"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      condition: {
        q:""
      },
      table_data:[
      ],
      page:1,
      total:0,
      sort:[],
      table_loading:false,
      page_size:10,
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {

    },
    handleCurrentChange() {

    },
    handleSizeChange() {

    },
    /**
     * 格式化用户列表
     * @param user_list_info
     */
    formatUserList (user_list_info) {

    },
    formatPaymentTimes (data) {

    },
    /**
     * 格式化创建时间 格式 2020-01-01 00:00:00
     * @param created_time
     */
    formatCreatedTime (created_time) {

    },
    /**
     * 格式化最后一次消费时间 格式 2020-01-01 00:00:00
     * @param last_payment
     */
    formatLastPayment (last_payment) {

    },
    /**
     * 格式化总消费金额 格式 US$ 99.00
     * @param total_spend
     */
    formatTotalSpend (total_spend) {

    },
    /**
     * 格式化退款金额 格式 US$ 99.00
     * @param refunded_amount
     */
    formatRefundedAmount (refunded_amount) {

    },
    //排序方法
    handleHeaderCellClass({column}){
      this.sort.forEach(element => {
        if (column.property===element.prop) {
          column.order=element.order
        }
      });
    },
    handleSortChange({prop, order }) {
      if (order) {
        let flag_is_have=false
        this.sort.forEach(element => {
          if (element.prop === prop) {
            element.order=order
            flag_is_have=true
          }
        });
        if (!flag_is_have) {
          this.sort.push({
            prop:prop,
            order:order
          })
        }
      }else{  //不参与排序
        let order_index=0
        this.sort.forEach((element,index) => {
          if (element.prop === prop) {
            order_index=index
          }
        });
        this.sort.splice(order_index,1)
      }
    }
  }
}
</script>
<style scoped lang="less">

</style>