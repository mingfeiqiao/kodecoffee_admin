<template>
  <div>
    <el-tabs v-model="active_order_type" @tab-click="handleClick">
      <el-tab-pane v-for="(option, index) in order_option" :key="index" :label="$t(option.label)" :name="option.value">
        <div>
          <div>
            <div style="display: flex;margin:9px 0 24px 0">
              <div class="order-btn" v-if="active_order_type === 'all order'">
                <div style="padding-right: 12px">{{$t('status') + ":"}}</div><div>
                <el-select size="small" v-model="condition.pay_status" :placeholder="$t('select placeholder')" clearable @change="search" filterable>
                  <el-option
                      v-for="item in order_status_options"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value">
                  </el-option>
                </el-select>
              </div>
              </div>
              <div class="order-btn">
                <div style="padding-right: 12px">{{$t('Type') + ':'}}</div><div>
                <el-select size="small" v-model="condition.plan_type" :placeholder="$t('select placeholder')" clearable @change="search" filterable>
                  <el-option
                      v-for="item in order_type_options"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value">
                  </el-option>
                </el-select></div>
              </div>
              <div class="order-btn">
                <div style="padding-right: 12px">
                  {{$t('payment email') + ":"}}
                </div>
                <div>
                  <el-input size="small" :placeholder="$t('input placeholder')" v-model="condition.q" clearable  @keyup.enter.native="search" @clear="search"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex;align-items: center;flex-direction: column">
            <el-table v-loading="table_loading" :data="table_data" style="width: 100%"
                      :empty-text="$t('no data')"
                      :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
            >
              <el-table-column prop="prod_name" :label="$t('Plan')"  width="auto">
              </el-table-column>
              <el-table-column prop="order_amount_format" :label="$t('Amount')" width="auto" >
              </el-table-column>
              <el-table-column prop="plan_type" width="auto" :label="$t('Type')">
                <template slot-scope="scope" >
                  <span v-if="scope.row.plan_type_obj">
                    {{$t(scope.row.plan_type_obj)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="auto"  :label="$t('status')" >
                <template slot-scope="scope" >
                  <span v-if="scope.row.order_status_obj" :style="{'color': scope.row.order_status_obj.color}">
                    {{ $t(scope.row.order_status_obj.message)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('create time')" prop="created_time" width="auto" >
              </el-table-column>
              <el-table-column prop="pay_email" width="auto" :label="$t('payment email')">
              </el-table-column>
              <el-table-column width="90" :label="$t('Operation')">
                <template slot-scope="scope">
                  <span class="link" @click="openOrderDetail(scope.row.order_id)">{{ $t('detail') }}</span>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SUBSCRIPTION_OPTIONS from "../../options/subscription_options.json";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import ORDER_OPTIONS from "../../options/order_options.json";
import {timestampToDateString} from "../../utils/dateUtils";
import {orderList} from "../../api/interface";
export default {
  data() {
    return {
      SUBSCRIPTION_TYPE_OPTIONS : SUBSCRIPTION_OPTIONS.SUBSCRIPTION_TYPE_OPTIONS,
      ORDER_STATUS : ORDER_OPTIONS.ORDER_STATUS_OPTIONS,
      ORDER_STATUS_REF : ORDER_OPTIONS.ORDER_STATUS_REF_OPTIONS,
      active_order_type: 'all order',
      page: 1,
      page_size: 10,
      total: 0,
      condition: {},
      order:{
        created_time:"desc"
      },
      order_option:[
        {
          label: 'All Orders',
          value: 'all order'
        },
        {
          label: 'Disputes',
          value: 'disputed'
        }
      ],
      order_type_options:[
        {
          label: "one_time",
          value: "one_time"
        },
        {
          label: "recurring",
          value: "recurring"
        }
      ],
      order_status_options:[
        {
          label: 'unCompleted',
          value: 'un_completed'
        },
        {
          label: 'Succeed',
          value: 'succeed'
        },
        {
          label: 'Failed',
          value: 'failed'
        },
        {
          label: 'Refunded',
          value: 'refunded'
        },
        {
          label: 'Disputed',
          value: 'disputed'
        }
      ],
      table_data:[],
      table_loading:false,
    };
  },
  created() {
    this.table_data = this.getTableData();
  },
  methods: {
    /**
     * tab切换
     */
    handleClick() {
      this.condition = {};
      if (this.active_order_type === 'disputed') {
        this.condition = {order_status: 'disputed'};
      }
      this.getTableData();
    },
    openOrderDetail (order_id) {
      this.$router.push({path: "/pay-all-order/detail/" + order_id});
    },
    /**
     * 改变每页显示条数
     */
    reset() {
      this.condition = {};
      this.getTableData();
    },
    /**
     * 搜索
     */
    search() {
      this.getTableData();
    },
    /**
     * 获取表格数据
     * @returns {*}
     */
    getTableData () {
      let args = {
        'page': this.page,
        'page_size': this.page_size,
        'condition': this.condition,
        'order':this.order
      };
      let vm = this;
      vm.table_loading = true;
      this.table_data = [];
      orderList(args).then(res => {
        vm.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          vm.table_data = vm.formatTableData(res.data.data);
          vm.total = res.data.totalCount;
        }
      }).catch(err => {
        vm.table_loading = false;
        console.log(err);
      });
    },
    /**
     * 格式化表格数据
     * @param data
     * @returns {*}
     */
    formatTableData (data) {
      data.forEach(item => {
        if (item.id) {
          item.order_id = item.id;
        }
        if (item.created_time) {
          item.created_time = timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS');
        }
        if (item.currency && item.pay_amount) {
          item.order_amount_format = this.formatPrice(item.currency, item.pay_amount);
        }
        if (item.plan_type) {
          item.plan_type_obj = this.SUBSCRIPTION_TYPE_OPTIONS[item.plan_type];
        }
        if (this.ORDER_STATUS_REF[item.pay_status]) {
          item.order_status_obj = this.ORDER_STATUS[this.ORDER_STATUS_REF[item.pay_status]];
        }
        return item;
      });
      return data;
    },
    /**
     * 分页
     */
    handleSizeChange(size) {
      this.page_size = size;
      this.getTableData();
    },
    formatPrice (currency, price) {
      let symbol = '';
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          symbol = CURRENCY_OPTIONS[currency_key]['symbol'];
          return symbol + ' ' + price;
        }
      }
      return currency + ' ' + price;
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
  },
};
</script>
<style scoped lang="less">
.order-btn {
  display: flex;
  align-items: center;
  margin-right: 24px;
}
</style>
