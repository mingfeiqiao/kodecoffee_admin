<template>
  <div class="container">
    <div style="display: flex;width: 100%;flex-direction: row;align-items: center;justify-content: space-between;">
      <div class="create-button" @click="operatePlan({}, 'add')">
        +创建
      </div>
      <div style="display:flex;align-items: center;justify-content: center">
        <div style="display: flex">
          <device-filter :data="paymentModes" @change="paymentModeChange" :device="condition.type"></device-filter>
        </div>
        <div>
          <div class="input-container">
            <el-input
                placeholder="请输入内容"
                v-model="condition.q">
              <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="search"></i>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="display: flex;align-items: center;flex-direction: column">
        <el-table :data="tableData" style="width: 100%"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
        >
          <el-table-column prop="prod_code" label="Plan Id"  width="200">
            <template slot="header" slot-scope="scope">
              <div style="display: flex;align-items: center;">
                <span>{{$t('planId')}}</span>
                <span>
                  <el-tooltip class="item" :content="$t('planId ToolTip Content')" effect="light" placement="top"><i class="el-icon-info" style="color: #c4c4c4"></i>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column max-width="200" width="120" min-width="120">
            <template slot="header" slot-scope="scope">
              <div>名称</div>
            </template>
            <template slot-scope="scope">
              <div class="column_content">
                <div>
                  <img :src="scope.row.icon"  width="44" height="44"  style="border:1px solid #eee;border-radius:10px;display:block;float:left;max-width: 130%;" alt="xxx">
                </div>
                <div class="column_right">
                  <div style="padding-left:10px;text-align: left;">
                    <div>{{scope.row.name}}</div>
                    <div>{{scope.row.desc}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="auto">
            <template slot="header" slot-scope="scope">
              <div>支付类型</div>
            </template>
            <template slot-scope="scope">
              <div v-if="isAppPriceTypeExist(scope.row.app_price)">
                <div v-if="scope.row.app_price[0].type === 'recurring'">
                  <div>
                    {{scope.row.app_price[0].type}}
                  </div>
                  <div>
                    {{scope.row.app_price[0].interval_count + ' ' + scope.row.app_price[0].interval}}
                  </div>
                </div>
                <div v-else-if="scope.row.app_price[0].type === 'one_time'">
                  <span>一次性付款</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="auto" >
            <template slot="header" slot-scope="scope">
              <div>金额</div>
            </template>
            <template slot-scope="scope">
              <div v-if="isPriceMultiTypeExist(scope.row.app_price)">
                <div>
                  {{scope.row.app_price[0].amount + ' ' + scope.row.app_price[0].currency}}
                </div>

                <el-popover
                  placement="bottom"
                  trigger="hover"
                  width="60"
                 >
                  <div style="display: flex;align-items: center;flex-direction: column">
                    <div v-for="(price, index) in scope.row.app_price[0].app_price_currency" :key="index">
                      {{price.amount + ' ' + price.currency}}
                    </div>
                  </div>

                  <div slot="reference">
                    另外{{scope.row.app_price[0].app_price_currency.length}}个价格
                  </div>
                </el-popover>
              </div>
              <div v-else>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="auto" >
            <template slot="header" slot-scope="scope">
              <div>试用</div>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.is_trial" >{{scope.row.trial_days + '天'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="operation" width="80">
            <template slot="header" slot-scope="scope">
              <div style="text-align: center">操作</div>
            </template>
            <template slot-scope="scope">
              <div class="column_content">
                <span style="color: #1090FF; cursor: pointer" @click="operatePlan(scope.row, 'edit')">编辑</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    <add-plan-dialog
      :visible="dialogFormVisible"
      @visibleChange="visibleChange"
      :operationType="operationType"
      :chosenPlanData="chosenPlanData"
      @operateSuccess="operateSuccess"
    ></add-plan-dialog>
  </div>
</template>
<script>
import deviceFilter from "../components/button-filter.vue";
import addPlanDialog from "../components/add-plan-dialog.vue";
import {planList} from "../../api/interface";
export default {
  data() {
    return {
      condition: {
        type: 1,
        q: "",
      },
      page: 1,
      page_size: 10,
      total: 0,
      tableData:[],
      paymentModes: [
        {
          name: "搜索",
          value: 1
        },
        {
          name: "订阅",
          value: 2
        },
        {
          name: "一次性",
          value: 3
        }
      ],
      PAYMENT_REF: {
        1 : 'search',
        2 : 'recurring',
        3 : 'one_time'
      },
      chosenPlanData: {},
      dialogFormVisible: false,
      operationType: 'add'
    };
  },
  created() {
    console.log("created");
    this.getPlanList();
    // this.testPlanList();
  },
  components: {
    deviceFilter,
    addPlanDialog
  },
  methods: {
    testPlanList() {
       this.tableData = [
         {
           "name": "kodepay-mfei",// 产品名称
           "desc": "kodepay mfei",// 产品描述
           "is_trial": true,// 是否试用
           "id": 1, //产品ID
           "application_id": 538,// 应用ID
           "is_deleted": 0, // 是否删除
           "updated_at": "2023-06-03T15:47:22",// 更新时间
           "icon": null, // icon图标
           "trial_days": 3,// 试用天数
           "account_id": 29,// 帐号ID
           "is_actived": 1,// 是否激活
           "created_at": "2023-06-03T15:47:22",// 创建时间
           "app_price": [ // 产品价格结构体
             {
               "currency": "usd",// 币种
               "amount": 1.99,// 金额
               "interval": "day",// 周期
               "id": 1,// 价格ID
               "application_id": 538,// 应用ID
               "is_deleted": 0,// 是否删除
               "updated_at": "2023-06-03T15:47:22",// 更新时间
               "type": "recurring",// 周期
               "product_id": 1,// 产品ID
               "interval_count": 1,// 周期数量
               "account_id": 29,// 帐号ID
               "is_actived": 1,// 是否激活
               "created_at": "2023-06-03T15:47:22",// 创建时间
               "app_price_currency": [// 产品价格多币种结构体
                 {
                   "amount": 1.99, // 金额
                   "price_id": 1,// 产品价格ID
                   "account_id": 29,// 帐号ID
                   "application_id": 538,// 应用ID
                   "is_deleted": 0,// 是否删除
                   "updated_at": "2023-06-03T15:47:22",// 更新时间
                   "currency": "usd",// 币种
                   "product_id": 1,// 产品ID
                   "id": 1,// 价格多币种ID
                   "is_actived": 1,// 是否激活
                   "created_at": "2023-06-03T15:47:22"// 创建时间
                 }
               ]
             }
           ]
         }
       ];
    },
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
      let vm = this;
      planList(args).then(res => {
        if (parseInt(res.data.code )=== 100000) {
          vm.tableData = res.data.data;
          // 将所有的icon前面都加上https://kodepay-cdn.oss-us-west-1.aliyuncs.com/
          vm.tableData.forEach(item => {
            if (item.icon) {
              item.icon = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + item.icon;
            }
          });
          vm.total = res.data.totalCount;
        }
      })
    },
    /**
     * 是否存在多币种
     */
    isPriceMultiTypeExist (price) {
      return !!(price && price[0] && price[0].app_price_currency && price[0].app_price_currency.length > 0);
    },
    /**
     *
     * @param appPrice
     * @returns {boolean}
     */
    isAppPriceTypeExist (appPrice) {
      return !!(appPrice && appPrice[0] && appPrice[0].type);
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
      this.args.page = val;
      this.getPlanList();
    },
    /**
     * 每页显示数量
     * @param val
     */
    handleSizeChange(val) {
      this.page_size = val;
      this.getPlanList();
    },
    /**
     * 支付类型改变
     * @param value
     */
    paymentModeChange(value) {
      this.condition.type = value;
      this.getPlanList();
    },
    /**
     * 搜索
     */
    search() {
      this.getPlanList();
    },
    operatePlan(planData, operation) {
      this.chosenPlanData = planData;
      this.operationType = operation;
      if (operation === 'edit') {
        this.dialogFormVisible = true;
      } else if (operation === 'delete') {
        // 发请求删除 --
      } else if (operation === 'add') {
        // 新增插件
        this.dialogFormVisible = true;
      }
    },
    /**
     *
     * @param visible
     */
    visibleChange (visible) {
      this.dialogFormVisible = visible;
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