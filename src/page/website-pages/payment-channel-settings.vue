<template>
  <div>
    <div>
      <div>支付渠道设置</div>
    </div>
    <div class="table">
      <ul>
        <li v-for="(setting, index) in payChannelSettings" :key="index">
          <div style="display: flex;align-items: center;">
              <div>
               <svg width="80" height="80">
                  <use :xlink:href="'#'+setting.icon"></use>
               </svg>
              </div>
              <div style="padding-left: 24px">
                <div>{{setting.label}}</div>
                <div>{{"支付宝支付"}}</div>
              </div>
            </div>
          <div style="padding-right: 20px">
            <el-switch v-model="setting.require" @change="settingChange(setting)" active-color="#13ce66" :disabled="setting.isDisable">
            </el-switch>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      payChannelSettings:[
        {
          name: 'cardPay',
          label: '银行卡支付',
          require: true,
          isDisable: true,
          icon: 'credit-card',
        },
        {
          name: 'alipay',
          label: '支付宝支付',
          require: true,
          isDisable: false,
          icon: 'alipay',
        },
        {
          name: 'wechatPay',
          label: '微信支付',
          require: true,
          isDisable: false,
          icon: 'wechat-pay',
        },
      ]
    }
  },
  methods: {
    settingChange(setting) {
      if(setting.require) {
        this.$confirm('是否开启支付渠道？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          setting.require = true
          this.$message({
            type: 'success',
            message: '开启成功!'
          });
        }).catch(() => {
          setting.require = false
          this.$message({
            type: 'info',
            message: '已取消开启'
          });
        });
      } else {
        this.$confirm('是否关闭支付渠道？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setting.require = false
          this.$message({
            type: 'success',
            message: '关闭成功!'
          });
        }).catch(() => {
          setting.require = true
          this.$message({
            type: 'info',
            message: '已取消关闭'
          });
        });
      }
    }
  }
}
</script>
<style scoped lang="less">
.table > ul > li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>