<template>
  <div>
    <div>
        <span class="title-16">
          {{ $t('4 steps to start') }}
        </span>
      <span style="color: #929292;padding-left: 12px">
          {{ $t('in 10 min')}}
        </span>
    </div>
    <div style="padding-top: 24px">
      <el-steps :active="currentStep" finish-status="success">
        <el-step v-for="(step, index) in guideSteps" :key="index" :title="$t(step.title)" :clickable="true" @click="goToStep(index)">
        </el-step>
      </el-steps>
    </div>

    <div v-if="currentStep === 0">
      <div style="padding-top: 100px">
        <div>
          {{$t('please input extension name')}}
        </div>
        <div style="max-width: 300px;padding-top: 12px">
          <el-input v-model="plugin_name" size="small" :placeholder="$t('please input extension name')"></el-input>
        </div>
      </div>

    </div>
    <div v-if="currentStep === 1">
      <div>
        <div style="padding-top: 80px">{{ $t('Create Plan and Price') }}</div>
        <div style="padding-top: 80px">
          <div>{{$t('Select the Subscription Plans to Add')}}</div>
          <div style="padding-top: 12px">
            <el-button  v-for="(value, key) in plan_options" size="small" :key="key" :label="value[$i18n.locale]" @click="changePlanName(key)">{{value[$i18n.locale]}}</el-button>
          </div>
        </div>

      </div>

    </div>
    <div v-if="currentStep === 2">
      <el-card style="margin-top: 80px">
        <pre>
// service_worker
import {Kodepay} from "kodepay";
const kodepay_client = Kodepay.kodepay(your application_id, your extension_id, the environment you want to use);
// example: const kodepay_client = Kodepay.kodepay(application_id, client_id, 'development')
// get user info
kodepay_client.get_user_info().then((user) => {
      console.log(user);
 });
// open login in page
kodepay_client.open_login_page();

// open user management page
kodepay_client.open_user_management_page();

// open payment page
kodepay_client.open_payment_page(price_id);
        </pre>
      </el-card>
    </div>
    <div v-if="currentStep === 3">
      <div style="display:flex;align-items: center;justify-content: center;flex-direction: column">
        <div style="padding-top: 80px">{{'🎉' + $t('Integration successful')}}</div>
        <div style="padding-top: 80px">
          <span class="link">{{$t('Development integration process documentation')}}</span> <span class="link" style="padding-left: 24px">{{  $t('Help documentation center') }}</span>
        </div>
        <el-button size="small" @click="finishGuide" type="primary" style="margin-top: 80px">
          {{ $t('Complete') }}
        </el-button>
      </div>
    </div>
    <div style="display: flex;align-items: center;justify-content: center;padding-top: 80px">
      <el-button style="margin-top: 12px;" @click="nextStep" v-if="currentStep < 3" size="small" type="primary">{{$t('Next Step')}}</el-button>
    </div>
  </div>
</template>
<script>
import {addPlan, addPlugin} from "../../api/interface";

export default {
  data() {
    return {
      plan_name: '',
      plugin_name:'',
      guideSteps: [
        {
          title: 'Create Extension',
        },
        {
          title: 'Create Plan',
        },
        {
          title: 'Import JS',
        },
        {
          title: 'Complete',
        },
      ],
      currentStep: 0,
      plan_options: {
        '$3.99-recurring': {
          "en-US":"$3.99/month Recurring",
          "zh-CN":"$3.99/月 循环订阅",
        },
        '$9.99-recurring': {
          "en-US":"$9.99/month Recurring",
          "zh-CN":"$9.99/月 循环订阅",
        },
        '$19.99-recurring': {
          "en-US":"$19.99/month Recurring",
          "zh-CN":"$19.99/月 循环订阅",
        },
        '$2.99-once-time': {
          "en-US":"$2.99 One Time",
          "zh-CN":"$2.99 单次支付",
        },
        '$9.99-once-time': {
          "en-US":"$9.99 One Time",
          "zh-CN":"$9.99 单次支付",
        },
      },
      plans: {
        '$3.99-recurring': {
          "is_trial":0,
          app_price:[
            {
              amount: 3.99,
              currency: "usd",
              currency_options:[],
              interval: "month",
              interval_count: 1,
              type: "recurring",
            }
          ]
        },
        '$9.99-recurring': {
            "is_trial":0,
            app_price:[
              {
                amount: 9.99,
                currency: "usd",
                currency_options:[],
                interval: "month",
                interval_count: 1,
                type: "recurring",
              }
            ]
          },
        '$19.99-recurring': {
          "is_trial":0,
          app_price:[
            {
              amount: 19.99,
              currency: "usd",
              currency_options:[],
              interval: "month",
              interval_count: 1,
              type: "recurring",
            }
          ]
        },
        '$2.99-once-time': {
          "is_trial":0,
          app_price:[
            {
              amount: 2.99,
              currency: "usd",
              currency_options:[],
              type: "one_time",
            }
          ]
        },
        '$9.99-once-time': {
          "is_trial":0,
          app_price:[
            {
              amount: 9.99,
              currency: "usd",
              currency_options:[],
              type: "one_time",
            }
          ]
        },
      }
    };
  },
  created() {
    this.currentStep = parseInt(localStorage.getItem('guideStep')) || 0;
    if (this.currentStep === 4) {
      this.$router.push({path: '/dashboard'});
    }
  },
  methods: {
    preStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    finishGuide() {
      this.nextStep();
      this.$router.push({path: '/dashboard'});
    },
    setLocalStorageGuideStep (step) {
      localStorage.setItem('guideStep', step);
      this.$store.commit('setGuideStep', step);
    },
    changePlanName(key) {
      this.plan_name = key;
    },
    nextStep() {
      if (this.currentStep === 0) {
        if (this.plugin_name === '') {
          this.$message({
            message: this.$t('extension name is required'),
            type: 'warning'
          });
        } else {
          let vm = this;
          addPlugin({name: this.plugin_name}).then(res => {
            if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
              vm.currentStep++;
              vm.setLocalStorageGuideStep(vm.currentStep);
            } else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          });
        }
      } else if (this.currentStep === 1) {
        if (this.plan_name === '') {
          this.$message({
            message: 'plan is required',
            type: 'warning'
          });
        } else {
          // 添加套餐
          let args = this.plans[this.plan_name];
          args.name = this.plan_options[this.plan_name][this.$i18n.locale];
          let vm = this;
          addPlan(args).then(res => {
            if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
              vm.currentStep++;
              vm.setLocalStorageGuideStep(vm.currentStep);
            } else {
              vm.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          });
        }
      } else if (this.currentStep === 2) { // 导入JS
        this.currentStep++;
        this.setLocalStorageGuideStep(this.currentStep);
      } else if (this.currentStep === 3) { // 页面
        this.currentStep++;
        this.setLocalStorageGuideStep(this.currentStep);
      }
    },
    goToStep(index) {
      this.currentStep = index;
    },
  }
};
</script>

<style scoped lang="less">

</style>