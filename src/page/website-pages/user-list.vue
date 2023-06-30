<template>
  <div>
    <div>
      <div style="max-width: 300px;">
        <el-input v-model="condition.q" :placeholder="$t('please input email')"  size="small" clearable @keyup.enter.native="search" @clear="search">
        </el-input>
      </div>
      <div style="padding-top: 24px">
        <el-table :data="table_data"
                  :empty-text="$t('no data')"
                  v-loading="table_loading"
                  @sort-change="handleSortChange"
                  :header-cell-class-name="handleHeaderCellClass"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
        >
          <el-table-column prop="user_email" :label="$t('customer')"></el-table-column>
          <el-table-column prop="total_spend" :label="$t('total spend')" sortable ></el-table-column>
          <el-table-column prop="payments_times" :label="$t('payments times')" sortable></el-table-column>
          <el-table-column prop="refunded_amount" :label="$t('refunded amount')" sortable></el-table-column>
          <el-table-column prop="last_payment" :label="$t('last payments')"></el-table-column>
          <el-table-column prop="created_time" :label="$t('create time')"></el-table-column>
          <el-table-column :label="$t('Operation')" width="100" align="center">
            <template slot-scope="scope">
              <span class="link" @click="openUserDetail(scope.row.user_id)">{{$t('detail')}}</span>
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
  </div>
</template>
<script>
import {timestampToDateString} from "../../utils/dateUtils";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import {customerListApi} from "../../api/interface";

export default {
  data() {
    return {
      condition: {
      },
      ORDER_FIELD_REF: {
        total_spend: "sum_settle_real_amount",
        payments_times: "sum_settle_pay_count",
        refunded_amount: "sum_settle_refund_amount",
        created_time: "created_time"
      },
      ORDER_TYPE_REF: {
        "descending": "desc",
        "ascending": "asc"
      },
      table_data: [],
      page:1,
      total:0,
      sort:[{prop:"created_time", order:"descending"}],
      table_loading:false,
      page_size:10,
    }
  },
  created() {
    this.getData();
  },
  methods: {
    openUserDetail (user_id) {
      this.$router.push({path: "/customers/detail/" + user_id});
    },
    search() {
      this.getData();
    },
    getData() {
      let vm = this;
      let args = {
        condition: vm.condition,
        page: vm.page,
        page_size: vm.page_size,
        order: this.formatSortParams(this.sort)
      };
      vm.table_loading = true;
      vm.table_data = [];
      customerListApi(args).then(res => {
        vm.table_loading = false;
        if (parseInt(res.data.code )=== 100000) {
          vm.table_data = vm.formatUserList(res.data.data);
          vm.total = res.data.totalCount;
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        vm.table_loading = false;
        console.log(err);
      });
    },
    /**
     * 当前页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    /**
     * 每页显示条数
     */
    handleSizeChange(size) {
      this.page_size = size;
      this.getData();
    },
    formatSortParams (sort) {
      let sort_params = {};
      sort.forEach(item => {
        sort_params[this.ORDER_FIELD_REF[item.prop]] = this.ORDER_TYPE_REF[item.order];
      })
      return sort_params;
    },
    /**
     * 格式化用户列表
     * @param user_list_info
     */
    formatUserList (user_list_info) {
      if (Array.isArray(user_list_info) && user_list_info.length > 0) {
        return user_list_info.map(item => {
          return this.formatUserData(item);
        })
      }
      return [];
    },
    /**
     * 格式化用户数据
     * @param item
     * @returns {{total_spend: string, created_time: string, user_email: (string|string|RegExp|*), user_id: string, last_payment: string, user_key: (*|string), payments_times: string, refunded_amount: string}}
     */
    formatUserData (item) {
      let user_consumption_statistics = item.user_consumption_statistics;
      if (!user_consumption_statistics) {
        user_consumption_statistics = {};
      }
      let currency = user_consumption_statistics.settle_currency || "usd";
      return {
        user_id: item.id || "",
        user_key: item.user_key || "",
        user_email: item.email || "",
        total_spend: this.formatPrice(user_consumption_statistics.sum_settle_pay_amount, currency),
        payments_times: user_consumption_statistics.sum_settle_pay_success_count || 0,
        refunded_amount:  this.formatPrice(user_consumption_statistics.sum_settle_refund_amount, currency),
        last_payment: this.formatTime(user_consumption_statistics.lasted_pay_time),
        created_time: this.formatTime(item.created_time)
      }
    },
    /**
     * 格式化创建时间 格式 2020-01-01 00:00:00
     * @param time
     */
    formatTime (time) {
      if (time) {
        return timestampToDateString(time, 'yyyy-MM-dd HH:II:SS');
      }
      return "-";
    },
    /**
     * 格式化退款金额 格式 US$ 99.00
     */
    formatPrice(price, currency) {
      if (price && currency){
        for (const currency_key in CURRENCY_OPTIONS) {
          if (currency_key.toLowerCase() === currency.toLowerCase()) {
            return CURRENCY_OPTIONS[currency_key]['symbol'] + ' ' + price;
          }
        }
        return currency + ' ' + price;
      }
      return "US$ 0";
    },
    //排序方法
    handleHeaderCellClass({column}){
      this.sort.forEach(element => {
        if (column.property===element.prop) {
          column.order=element.order
        }
      });
    },
    /**
     * 排序
     * @param prop
     * @param order
     */
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
      this.getData();
    }
  }
}
</script>
<style scoped lang="less">

</style>