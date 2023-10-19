<template>
  <div class="container">
    <div style="display: flex;width: 100%;flex-direction: row;align-items: center;justify-content: space-between;padding-bottom: 24px">
      <div style="display:flex;align-items: center;justify-content: center">
        <div style="display: flex">
          <device-filter :data="payment_modes" @change="paymentModeChange" :device="condition.type"></device-filter>
        </div>
        <div>
          <div style="padding-left: 12px">
            <el-input size="small" :placeholder="$t('input placeholder')" v-model="condition.q" clearable @keyup.enter.native="search"  @clear="search">
            </el-input>
          </div>
        </div>
      </div>
      <el-button type="primary" size="small" @click="operatePlan({}, 'add')">
        {{$t('create plan')}}
      </el-button>
    </div>
    <div>
      <div style="display: flex;align-items: center;flex-direction: column">
        <el-table :data="plan_list" style="width: 100%"
                  v-loading="table_loading"
                  :empty-text="$t('no data')"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
        >
          <el-table-column  width="300" >
            <template slot="header" slot-scope="scope">
              <div>{{$t('name')}}</div>
            </template>
            <template slot-scope="scope">
              <div class="column_content">
                <div>
                  <img v-if="scope.row.plan_icon" :src="scope.row.plan_icon"  width="44" height="44"  style="border:1px solid #eee;border-radius:10px;display:block;float:left;max-width: 130%;" :alt="scope.row.plan_name">
                  <svg  v-else width="40" height="40">
                    <use xlink:href="#default-plan-icon"></use>
                  </svg>
                </div>
                <div class="column_right">
                  <div style="padding-left:10px;text-align: left;">
                    <div>
                      <ellipsis-text :text="scope.row.plan_name" :max_width="230"></ellipsis-text>
                    </div>
                    <div style="color: #929292">
                      <ellipsis-text :text="scope.row.plan_desc" :max_width="230"></ellipsis-text>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="auto" :label="$t('Type')">
            <template slot-scope="scope">
              <div v-if="scope.row.plan_type_obj">
                <div v-if="scope.row.plan_type_obj.type === 'recurring'">
                  <div>
                    {{$t(scope.row.plan_type_obj.type)}}
                  </div>
                  <div style="color: #929292" v-if="scope.row.plan_type_obj.interval === 'month'">
                    <span v-if="scope.row.plan_type_obj.interval_count === 1">
                      {{$t('monthly')}}
                    </span>
                    <span v-if="scope.row.plan_type_obj.interval_count === 3">
                      {{$t('every 3 months')}}
                    </span>
                  </div>
                </div>
                <div v-else-if="scope.row.plan_type_obj.type === 'one_time'">
                  <span>{{ $t(scope.row.plan_type_obj.type ) }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="auto" >
            <template slot="header" slot-scope="scope">
              <div>{{ $t('Amount') }}</div>
            </template>
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.main_price_obj">
                  {{scope.row.main_price_obj.price_format}}
                </div>
                <el-popover placement="bottom" trigger="hover" v-if="scope.row.other_price_obj && scope.row.other_price_obj.length > 0">
                  <div style="display: flex;align-items: center;flex-direction: column">
                    <div v-for="(price, index) in scope.row.other_price_obj" :key="index">
                      {{price.price_format}}
                    </div>
                  </div>
                  <div slot="reference" style="color: #929292">
                    {{$t('other price tip', {number: scope.row.other_price_obj.length})}}
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column width="100" :label="$t('trial')" >-->
<!--            <template slot-scope="scope">-->
<!--              <div v-if="scope.row.plan_trial_obj && scope.row.plan_trial_obj.is_trial" >{{scope.row.plan_trial_obj.trial_days + ' ' + $t('days')}}</div>-->
<!--              <div v-else>-->
<!--                {{ $t('no trial') }}-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="plan_code" :label="$t('id')" width="230">
            <template slot-scope="scope">
              <div style="display:flex;align-items: center">
                <span>{{scope.row.plan_code}}</span>
                <span v-if="scope.row.plan_code" style="display: flex;align-items: center">
                  <svg width="16" height="16" @click="copy(scope.row.plan_code)" style="cursor: pointer;padding-left: 8px" class="copy_text">
                    <use xlink:href="#copy">
                    </use>
                  </svg>
              </span>
              </div>

            </template>
          </el-table-column>
          <el-table-column prop="operation" :label="$t('Operation')" width="100" align="center">
            <template slot-scope="scope">
              <div class="column_content">
                <span class="link" @click="operatePlan(scope.row, 'edit')">{{$t('edit')}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-top: 12px">
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
    <div v-if="dialog_form_visible">
      <add-plan-dialog
        :visible="dialog_form_visible"
        @visibleChange="visibleChange"
        :operationType="operationType"
        :chosen_plan_data="chosen_plan_data"
        @operateSuccess="operateSuccess"
      ></add-plan-dialog>
    </div>
  </div>
</template>
<script>
import deviceFilter from "../components/button-filter.vue";
import addPlanDialog from "../components/add-plan-dialog.vue";
import {planList} from "../../api/interface";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import EllipsisText from "../components/ellipsis-text.vue";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      condition: {
        type: 1,
        q: "",
      },
      order:{
        created_time:"desc"
      },
      page: 1,
      page_size: 10,
      total: 0,
      plan_list:[],
      table_loading: false,
      payment_modes: [
        {
          name: "all",
          value: 1
        },
        {
          name: "recurring",
          value: 2
        },
        {
          name: "one_time",
          value: 3
        }
      ],
      PAYMENT_REF: {
        1 : 'search',
        2 : 'recurring',
        3 : 'one_time'
      },
      chosen_plan_data: {},
      dialog_form_visible: false,
      operationType: 'add'
    };
  },
  created() {
    this.getPlanList();
  },
  components: {
    EllipsisText,
    deviceFilter,
    addPlanDialog
  },
  methods: {
    /**
     * 获取计划列表
     */
    getPlanList () {
      let args = {
        page: this.page,
        page_size: this.page_size
      };
      let condition = {};
      if (parseInt(this.condition.type) !== 1) {
        condition.type = this.PAYMENT_REF[this.condition.type]
      }
      if (this.condition.q) {
        condition.q = this.condition.q;
      }
      if (Object.keys(condition).length !== 0) {
        args.condition = condition;
      }
      args.order = this.order;
      let vm = this;
      vm.plan_list = [];
      vm.table_loading = true;
      planList(args).then(res => {
        vm.table_loading = false;
        if (parseInt(res.data.code )=== 100000) {
          vm.plan_list = vm.formatPlanList(res.data.data);
          vm.total = res.data.totalCount;
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        vm.table_loading = false;
      });
    },
    /**
     * 格式化table数据
     */
    resetPageParams () {
      this.page = 1;
      this.page_size = 10;
      this.total = 0;
    },
    /**
     *
     * @param client_key
     */
    copy (client_key){
      let clipboard = new Clipboard('.copy_text', {
        text: () => {
          return client_key
        }
      })
      clipboard.on('success', e => {
        this.$message({
          message: this.$t('copy success'),
          type: 'success'
        })
        clipboard.destroy() // 释放内存
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message:  this.$t('browser not support copy'),
          type: 'warning'
        })
        clipboard.destroy() // 释放内存
      })
    },
    /**
     * 操作成功
     */
    operateSuccess () {
      this.getPlanList();
    },
    /**
     * 分页
     * @param val
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getPlanList();
    },
    /**
     * 每页显示数量
     * @param val
     */
    handleSizeChange(val) {
      this.resetPageParams();
      this.page_size = val;
      this.getPlanList();
    },
    /**
     * 支付类型改变
     * @param value
     */
    paymentModeChange(value) {
      this.condition.type = value;
      this.resetPageParams();
      this.getPlanList();
    },
    formatPlanList (data) {
      return data.map(item => {
         return {
           plan_id: item.id || "",
           plan_code : item.prod_code || "",
           plan_icon: item.icon ? "https://kodepay-cdn.oss-us-west-1.aliyuncs.com/" + item.icon : "",
           plan_name: item.name || "",
           plan_desc: item.desc || "",
           plan_type_obj : this.formatPlanType(item.app_price) || null,
           plan_trial_obj: {
              is_trial: !!item.is_trial,
              trial_days: item.trial_days
           },
           main_price_obj: this.formatMainPriceObj(item.app_price) || null,
           other_price_obj: this.formatOtherPriceObj(item.app_price) || null,
         }
       })
    },
    formatPlanType (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        return {
          type: main_price.type || "",
          interval: main_price.interval || "",
          interval_count: main_price.interval_count || "",
        }
      }
    },
    formatOtherPriceObj (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        if (!main_price.currency) {
          return;
        }
        const app_price_currency = main_price.app_price_currency;
        if (app_price_currency && Array.isArray(app_price_currency) && app_price_currency.length > 0) {
          // 先把主币种的价格过滤掉
          const other_price = app_price_currency.filter(item => {
            return item.currency !== main_price.currency;
          });
          return other_price.map(item => {
            return {
              currency: item.currency || "",
              price: item.amount || "",
              price_format: this.formatPrice(item.amount, item.currency) || "",
            }
          });
        }
      }
    },
    formatMainPriceObj (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        return {
          currency: main_price.currency || "",
          price: main_price.amount || "",
          interval: main_price.interval || "",
          interval_count:main_price.interval_count,
          price_format: this.formatPrice(main_price.amount, main_price.currency) || "",
        };
      }
    },
    formatPrice (price, currency) {
      let symbol = '';
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          symbol = CURRENCY_OPTIONS[currency_key]['symbol'];
          return `${symbol} ${price}`;
        }
      }
    },
    /**
     * 搜索
     */
    search() {
      this.resetPageParams();
      this.getPlanList();
    },
    operatePlan(plan_data, operation) {
      this.chosen_plan_data = plan_data;
      this.operationType = operation;
      if (operation === 'edit') {
        this.dialog_form_visible = true;
      } else if (operation === 'add') {
        // 新增插件
        this.dialog_form_visible = true;
      }
    },
    /**
     * 获取api参数
     * @param condition
     * @param orders
     * @param page
     * @param page_size
     * @returns {{condition: {}, page, page_size, order: {}}}
     */
    getApiArgs (condition, orders, page, page_size) {
      let condition_temp = {};
      for (let key in condition) {
        if (condition[key]) {
          condition_temp[key] = condition[key];
        }
      }
      let orders_temp = {};
      for (let key in orders) {
        if (orders[key]) {
          orders_temp[key] = orders[key];
        }
      }
      return {
        'page': page,
        'page_size': page_size,
        'condition': condition_temp,
        'order': orders_temp
      }
    },
    /**
     *
     * @param visible
     */
    visibleChange (visible) {
      this.dialog_form_visible = visible;
    }
  }
};
</script>
<style scoped lang="less">
.input-container .el-input__icon {
  line-height: 32px;
}
:global(.input-container .el-input__inner) {
  height: 32px;
}
.create-button {
  height: 30px;
  line-height: 32px;
  padding: 0 12px;
  border-radius: 5px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(24, 144, 255, 1);
}
.column_content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
}
.column_right {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 44px);
  align-items: center;
  padding-top: 7px;
}
</style>