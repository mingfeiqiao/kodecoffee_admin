<template>
  <div>
    <el-dialog :title="operationType === 'add' ? $t('create new plan') : $t('update plan')"  :visible.sync="dialog_form_visible" width="50%" :modal-append-to-body="false" destroy-on-close>
     <el-form ref="ruleForm" :model="plan"  label-width="120px" label-position="top" size="mini" :rules="rules">
       <div style="display:flex;align-items: center;justify-content: space-between; ">
         <div style="min-width: 250px;">
           <el-form-item :label="$t('name')" prop="plan_name">
             <el-input v-model="plan.plan_name" :placeholder="$t('plan name placeholder')" style="width: 300px"></el-input>
           </el-form-item>
           <el-form-item :label="$t('description')" prop="plan_desc">
             <el-input type="textarea" v-model="plan.plan_desc" :placeholder="$t('plan description placeholder')" style="width: 300px"></el-input>
           </el-form-item>
         </div>
         <div>
           <el-form-item :label="$t('icon')">
             <img-upload :icon_url="plan.plan_icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
           </el-form-item>
         </div>
       </div>
       <div>
         <el-form-item>
           <div style="display: flex;align-items: center">
             <div style="padding-right: 20px">
               {{$t('billing method')}}
             </div>
             <el-radio v-model="plan_type_obj.type" v-for="option of type_option" :key="option.value" :label="option.value" :disabled="!unable_modify">
               {{ $t(option.label) }}
             </el-radio>
           </div>
         </el-form-item>
         <el-form-item v-if="plan_type_obj.type === 'recurring'">
           <div style="display: flex;align-items: center">
             <div style="padding-right: 20px">
               {{$t('Billing cycle')}}
             </div>
             <div style="max-width: 150px">
               <el-select v-model="interval_option" :disabled="!unable_modify" @change="intervalOptionChange">
                 <el-option v-for="item in interval_options" :key="item.value" :label="$t(item.label)" :value="item.value">
                 </el-option>
               </el-select>
             </div>
           </div>
         </el-form-item>
         <div v-if="plan_type_obj.type === 'recurring' && interval_option === 'every day'"  style="display: flex;align-items: center;padding-left: 80px;color: #f5222d">
            {{$t('Daily subscription is for testing purposes in the development environment')}}
         </div>

       </div>
       <div style="height: 1px; background-color: rgba(232, 232, 232, 1);"></div>
       <div v-if="operationType === 'add'">
         <div class="title-14" style="padding: 12px 0">{{$t('Amount')}}</div>
         <el-form-item>
           <div style="display: flex;flex-direction: column">
             <div style="display: flex;flex-direction: row;align-items: center">
               <div class="p-main">
                 US$
               </div>
               <div style="max-width: 100px">
                 <el-select v-model="main_price_obj.price"  @change="priceChange">
                   <el-option
                     v-for="item in app_price_options"
                     :key="item.index"
                     :label="item.amount"
                     :value="item.amount">
                     <span style="text-align: center">
                       {{ item.amount }}
                     </span>
                   </el-option>
                 </el-select>
               </div>
             </div>
             <div style="color: #939393">
               {{$t('all prices are tax inclusive')}}
             </div>
           </div>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="setCurrencyOption">{{$t('set more currencies')}}</el-button>
           <div style="color: #929292;font-size: 12px">
             <span>{{$t('set more currencies tip')}}</span>
             <span>{{$t('learn more')}}</span>
           </div>
           <div v-if="is_multiple_currency_support">
             <el-table
               ref="multipleTable"
               :data="currency_options"
               tooltip-effect="dark"
               style="width: 100%"
               :empty-text="$t('no data')"
               :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
               @selection-change="handleSelectionChange">
               <el-table-column
                 type="selection"
                 :label="$t('enabled')"
                 :selectable="isSelectable"
               >
               </el-table-column>
               <el-table-column
                 :label="$t('currency')"
                 prop="currency_format"
               >
               </el-table-column>
               <el-table-column
                 prop="price_format"
                 :label="$t('Amount')"
               >
               </el-table-column>
             </el-table>
           </div>
         </el-form-item>
       </div>
       <div>
         <el-form-item>
           <div v-if="operationType ==='add'" style="color: #929292;">
             {{  $t('plan update tip') }}
           </div>
           <div style="float: right;padding-top: 24px">
             <el-button @click="dialog_form_visible = false" >{{ $t('cancel') }}</el-button>
             <el-button type="primary" @click="onSubmit('ruleForm')" :loading="save_loading">{{operationType === 'add' ? $t('create') : $t('update')}}</el-button>
           </div>
         </el-form-item>
       </div>
    </el-form>
    </el-dialog>
  </div>
