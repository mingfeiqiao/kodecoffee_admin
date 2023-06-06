<template>
  <div>
    <el-dialog :title="operationType === 'add' ? '添加套餐' : '更新套餐'" :visible.sync="dialogFormVisible"  width="50%" :modal-append-to-body="false">
     <el-form ref="form" :model="plan"  label-width="80px" label-position="top" size="mini">
       <div style="display:flex;align-items: center;justify-content: space-between;">
         <div style="min-width: 250px;">
           <el-form-item label="名称">
             <el-input v-model="plan.name"></el-input>
           </el-form-item>
           <el-form-item label="描述">
             <el-input type="textarea" v-model="plan.desc"></el-input>
           </el-form-item>
         </div>
         <div>
           <el-form-item label="图标">
             <img-upload :icon_url="plan.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
           </el-form-item>
         </div>
       </div>
       <div>
         <el-form-item>
           <div style="display: flex;align-items: center">
             <div style="padding-right: 20px">
               计费方式
             </div>
             <el-radio :disabled="unableModify" v-model="app_price.type" :label="option.value" v-for="option of type_option" :key="option.value">
               {{option.label}}
             </el-radio>
           </div>
         </el-form-item>
         <el-form-item v-if="app_price.type === 'recurring'">
           <div style="display: flex;align-items: center;padding-left: 80px">
             按月支付，每月循环
           </div>
         </el-form-item>
         <el-form-item>
           <el-switch :disabled="unableModify" v-model="plan.is_trial" inactive-text="免费试用">
           </el-switch>
         </el-form-item>
         <el-form-item v-if="plan.is_trial">
           <div style="display: flex;padding-left: 60px">
             <el-radio-group v-model="plan.trial_days">
               <el-radio v-for="item in trial_days_option" :key="item.index" :label="item.value">{{item.label}}</el-radio>
             </el-radio-group>
           </div>
         </el-form-item>
         <div v-if="operationType === 'add'">
           <el-form-item>
             <div style="display: flex;flex-direction: column">
               <div style="display: flex;flex-direction: row;">
                 <div>美金 $</div>
                 <el-select v-model="app_price.amount" placeholder="选择价格" @change="priceChange">
                   <el-option
                     v-for="item in app_price_options"
                     :key="item.index"
                     :label="item.amount"
                     :value="item.amount">
                     <span style="text-align: center">{{ item.amount }}</span>
                   </el-option>
                 </el-select>
               </div>
               <div>
                 价格中包含税
               </div>
             </div>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="setCurrencyOption">设置多币种</el-button>
             <span>我们根据各个不同主流国家地区的币种，制定了最合适的价格选择。</span><span>了解更多</span>
             <div v-if="is_multiple_currency_support">
               <el-table
                 ref="multipleTable"
                 :data="currency_options"
                 tooltip-effect="dark"
                 style="width: 100%"
                 @selection-change="handleSelectionChange">
                 <el-table-column
                   type="selection"
                   width="55">
                 </el-table-column>
                 <el-table-column
                   label="币种"
                   prop="currency"
                 >
                 </el-table-column>
                 <el-table-column
                   prop="amount"
                   label="价格"
                   width="120">
                 </el-table-column>
               </el-table>
             </div>
           </el-form-item>
         </div>
       </div>
       <div>
         <el-form-item>
           <div v-if="operationType ==='add'">
             价格、计费方式提交后无法修改
           </div>
           <div style="float: right">
             <el-button @click="dialogFormVisible = false" >取消</el-button>
             <el-button type="primary" @click="onSubmit">{{operationType === 'add' ? '创建' : '更新'}}</el-button>
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
import appPriceOptions from "../../options/app_price_options.json";

