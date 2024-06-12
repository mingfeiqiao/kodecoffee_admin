<template>
  <div class="main-container" v-if="isLoaded">
    <h4>{{ $t('Support creator') }} {{client_info.name}}</h4>
    <div class="pay-box">
      <h5>{{productData.name}}</h5>
      <div class="pay-select">
        <img class="pay-cup" src="@/assets/cup.png" alt="cup">
        <span class="pay-price" v-if="productData.app_price_obj">{{productData.app_price_obj.price_format}}</span>
        <div class="pay-num-box">
          <span class="pay-label-num">{{ $t('Num') }}</span>
          <label class="pay-num-item"
                 :class="{active: i === quantity}"
                 v-for="i in quan" :key="i"
                 @click="quantity = i"
          >{{i}} <input type="radio" :value="i" style="display: none;"></label>
<!--          <label class="pay-num-item">2</label>-->
<!--          <input class="pay-num-input" type="text">-->
        </div>
      </div>
      <div class="pay-context">
        <p>{{productData.plan_desc}}</p>
      </div>
      <div class="pay-message" v-if="0">
        <el-input class="pay-message-input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          :placeholder="$t('Encourage creator')">
        </el-input>
      </div>
      <div class="pay-button">
        <el-button class="el-button-orange" @click="handlePay">{{ $t('Pay') }} {{sumAmountPay}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {KodePay as KodePayFn} from "@/utils/kodepay-website";
import {getProductList, pluginList, priceList} from "@/api/interface";
import CURRENCY_OPTIONS from "@/options/currency_options.json";
export default {
  name: "PayCoffee",
  data() {
    return {
      quantity: 1,
      quan: [1, 2, 5],
      isLoaded: false,
      application_id: '',
      client_id: '',
      plan_id: '',
      client_info: {},
      productData: {},
      name: '',
      header: {
        'Content-Type': 'application/json',
        'client-name': ''
      },
    }
  },
  created() {
    const {name, pid} = this.$route.query
    console.log(this.$route)
    this.name = name
    this.plan_id = pid
    if(this.name) {
      /*不需要登录授权*/
      this.getProductList()
      // this.getPlanList()
    }
  },
  mounted() {
    this.injectKodepayScript()
  },
  computed: {
    currentPlan: {
      get() {
        return this.$store.state.currentPlan;
      }
    },
    sumAmountPay() {
      const {app_price_obj} = this.productData
      return app_price_obj.currency + ' ' + (app_price_obj.amount * this.quantity / 100)
    },
  },
  methods: {
    injectKodepayScript() {
      window.KODEPAY_APPLICATION_ID = this.application_id; // application_id
      window.KODEPAY_CLIENT_ID = this.client_id;//client_id
      window.KODEPAY_ENV = 'production';//env，development 和  production
      window.KodePay = KodePayFn(this.application_id, this.client_id)
      console.log(this.application_id, this.client_id, 123)
    },
    getProductList() {
      this.header["client-name"] = this.name
      const params = {
        "condition": {},
        "order": {},
        "page": 1,
        "page_size": 100
      }
      getProductList(this.header, params).then(res => {
        const {client_info, application_info, product_list} = res.data
        client_info.userHeadImg = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + client_info.icon;
        client_info.homeLink = client_info.url + '?name='+ client_info.name;
        this.isLoaded = true
        this.client_info  =client_info
        this.client_id = client_info.id
        this.application_id = application_info.id
        this.handleProductPrice(product_list.list.filter(item => item.prod_code === this.plan_id))
        if(this.application_id && this.client_id) {
           this.injectKodepayScript()
        }
      })
    },
    handleProductPrice(list) {
      list = list.map(item => {
        item.appImg = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + item.icon;
        item.app_price = item.app_price.map(price_item => {
          price_item.price_format =  this.formatPrice(price_item.amount, price_item.currency) || ""
          return price_item
        })
        item.app_price_obj = item.app_price[0]
        return item
      })
      this.productData = list[0]
      console.log(list[0], 'list[0]')
    },
     formatPlanList (data) {
      return data.map(item => {
         return {
           plan_id: item.id || "",
           plan_code : item.prod_code || "",
           plan_icon: item.icon ? "https://kodepay-cdn.oss-us-west-1.aliyuncs.com/" + item.icon : "",
           plan_name: item.name || "",
           plan_desc: item.desc || "",
           plan_type_obj : this.formatPlanType(item.app_price) || null,
           plan_trial_obj: {
              is_trial: !!item.is_trial,
              trial_days: item.trial_days
           },
           main_price_obj: this.formatMainPriceObj(item.app_price) || null,
           other_price_obj: this.formatOtherPriceObj(item.app_price) || null,
         }
       })
    },
    formatPlanType (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        return {
          type: main_price.type || "",
          interval: main_price.interval || "",
          interval_count: main_price.interval_count || "",
        }
      }
    },
    formatOtherPriceObj (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        if (!main_price.currency) {
          return;
        }
        const app_price_currency = main_price.app_price_currency;
        if (app_price_currency && Array.isArray(app_price_currency) && app_price_currency.length > 0) {
          // 先把主币种的价格过滤掉
          const other_price = app_price_currency.filter(item => {
            return item.currency !== main_price.currency;
          });
          return other_price.map(item => {
            return {
              currency: item.currency || "",
              price: item.amount || "",
              price_format: this.formatPrice(item.amount, item.currency) || "",
            }
          });
        }
      }
    },
    formatMainPriceObj (app_price) {
      if (Array.isArray(app_price) && app_price.length > 0) {
        const main_price = app_price[0];
        return {
          currency: main_price.currency || "",
          price: main_price.amount || "",
          interval: main_price.interval || "",
          interval_count:main_price.interval_count,
          price_format: this.formatPrice(main_price.amount, main_price.currency) || "",
        };
      }
    },
    formatPrice (price, currency) {
      let symbol = '';
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          symbol = CURRENCY_OPTIONS[currency_key]['symbol'];
          return `${symbol} ${price/100}`;
        }
      }
    },
    goDetail(item) {
      this.$router.push(`/payCoffee?name=${this.name}&pid=${item.prod_code}`)
    },
    handlePay() {
      // const origial_data= {user_id:8081320,order_id:367};
      const {prod_code, app_price_obj} = this.productData
      window.KodePay.open_payment_choose_page(prod_code, app_price_obj.currency,{quantity: this.quantity}, 800, 700);
    },
  },
}
</script>

