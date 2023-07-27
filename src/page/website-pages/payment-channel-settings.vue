<template>
  <div>
    <div>
      <div>{{$t('Payment Channel Settings')}}</div>
    </div>
    <div class="table">
      <ul>
        <li v-for="(setting, index) in pay_channel_settings" :key="index">
          <div style="display: flex;align-items: center;">
              <div>
               <svg width="43" height="43">
                  <use :xlink:href="'#'+setting.payment_channel"></use>
               </svg>
              </div>
              <div style="padding-left: 24px">
                <div>{{setting.payment_channel}}</div>
                <div style="color: #929292">{{$t(CHANNEL_DESC_DICT[setting.payment_channel])}}</div>
              </div>
            </div>
          <div style="padding-right: 20px">
            <el-switch v-model="setting.status" @change="settingChange(setting)" active-color="#13ce66">
            </el-switch>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {getPaymentChannelApi, setPaymentChannelApi} from "../../api/interface";
export default {
  data () {
    return {
      pay_channel_settings:[],
      CHANNEL_DESC_DICT : {
        'paypal': 'PayPal'
      }
    }
  },
  methods: {
    settingChange(setting) {
      if(setting.status) {
        this.$confirm(this.$t('open channel tip', {value: setting.payment_channel}), '', {
          confirmButtonText: this.$t('Ok'),
          cancelButtonText: this.$t('cancel'),
        }).then(() => {
          this.setPaymentChannel({'payment_channel': setting.payment_channel, 'status': 1});
        })
      } else {
        this.$confirm(this.$t('close channel tip', {value: setting.payment_channel}), '', {
          confirmButtonText: this.$t('Ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.setPaymentChannel({'payment_channel': setting.payment_channel, 'status': 0});
        })
      }
    },
    setPaymentChannel(setting) {
      setPaymentChannelApi(setting).then(res => {
        if(parseInt(res.data.code) === 100000) {
          this.pay_channel_settings.forEach(item => {
            if(item.payment_channel === setting.payment_channel) {
              this.$set(item, 'status', item.status);
            }
          });
          if (setting.status) {
            this.$message({
              type: 'success',
              message: this.$t('open succeed')
            });
          } else {
            this.$message({
              type: 'success',
              message: this.$t('close succeed')
            });
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          });
        }
      }).catch(err => {
        this.$message({
          type: 'error',
          message: 'error'
        });
      })
    },
    getPaymentChannelSettings() {
      getPaymentChannelApi().then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 100000) {
          let data = res.data.data;
          data.forEach(item => {
            item.status = parseInt(item.status) === 1;
          });
          this.pay_channel_settings = data;
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getPaymentChannelSettings()
  }
}
</script>
<style scoped lang="less">
.table > ul > li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E9E9E9;
  padding: 12px 0;
}
</style>