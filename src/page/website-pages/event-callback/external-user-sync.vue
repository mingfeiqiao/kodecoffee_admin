<template>
  <div>
    <div>
      <div style="display: flex;margin:12px 0 12px 0;flex-direction: row-reverse;">
        <el-button type="primary" size="small" @click="showCreateSymDialog">{{ $t('create plan') }}</el-button>
      </div>
    </div>
    <div style="display: flex;align-items: center;flex-direction: column">
      <el-table v-loading="table_loading" :data="table_data" style="width: 100%"
                :empty-text="$t('no data')"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="client_name" :label="$t('name')" width="auto">
        </el-table-column>
        <el-table-column prop="symmetric_key" :label="$t('sym-key')" width="auto">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
                  <span>
                    {{scope.row.symmetric_key}}
                  </span>
              <span style="padding-left: 8px;display: flex;align-items: center;cursor: pointer"
                    @click="copy(scope.row.symmetric_key)" id="copy_text">
                      <svg width="16" height="16">
                        <use xlink:href="#copy"></use>
                      </svg>
                  </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">

      </div>
    </div>
    <div style="background-color: #FAFAFA;padding: 24px">
      <div>
        <div class="title-16">
          {{$t('User Sync')}}
        </div>
        <div>
          <div>
            <span>{{$t("1. When developers have their own user login and account system, user sync helps to synchronize Kodepay's user payment-related information to the developer's own account system, completing the binding process.")}}</span>
          </div>
          <div>
            <span>{{$t('2. Each plugin requires a unique key for validation. Before starting, please generate a key for the respective plugin. For more details, please refer to the ')}}</span><span class="link">{{$t('User Sync Documentation')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="show_add_dialog" v-if="show_add_dialog">
      <el-dialog
        :visible.sync="show_add_dialog"
        :show-close="false"
        width="50%"
      >
        <div style="padding: 16px 24px">
          <div class="title-16">
            {{ $t('Add Key') }}
          </div>
          <div style="padding: 24px">
            <div>
              <el-form :model="sym" ref="commission_form" label-suffix=":" :rules="rules" label-width="90px">
                <el-form-item :label="$t('extension')" prop="client_key">
                  <el-select style="max-width: 400px" size="small" v-model="sym.client_key"
                             :placeholder="$t('Select Plugin for Create Sym Key')" clearable filterable
                             v-loading="support_clients_loading">
                    <el-option
                      v-for="item in support_clients"
                      :key="item.client_key"
                      :label="item.name"
                      :disabled="item.disabled"
                      :value="item.client_key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div style="padding-top: 200px">
              <span> {{$t("Explanation: Each plugin requires a unique key for validation. By clicking 'Save,' we will automatically generate a key for the plugin. This key will be used for validation and synchronization in the future. For further details, please refer to the ")}}</span><span class="link">{{$t('User Sync Documentation')}}</span>
            </div>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button type="primary" @click="createSym('commission_form')" size="small" style="margin-left: 12px" :loading="save_loading">{{ $t('save') }}
            </el-button>
            <el-button @click="show_add_dialog = false" size="small">{{ $t('cancel') }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import {addSymmetricKeyApi, getSupportSymClientsApi, getSymmetricListApi} from "../../../api/interface";
export default {
  data() {
    return {
      sym: {},
      client_list: [],
      support_clients: [],
      support_clients_loading: false,
      show_add_dialog: false,
      table_loading: false,
      table_data: [],
      save_loading:false
    }
  },
  computed: {
    rules() {
      return {
        client_key: [
          {required: true, message: this.$t('please select extension'), trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.getSymList();
  },
  methods: {
    getSymList () {
      this.table_loading = true;
      getSymmetricListApi().then(res => {
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          this.table_data = res.data.data;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message);
          }
        }
        this.table_loading = false;
      }).catch(err => {
        this.table_loading = false;
        console.log(err)
      })
    },
    getSupportClients() {
      this.support_clients_loading = true;
      getSupportSymClientsApi().then(res => {
        if (res.data && res.data.code && res.data.code === 100000) {
          this.support_clients = this.formatExtensionList(res.data.data);
        }
        this.support_clients_loading = false;
      }).catch(err => {
        console.log(err)
        this.support_clients_loading = false;
      });
    },
    createSym(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save_loading = true;
          addSymmetricKeyApi(this.sym).then(res => {
            this.save_loading = false;
            if (res.data && parseInt(res.data.code) === 100000) {
              this.$message({
                message: this.$t('add success'),
                type: 'success'
              })
              this.show_add_dialog = false;
              this.getSymList();
            } else {
              if (res && res.data && res.data.message) {
                this.$message.warning(res.data.message)
              }
            }
          }).catch(err => {
            this.save_loading = false;
            this.$message({
              message:err,
              type:'error'
            })
          })
        }
      })
    },
    /**
     *
     * @param data
     * @returns {*}
     */
    formatExtensionList(data) {
      data.map(item => {
        item.disabled = !!item.sym_status;
      })
      return data;
    },
    showCreateSymDialog() {
      this.show_add_dialog = true;
      this.getSupportClients();
    },
    copy(text) {
      let clipboard = new Clipboard('#copy_text', {
        text: () => {
          return text;
        }
      })
      clipboard.on('success', e => {
        this.$message({
          message: this.$t('copy success'),
          type: 'success'
        })
        clipboard.destroy() // 释放内存
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: this.$t('browser not support copy'),
          type: 'warning'
        })
        clipboard.destroy()
      })
    },
  }
}
</script>
<style scoped lang="less">
.ko-mo /deep/ .el-dialog__header {
  padding: 0;
}

.ko-mo /deep/ .el-dialog__body {
  padding: 0;
}

.ko-mo /deep/ .el-tabs__header {
  margin: 0;
}
</style>
