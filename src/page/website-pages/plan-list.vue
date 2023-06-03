<template>
  <div class="container">
    <div style="display: flex;width: 100%;flex-direction: row;align-items: center;justify-content: space-between;">
      <div class="create-button" @click="operatePlan({}, 'add')">
        +创建
      </div>
      <div style="display:flex;align-items: center;justify-content: center">
        <div style="display: flex">
          <device-filter :data="paymentModes" @change="paymentModeChange" :device="args.type"></device-filter>
        </div>
        <div>
          <div class="input-container">
            <el-input
                placeholder="请输入内容"
                v-model="args.q">
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
          <el-table-column prop="planId" label="Plan Id"  width="auto" >
          </el-table-column>
          <el-table-column width="auto">
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
          <el-table-column prop="payMode" width="auto">
            <template slot="header" slot-scope="scope">
              <div>支付类型</div>
            </template>
            <template slot-scope="scope">
              <div>
                <div>
                  {{scope.row.type}}
                </div>
                <div>
                  {{scope.row.type}}
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
              <div>{{scope.row.trial_days + '天'}}</div>
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
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="args.page"
          :page-sizes="[10,20]"
          :page-size="args.page_size"
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
      args: {
        page: 1,
        page_size: 10,
        type: 1,
        q: "",
      },
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
      chosenPlanData: {},
      dialogFormVisible: false,
      operationType: 'add'
    };
  },
  created() {
    console.log("created");
    this.getPlanList();
  },
  components: {
    deviceFilter,
    addPlanDialog
  },
  methods: {
    /**
     * 获取计划列表
     */
    getPlanList () {
      let args = this.args;
      let vm = this;
      planList(args).then(res => {
        if (parseInt(res.data.code )=== 100000) {
          vm.tableData = res.data.data;
          vm.total = res.data.total;
        }
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
      this.args.page = val;
      this.getPlanList();
    },
    /**
     * 每页显示数量
     * @param val
     */
    handleSizeChange(val) {
      this.args.page_size = val;
      this.getPlanList();
    },
    /**
     * 支付类型改变
     * @param value
     */
    paymentModeChange(value) {
      this.args.type = value;
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