export default {
  data() {
    return {
      is_multiple_currency_support: false,
      app_price_options:appPriceOptions,
      icon_file:null,
      currency_options: [],
      multiple_selection: [],// 选中的数据
      unableModify: false, // 是否不可修改
      plan: {},
      type_option: [
        {
          label: '订阅 每月循环',
          value: 'recurring'
        },
        {
          label: '一次性付费',
          value: 'one_time'
        }
      ],
      trial_days_option: [
        {
          label: '3天',
          value: 3
        },
        {
          label: '7天',
          value: 7
        },
        {
          label: '14天',
          value: 14
        }
      ],
      app_price: {},
      dialogFormVisible: false,
    }
  },
  components: {
    imgUpload
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
    chosenPlanData: {
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
  watch : {
    visible(newValue) {
      this.dialogFormVisible = newValue;
    },
    dialogFormVisible(newValue) {
      console.log(newValue);
      this.$emit('visibleChange', newValue);
      return newValue;
    },
    chosenPlanData(newValue) {
      console.log('update:', newValue);
      if (newValue && newValue.app_price && newValue.app_price.length > 0) {
        newValue.is_trial = newValue.is_trial === 1;
        this.plan = JSON.parse(JSON.stringify(newValue));
      } else {
        this.plan = {};
      }
      console.log('plan' ,this.plan);
      if (newValue && newValue.app_price && newValue.app_price.length > 0) {
        this.app_price = newValue.app_price[0];
        this.is_multiple_currency_support = this.app_price.app_price_currency && this.app_price.app_price_currency.length > 0;
        this.getPriceOptionAndCurrencyOption(this.app_price.amount);
      }
      return newValue;
    },
    operationType(newValue) {
      this.unableModify = newValue !== 'add';
    }
  },
  methods: {
    /**
     * 选择price
     * @param value
     */
    priceChange(value){
      this.getPriceOptionAndCurrencyOption(value)
    },
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
            console.log('xxx', this.currency_options[i]);
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
        this.app_price.currency = current_app_price_option[0].currency;
        this.app_price.amount =  current_app_price_option[0].amount;
        // 货币
        let currency_options = current_app_price_option[0].app_price_currency;
        if (this.app_price && this.app_price.app_price_currency && this.app_price.app_price_currency.length > 0) { //判断app_price
          // 对比currency_options和app_price_currency的currency和amount, 如果存在则设置为选中状态
          currency_options.forEach(item => {
            this.app_price.app_price_currency.forEach(item2 => {
              if (item.currency === item2.currency && item.amount === item2.amount) {
                multiple_selection.push(item);
                item.selected = true;
              }
            });
          });
        } else {
          // 默认选中与当前的current_app_price_option的currency和amount相同的数据
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
        name: this.plan.name,
        desc: this.plan.desc,
        is_trial: this.plan.is_trial ? 1 : 0,
        trial_days: this.plan.trial_days,
      }
      let app_price = [];
      if (this.app_price && this.app_price.amount) { // 确定用户设置了价格
        // 循环multiple_selection, 去掉其中的selected键
        this.multiple_selection.forEach(item => {
          delete item.selected;
        });
        if (this.app_price.type === 'recurring') {
          app_price.push({
            amount: this.app_price.amount,
            currency: this.app_price.currency,
            type: this.app_price.type,
            interval: 'month',
            interval_count: 1,
            currency_options: this.multiple_selection // 一个是currency_options一个是app_price_currency
          });
        } else {
          app_price.push({
            amount: this.app_price.amount,
            currency: this.app_price.currency,
            type: this.app_price.type,
            currency_options: this.multiple_selection
          });
        }
      }
      args.app_price = app_price;
      if (this.icon_file) {
        let icon = await this.getIconUrl('plan', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      let vm = this;
      addPlan(args).then(res => {
        if (parseInt(res.data.code) === 100000) {
          vm.$message({
            message: '添加成功',
            type: 'success'
          });
          vm.dialogFormVisible = false;
          vm.$emit('operateSuccess');
        } else {
          vm.$message({
            message: '添加失败',
            type: 'error'
          });
        }
      }).catch(err => {
        vm.$message({
          message: '添加失败',
          type: 'error'
        });
      });
    },
    async updatePlanData () {
      // 比对chosenPlanData 和 plan 的 icon,name,is_trial,trial_days,desc查看是否有修改,找出修改的数据
      let args = {};
      console.log('xxx', this.plan);
      console.log('chosenPlanData', this.chosenPlanData);
      if (this.icon_file) {
        let icon = await this.getIconUrl('plan', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      if (this.plan.name !== this.chosenPlanData.name) {
        args.name = this.plan.name;
      }
      if (this.plan.is_trial !== this.chosenPlanData.is_trial) {
        args.is_trial = this.plan.is_trial ? 1 : 0;
      }
      if (this.plan.trial_days !== this.chosenPlanData.trial_days) {
        args.trial_days = this.plan.trial_days;
      }
      if (this.plan.desc !== this.chosenPlanData.desc) {
        args.desc = this.plan.desc;
      }
      let vm = this;
      let id = this.chosenPlanData.id;
      updatePlan(id, args).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        });
        vm.dialogFormVisible = false;
        vm.$emit('operateSuccess');
      }).catch(err => {
        vm.$message({
          message: '更新失败',
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
          message: '上传图片失败',
          type: 'error'
        });
      }
    },
    /**
     *
     */
    async onSubmit() {
      // submit
      if (this.operationType === 'add') {
        await this.addPlanData();
      } else {
        await this.updatePlanData();
      }
    },
    /**
     *
     * @returns {*}
     */
    getUSDPrice() {
      let a = this.plan.price.filter(item => {
        if (item.currency === 'USD') {
         return item;
        }
      });
      return a[0];
    },
    /**
     *
     */
    addPrice() {
      if (!this.plan.price) {
        this.$set(this.plan, 'price', []);
      }
      this.plan.price.push({
        currency: 'USD',
        price: 1
      })
    },
    /**
     *
     * @param index
     */
    removePrice(index) {
      this.$delete(this.plan.price, index);
    },

    handleSelectionChange(val) {
      this.multiple_selection = val;
      console.log('handleSelectionChange', val);
    },
  }
}
</script>
<style scoped lang="less">

</style>