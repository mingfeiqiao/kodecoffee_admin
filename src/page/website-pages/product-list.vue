<template>
  <div class="container">
    <div style="display: flex;width: 100%;flex-direction: row;align-items: center;justify-content: space-between;">
      <div class="create-button" @click="operatePlan({}, 'add')">
        +创建
      </div>
      <div style="display:flex;align-items: center;justify-content: center">
        <div style="display: flex">
          <device-filter :data="paymentModes" @change="paymentModeChange"></device-filter>
        </div>
        <div>
          <div class="input-container">
            <el-input
                placeholder="请输入内容"
                v-model="input">
              <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="search"></i>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%"
                :header-cell-style="{'background-color' : 'rgba(250, 250, 250, 1)', 'color': '#101010'}">
        <el-table-column prop="planId" label="Plan Id"  width="auto" >
        </el-table-column>
        <el-table-column width="auto">
          <template slot="header" slot-scope="scope">
            <div>名称</div>
          </template>
          <template slot-scope="scope">
            <div class="column_content">
              <div>
                <img :src="scope.row.planIcon"  width="44" height="44"  style="border:1px solid #eee;border-radius:10px;display:block;float:left;max-width: 130%;" alt="xxx">
              </div>
              <div class="column_right">
                <div style="padding-left:10px;text-align: left;">
                  <div>{{scope.row.planName}}</div>
                  <div>{{scope.row.planDescription}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payMode" width="auto">
          <template slot="header" slot-scope="scope">
            <div>支付类型</div>
          </template>
          <template slot-scope="scope">
            <div>
              <div>
                {{scope.row.payMode}}
              </div>
              <div>
                {{scope.row.cycle}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payPrice" width="auto" >
          <template slot="header" slot-scope="scope">
            <div>金额</div>
          </template>
          <template slot-scope="scope">
            <div>
              <div v-for="(price, index) in scope.row.price" :key="index">
                {{price.price + ' ' + price.currency}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="trialDays" width="auto" >
          <template slot="header" slot-scope="scope">
            <div>试用</div>
          </template>
          <template slot-scope="scope">
            <div>{{scope.row.trialDays + '天'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" width="auto">
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
    </div>
    <add-plan-dialog :visible="dialogFormVisible" @visibleChange="visibleChange" :operationType="operationType" :chosenPluginData="chosenPlanData"></add-plan-dialog>
  </div>
</template>
<script>
import deviceFilter from "../components/button-filter.vue";
import addPlanDialog from "../components/add-plan-dialog.vue";
export default {
  data() {
    return {
      input: "",
      tableData:[
        {
          planId: 1,
          planIcon: 'https://appcdn-global.zingfront.com/imgs/7d4439ed88c469d655e00b4ad78349e0.jpg?x-oss-process=image/resize,w_72,h_72/format,webp',
          planName: "产品的名称",
          planDescription: "产品的描述",
          payMode: 1,
          billingCycle: 1,
          billingCycleNum: 1,
          isTrial: true,
          trialDays:7, // 试用时间
          price:[
            {
              currency: "USD",
              price: 1
            },
            {
              currency: "CNY",
              price: 6
            }
          ],
        }
      ],
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
      chosenPlanData: {},
      dialogFormVisible: false,
      operationType: 'add'
    };
  },
  created() {
    console.log(this.$route.query);
  },
  components: {
    deviceFilter,
    addPlanDialog
  },
  methods: {
    paymentModeChange(value) {
      console.log(value);
    },
    search() {
      console.log(this.input);
    },
    operatePlan(planData, operation) {
      console.log(planData, operation);
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