<style scoped lang="less">
@media (min-width: 768px) {
  .main-container {
     width: 70%;
    .pay-select{
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
    .pay-box .pay-button{
      text-align: left;
      .el-button{
        padding: 12px 20px;
        width: 120px;
      }
    }
  }
}
.main-container {
  background: #fff;
  padding: 20px;
  color: #3D3D3D;
  margin: 0 auto;
  >h4{
    font-size: 20px;
    font-weight: bold;
  }
  .pay-box{
    margin: 20px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    >h5{
      font-weight: bold;
    }
  }

  .pay-select123{
    background: rgba(255, 149, 77, 0.1);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin: 15px 0;
  }
  .pay-select{
    background: rgba(255, 149, 77, 0.1);
    border-radius: 5px;
    padding: 10px;
    margin: 15px 0;
  }
  .pay-cup{
    width: 80px;
    height: 80px;
    vertical-align: bottom;
  }
  .pay-price{
    font-family: 思源黑体;
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    color: #FF954D;
    margin-right: 80px;
  }
  .pay-label-num{
    font-family: 思源黑体;
    font-size: 14px;
    color: #767676;
    align-self: flex-end;
    margin-right: 10px;
  }
  .pay-num-box{
    margin: 20px 0 0 20px;
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
  }
  .pay-num-item{
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 149, 77, 0.502);
    font-size: 20px;
    color: #FF954D;
    margin: 0 5px;
    cursor: pointer;
    &.active{
      background: rgba(255, 149, 77, 0.5);
      color: #fff;
    }
  }
  .pay-num-input{
    margin: 0 5px;
    width: 40px;
    max-width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.251);
    color: #3D3D3D;
    padding: 10px;
    outline: none;
    caret-color: #FF954D;
    &:active,&:focus{
       border: 1px solid rgba(0, 0, 0, 0.251);
    }
  }
  .pay-context{
    font-family: 思源黑体;
    font-size: 16px;
    color: #3D3D3D;
    p{
      line-height: 20px;
    }
  }
  .pay-message{
    margin: 50px 0;
    .pay-message-input{
      width: 100%;
      caret-color: #FF954D;
      .el-textarea__inner:focus{
        border: 1px solid #dcdfe6!important; //无效
      }
    }
  }
  .pay-button{
    text-align: center;
    margin-top: 20px;
    .el-button{
      padding: 8px 14px;
    }
  }
}
</style>