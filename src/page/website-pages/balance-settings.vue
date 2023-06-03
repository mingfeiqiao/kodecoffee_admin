<template>
  <div>
    <div>
      <div>余额</div>
      <div style="display: flex;align-items: center;justify-content: flex-start;">
        <div style="padding-right: 30px">
          <div>
            <span>总余额</span>
            <span>
              <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
          </div>
          <div>US$ 0.00</div>
        </div>
        <div  style="padding-right: 30px">
          <div>
            <span>总余额</span>
            <span>
              <el-tooltip class="item" content="Left Top 提示文字" effect="light" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
          </div>
          <div>US$ 0.00</div>
          </div>
      </div>
    </div>
    <div>
      <div>
        提现设置
      </div>
      <div>
        <div>提现账号</div>
        <div>
          <span>PayPal ****** 1234</span>
          <span style="cursor: pointer;color: #1090FF">修改</span>
        </div>
        <div>
          <div>提现说明:</div>
          <ul>
            <li>1.xxxxxx</li>
            <li>1.xxxxxx</li>
            <li>1.xxxxxx</li>
            <li>1.xxxxxx</li>
            <li style="display: flex;justify-content: flex-end;cursor: pointer;color: #1090FF">更多说明</li>
          </ul>
        </div>

      </div>
    </div>
    <div>
      <div>提现记录</div>
      <div>
        <el-table :data="tableData" style="width: 100%"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"        >
          <el-table-column prop="balance" label="金额"></el-table-column>
          <el-table-column prop="account" label="账户"></el-table-column>
          <el-table-column prop="time" label="提现时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [
        {
          balance: 'US$ 0.00',
          account: 'PayPal ****** 1234',
          time: '2020-12-12 12:12:12'
        }
      ]
    }
  }
}
</script>
<style scoped lang="less">

</style>