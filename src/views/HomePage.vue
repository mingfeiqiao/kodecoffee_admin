<template>
  <div class="main-container">
    <el-row :gutter="10" class="creator-box">
      <el-col :sm="24" :md="12">
        <div class="creator-info">
          <el-avatar class="creator-img" icon="el-icon-user-solid" :src="client_info.userHeadImg"></el-avatar>
          <div class="creator-tips">
            <h5>{{client_info.name}}</h5>
            <p><el-link :underline="false" :href="client_info.homeLink">{{client_info.homeLink}}</el-link></p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12">
        <div class="creator-support">
<!--          <el-button class="el-button-orange" size="small" @click="goDetail">{{ $t('Support creator') }}</el-button>-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="24" :md="12">
        <div class="creator-content-left">
          <h5>{{$t("Work Info")}}</h5>
          <p>{{client_info.description}}</p>
        </div>
      </el-col>
      <el-col :sm="24" :md="12">
        <div class="support-list">
          <div class="support-item" v-for="item in product_list" :key="item.plan_id">
            <div class="support-info">
              <h4>{{item.name}}</h4>
              <div class="support-price">
                <strong v-for="price_item in item.app_price" :key="price_item.id">{{price_item.price_format}}</strong>
              </div>
              <h4>{{$t("Tips reward")}}</h4>
              <p>{{item.desc}}</p>
            </div>
            <div class="support-img-box">
              <div class="support-img">
                <img :src="item.appImg">
              </div>
              <div style="text-align: center;">
                <el-button class="el-button-orange el-button-tiny" @click="goDetail(item)">{{ $t('Support creator') }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {KodePay as KodePayFn} from "@/utils/kodepay-website";
import {getProductList, pluginList, priceList} from "@/api/interface";
import CURRENCY_OPTIONS from "@/options/currency_options.json";
export default {
  name: "HomePage",
  data() {
    return {
      application_id: '',
      client_id: '',
      projectData: {},
      client_info: {},
      client_info_default: {
        "description": "",
        "icon": "https://kodecoffee-global.zingfront.com/fixed_files/img/default_head.png",
        "cover": "https://kodecoffee-global.zingfront.com/fixed_files/img/william-warby-ld4wZGqlLF4-unsplash.jpg",
      },
      product_list: [],
      name: '',
      header: {
        'Content-Type': 'application/json',
        'client-name': ''
      },
    }
  },
  created() {
    const {name} = this.$route.query
    console.log(this.$route)
    this.name = name
    if(this.name) {
      /*不需要登录授权*/
      this.getProductList()
      // this.getPlanList()
    }
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
        client_info.homeLink = client_info.url + '?name='+ client_info.name;

        client_info.userHeadImg = client_info.icon ? this.OSS_URL + client_info.icon : this.client_info_default.icon;
        client_info.homeCover = client_info.cover ? this.OSS_URL + client_info.cover : this.client_info_default.cover;

        this.client_info = client_info
        this.client_id = client_info.id
        this.application_id = application_info.id
        this.handleProductPrice(product_list.list)
        if(this.application_id && this.client_id) {
           this.injectKodepayScript()
        }
      })
    },
    handleProductPrice(list) {
      list = list.map(item => {
        item.appImg = process.env.VUE_APP_OSS_URL + item.icon;
        item.app_price = item.app_price.map(price_item => {
          price_item.price_format =  this.formatPrice(price_item.amount, price_item.currency) || ""
          return price_item
        })
        return item
      })
      this.product_list = list
    },
     formatPlanList (data) {
      return data.map(item => {
         return {
           plan_id: item.id || "",
           plan_code : item.prod_code || "",
           plan_icon: item.icon ? process.env.VUE_APP_OSS_URL + item.icon : "",
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
    handlePay(item) {
      // const origial_data= {user_id:8081320,order_id:367};
      window.KodePay.open_payment_choose_page(item.prod_code, 'usd',null, 800, 700);
    },
  },
}
</script>

<style scoped lang="less">
@media (min-width: 768px) {
  .main-container {
     width: 70%;
  }
}
.main-container{
  //margin-top: 60px;
  background: #fff;
  padding: 20px;

  color: #3D3D3D;
  margin: 0 auto;
  .creator-box{
    margin-bottom: 30px;
  }
  .creator-info{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .creator-img{
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    border-radius: 50%;
    background: transparent;
    margin-right: 10px;
  }
  .creator-tips{
    color: #3D3D3D;
    h5{
      margin: 0;
      padding: 0;
      font-size: 20px;
    }
    p{
      font-size: 16px;
    }
  }
  .creator-support{
    float: right;
    margin-top: 20px;
    .el-button{}
  }
  .creator-content{
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    font-family: 思源黑体;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .creator-content-left{
    border: 1px solid #dedede;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .creator-content-right{
    padding-left: 20px;
  }
  .support-list{
    .support-item{
      border: 1px solid #dedede;
      border-radius: 5px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px;
      .support-info{}
      .support-price{}
      .support-img-box{}
      .support-img{
        max-width: 120px;
        width: 100%;
        height: 100%;
        //padding-bottom: 60%;
        border-radius: 5px;
        //background: #ccc;
        border: 1px dashed #dedede;
        margin-bottom: 40px;
        img{
          width: 100%;
        }
      }
    }
  }
}
</style>