</template>
<script>
import imgUpload from "../components/img-upload.vue";
import {addPlan, updatePlan, uploadFile} from "../../api/interface";
import CURRENCY_OPTIONS from "../../options/currency_options.json";
export default {
  data() {
    return {
      icon_file:null,
      currency_options: [],
      multiple_selection: [],// 选中的数据
      unable_modify: false, // 是否不可修改
      app_price_options:[],
      interval_option: "monthly",
      interval_option_map: {"monthly": {interval:"month", interval_count:1}, "every quarter": {interval_count:3, interval: "month"}, "every day": {interval_count:1, interval:"day"}},
      interval_options:[
        {"label":"monthly","value": "monthly"},
        {"label":"every 3 months","value": "every quarter"}
      ],
      plan: {
        plan_id: "",
        plan_code : "",
        plan_icon: null,
        plan_name: "",
        plan_desc: "",
      },
      LOCAL_NAMES: {
        usd: "US Dollar",
        cny:"Chinese Yuan",
        inr:"Indian Rupee"
      },
      is_multiple_currency_support: false,
      plan_type_obj: {
        type: 'recurring'
      },
      plan_trial_obj: {
        is_trial: false,
        trial_days: 0
      },
      main_price_obj: {
        price: 1.99,
        currency: 'usd',
        interval:"month",
        interval_count:1
      },
      other_price_obj: [],
      type_option: [
        {
          label: 'recurring',
          value: 'recurring'
        },
        {
          label: 'one time pay',
          value: 'one_time'
        }
      ],
      trial_days_option: [
        {
          value: 3
        },
        {
          value: 7
        },
        {
          value: 14
        }
      ],
      dialog_form_visible: false,
      save_loading:false
    }
  },
  components: {
    imgUpload
  },
  created() {
    if (this.$mode === this.MODECONFIG.SANDBOX.mode) {
      this.interval_options.push({label:"every day", value:"every day"});
    }
    this.app_price_options = this.OPTIONS.app_price_options;
    if (this.chosen_plan_data && this.chosen_plan_data.plan_id) {
      this.plan = JSON.parse(JSON.stringify(this.chosen_plan_data))
      this.plan_type_obj = this.plan.plan_type_obj;
      this.plan_trial_obj = this.plan.plan_trial_obj;
      this.main_price_obj = this.plan.main_price_obj;
      this.interval_option = this.getIntervalOption(this.main_price_obj.interval, this.main_price_obj.interval_count);
      this.other_price_obj = this.plan.other_price_obj;
    }
    this.dialog_form_visible = this.visible;
    this.priceChange(this.main_price_obj.price);
  },
  props: {
    operateSuccess: {
      type: Function,
      default: () => {}
    },
    operationType: {
      type: String,
      default: 'add'
    },
    chosen_plan_data: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    visibleChange : {
      type: Function,
      default: () => {}
    }
  },
  mounted() {
    this.$watch('plan_trial_obj.is_trial', this.handleIsTrialChange);
    this.unable_modify = this.operationType === 'add';
  },
  watch : {
    visible(newValue) {
      this.dialog_form_visible = newValue;
    },
    dialog_form_visible(newValue) {
      this.$emit('visibleChange', newValue);
      return newValue;
    },
    currency_options(newValue) {
      newValue.forEach((item) => {
        item.price_format = this.formatPrice(item.currency, item.amount);
        item.currency_format = this.formatCurrency(item.currency);
      })
    },
    operationType(newValue) {
      if(newValue === 'add') {
        this.plan = {
          plan_key: "",
          plan_code : "",
          plan_icon: null,
          plan_name: "",
          plan_desc: "",
        };
        this.plan_type_obj = {
          type: 'recurring'
        };
        this.plan_trial_obj = {
          is_trial: true,
          trial_days: 3
        };
        this.main_price_obj = {
          price: 1.99,
          currency: 'usd',
          interval: 'month',
          interval_count: 1
        };
        this.other_price_obj = [];
      }
      this.unable_modify = newValue !== 'add';
    },
    chosen_plan_data(newValue) {
      if (this.chosen_plan_data && this.chosen_plan_data.plan_id) {
        this.plan = JSON.parse(JSON.stringify(this.chosen_plan_data))
        this.plan_type_obj = this.plan.plan_type_obj;
        this.plan_trial_obj = this.plan.plan_trial_obj;
        this.main_price_obj = this.plan.main_price_obj;
        this.other_price_obj = this.plan.other_price_obj;
      }
      return newValue;
    }
  },
  methods: {
    getIntervalOption(interval, interval_count) {
      for (let interval_option_map_key in this.interval_option_map) {
        if (this.interval_option_map[interval_option_map_key].interval === interval && parseInt(this.interval_option_map[interval_option_map_key].interval_count) === parseInt(interval_count)) {
          return interval_option_map_key;
        }
      }
    },
    intervalOptionChange(new_value) {
      if (this.interval_option_map[new_value]) {
        this.main_price_obj.interval_count = this.interval_option_map[new_value].interval_count;
        this.main_price_obj.interval = this.interval_option_map[new_value].interval;
      }
    },
    handleIsTrialChange (newValue) {
        if (newValue) {
          this.plan_trial_obj.trial_days = 3;
        }
    },
    /**
     * 确保第一行的选中状态不被修改
     * @param row
     * @param index
     * @returns {boolean}
     */
    isSelectable(row, index) {
      return index !== 0;
    },
    formatPrice (currency, price) {
      let symbol = '';
      for (const currency_key in CURRENCY_OPTIONS) {
        if (currency_key.toLowerCase() === currency) {
          symbol = CURRENCY_OPTIONS[currency_key]['symbol'];
          return symbol + ' ' + price;
        }
      }
      return currency + ' ' + price;
    },
    /**
     * 获取价格选项和货币选项
     * @param currency
     */
    formatCurrency (currency) {
      if (currency && this.LOCAL_NAMES[currency.toLowerCase()]) {
        return `${this.LOCAL_NAMES[currency.toLowerCase()]} (${currency.toUpperCase()})`;
      }
    },
    /**
     * 选择price
     * @param value
     */
    priceChange(value){
      this.getPriceOptionAndCurrencyOption(value)
    },
    /**
     * 选择货币
     */
    setCurrencyOption() {
      this.is_multiple_currency_support = !this.is_multiple_currency_support;
      if (this.is_multiple_currency_support) {
        this.setSelectedCurrencyOption();
      }
    },
    /**
     * 选择货币
     */
    setSelectedCurrencyOption() {
      this.$nextTick(() => {
        for (let i = 0; i < this.currency_options.length; i++) {
          if (this.currency_options[i].selected) {
            this.$refs.multipleTable.toggleRowSelection(this.currency_options[i], true);
          }
        }
      });
    },
    /**
     *
     * @param value
     */
    getPriceOptionAndCurrencyOption (value) {
      let current_app_price_option = this.app_price_options.filter(item => item.amount === value);
      let multiple_selection = [];
      if (current_app_price_option && current_app_price_option.length > 0) {
        this.main_price_obj.currency = current_app_price_option[0].currency;
        this.main_price_obj.price =  current_app_price_option[0].amount;
        let currency_options = current_app_price_option[0].app_price_currency;
        if ( this.main_price_obj && Array.isArray(this.other_price_obj) && this.other_price_obj.length > 0) { //判断app_price
          // 对比currency_options和app_price_currency的currency和amount, 如果存在则设置为选中状态
          currency_options.forEach(item => {
            this.other_price_obj.forEach(item2 => {
              if (item.currency === item2.currency && item.amount === item2.price) {
                multiple_selection.push(item);
                item.selected = true;
              }
            });
          });
        } else {
          currency_options.forEach(item => {
            if (item.currency === current_app_price_option[0].currency && item.amount === current_app_price_option[0].amount) {
              multiple_selection.push(item);
              item.selected = true;
            }
          });
        }
        this.multiple_selection = multiple_selection;
        this.currency_options = currency_options;
        if (this.is_multiple_currency_support) {
          this.setSelectedCurrencyOption();
        }
      }
    },
    /**
     *
     * @param file
     */
    iconUpSourceChange(file) {
      this.icon_file = file;
    },
    /**
     * 新增套餐
     * @returns {Promise<void>}
     */
    async addPlanData () {
      let args = {
        name: this.plan.plan_name,
        desc: this.plan.plan_desc,
        is_trial: this.plan_trial_obj.is_trial ? 1 : 0,
        trial_days: this.plan_trial_obj.trial_days,
      }
      if (!args.desc) {
        delete args.desc;
      }
      // 确定用户设置了价格
      if (this.main_price_obj && this.main_price_obj.price) {
        let currency_options = [];
        // 将multiple_selection中的selected去掉，并且将multiple_selection中的currency和amount 与 main_price_obj中的currency和price进行对比，如果相同则去除
        this.multiple_selection.forEach(item => {
          if (item.currency !== this.main_price_obj.currency || item.amount !== this.main_price_obj.price) {
            currency_options.push({
              currency: item.currency,
              amount: item.amount
            });
          }
        });
        if (this.plan_type_obj && this.plan_type_obj.type === 'recurring') {
          args.app_price = [{
            amount: this.main_price_obj.price,
            currency: this.main_price_obj.currency,
            type: 'recurring',
            interval: this.main_price_obj.interval,
            interval_count: this.main_price_obj.interval_count,
            currency_options: currency_options
          }];
        } else {
          args.app_price = [{
            amount: this.main_price_obj.price,
            currency: this.main_price_obj.currency,
            type: 'one_time',
            currency_options: currency_options
          }];
        }
      }
      if (this.icon_file) {
        let icon = await this.getIconUrl('plan', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      this.save_loading = true;
      addPlan(args).then(res => {
        this.save_loading = false;
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: this.$t('create success'),
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        this.save_loading = false;
        this.$message({
          message: this.$t('create error'),
          type: 'error'
        });
      });
    },
    /**
     * 更新套餐
     * @returns {Promise<void>}
     */
    async updatePlanData () {
      // 比对chosen_plan_data和plan的icon, name, is_trial, trial_days, desc查看是否有修改,找出修改的数据
      let args = {};
      if (this.plan.plan_name !== this.chosen_plan_data.plan_name) {
        args.name = this.plan.plan_name;
      }
      if (this.plan.plan_desc !== this.chosen_plan_data.plan_desc) {
        args.desc = this.plan.plan_desc;
      }
      if (this.icon_file) {
        let icon = await this.getIconUrl('plan', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      // 试用是否有更改？
      if (this.plan_trial_obj && this.chosen_plan_data.plan_trial_obj ) {
        if (this.plan_trial_obj.is_trial !== this.chosen_plan_data.plan_trial_obj.is_trial) {
          args.is_trial = this.plan_trial_obj.is_trial ? 1 : 0;
        }
        // 试用天数是否有更改？
        if (this.plan_trial_obj.trial_days !== this.chosen_plan_data.plan_trial_obj.trial_days) {
          args.trial_days = this.plan_trial_obj.trial_days;
        }
      }
      let id = this.plan.plan_id;
      this.save_loading = true;
      updatePlan(id, args).then(res => {
        this.save_loading = false;
        if (res.data && parseInt(res.data.code)=== 100000) {
          this.$message({
            message: this.$t('update success'),
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        this.save_loading = false;
        this.$message({
          message: this.$t('update error'),
          type: 'error'
        });
      })
    },
    /**
     *
     * @param path
     * @param file
     * @returns {Promise<*>}
     */
    async getIconUrl(path, file) {
      let response = await uploadFile({path: path, icon: file})
      if (parseInt(response.data.code) === 100000) {
        return response.data.data.url;
      } else {
        this.$message({
          message: 'upload error',
          type: 'error'
        });
      }
    },
    /**
     * 提交
     */
    onSubmit(formName) {
      // submit
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operationType === 'add') {
           this.addPlanData();
          } else {
           this.updatePlanData();
          }
        } else {
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multiple_selection = val;
    },
    validateTrimmedField(rule, value, callback) {
      if (value && value.trim() === '') {
        callback(new Error(this.$t('Field cannot be empty')));
      } else {
        callback();
      }
    }
  },
  computed: {
    rules () {
      return {
        plan_name: [
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur', min: 1, max: 100 },
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        plan_desc: [
          { required: false,  trigger: 'blur', type: 'string', min: 0, max: 1000 },
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],

      }
    }
  }
}
</script>
<style scoped lang="less">
.p-main {
  border-radius: 4px 0 0 4px;
  color: rgba(16, 16, 16, 1);
  padding: 0 8px;
  line-height: 26px;
  height: 26px;
  text-align: left;
  border: 1px solid rgba(198, 198, 198, 1);
}
</style>