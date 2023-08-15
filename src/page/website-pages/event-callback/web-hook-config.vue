<template>
  <div class="ko-mo">
    <div>
      <div style="display: flex;margin:12px 0 12px 0;flex-direction: row-reverse;">
        <el-button type="primary" size="small" @click="openWebHookEventDialog">{{ $t('+ 添加端点') }}</el-button>
      </div>
    </div>
    <div style="display: flex;align-items: center;flex-direction: column">
      <el-table v-loading="web_hook_event_table_loading" :data="web_hook_table_data" style="width: 100%"
                :empty-text="$t('no data')"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="name" :label="$t('name')" width="auto">
        </el-table-column>
      </el-table>
      <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10,20]"
          :page-size="page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="add-web-hook-dialog" v-if="show_add_webhook_config">
      <el-dialog
        :visible.sync="show_add_webhook_config"
        :show-close="false"
        width="50%"
      >
        <div style="padding: 16px 24px">
          <div class="title-16">
            {{ $t('创建事件') }}
          </div>
          <div style="padding-top: 24px">
            <el-form :model="web_hook_event_data" ref="commission_form" label-suffix=":" :rules="rules"
                     label-width="125px">
              <el-form-item :label="$t('端点URL')" prop="url">
                <el-input v-model="web_hook_event_data.url"
                          placeholder="https://example.com/webhooks/commission"></el-input>
              </el-form-item>
              <el-form-item :label="$t('event')" prop="name">
                <el-checkbox-group v-model="web_hook_event_data.event_types" v-loading="event_types_loading">
                  <el-checkbox v-for="(item, key) in event_types" :key="key" :label="item.value">{{ $i18n.locale  === 'en-US' ? item.value : item.label }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button type="primary" size="small" style="margin-left: 12px" @click="addWebHookEvent">{{ $t('save') }}</el-button>
            <el-button size="small">{{ $t('cancel') }}</el-button>
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
          <div class="title-16">{{ $t('Commission Campaigns Details') }}</div>
        </div>
        <div style="padding: 16px 24px">
          <div style="padding-bottom: 56px">
            <el-descriptions>
              <el-descriptions-item :label="$t('Belongs to Extension')" :span="12">{{
                  chosen_web_hook_event_data.url
                }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('name')" :span="12">{{
                  chosen_web_hook_event_data.events
                }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Extension URL')" :span="12">{{
                  chosen_web_hook_event_data.api_key
                }}
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
export default {
  data() {
    return {
      page: 1,
      page_size: 10,
      total: 0,
      chosen_web_hook_event_data: {},
      web_hook_event_table_loading: false,
      event_types_loading: false,
      show_add_webhook_config: false,
      show_webhook_detail_dialog: false,
      web_hook_table_data: [],
      web_hook_event_data: {
        event_types: []
      },
      event_types: [], // event 列表
    }
  },
  computed: {
    rules: {}
  },
  methods: {
    openWebHookEventDialog() {
      this.show_add_webhook_config = true;
      this.getWebHookEventList();
    },
    getWebHookEventList() {
      this.event_types_loading = true;
      this.event_types = [];
      getWebHookEventTypesApi().then(res => {
        if (parseInt(res.data.code)=== 100000) {
          this.event_types = res.data.data.event_types;
          console.log(this.event_types);
          this.event_types_loading = false;
        } else {
          this.event_types_loading = false;
        }
      }).catch(err => {
        console.log(err);
        this.event_types_loading = false;
      })
    },
    addWebHookEvent() {
      addWebHookEventApi().then(res => {
        if (res.data.code === 100000) {
          this.show_add_webhook_config = false;
          this.getWebHookEventList();
        }
      }).catch(err => {
        console.log(err);
      })
    },
    updateWebHookEvent() {

    },
    handleSizeChange(val) {
      this.page_size = val;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
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