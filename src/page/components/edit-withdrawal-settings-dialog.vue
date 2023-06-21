<template>
  <div class="ko-mo">
    <el-dialog :modal-append-to-body="false" v-if="dialog_form_visible" :visible.sync="dialog_form_visible" width="50%" :show-close="false">
      <div style="padding: 16px 24px">
        <div class="title-16" style="padding-bottom: 16px;border-bottom: 1px solid rgba(232, 232, 232, 1)">提现信息编辑</div>
        <div style="padding: 24px 0">
          <el-form label-position="left" label-width="150px" label-suffix=":">
            <div style="border-bottom: 1px solid rgba(232, 232, 232, 1);padding-bottom: 24px;">
              <el-form-item label="姓名">
                <div style="display: flex;">
                  <span style="max-width: 150px">
                    <el-input v-model="withdrawal_settings.first_name" placeholder="First Name" size="small">
                    </el-input>
                  </span>
                  <span style="max-width: 150px;margin-left: 24px">
                    <el-input v-model="withdrawal_settings.last_name" placeholder="Last Name" size="small">
                    </el-input>
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="国家地区">
                <el-select v-model="withdrawal_settings.country" placeholder="请选择" size="small" filterable style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in Countries"
                    :key="key"
                    :label="value[$i18n.locale]"
                    :value="value.short_name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业务类型">
                <el-select v-model="withdrawal_settings.business_type" placeholder="请选择" size="small" filterable style="max-width: 100px" >
                  <el-option
                    v-for="item in business_type_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="withdrawal_settings.vat_number" placeholder="增值税号" size="small" style="max-width: 150px">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex;">
                  <span style="max-width: 200px">
                    <el-input v-model="withdrawal_settings.street_address" placeholder="街区地址" size="small">
                    </el-input>
                  </span>
                  <span style="max-width: 150px;margin-left: 24px">
                    <el-input v-model="withdrawal_settings.city" placeholder="城市" size="small">
                    </el-input>
                  </span>
                </div>
              </el-form-item>
              <el-form-item>
                <el-input v-model="withdrawal_settings.postal_code" placeholder="邮编" size="small" style="max-width: 150px">
                </el-input>
              </el-form-item>
            </div>
            <div style="border-bottom: 1px solid rgba(232, 232, 232, 1);padding: 24px 0;">
              <el-form-item label="提现货币">
                <el-select v-model="withdrawal_settings.currency" placeholder="请选择" size="small" style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in Currency"
                    :key="key"
                    :label="value[$i18n.locale]"
                    :value="key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提现方式">
                <el-select v-model="withdrawal_settings.withdrawal_method" placeholder="请选择" size="small" style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in withdrawal_method_options"
                    :key="key"
                    :label="$t(value.label)"
                    :value="value.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="withdrawal_settings.withdrawal_method === 'bank'">
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_name" placeholder="银行名称" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_address" placeholder="开户行地址" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.account_holder_name" placeholder="账户持有人姓名" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_card_number" placeholder="银行卡号" size="small">
                  </el-input>
                </el-form-item>
              </div>
              <div v-else-if="withdrawal_settings.withdrawal_method === 'paypal'">
                <el-form-item label="paypal email">
                  <el-input v-model="withdrawal_settings.bank_card_number" placeholder="银行卡号" size="small">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div style="display: flex;flex-direction: row-reverse;align-items: center;">
          <el-button @click="dialog_form_visible = false" size="small" style="margin-left: 12px">{{ $t('cancel') }}</el-button>
          <el-button type="primary"  size="small">{{$t('update')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import Countries from '../../options/countries.json'
import Currency from '../../options/currency_options.json'
export default {
  data () {
    return {
      Countries: Countries,
      Currency:Currency,
      dialog_form_visible: false,
      withdrawal_settings: {
      },
      business_type_options:[
        {
          label: '个人',
          value: 'personal'
        },
        {
          label: '公司',
          value: 'company'
        }
      ],
      withdrawal_method_options: [
        {
          label: 'bank',
          value: 'bank'
        },
        {
          label: 'Paypal',
          value: 'paypal'
        }
      ]
    }
  },
  components : {
  },
  watch : {
    visible(newValue) {
      this.dialog_form_visible = newValue;
    },
    dialog_form_visible(newValue) {
      this.$emit('visibleChange', newValue);
      return newValue;
    }
  },
  created() {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    visibleChange : {
      type: Function,
      default: () => {
      }
    },
    operateSuccess : {
      type: Function,
      default: () => {
      }
    }
  },
  methods : {
  }
}
</script>
<style scoped lang="less">
.ko-mo /deep/.el-dialog__header {
  padding: 0;
}
.ko-mo /deep/ .el-dialog__body {
  padding: 0;
}
</style>