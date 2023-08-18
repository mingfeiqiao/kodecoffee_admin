<template>
  <div class="ko-mo">
    <div>
      <div style="display: flex;margin:12px 0 12px 0;flex-direction: row-reverse;">
        <el-button type="primary" size="small" @click="openAddWebHookEventDialog" v-if="!web_hook_event_table_loading"> {{ $t('Add EndPoint') }}</el-button>
      </div>
    </div>
    <div style="display: flex;align-items: center;flex-direction: column">
      <el-table v-loading="web_hook_event_table_loading" :data="web_hook_table_data" style="width: 100%"
                :empty-text="$t('no data')"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="endpoint" :label="$t('Endpoint URL')" width="auto">
        </el-table-column>
        <el-table-column prop="created_time_format" :label="$t('create time')" width="auto">
        </el-table-column>
        <el-table-column :label="$t('Operation')" width="100" align="center">
          <template slot-scope="scope">
            <span class="link" @click="openWebHookDetailDialog(scope.row)">{{ $t('detail') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add-web-hook-dialog" v-if="show_add_webhook_config">
      <el-dialog
        :visible.sync="show_add_webhook_config"
        :show-close="false"
        width="50%"
      >
        <div style="padding: 16px 24px">
          <div class="title-16">
            {{ $t('Create Event') }}
          </div>
          <div style="padding-top: 24px">
            <el-form :model="web_hook_event_data" ref="add_web_hook_event_form" label-suffix=":" :rules="rules"
                     label-width="125px">
              <el-form-item :label="$t('Endpoint URL')" prop="endpoint">
                <el-input v-model="web_hook_event_data.endpoint"
                          placeholder="https://example.com/webhooks"></el-input>
              </el-form-item>
              <el-form-item :label="$t('event')">
                <el-checkbox-group v-model="web_hook_event_data.event_types" v-loading="event_types_loading">
                  <el-checkbox v-for="(item, key) in event_types" :key="key" :label="item.value">{{ $i18n.locale  === 'en-US' ? item.value : item.label }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button type="primary" size="small" style="margin-left: 12px" @click="addWebHookEvent">{{ $t('save') }}</el-button>
            <el-button size="small" @click="show_add_webhook_config = false">{{ $t('cancel') }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="webhook-detail-dialog" v-if="show_webhook_detail_dialog">
      <el-dialog
        :visible.sync="show_webhook_detail_dialog"
        width="50%"
      >
        <div style="padding: 16px 24px;border-bottom: 1px solid rgba(232, 232, 232, 1)">
          <div class="title-16">{{ $t('Event Details') }}</div>
        </div>
        <div style="padding: 16px 24px">
          <div style="padding-bottom: 100px">
            <el-descriptions>
              <el-descriptions-item :label="$t('Endpoint URL')" :span="12">
                {{chosen_web_hook_event_data.endpoint}}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Event')" :span="12" v-loading="event_types_loading">
                {{getEventNames(chosen_web_hook_event_data.event_types)}}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Signature Key')" :span="12">
                <div style="display: flex;align-items: center">
                  <span>{{chosen_web_hook_event_data.webhook_id}}</span>
                  <span style="padding-left: 8px;display: flex;align-items: center;cursor: pointer"
                        @click="copy(chosen_web_hook_event_data.webhook_id)" id="copy_text">
                    <svg width="16" height="16">
                      <use xlink:href="#copy"></use>
                    </svg>
                  </span>
                </div>

              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {addWebHookEventApi, getWebHookEventTypesApi, getWebHookEventListApi} from "../../../api/interface";
import {timestampToDateString} from "../../../utils/dateUtils";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      WEB_HOOK_EVENT_LIMIT: 5,
      chosen_web_hook_event_data: {},
      web_hook_event_table_loading: false,
      event_types_loading: false,
      show_add_webhook_config: false,
      show_webhook_detail_dialog: false,
      web_hook_table_data: [],
      web_hook_event_data: {
        endpoint:'',
        event_types: []
      },
      event_types: [], // event 列表
    }
  },
  computed: {
    rules () {
      return {
        endpoint:[
          { required: true, message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        event_types:[
          { required: true, validator: this.validateArrayData, trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getWebHookEventsList();
    this.getWebHookEventTypes();
  },
  methods: {
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

    /**
     * 验证数组不为空
     * @param rule
     * @param value
     * @param callback
     */
    validateArrayData(rule, value, callback) {
      if (value.length === 0) {
        callback(new Error(this.$t('Field cannot be empty')));
      } else {
        callback();
      }
    },
    /**
     *
     * @param rule
     * @param value
     * @param callback
     */
    validateTrimmedField(rule, value, callback) {
      if (value && value.trim() === '') {
        callback(new Error(this.$t('Field cannot be empty')));
      } else {
        callback();
      }
    },
    openWebHookDetailDialog(row) {
      this.chosen_web_hook_event_data = row;
      this.show_webhook_detail_dialog = true;
    },
    /**
     * 打开新增事件窗口
     */
    openAddWebHookEventDialog() {
      if (this.web_hook_table_data.length >= this.WEB_HOOK_EVENT_LIMIT) {
        this.$message.warning(this.$t('Up to endpoint URLs', {number: this.WEB_HOOK_EVENT_LIMIT}));
      } else {
        this.show_add_webhook_config = true;
      }
    },
    /**
     * 查询出所有的web hook 事件的类型
     */
    getWebHookEventTypes() {
      this.event_types_loading = true;
      this.event_types = [];
      getWebHookEventTypesApi().then(res => {
        if (parseInt(res.data.code)=== 100000) {
          this.event_types = res.data.data.event_types;
        }
        this.event_types_loading = false;
      }).catch(err => {
        console.log(err);
        this.event_types_loading = false;
      })
    },
    /**
     * 获取事件名称
     * @param event_types
     * @returns {string}
     */
    getEventNames (event_types) {
      // 获取所有的event_types 的中英文
      let event_names = [];
      this.event_types.forEach(item => {
        if (event_types.includes(item.value)) {
          event_names.push( this.$i18n.locale === 'en-US' ? item.value : item.label)
        }
      })
      return event_names.join(',')
    },
    /**
     * 获取新增事件的参数
     * @param endpoint
     * @param event_types
     * @returns {{endpoint, event_type: string}|{endpoint, event_type: string, event_types}}
     */
    getAddEventArgs (endpoint, event_types) {
      // 判断是不是全选
      if (event_types.length === this.event_types.length) {
        return {
          endpoint:endpoint,
          event_type: 'all'
        }
      } else {
        return {
          endpoint: endpoint,
          event_type: 'include',
          event_types:event_types
        }
      }
    },
    /**
     * 新增一个回调事件地址
     */
    addWebHookEvent() {
      addWebHookEventApi(this.getAddEventArgs(this.web_hook_event_data.endpoint, this.web_hook_event_data.event_types)).then(res => {
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          this.$message({
            message: this.$t('add success'),
            type: 'success'
          })
          this.show_add_webhook_config = false;
          this.getWebHookEventsList();
        } else {
          if (res.data.message) {
            this.$message.error(res.data.msg);
          }
        }
      }).catch(err => {
        console.log(err);
      })
    },
    /**
     * 获取回调事件列表
     */
    getWebHookEventsList () {
      this.web_hook_event_table_loading =  true;
      getWebHookEventListApi().then(res => {
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          this.web_hook_table_data = this.formatWebHookTableData(res.data.data.webhooks);
        } else {
          if (res.data && res.data.message) {
            this.$message.error(res.data.message);
          }
        }
        this.web_hook_event_table_loading = false;
      }).catch(err => {
        this.web_hook_event_table_loading = false;
        console.log(err)
      })
    },
    formatWebHookTableData (data) {
      data.forEach(item => {
        item.created_time_format = item.created_time ?  timestampToDateString(item.created_time, 'yyyy-MM-dd HH:II:SS') : "-";
      });
      console.log(data);
      return data;
    }
  }
}
</script>
<style scoped lang="less">
.order-btn {
  display: flex;
  align-items: center;
  margin-right: 24px;
}
.ko-mo /deep/.el-dialog__header {
  padding: 0;
}
.ko-mo /deep/ .el-dialog__body {
  padding: 0;
}
.ko-mo /deep/ .el-tabs__header {
  margin: 0;
}
</style>