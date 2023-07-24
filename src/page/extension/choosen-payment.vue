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
            <div style="padding: 12px 8px;display: flex;flex-direction: column;align-items: flex-start;">
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
    };
  },
  created() {
  },
  methods: {
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