<template>
  <div>
    <div>
        <span class="title-16">
          {{ $t('4 steps to start') }}
        </span>
      <span style="color: #929292;padding-left: 12px">
          {{ $t('in 3 min')}}
        </span>
    </div>
    <div style="padding-top: 24px">
      <el-steps :active="current_step" finish-status="success">
        <el-step v-for="(step, index) in guideSteps" :key="index" :title="$t(step.title)" :clickable="true" @click="goToStep(index)">
        </el-step>
      </el-steps>
    </div>

    <div v-show="current_step === 0">
      <div style="padding-top: 100px">
        <div>
          {{$t('please input extension name')}}
        </div>
        <div style="max-width: 300px;padding-top: 12px">
          <el-input v-model="plugin_name" size="small" :placeholder="$t('please input extension name')"></el-input>
        </div>
      </div>

    </div>
    <div v-show="current_step === 1">
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
    <div v-show="current_step === 2">
      <div style="margin-top: 24px">
        <div>
          <div class="title-14">{{'1.' + $t('Import the dependency package')}}</div>
          <div class="code-container">
            <pre>
              <code class="language-javascript my-code-style">
npm install kodepay</code>
            </pre>
            <div class="copy-button" @click="copy()">{{$t('copy code')}}</div>
          </div>
        </div>
        <div>
          <div class="title-14">{{'2.' + $t('Create kodepayContent.js and paste the code below')}}</div>
          <div class="code-container">
            <pre>
              <code class="language-javascript">
import {KodepayContent} from 'kodepay';
KodepayContent.kodepay_content_start_listener();</code>
            </pre>
            <div class="copy-button" @click="copy()">{{$t('copy code')}}</div>
          </div>
        </div>
        <div>
          <div class="title-14">{{'3.' + $t('Copy the code below and paste it into your background.js')}}</div>
          <div class="code-container">
            <pre>
              <code class="language-javascript">
{{`// service_worker
import {Kodepay} from "kodepay";
// example: const kodepay_client = Kodepay.kodepay({application_id:"xxxx", client_id:"xxxx", mode:"development or production"})
//You can find the application_id in the Developer Settings page
//You can find the extension_id in the extension page
const kodepay_client = Kodepay.kodepay({application_id:"${application_key}", client_id:"${extension_key}", mode:"development"});
// get user info
kodepay_client.get_user_info().then((user) => {
   console.log(user);
});
// open login in page
kodepay_client.open_login_page();
// open user management page
 kodepay_client.open_user_management_page();
// open payment page
//You can find the plan_id in the plan page
kodepay_client.open_payment_page({plan_id:"${plan_key}"});`
}}</code>
            </pre>
            <div class="copy-button" @click="copy()">{{$t('copy code')}}</div>
          </div>
        </div>
        <div>
          <div class="title-14">{{'4.' + $t('Add the following code to manifest.json')}}</div>
          <div class="code-container">
            <pre>
              <code class="language-javascript">
