<template>
  <div class="container">
    <div class="border-bottom" >
      <div class="title-20">余额</div>
      <div style="padding: 24px 0;display: flex;justify-content: space-between;align-items: flex-end;">
        <div style="display: flex;align-items: center;justify-content: flex-start;">
          <div style="padding-right: 30px">
            <div>
              <span style="color:#929292;">总余额</span>
              <span>
              <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                <i class="el-icon-info" style="color:#939393;"></i>
              </el-tooltip>
            </span>
            </div>
            <div class="title-28">{{balance.total_balance_format}}</div>
          </div>
          <div style="padding-right: 30px">
            <div>
              <span style="color:#939393;">可提现</span>
              <span>
              <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                <i class="el-icon-info"  style="color:#929292;"></i>
              </el-tooltip>
            </span>
            </div>
            <div class="title-28">{{balance.withdrawable_format}}</div>
          </div>
        </div>
        <div style="display: flex;align-items: flex-end">
          <span style="color: #929292;padding-right: 12px;">每30天可以进行一次提现</span>
          <el-button type="primary" size="small" @click="openWithdrawalDialog">提现</el-button>
        </div>
      </div>
    </div>
    <div class="border-bottom" style="padding-bottom: 24px">
      <div style="padding: 24px 0">
        <span class="title-16">提现设置</span>
        <span class="link" style="padding-left: 24px;" @click="openWithdrawalSettingsDialog">编辑信息</span>
      </div>
      <div>
        <el-descriptions direction="vertical">
          <el-descriptions-item label="姓名">{{ balance_settings.full_name}}</el-descriptions-item>
          <el-descriptions-item label="所在国家">{{ balance_settings.country }}</el-descriptions-item>
          <el-descriptions-item label="业务类型">{{ balance_settings.business_type }}</el-descriptions-item>
          <el-descriptions-item label="提现币种和最小金额" >{{ balance_settings.withdrawal_currency + balance_settings.minimum_withdrawal_amount }}</el-descriptions-item>
          <el-descriptions-item label="提现周期" >{{ balance_settings.withdrawal_period }}</el-descriptions-item>
          <el-descriptions-item label="提现方式" >{{ balance_settings.withdrawal_method }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="background-color: rgba(250, 250, 250, 1);padding: 8px 24px;">
        <div>提现说明</div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;">
{{`1. 申请提现后，我们会安排专业的财务团队进行审核，3~7个工作日内会完成审核和打款操作，具体到账日期根据各个银行不等一般7个工作日内到账。
2. 请确保你填写的提现信息正确，打款后不可撤销。
3. 每次提现的最小额度为100美元，并且每次提现的金额为100美元的整数倍，提现时我们支持美金和人民币账户，如选择人民币我们会按照提现时的汇率计算出对应的转账金额。
4. 我们当前支持中国大陆银行卡、香港银行卡、新加坡银行卡，钱包支持PayPal和Payoneer。`}}
        </pre>
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div>
            <span>有疑问或者其他问题？</span>
            <span class="link">
              联系我们
            </span>
          </div>
          <div>
            <span>
              KodePay Power by
            </span>
            <span>
              ZingFront
            </span>
            <span style="color: #1D39C4;cursor: pointer">
              了解更多
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="title-16" style="padding: 24px 0">提现记录</div>
      <div>
        <el-table :data="table_data" style="width: 100%"
                  :empty-text="$t('no data')"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"        >
          <el-table-column prop="balance_format" label="金额"></el-table-column>
          <el-table-column prop="account_format" label="账户"></el-table-column>
          <el-table-column prop="time" label="提现时间"></el-table-column>
        </el-table>
      </div>
    </div>
     <edit-withdrawal-settings-dialog :visible="show_withdrawal_settings_edit_dialog" @visibleChange="visibleChange" @operateSuccess="operateSuccess"></edit-withdrawal-settings-dialog>
     <el-dialog  :visible.sync="show_withdrawal_dialog" :show-close="false">
       <div style="padding: 16px 24px">
         <div class="title-16" style="padding-bottom: 16px;border-bottom: 1px solid rgba(232, 232, 232, 1)">申请提现</div>
         <span style="display:flex;justify-content: center;align-items: center;padding-top:24px">
           <span style="color: #101010;width: 80%;background-color: rgba(230, 247, 255, 1);border-radius: 5px;height: 40px;line-height: 40px;padding: 0 12px;text-align: left">
              <i class="el-icon-warning" style="color: #1990FF"></i>
              <span>
                资金将直接打入该账户，无法退回。请确认账户信息正确
              </span>
           </span>
         </span>
         <div class="custom-descriptions-container" style="display: flex;align-items: center;justify-content: center">
           <el-descriptions border :column="1"  class="custom-descriptions">
             <el-descriptions-item label="提现金额">
             </el-descriptions-item>
             <el-descriptions-item label="收款方式">
             </el-descriptions-item>
             <el-descriptions-item label="银行账户">
             </el-descriptions-item>
             <el-descriptions-item label="开户行">
             </el-descriptions-item>
             <el-descriptions-item label="账户人姓名">
             </el-descriptions-item>
             <el-descriptions-item label="提现币种">
             </el-descriptions-item>
           </el-descriptions>
         </div>
         <div style="display: flex;flex-direction: row-reverse;align-items: center;">
           <el-button @click="show_withdrawal_dialog = false" size="small" style="margin-left: 12px">{{ $t('cancel') }}</el-button>
           <el-button type="primary"  size="small">{{$t('create')}}</el-button>
         </div>
       </div>
     </el-dialog>
  </div>
</template>
<script>
import EditWithdrawalSettingsDialog from '../components/edit-withdrawal-settings-dialog.vue'
export default {
  components: {
    EditWithdrawalSettingsDialog
  },
  data () {
    return {
      balance: {
        total_balance_format: 'US$ 0.00',
        withdrawable_format: 'US$ 0.00',
      },
      balance_settings: {
        full_name:"",
        country:"",
        business_type:"",
        withdrawal_currency:"",
        minimum_withdrawal_amount:"xxxxx",
        withdrawal_period:"",
        withdrawal_method:"",
      },
      table_loading: false,
      show_withdrawal_dialog: false,
      show_withdrawal_settings_edit_dialog : false,
      table_data: [
        {
          balance_format: 'US$ 0.00',
          account_format: 'PayPal ****** 1234',
          time: '2020-12-12 12:12:12'
        }
      ]
    }
  },
  methods: {
    /**
     * 打开提现弹窗
     */
    openWithdrawalDialog () {
      this.show_withdrawal_dialog = !this.show_withdrawal_dialog;
    },
    openWithdrawalSettingsDialog () {
      this.show_withdrawal_settings_edit_dialog = !this.show_withdrawal_settings_edit_dialog;
    },
    visibleChange (visible) {
      this.show_withdrawal_settings_edit_dialog = visible;
    },
    operateSuccess () {
      this.show_withdrawal_settings_edit_dialog = false;
    }
  },
}
</script>
<style scoped lang="less">
.container {
}
.container /deep/ .el-descriptions-item__cell {
  padding-bottom: 24px;
}
.border-bottom {
  border-bottom: 1px solid #ebeef5;
}
.custom-descriptions-container /deep/ .el-descriptions-item__label {
  width: 200px;
  padding: 12px;
}
.custom-descriptions-container {
  padding: 24px 0;
}
.container /deep/.el-dialog__header {
  padding: 0;
}
.container /deep/ .el-dialog__body {
  padding: 0;
}
</style>