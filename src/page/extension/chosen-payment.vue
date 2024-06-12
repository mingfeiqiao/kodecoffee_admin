<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container" v-loading="loading" :element-loading-text="$t('Loading desperately')" >
          <div style="height: 33%;display: flex;align-items: center">
            <div class="title-28">
              {{ $t('Choose Payment Method') }}
            </div>
          </div>
          <div style="display: flex;align-items: center;width: 100%;justify-content: center;height: 33%">
            <el-card class="card" v-for="(item, key) in payment_methods" :key="key">
              <div style="padding: 12px 8px;display: flex;flex-direction: column;align-items: flex-start;" @click="checkTransactions(item)">
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
      <div style="display: flex; justify-content: space-between;margin-top: 5px;">
        <language-change></language-change>
        <div>
          <span style="font-size: 12px;color: #767676;">Powered by</span>
          <a :href="$i18n.locale === ZH_CODE ? 'https://kodepay.io/cn?utm_source=chosen-payment' : 'https://kodepay.io/en?utm_source=chosen-payment'" target="_blank" style="color: #767676;text-decoration: none;font-size: 12px;font-weight: 700;">KodePay</a>
          <span style="color: #767676;">&nbsp;|&nbsp;</span>
          <a :href="$i18n.locale === ZH_CODE ? 'https://kodepay.io/buyer-terms-cn?utm_source=chosen-payment' : 'https://kodepay.io/buyer-terms-en?utm_source=chosen-payment'" target="_blank" class="agreement_link">{{ $t('Terms') }}</a>
          <a href="https://kodepay.io/privacy?utm_source=chosen-payment" target="_blank" class="agreement_link">{{ $t('Privacy') }}</a>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import languageChange from "@/page/components/language-change.vue";
import {extensionGetSupportPaymentsApi, makeOrderApi} from "@/api/interface";
import {timestampToDateString} from "@/utils/dateUtils";
export default {
  components: {languageChange},
  data() {
    return {
      payment_methods:[],
      support_payment_loading:false,
      pay_url_loading:false,
      transactions:null,
    };
  },
  created() {
    this.init();
  },
  computed:{
    loading () {
      return this.pay_url_loading || this.support_payment_loading
    }
  },
  methods: {
    init () {
      const headers = this.getHeaders();
      const data = {
        price_id : this.$route.query.prod_id,
        currency: this.$route.query.currency || "usd"
      }
      this.support_payment_loading = true;
      extensionGetSupportPaymentsApi(headers, data).then(res => {
        this.support_payment_loading = false;
        if(parseInt(res.data.code) === 100000) {
          let payment_methods = res.data.data.payment;
          this.transactions = res.data.data.transactions
             if (Array.isArray(payment_methods) && Array.length > 0 ) {
              if (payment_methods.length === 1) {
                 // 直接帮他下单
                this.checkTransactions(payment_methods[0]);
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
        this.support_payment_loading = false;
        this.$message.error(err);
      });
    },
    checkTransactions(item) {
      if (this.transactions && this.transactions.length > 0) {
        const recently_transaction = this.transactions[0];
        let message = '';
        let title = '';
        if (recently_transaction.plan_type === 'recurring') {
          message = this.$t('subscription active msg', {date:timestampToDateString(recently_transaction.plan_start_time, 'yyyy-MM-dd HH:II:SS'), prod_name:recently_transaction.prod_name})
          title = this.$t('subscription active tip',{prod_name:recently_transaction.prod_name})
        } else {
          message = this.$t('one time purchased msg', {date:timestampToDateString(recently_transaction.pay_time, 'yyyy-MM-dd HH:II:SS'), prod_name:recently_transaction.prod_name})
          title = this.$t('one time purchased tip')
        }
        const h = this.$createElement;
        console.log(message)
        this.$msgbox({title:title, message: h('div', {style:'white-space: pre-line;'}, message), showCancelButton:true, confirmButtonText:this.$t('Continue'), cancelButtonText:this.$t('cancel')}).then(() => {
          this.pay(item)
        }).catch(() => {
          console.log('canceld')
        });
      } else {
        this.pay(item)
      }
    },
    pay(item) {
      const data = {
        price_id : this.$route.query.prod_id,
        payment_channel: item.payment_channel,
        payment_method: item.payment_method
      }
      let origin_data = this.$route.query.origin_data || "";
      let redirect_url = this.$route.query.redirect_url || "";
      if (redirect_url) {
        data.redirect_url = redirect_url;
      }
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
      this.pay_url_loading = true;
      makeOrderApi(this.getHeaders(), data).then(res => {
        if(parseInt(res.data.code) === 100000) {
          let post_params = this.$route.query;
          post_params.transaction_id = res.data.data.transaction_id;
          window.postMessage({
            type: 'transaction',
            data:  Object.assign({}, data, post_params)
          });
          if (window.opener) {
            window.opener.postMessage({
              type: 'transaction',
              data:  Object.assign({}, data, post_params)
            },"*");
          }
          console.log('发送成功:', 'transaction',Object.assign({}, data, post_params));
          window.location.href = res.data.data.url;
        } else {
          this.$message.warning(res.data.message);
        }
      }).catch(err => {
        this.$message.error(err);
      });
    },
    getHeaders () {
      let headers = {};
      for (let key in this.$route.query) {
        if (key === 'origin_data' || key === 'redirect_url') {
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
.container /deep/ .el-loading-text {
  color: #929292
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
.text-loading:after{
  content:'...';
  animation: text-loading 2s infinite;
}
@keyframes text-loading {
  25%{
    content: ".";
  }
  50%{
    content: "..";
  }
  100%{
    content: "...";
  }
}
</style>
<style lang="less">
.el-message-box__title {
  font-weight: bold;
  font-size: 16px;
}
.agreement_link{
  color: rgb(118, 118, 118);
  text-decoration: underline;
  font-size: 12px;
  margin-left: 5px;
}
</style>