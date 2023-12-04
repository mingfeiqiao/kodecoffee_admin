
<template>
  <div style="padding-top: 24px">
    <div style="display: flex;align-items: center;flex-direction: column">
      <el-table v-loading="web_hook_log_table_loading" :data="web_hook_log_table_data" style="width: 100%"
                :empty-text="$t('no data')"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="event_type" :label="$t('Event')" width="auto">
          <template slot-scope="scope">
            <span>
              {{event_mappers[scope.row.event_type][$i18n.locale]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="client_name" :label="$t('Applied extension')" width="auto">
          <template slot-scope="scope">
            <span v-if="scope.row.client_name">{{ scope.row.client_name }}</span>
            <span v-else>{{ $t('all') }}</span>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('status')" width="auto">
          <template slot-scope="scope" v-if="scope.row.event_status_obj">
            <span :style="{'color': scope.row.event_status_obj.color }">
              {{$t( scope.row.event_status_obj.message)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="event_time_format" :label="$t('Time')" width="auto">
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
  </div>
</template>
<script>
import {getWebHookEventLogsApi, getWebHookEventTypesApi} from "../../../api/interface";
import {timestampToDateString} from "../../../utils/dateUtils";
export default {
  data() {
    return {
      page:1,
      page_size:10,
      total:0,
      order:{
        created_time:"desc"
      },
      STATUS_MAPPING: {
        failed: {
          message:'Failed',
          color:'#E14040'
        },
        success: {
          message: 'Succeed',
          color: '#08A81F'
        }
      },
      web_hook_log_table_loading:false,
      web_hook_log_table_data:[],
      event_mappers: {}
    }
  },
  created() {
    this.getWebHookEventTypes();
  },
  methods: {
    /**
     * 查询出所有的web hook 事件的类型
     */
    getWebHookEventTypes() {
      getWebHookEventTypesApi().then(res => {
        if (parseInt(res.data.code)=== 100000) {
          this.event_mappers = this.formatEventTypes(res.data.data.event_types);
          this.getWebHookLogs();
        }
      }).catch(err => {
        console.log(err);
      })
    },
    formatEventTypes (event_types) {
      let event_type_mapper = {}
      event_types.forEach(item => {
        event_type_mapper[item.value] = {
          'en-US':item.value,
          'zh-CN':item.label
        }
      });
      return event_type_mapper;
    },
    getWebHookEventLogsArgs () {
      return {
        page:this.page,
        page_size:this.page_size,
        order:this.order
      }
    },
    getWebHookLogs() {
      this.web_hook_log_table_loading = true;
      getWebHookEventLogsApi(this.getWebHookEventLogsArgs()).then(res => {
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
            this.web_hook_log_table_data = this.formatTableData(res.data.data);
            this.total = res.data.totalCount;
        } else {
          if (res.data && res.data.message) {
            this.$message.error(res.data.message);
          }
        }
        this.web_hook_log_table_loading = false;
      }).catch(err => {
        this.web_hook_log_table_loading = false;
        console.log(err)
      })
    },
    formatTableData (data) {
      data.forEach(item => {
        item.event_time_format = item.event_time ? timestampToDateString(item.event_time, 'yyyy-MM-dd HH:II:SS') :"-";
        item.event_status_obj = this.STATUS_MAPPING[item.event_status];
      })
      return data;
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.getWebHookLogs();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getWebHookLogs();
    }
  }
}
</script>
<style scoped lang="less">

</style>