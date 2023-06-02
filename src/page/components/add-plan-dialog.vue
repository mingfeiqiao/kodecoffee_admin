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
             <el-radio :disabled="unableModify" v-model="plan.type" :label="option.value" v-for="option of type_option" :key="option.value">
               {{option.label}}
             </el-radio>
           </div>
         </el-form-item>
         <el-form-item v-if="plan.type === 'recurring'">
           <div style="display: flex;align-items: center;padding-left: 60px">
             <div>每</div>
             <div>
               <el-input-number :disabled="unableModify" v-model="plan.interval_count" controls-position="right"></el-input-number>
               <el-select :disabled="unableModify" v-model="plan.interval" placeholder="请选择">
                 <el-option
                     v-for="item in interval_option"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                 </el-option>
               </el-select>
             </div>
           </div>
         </el-form-item>
         <el-form-item>
           <el-switch :disabled="unableModify" v-model="plan.is_trial" inactive-text="免费试用">
           </el-switch>
         </el-form-item>
         <el-form-item v-if="plan.is_trial">
           <div style="display: flex;padding-left: 60px">
             <div>试用天数</div>
             <div>
               <el-input-number :disabled="unableModify" v-model="plan.trial_days" controls-position="right"></el-input-number>
             </div>
           </div>
         </el-form-item>
         <el-form-item>
           <div>
             <div style="display: flex">
               <div style="width: 60px">价格:</div>
               <div style="display: flex;flex-direction: column">
                 <div style="display: flex" v-for="(price, index) of plan.price" :key="index">
                   <div>
                     <el-input :disabled="unableModify" v-model="price.price" placeholder="请输入价格"></el-input>
                   </div>
                   <div>
                     <el-select :disabled="unableModify" v-model="price.currency" placeholder="选择币种">
                       <el-option
                         v-for="item in currency_option" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                   </div>
                   <div style="padding-left: 5px;cursor: pointer">
                     <i class="el-icon-close" @click="removePrice(index)" v-if="!unableModify"></i>
                   </div>
                 </div>
               </div>
               <div style="padding-left: 40px">
                 <el-checkbox :disabled="unableModify" label="价格中含税" disabled checked></el-checkbox>
               </div>
             </div>
             <div style="padding-top: 24px">
            <span style="padding-left: 60px;cursor: pointer;color: #1684FC" @click="addPrice" v-if="!unableModify">
              + 添加币种和价格
            </span>
               <span style="padding-left: 20px;font-size: 12px;color: rgba(0,0,0,0.45)">
              多币种价格相当于针对不同国家地区IP自动切换
            </span>
             </div>
           </div>
         </el-form-item>
       </div>
       <div>
         <el-form-item>
           <div style="display: flex;justify-content: space-between;align-items: center">
             <div>
               价格、计费方式提交后无法修改
             </div>
             <div>
               <el-button type="primary" @click="onSubmit">立即创建/更新</el-button>
               <el-button @click="dialogFormVisible = false" >取消</el-button>
             </div>
           </div>
         </el-form-item>
       </div>
    </el-form>
    </el-dialog>
  </div>
</template>
<script>
import imgUpload from "../components/img-upload.vue";
import {addPlan, updatePlan} from "../../api/interface";

export default {
  data() {
    return {
      icon_file:null,
      unableModify: false,
      plan: {},
      currency_option:[
        {
          label: '人民币',
          value: 'CNY'
        },
        {
          label: '美元',
          value: 'USD'
        }
      ],
      type_option: [
        {
          label: '周期付费',
          value: 'recurring'
        },
        {
          label: '一次性付费',
          value: 'one_time'
        }
      ],
      interval_option: [
        {
          label: '月',
          value: 'month'
        }
      ],
      dialogFormVisible: false
    }
  },
  components: {
    imgUpload
  },
  props: {
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
      this.plan = newValue;
    },
    operationType(newValue) {
      this.unableModify = newValue !== 'add';
    }
  },
  methods: {
    iconUpSourceChange(file) {
      this.icon_file = file;
    },
    onSubmit() {
      // submit
      if (this.operationType === 'add') {
        console.log(this.plan);
        let app_price = [];
        let p1 = {
          type:this.plan.type,
          currency: 'USD',
          amount: 1.99,
          interval: 'month',
          interval_count: 1,
          currency_options:[
            {
              currency: 'USD',
              amount: 1.99
            },
            {
              currency: 'CNY',
              amount: 14.99
            }
          ]
        };
        app_price.push(p1);
        let args = {
          name: this.plan.name,
          desc: this.plan.desc,
          // icon: this.icon_file,
          is_trial: this.plan.is_trial,
          trial_days: this.plan.trial_days,
          app_price: app_price
        };
        console.log(args);
        addPlan(args).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.$emit('addPlan', res.data);
        }).catch(err => {
          this.$message({
            message: '添加失败',
            type: 'error'
          });
        })
      } else {
        updatePlan(this.plan).then(res => {
          this.$message({
            message: '更新成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.$emit('updatePlan', res.data);
        }).catch(err => {
          this.$message({
            message: '更新失败',
            type: 'error'
          });
        })
      }
    },
    addPrice() {
      if (!this.plan.price) {
        this.$set(this.plan, 'price', []);
      }
      this.plan.price.push({
        currency: 'USD',
        price: 1
      })
    },
    removePrice(index) {
      this.$delete(this.plan.price, index);
    }
  }
}
</script>
<style scoped lang="less">

</style>