"permissions": ["storage"],
"content_scripts": [
    {
      // other content-scripts
    },
    {
      "js": ["kodepayContent.js"],
      "matches": ["https://kodepay.io/*"],
      "run_at": "document_start"
    }
]</code>
            </pre>
            <div class="copy-button" @click="copy()">{{$t('copy code')}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="current_step === 3">
      <div style="display:flex;align-items: center;justify-content: center;flex-direction: column">
        <div style="padding-top: 80px">{{'🎉' + $t('Integration successful')}}</div>
        <div style="padding-top: 80px">
          <span class="link" @click="gotoDocCenter($i18n.locale)">{{  $t('Help documentation center') }}</span>
        </div>
        <el-button size="small" @click="finishGuide" type="primary" style="margin-top: 80px">
          {{ $t('Complete') }}
        </el-button>
      </div>
    </div>
    <div style="display: flex;align-items: center;justify-content: center;padding-top: 80px">
      <el-button style="margin-top: 12px;" @click="nextStep" v-if="current_step < 3" size="small" type="primary">{{$t('Next Step')}}</el-button>
    </div>
  </div>
</template>
<script>
import {addPlan, addPlugin, setGuideStepApi} from "../../api/interface";
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import Clipboard from "clipboard";
import {gotoDocCenter} from "../../configs/common";
export default {
  data() {
    return {
      plan_name: '',
      plugin_name:'',
      application_key:"",
      extension_key:"",
      plan_key:"",
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
      current_step: 0,
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
    this.current_step = parseInt(localStorage.getItem('guideStep')) || 0;
    if (this.current_step === 4) {
      this.$router.push({path: '/dashboard'});
    }
    //
    this.application_key = localStorage.getItem(this.$mode + 'applicationKey') || "your application id";
    this.extension_key = localStorage.getItem('extensionKey') || "your extension id";
    this.plan_key = localStorage.getItem('planKey') || "your plan id";
  },
  mounted() {
    this.renderCodeBlocks();
  },
  methods: {
    gotoDocCenter,
    preStep() {
      if (this.current_step > 0) {
        this.current_step--;
      }
    },
    renderCodeBlocks () {
      // 获取需要高亮的代码块
      console.log('重新刷新');
      const codeBlocks = document.querySelectorAll('pre code');
      // 对每个代码块应用 Prism.js 的语法高亮
      codeBlocks.forEach((codeBlock) => {
        Prism.highlightElement(codeBlock);
      });
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
      if (this.current_step === 0) {
        if (!this.plugin_name || !this.plugin_name.trim()) {
          this.$message({
            message: this.$t('extension name is required'),
            type: 'warning'
          });
        } else {
          addPlugin({name: this.plugin_name}).then(plugin_res => {
            const { data } = plugin_res || {};
            const { code = 0 } = data || {};
            if (parseInt(code) === 100000) {
              setGuideStepApi({step: this.current_step + 1, status:1}).then(res => {
                if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
                  this.current_step++;
                  this.extension_key = plugin_res.data.data.extension_id;
                  localStorage.setItem('extensionKey', this.extension_key);
                  this.setLocalStorageGuideStep(this.current_step);
                  this.$message({
                    message: this.$t('create success'),
                    type: 'success'
                  })
                } else {
                  this.$message({message: res.data.message, type: 'warning'
                  });
                }
              }).catch(err => {
                console.error(err)
              });
            } else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          });
        }
      } else if (this.current_step === 1) {
        if (this.plan_name === '' || this.plan_name.trim() === '') {
          this.$message({
            message: 'plan is required',
            type: 'warning'
          });
        } else {
          // 添加套餐
          let args = this.plans[this.plan_name];
          args.name = this.plan_options[this.plan_name][this.$i18n.locale];
          addPlan(args).then(plan_res => {
            const { data } = plan_res || {};
            const { code = 0 } = data || {};
            const { message } = data || {};
            if (parseInt(code) === 100000) {
              setGuideStepApi({step: this.current_step + 1, status:1}).then(res => {
                const { data } = res || {};
                const { code = 0 } = data || {};
                const { message } = data || {};
                if (parseInt(code) === 100000) {
                  this.current_step++;
                  this.plan_key = plan_res.data.data.product_key;
                  localStorage.setItem('planKey', this.plan_key);
                  this.setLocalStorageGuideStep(this.current_step);
                  this.$message({
                    message: this.$t('create success'),
                    type: 'success'
                  })
                  // window.location.reload();
                } else {
                  if (message) {
                    this.$message({message: res.data.message, type: 'warning'});
                  }
                }
              }).catch(err => {
                console.error(err)
              });
            } else {
              if (message) {
                this.$message.warning(res.data.message)
              }
            }
          }).catch(err => {
            console.error(err);
          });
        }
      } else if (this.current_step === 2) { // 导入JS
        setGuideStepApi({step: this.current_step + 1, status:1}).then(res => {
          const { data } = res || {};
          const { code = 0 } = data || {};
          const { message } = data || {};
          if (parseInt(code) === 100000) {
            this.current_step++;
            this.setLocalStorageGuideStep(this.current_step);
          }
          if (!(code && parseInt(code) === 100000)) {
            if (message) {
              this.$message({message: res.data.message, type: 'warning'});
            }
          }
        }).catch(err => {
          console.error(err)
        });
      } else if (this.current_step === 3) { // 页面
        setGuideStepApi({step: this.current_step + 1, status:1}).then(res => {
          const { data } = res || {};
          const { code = 0 } = data || {};
          const { message } = data || {}
          if (parseInt(code) === 100000) {
            this.current_step++;
            localStorage.removeItem('extensionKey');
            localStorage.removeItem('planKey');
            this.setLocalStorageGuideStep(this.current_step);
          }
          if (!(code && parseInt(code) === 100000)) {
            if (message) {
              this.$message({message: res.data.message, type: 'warning'});
            }
          }
        }).catch(err => {
          console.error(err)
        });
      }
    },
    copy (){
      let clipboard = new Clipboard('.copy-button', {
        text: (trigger) => {
          const codeBlock = trigger.parentNode.querySelector('pre code');
          return codeBlock.innerText;
        }
      })
      clipboard.on('success', e => {
        this.$message({
          message: this.$t('copy success'),
          type: 'success'
        });
        clipboard.destroy(); // 释放内存
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({message: this.$t('browser not support copy'), type: 'warning'})
        clipboard.destroy();
      })
    },
    goToStep(index) {
      this.current_step = index;
    },
  }
};
</script>
<style scoped lang="less">
.code-container {
  padding-bottom: 12px;
  position: relative;
}
.my-code-style {
  background: #f0f0f0;
}
.copy-button {
  position: absolute;
  cursor: pointer;
  padding: 4px;
  margin: 8px;
  font-size: 12px;
  color: #929292;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  top: 0;
  right: 0;
}
pre[class*="language-"] {
  background-color: #F0F0F0;
}
</style>