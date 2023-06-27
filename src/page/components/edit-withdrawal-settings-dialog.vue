<template>
  <div class="ko-mo">
    <el-dialog :modal-append-to-body="false" v-if="dialog_form_visible" :visible.sync="dialog_form_visible" width="50%" :show-close="false">
      <div style="padding: 16px 24px">
        <div class="title-16" style="padding-bottom: 16px;border-bottom: 1px solid rgba(232, 232, 232, 1)">{{$t('payout settings')}}</div>
        <div style="padding: 24px 0">
          <el-form label-position="left" label-width="150px" label-suffix=":">
            <div style="border-bottom: 1px solid rgba(232, 232, 232, 1);padding-bottom: 24px;">
              <el-form-item :label="$t('your name')">
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
                <div class="tip">{{$t('your name tip')}}</div>
              </el-form-item>
              <el-form-item :label="$t('country area')">
                <el-select v-model="withdrawal_settings.country" :placeholder="$t('select placeholder')" size="small" filterable style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in Countries"
                    :key="key"
                    :label="value[$i18n.locale]"
                    :value="value.short_name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('business type')">
                <el-select v-model="withdrawal_settings.bussiness_type" :placeholder="$t('select placeholder')" size="small" filterable style="max-width: 100px" >
                  <el-option
                    v-for="item in business_type_options"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="withdrawal_settings.tax_number" :placeholder="$t('vat number')" size="small" style="max-width: 150px">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex;">
                  <span style="max-width: 200px">
                    <el-input v-model="withdrawal_settings.address" :placeholder="$t('street')" size="small">
                    </el-input>
                  </span>
                  <span style="max-width: 150px;margin-left: 24px">
                    <el-input v-model="withdrawal_settings.city" :placeholder="$t('city')" size="small">
                    </el-input>
                  </span>
                </div>
              </el-form-item>
              <el-form-item>
                <el-input v-model="withdrawal_settings.post_code" :placeholder="$t('post code')" size="small" style="max-width: 150px">
                </el-input>
              </el-form-item>
            </div>
            <div style="border-bottom: 1px solid rgba(232, 232, 232, 1);padding: 24px 0;">
              <el-form-item :label="$t('transfer currency')">
                <el-select v-model="withdrawal_settings.currency" :placeholder="$t('select placeholder')" size="small" style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in Currency"
                    :key="key"
                    :label="value[$i18n.locale]"
                    :value="key">
                  </el-option>
                </el-select>
                <div class="tip">
                  {{$t('transfer currency tip')}}
                </div>
              </el-form-item>
              <el-form-item :label="$t('payout method')">
                <el-select v-model="withdrawal_settings.withdraw_type" :placeholder="$t('select placeholder')" size="small" style="max-width: 100px" >
                  <el-option
                    v-for="(value, key) in withdrawal_method_options"
                    :key="key"
                    :label="$t(value.label)"
                    :value="value.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="withdrawal_settings.withdraw_type === 'card'">
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_name" :placeholder="$t('bank name')" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_address" :placeholder="$t('bank address')" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.bank_account_hold_name" :placeholder="$t('account holder name')" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="withdrawal_settings.card_num" :placeholder="$t('card number')" size="small">
                  </el-input>
                </el-form-item>
              </div>
              <div v-else-if="withdrawal_settings.withdraw_type === 'paypal'">
                <el-form-item label="paypal email">
                  <el-input v-model="withdrawal_settings.paypal_email" :placeholder="$t('paypal email')" size="small">
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div style="display: flex;flex-direction: row-reverse;align-items: center;">
          <el-button type="primary" @click="submit" size="small" style="margin-left: 12px">{{$t('save')}}</el-button>
          <el-button @click="dialog_form_visible = false" size="small" >{{ $t('cancel') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import Countries from '../../options/countries.json'
import Currency from '../../options/currency_options.json'
import {addWithdrawInfoApi, updateWithdrawInfoApi} from '../../api/interface'
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
          label: 'individual/sole proprietorship',
          value: 'personal'
        },
        {
          label: 'corporation',
          value: 'company'
        }
      ],
      withdrawal_method_options: [
        {
          label: 'bank',
          value: 'card'
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
    },
    balance_settings(newValue) {
      this.withdrawal_settings = JSON.parse(JSON.stringify(newValue));
      return newValue;
    }
  },
  created() {
    this.withdrawal_settings = JSON.parse(JSON.stringify(this.balance_settings));
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
    },
    operationType: {
      type: String,
      default: 'add'
    },
    balance_settings: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods : {
    async submit() {
      if (this.operationType === 'add') {
        addWithdrawInfoApi(this.withdrawal_settings).then((response) => {
          if (response.data && parseInt(response.data.code) === 100000) {
            this.$message({
              message: this.$t('create success'),
              type: 'success'
            });
            this.dialog_form_visible = false;
            this.$emit('operateSuccess');
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).catch((error) => {
          this.$message({
            message: error.message,
            type: 'error'
          });
        });
      } else {
        // 比较this.withdrawal_settings 和 this.balance_settings, 不同的作为请求参数传递
        let args = {};
        for (let key in this.withdrawal_settings) {
          if (this.withdrawal_settings[key] !== this.balance_settings[key]) {
            args[key] = this.withdrawal_settings[key];
          }
        }
        updateWithdrawInfoApi(this.withdrawal_settings).then((response) => {
          if (response.data && parseInt(response.data.code) === 100000) {
            this.$message({
              message: this.$t('update success'),
              type: 'success'
            });
            this.dialog_form_visible = false;
            this.$emit('operateSuccess');
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).catch((error) => {
          this.$message({
            message: error.message,
            type: 'error'
          });
        });
      }
    }
  },
}
</script>
<style scoped lang="less">
.ko-mo /deep/.el-dialog__header {
  padding: 0;
}
.ko-mo /deep/ .el-dialog__body {
  padding: 0;
}
.tip {
  color: #929292;
  font-size: 12px;
  display: flex;
  height: 20px;
  align-items: center;
}
</style>