<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="height: 33%;display: flex;align-items: center">
          <div class="title-28">
            {{ $t('Choose Payment Method') }}
          </div>
        </div>
        <div style="display: flex;align-items: center;width: 100%;justify-content: center;height: 33%">
          <el-card class="card" v-for="(item, key) in payment_methods" :key="key">
            <div style="padding: 12px 8px;display: flex;flex-direction: column;align-items: flex-start;"  @click="pay(item)">
              <div>
                <svg width="30" height="30">
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='card'" xlink:href="#bank-card"></use>
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='alipay'" xlink:href="#alipay"></use>
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='wechat'" xlink:href="#wechat-pay"></use>
                  <use v-if="item.payment_channel==='paypal'" xlink:href="#paypal"></use>
                </svg>
              </div>
              <div>
                {{ $t(item.payment_channel==='stripe'? item.payment_method : item.payment_channel) }}
              </div>
            </div>
          </el-card >
        </div>
        <div style="height: 34%">
        </div>
      </div>
      <div>
        <language-change></language-change>
      </div>
    </main>
  </div>
</template>
<script>
import languageChange from "../components/language-change.vue";
import {extensionGetPaymentLinkApi, extensionGetSupportPaymentsApi} from "../../api/interface";

export default {
  components: {languageChange},
  data() {
    return {
      payment_methods : [
        {
          'payment_channel': 'stripe',
          'payment_method':'card'
        },
        {
          'payment_channel': 'stripe',
          'payment_method':'alipay',
        },
        {
          'payment_channel': 'stripe',
          'payment_method': 'wechat',
        },
        {
          'payment_channel': 'paypal'
        }
      ],
      payment_channel: '',
      payment_method: '',
    };
  },
  created() {
  },
  methods: {
    init () {
      const headers = this.getHeaders();
      const data = {
        prod_id : this.$route.query.prod_id,
      }
      // extensionGetSupportPaymentsApi(headers, data).then(res => {
      //   if(res.data.code === 200) {
      //     let payment_methods = res.data.data.payment_methods;
      //        if (Array.isArray(payment_methods) && Array.length > 0 ) {
      //         if (payment_methods.length === 1) {
      //            // 直接帮他下单
      //         } else {
      //           直接赋值给payment_methods用于展示
      //         }
      //        }
      //     let payment_method = payment_methods.find(payment_method => payment_method.payment_channel === item.payment_channel && payment_method.payment_method === item.payment_method);
      //     if(payment_method) {
      //       this.$router.push({path: '/extension/pay', query: {payment_method_id: payment_method.id}});
      //     } else {
      //       this.$message.error(this.$t('Payment method is not supported'));
      //     }
      //   } else {
      //     this.$message.error(res.data.message);
      //   }
      // }).catch(err => {
      //   this.$message.error(err);
      // });
    },

    pay(item) {
      console.log('item',item);
      const headers = this.getHeaders();
      const data = {
        prod_id : this.$route.query.prod_id,
        payment_channel: item.payment_channel,
        payment_method: item.payment_method
      }
      // extensionGetPaymentLinkApi(this.getHeaders()).then(res => {
      //   if(res.data.code === 200) {
      //     this.payment_methods = res.data.data.payment_methods;
      //   } else {
      //     this.$message.error(res.data.message);
      //   }
      // }).catch(err => {
      //   this.$message.error(err);
      // });
    },
    getHeaders () {
      let headers = {};
      for (let key in this.$route.query) {
        let newKey = key.replace(/_/g, "-");
        headers[newKey] = this.$route.query[key];
      }
      return headers;
    }
  }
};
</script>
<style scoped lang="less">
.container {
  width: 600px;
  height: 400px;
  border-radius: 5px;
  display:flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}
.card {
  width: 100px;
  height: 80px;
  margin: 12px;
}
.card:hover {
  cursor: pointer;
  border: solid 1px #2f54eb;
}
.card:active {
  border: solid 1px #2f54eb;
}
.card /deep/ .el-card__body {
  padding: 0;
}
</style>