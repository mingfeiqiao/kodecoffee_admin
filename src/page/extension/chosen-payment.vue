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
            <div style="padding: 12px 8px;display: flex;flex-direction: column;align-items: flex-start;" @click="pay(item)">
              <div>
                <svg width="30" height="30">
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='card'" xlink:href="#bank-card"></use>
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='alipay'" xlink:href="#alipay"></use>
                  <use v-if="item.payment_channel==='stripe' && item.payment_method==='wechat'" xlink:href="#wechat-pay"></use>
                  <use v-if="item.payment_channel==='paypal'" xlink:href="#paypal"></use>
                  <use v-if="item==='paypal'" xlink:href="#paypal"></use>-->
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
import {extensionGetSupportPaymentsApi, makeOrderApi} from "../../api/interface";
export default {
  components: {languageChange},
  data() {
    return {
      payment_methods:[],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init () {
      const headers = this.getHeaders();
      const data = {
        price_id : this.$route.query.prod_id,
        currency: this.$route.query.currency || ""
      }
      extensionGetSupportPaymentsApi(headers, data).then(res => {
        if(parseInt(res.data.code )=== 100000) {
          let payment_methods = res.data.data;
             if (Array.isArray(payment_methods) && Array.length > 0 ) {
              if (payment_methods.length === 1) {
                 // 直接帮他下单
                this.pay(payment_methods[0]);
              } else {
                this.payment_methods = payment_methods;
              }
             } else {
               this.$message.warning('No payment method');
             }
        } else {
          this.$message.warning(res.data.message);
        }
      }).catch(err => {
        this.$message.error(err);
      });
    },

    pay(item) {
      const data = {
        price_id : this.$route.query.prod_id,
        payment_channel: item.payment_channel,
        payment_method: item.payment_method
      }
      let origin_data = this.$route.query.origin_data || "";
      if (origin_data) {
        try {
          let decoded_string = atob(origin_data); // 解码
          data.origin_data = JSON.parse(decoded_string);
        } catch (error) {
          console.error("Error decoding or parsing:", error);
        }
      }
      if (this.$route.query.currency && this.$route.query.currency !== "" ) {
        data.currency = this.$route.query.currency;
      }
      makeOrderApi(this.getHeaders(), data).then(res => {
        if(parseInt(res.data.code) === 100000) {
          let post_params = this.$route.query;
          post_params.transaction_id = res.data.data.transaction_id;
          if (window.opener) {
            window.opener.postMessage({
              type: 'transaction',
              data:  Object.assign({}, data, post_params)
            },"*");
          }
          window.postMessage({
            type: 'transaction',
            data:  Object.assign({}, data, post_params)
          });
          console.log('发送成功:', 'transaction',Object.assign({}, data, post_params));
          window.location.href = res.data.data.url;
        } else {
          this.$message.error(res.data.message);
        }
      }).catch(err => {
        this.$message.error(err);
      });
    },
    getHeaders () {
      let headers = {};
      for (let key in this.$route.query) {
        if (key === 'origin_data') {
          continue
        }
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