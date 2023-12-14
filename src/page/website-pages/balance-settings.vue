<template>
  <div class="container">
    <div class="border-bottom" >
      <div class="title-20">{{$t('balance')}}</div>
      <div style="padding: 24px 0;display: flex;justify-content: space-between;align-items: flex-end;">
        <div style="display: flex;align-items: center;justify-content: flex-start;">
          <div style="padding-right: 30px">
            <div>
              <span style="color:#929292;">{{$t('balance')}}</span>
              <span>
              <el-tooltip class="item" :content="$t('The balance refers to the amount remaining for developers after deducting fees, refunds, and dispute charges from their order revenue')" effect="light" placement="top">
                <i class="el-icon-info" style="color:#929292;"></i>
              </el-tooltip>
            </span>
            </div>
            <div class="title-28">{{balance.total_balance_format}}</div>
          </div>
          <div style="padding-right: 30px">
            <div>
              <span style="color:#929292;">{{$t('able to payout')}}</span>
              <span>
              <el-tooltip class="item" :content="$t('Payout amount refers to the balance that can be withdrawn after 14 days from the completion of the order')" effect="light" placement="top">
                <i class="el-icon-info" style="color:#929292;"></i>
              </el-tooltip>
            </span>
            </div>
            <div class="title-28">{{balance.withdrawable_format}}</div>
          </div>
        </div>
        <div style="display: flex;align-items: flex-end">
          <span style="color: #929292;padding-right: 12px;">{{$t('payout 30 days tip')}}</span>
          <el-button v-show="is_balance_settings_loaded" type="primary" size="small" @click="openWithdrawalDialog">{{$t('payout')}}</el-button>
        </div>
      </div>
    </div>
    <div class="border-bottom" style="padding-bottom: 24px">
      <div style="padding: 24px 0">
        <span class="title-16">{{$t('payout settings')}}</span>
        <span class="link" style="padding-left: 24px;" @click="openWithdrawalSettingsDialog">{{$t('edit payout settings')}}</span>
      </div>
      <div>
        <el-descriptions direction="vertical">
          <el-descriptions-item :label="$t('full name')">
            <span v-if="balance_settings.first_name && balance_settings.last_name">
              {{ balance_settings.first_name + balance_settings.last_name}}
            </span>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('country')">{{ getCountryFullName(balance_settings.country) }}</el-descriptions-item>
          <el-descriptions-item :label="$t('business type')">
            {{ $t(business_type_options[balance_settings.bussiness_type]) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('minimum threshold')">{{BALANCE_SETTING.minimum_withdrawal_amount}}</el-descriptions-item>
          <el-descriptions-item :label="$t('payout frequency')">{{$t(BALANCE_SETTING.withdrawal_period)}}</el-descriptions-item>
          <el-descriptions-item :label="$t('payout method')">
            <span v-if="balance_settings.withdraw_type === 'card'" style="display:flex;align-items: center">
              <svg style="width: 16px;height: 16px">
                <use xlink:href="#bank-card"></use>
              </svg>
              <span style="padding-left: 8px">{{formatCard(balance_settings.card_num)}}</span>
            </span>
            <span v-if="balance_settings.withdraw_type=== 'paypal'" style="display:flex;align-items: center">
              <svg style="width: 16px;height: 16px">
                <use xlink:href="#paypal"></use>
              </svg>
              <span style="padding-left: 8px">{{balance_settings.paypal_email}}</span>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="background-color: rgba(250, 250, 250, 1);padding: 8px 24px;">
        <div style="font-weight: bold">{{$t('payouts instructions')}}</div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;margin-top: 8px">
{{$t('payouts instructions content')}}
        </pre>
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div style="display: flex">
            <span style="color: #C6C6C6">{{ $t('more question') }}</span>
            <span class="link" @click="OpenCrispChat" style="display:flex;align-items: center;padding-left: 8px">
              <span style="display: flex">
                <svg style="width: 16px;height: 16px">
                  <use xlink:href="#chat-with-us"></use>
                </svg>
              </span>
              <span>
                {{$t('contact us')}}
              </span>
            </span>
          </div>
          <div style="display:flex;">
            <span>
              KodePay Power by
            </span>
            <span style="display: flex;align-items: center;padding-left: 12px">
              <img src="../../assets/zingfront.png" width="20" height="20" alt="zingfront">
              <span style="font-size: 12px;font-weight: bold;padding-left: 2px">
                ZingFront
              </span>
            </span>
            <span class="link" style="padding-left: 12px">
              {{$t('learn more')}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="title-16" style="padding: 24px 0">{{ $t('payout records') }}</div>
      <div>
        <el-table :data="table_data" style="width: 100%"
                  :empty-text="$t('no data')"
                  v-loading="table_loading"
                  :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"        >
          <el-table-column prop="amount_format" :label="$t('Amount')"></el-table-column>
          <el-table-column prop="payout_method_format" :label="$t('account')">
            <template slot-scope="scope" v-if="scope.row.withdraw_type">
              <span v-if="scope.row.withdraw_type === 'card'">
                {{$t('card')}} {{formatCard(scope.row.card_num)}}
              </span>
              <span v-if="scope.row.withdraw_type === 'paypal'">
                {{$t('paypal')}} {{scope.row.paypal_email}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('status')">
            <template slot-scope="scope" v-if="scope.row.status_obj">
              <span>{{ $t(scope.row.status_obj.message) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="apply_time" :label="$t('apply time')"></el-table-column>
          <el-table-column prop="remarks" :label="$t('remarks')">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'reject'">
                 {{$t(scope.row.comment_option)}}
              </span>
              <span v-if="scope.row.status ==='approved' ">
                {{`${formatTime(scope.row.updated_time)} ${$t('approved tip')}`}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
     <edit-withdrawal-settings-dialog :visible="show_withdrawal_settings_edit_dialog" :operationType="has_balance_settings ? 'update' : 'add'" @visibleChange="visibleChange" @operateSuccess="operateSuccess" :balance_settings="balance_settings"></edit-withdrawal-settings-dialog>
    <div v-if="show_withdrawal_dialog">
      <el-dialog  :visible.sync="show_withdrawal_dialog" :show-close="false">
        <div style="padding: 16px 24px">
          <div class="title-16" style="padding-bottom: 16px;border-bottom: 1px solid rgba(232, 232, 232, 1)">{{$t('apply payout')}}</div>
          <div style="display:flex;justify-content: center;align-items: center;padding-top:24px;">
           <div style="width: 80%;background-color: rgba(230, 247, 255, 1);border-radius: 5px;padding: 12px 12px;text-align: left;display: flex;align-items: center">
              <i class="el-icon-warning" style="color: #1990FF"></i>
              <div style="padding-left: 8px">
                {{ $t('apply payout tip') }}
              </div>
           </div>
         </div>
          <div class="custom-descriptions-container" style="display: flex;align-items: center;justify-content: center">
            <el-descriptions border :column="1"  class="custom-descriptions">
              <el-descriptions-item :label="$t('payout amount')">
                <template slot="label">
                  <span style="color:#929292;">{{$t('payout amount')}}</span>
                  <span>
                    <el-tooltip class="item" :content="$t('The payout amount is rounded up for ease of calculation and financial processing. The remaining amount will be accumulated in subsequent withdrawals')" effect="light" placement="top"><i class="el-icon-info" style="color:#929292;"></i></el-tooltip>
                  </span>
                </template>
                <div class="withdraw-width">
                  <span class="title-20"> {{balance.withdrawable_round_down_format}} </span>
                  <span style="color: #929292;">{{ $t('available') +' '+ balance.withdrawable_format}} </span>
                </div>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('payout method')">
                <div class="withdraw-width">
                  {{$t(business_type_options[balance_settings.bussiness_type])}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item v-if="balance_settings.withdraw_type === 'card'" :label="$t('payout account number')" >
                <div class="withdraw-width">
                  {{balance_settings.card_num}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item v-if="balance_settings.withdraw_type === 'card'" :label="$t('account opening bank')">
                  <div class="withdraw-width">
                    {{balance_settings.bank_name}}
                  </div>
                </el-descriptions-item>
              <el-descriptions-item v-if="balance_settings.withdraw_type === 'card'" :label="$t('account holder name')">
                  <div class="withdraw-width">
                    {{balance_settings.bank_account_hold_name}}
                  </div>
                </el-descriptions-item>
              <el-descriptions-item :label="$t('transfer currency')" v-if="balance_settings.currency!=='usd'">
                  <div class="withdraw-width">
                    <div v-if="CURRENCY_OPTIONS[balance_settings.currency]" style="width: 70px">
                      {{CURRENCY_OPTIONS[balance_settings.currency][$i18n.locale]}}
                    </div>
                    <div style="min-width: 100px;max-width: 170px">
                      {{ rateChange('usd', balance_settings.currency, Math.floor(balance.withdraw_amount))}}
                    </div>
                    <div style="padding-left: 12px;color: #929292;width: calc(100% - 140px)">
                      {{$t('calculate by rate')}}
                    </div>
                  </div>
                </el-descriptions-item>
              <el-descriptions-item  v-if="balance_settings.withdraw_type === 'paypal'" :label="$t('paypal email')">
                <div class="withdraw-width">
                  {{balance_settings.paypal_email}}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button @click="show_withdrawal_dialog = !show_withdrawal_dialog" size="small" style="margin-left: 12px">{{ $t('cancel') }}</el-button>
            <el-button type="primary"  @click="createWithdraw" size="small">{{$t('create')}}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import EditWithdrawalSettingsDialog from '../components/edit-withdrawal-settings-dialog.vue'
import CURRENCY_OPTIONS from "../../options/currency_options.json";
import Countries from '../../options/countries.json';
import {timestampToDateString} from "../../utils/dateUtils";
import {accountWithdrawInfoApi, searchWithdrawAmountApi, withdrawRateApi, accountWithdrawInfoListApi, applyWithdrawApi, checkWithdrawApi} from "../../api/interface";
import {OpenCrispChat} from "../../configs/common";
export default {
  components: {
    EditWithdrawalSettingsDialog
  },
  data () {
    return {
      CURRENCY_OPTIONS:CURRENCY_OPTIONS,
      balance: {
        total_balance_format: '',
        withdrawable_format: '',
        currency: 'usd',
      },
      business_type_options: {
        personal: 'individual/sole proprietorship',
        company: 'corporation',
      },
      balance_settings: {},
      has_balance_settings: false,
      is_balance_settings_loaded:false,
      rate:"",
      BALANCE_SETTING: {
        minimum_withdrawal_amount: 'US$ 100',
        withdrawal_period: 'payout 30 days tip',
      },
      table_loading: false,
      show_withdrawal_dialog: false,
      show_withdrawal_settings_edit_dialog : false,
      table_data: [],
      WITHDRAW_STATUS_OPTIONS: {
        approved:{
          message:"approved",
          color:"#389E0D"
        },
        pending:{
          message:"pending",
          color:"#101010"
        },
        reject:{
          message:"reject",
          color:"#E14040"
        },
      }
    }
  },
  created() {
    this.initData();
  },
  methods: {
    createWithdraw () {
      let args = {
        withdraw_type: this.balance_settings.withdraw_type,
        settle_currency: this.balance.currency,
        settle_amount: this.balance.left_amount,
        real_settle_amount:Math.floor(this.balance.withdraw_amount),
        paypal_email: this.balance_settings.paypal_email,
        card_num: this.balance_settings.card_num,
        bank_name: this.balance_settings.bank_name,
        bank_account_hold_name: this.balance_settings.bank_account_hold_name,
        withdraw_currency: this.balance_settings.currency,
        withdraw_amount: Math.floor(this.balance.withdraw_amount),
      };
      applyWithdrawApi(args).then(res => {
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: this.$t('success'),
            type: 'success'
          });
          this.show_withdrawal_dialog = false;
          this.initData();
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * 打开提现设置编辑弹窗
     */
    initData () {
      this.getRealAmount();
      this.getAccountWithdrawInfo();
      this.getWithdrawList();
    },
    /**
     * 获取国家的全称
     * @param country
     * @returns {*|string}
     */
    getCountryFullName (country) {
      if (!country) {
        return '';
      }
      for (let countriesKey in Countries) {
        if (Countries[countriesKey].short_name.toLowerCase() === country.toLowerCase()) {
          return Countries[countriesKey][this.$i18n.locale];
        }
      }
    },
    /**
     * 获取账户提现信息
     */
    getWithdrawList() {
      this.table_loading = true;
      accountWithdrawInfoListApi().then(res => {
        this.table_loading = false;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code )=== 100000) {
          this.table_data = this.formatWithdrawList(res.data.data);
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        this.table_loading = false;
        console.log(err);
      });
    },
    /**
     * 获取账户余额和可提现余额
     */
    getRealAmount () {
      searchWithdrawAmountApi().then(res => {
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code )=== 100000) {
          this.formatBalance(res.data.data);
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * 获取提现设置
     */
    getAccountWithdrawInfo () {
      accountWithdrawInfoApi().then(res => {
        this.is_balance_settings_loaded = true;
        if (!res.data) {
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          this.has_balance_settings = JSON.stringify(res.data.data) !== '{}';
          this.balance_settings = res.data.data;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      })
    },
    /**
     * 格式化balance
     * @param data
     */
    formatBalance (data) {
      if (!data) {
        return;
      }
      data.total_balance_format = this.formatPrice(data.currency, data.left_amount || 0);
      data.withdrawable_format = this.formatPrice(data.currency, data.withdraw_amount || 0);
      data.withdrawable_round_down_format = this.formatPrice(data.currency, Math.floor(data.withdraw_amount) || 0)
      this.balance = data;
    },
    /**
     * 格式化提现列表
     * @param data
     * @returns {*|*[]}
     */
    formatWithdrawList (data) {
      if (Array.isArray(data) && data.length > 0) {
        data.map(item => {
          item.amount_format = this.formatPrice(item.settle_currency, item.real_settle_amount);
          item.status_obj = this.WITHDRAW_STATUS_OPTIONS[item.status] || {};
          item.apply_time = this.formatTime(item.created_time);
          return item;
        });
        return data;
      }
      return [];
    },
    rateChange (from_currency, to_currency, amount) {
      if (from_currency === to_currency) {
        return this.formatPrice(to_currency, amount);
      } else {
        // 保留两位小数
        return this.formatPrice(to_currency, (amount * this.rate).toFixed(2));
      }
    },
    /**
     * 格式化银行卡号
     * @param card_number
     * @returns {string}
     */
    formatCard (card_number) {
      // 截取后四位，其他用*代替
      if (card_number) {
        return `**** **** **** ${card_number.slice(-4)}`;
      }
      return "";
    },
    /**
     * 格式化时间
     * @param time
     * @returns {string}
     */
    formatTime (time) {
      if (time) {
        return timestampToDateString(time, 'yyyy-MM-dd HH:II:SS');
      }
      return "-";
    },
    /**
     * 格式化货币
     * @param currency
     * @param price
     * @returns {string}
     */
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
     * 获取汇率
     * @param from_currency
     * @param to_currency
     * @returns {Promise<*>}
     */
    async getRate(from_currency, to_currency) {
      let args = {
        origin_currency: from_currency,
        to_currency: to_currency,
      };
      let response = await withdrawRateApi(args);
      if (parseInt(response.data.code) === 100000) {
        return response.data.data.exchange_rate;
      } else {
        if (response && response.data && response.data.message) {
          this.$message.warning(response.data.message)
        }
      }
    },
    /**
     * 打开提现弹窗
     */
    openWithdrawalDialog () {
      // 先获取汇率
      if (!this.show_withdrawal_dialog) {
        // 检查是否能够提现
        checkWithdrawApi().then(res => {
          if (!res.data) {
            return;
          }
          if (parseInt(res.data.code) === 100000) {
            if (this.balance_settings.currency === 'usd') {
              this.rate = 1;
              this.show_withdrawal_dialog = !this.show_withdrawal_dialog;
            } else {
              this.rate = this.getRate('usd', this.balance_settings.currency).then(
                rate => {
                  this.rate = rate;
                  this.show_withdrawal_dialog = !this.show_withdrawal_dialog;
                }
              );
            }
          } else { // 不能提现
            let is_withdrawal_information_missing = false;
            if (parseInt(res.data.code) === 120003) {
              is_withdrawal_information_missing = true;
            }
            this.$alert(res.data.message, res.data.title, {
              confirmButtonText: this.$t('OK')
            }).then(() => {
              if (is_withdrawal_information_missing) {
                this.show_withdrawal_settings_edit_dialog = true;
              }
            }).catch(() => {
              console.log('close');
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }
    },
    /**
     * 打开提现设置弹窗
     */
    openWithdrawalSettingsDialog () {
      this.show_withdrawal_settings_edit_dialog = !this.show_withdrawal_settings_edit_dialog;
    },
    visibleChange (visible) {
      this.show_withdrawal_settings_edit_dialog = visible;
    },
    operateSuccess () {
      this.show_withdrawal_settings_edit_dialog = false;
      this.getAccountWithdrawInfo();
    }
  },
}
</script>
<style scoped lang="less">
.container {
}
.border-bottom {
  border-bottom: 1px solid #ebeef5;
}
.custom-descriptions-container /deep/ .el-descriptions-item__label {
  min-width: 100px;
  padding: 12px;
  color: #929292;
}
.container /deep/ .el-descriptions-item__label {
  color: #929292;
}
.custom-descriptions-container {
  padding: 24px 0;
}
.container /deep/.el-dialog__header {
  padding: 0;
}
.container /deep/ .el-dialog__body {
  padding: 0;
}
.more-question {
  color: val(--color-text-secondary)
}
.withdraw-width {
  display: flex;
  justify-content: space-between;
  width: 300px;
  align-items: center;
}
pre {
  font-family: inherit;
}
</style>