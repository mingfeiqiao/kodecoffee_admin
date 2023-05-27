<template>
  <div>
    <el-dialog :title="operationType === 'add' ? '添加套餐' : '更新套餐'" :visible.sync="dialogFormVisible"  width="50%" :modal-append-to-body="false">
     <el-form ref="form" :model="plan" label-width="80px" label-position="top" size="mini">
       <div style="display:flex;align-items: center;justify-content: flex-start">
         <div style="min-width: 250px;">
           <el-form-item label="所属插件">
             <el-select v-model="plan.extensionId"  placeholder="请选择" :disabled="unableModify">
               <el-option v-for="item in pluginOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="名称">
             <el-input  v-model="plan.planName"></el-input>
           </el-form-item>
           <el-form-item label="描述">
             <el-input type="textarea" v-model="plan.planDescription"></el-input>
           </el-form-item>
         </div>
         <div style="padding-left: 150px">
           <div>图标</div>
           <img-upload @iconUpSourceChange="iconUpSourceChange"></img-upload>
         </div>
       </div>
       <div>
         <el-form-item>
           <div style="display: flex;align-items: center">
             <div style="padding-right: 20px">
               计费方式
             </div>
             <el-radio :disabled="unableModify" v-model="plan.payMode" :label="option.value" v-for="option of payModeOption" :key="option.value">{{option.label}}</el-radio>
           </div>
         </el-form-item>
         <el-form-item v-if="plan.payMode === 1">
           <div style="display: flex;align-items: center;padding-left: 60px">
             <div>每</div>
             <div>
               <el-input-number  :disabled="unableModify" v-model="plan.billingCycleNum" controls-position="right"></el-input-number>
               <el-select :disabled="unableModify" v-model="plan.billingCycle" placeholder="请选择">
                 <el-option
                     v-for="item in billingCycleOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                 </el-option>
               </el-select>
             </div>
           </div>
         </el-form-item>
         <el-form-item>
           <el-switch :disabled="unableModify" v-model="plan.isTrial" inactive-text="免费试用">
           </el-switch>
         </el-form-item>
         <el-form-item v-if="plan.isTrial">
           <div style="display: flex;padding-left: 60px">
             <div>试用天数</div>
             <div>
               <el-input-number :disabled="unableModify" v-model="plan.trialDays" controls-position="right"></el-input-number>
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
                       <el-option label="人民币" value="CNY"></el-option>
                       <el-option label="美元" value="USD"></el-option>
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
export default {
  data() {
    return {
      unableModify: false,
      plan: {},
      pluginOption:[
        {
          label: '插件1',
          value: 'adf23'
        },
        {
          label: '插件2',
          value: '13es'
        }
      ],
      payModeOption: [
        {
          label: '周期付费',
          value: 1
        },
        {
          label: '一次性付费',
          value: 2
        }
      ],
      billingCycleOptions: [
        {
          value: 1,
          label: '月'
        },
        {
          value: 2,
          label: '年'
        }
      ],
      dialogFormVisible: false
    }
  },
  components: {
    imgUpload
  },
  created() {
    this.plan = this.chosenPlanData;
  },
  props: {
    operationType: {
      type: String,
      default: 'add'
    },
    chosenPlanData: {
      type: Object,
      default: () => {
        return {
          extensionName: '',
          extensionId: '13es',
          planName: '',
          planIcon: null,
          planDescription: '',
          payMode: 1, // 计费方式 1 循环支付 2 一次性支付
          billingCycle: 1, // 循环周期 1 月 2 年
          billingCycleNum: 1, // 循环时间跨度数字 与 billingCycle 组合使用 1（）年 或者2月
          isTrial: true, // 是否试用
          trialDays: 1, // 试用天数
          price: [ // 价格
            {
              currency: 'USD',
              price: 1
            },
            {
              currency: 'CNY',
              price: 2
            }
          ]
        }
      }
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
      console.log(newValue);
      this.plan = newValue;
    },
    operationType(newValue) {
      this.unableModify = newValue !== 'add';
    }
  },
  methods: {
    iconUpSourceChange(file) {
      console.log('xxx');
      this.plan.planIcon = file;
    },
    onSubmit() {
      console.log('submit!');
    },
    addPrice() {
      this.plan.price.push({
        currency: 'USD',
        price: 1
      })
    },
    removePrice(index) {
      this.plan.price.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="less">

</style>