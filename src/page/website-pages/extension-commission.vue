<template>
  <div class="ko-mo">
    <div class="el-tab-cus">
      <el-tabs v-model="active_name" @tab-click="handleClick">
        <el-tab-pane label="分佣活动" name="commission">
          <div>
            <div style="display: flex;margin:12px 0 12px 0;flex-direction: row-reverse;">
              <el-button type="primary" size="small" @click="createShare">{{$t('create plan')}}</el-button>
            </div>
          </div>
          <div style="display: flex;align-items: center;flex-direction: column">
            <el-table v-loading="commission_data.loading" :data="commission_data.table_data" style="width: 100%"
                      :empty-text="$t('no data')"
                      @sort-change="handleSortChange"
                      :header-cell-class-name="handleCommissionHeaderCellClass"
                      :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
            >
              <el-table-column prop="name" :label="$t('name')"  width="auto">
              </el-table-column>
              <el-table-column prop="click_count" :label="$t('Click Count')" width="auto" sortable="customer">
              </el-table-column>
              <el-table-column prop="install_count" width="auto" :label="$t('Install Count')" sortable="customer">
              </el-table-column>
              <el-table-column width="auto" prop="customer_count" :label="$t('Customer Count')" sortable="customer">
              </el-table-column>
              <el-table-column prop="created_time" width="auto" :label="$t('create time')">
              </el-table-column>
              <el-table-column width="100" :label="$t('Operation')" align="center">
                <template slot-scope="scope">
                  <span class="link" @click="openShareDetail(scope.row)">{{ $t('detail') }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="commission_data.page"
                :page-sizes="[10,20]"
                :page-size="commission_data.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="commission_data.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="推广员" name="promoter">
          <div>
            <div style="display: flex;margin:12px 0 12px 0;">
              <el-select style="max-width: 400px" size="small" @reset="commissionChange" @change="commissionChange" v-model="promoter_data.condition.client_fpr_id" :placeholder="$t('Select Plugin for Share Link')" clearable filterable v-loading="commission_list_loading" >
                <el-option
                  v-for="item in commission_list"
                  :key="item.client_fpr_id"
                  :label="item.name"
                  :value="item.client_fpr_id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div style="display: flex;align-items: center;flex-direction: column;">
            <el-table v-loading="promoter_data.loading" :data="promoter_data.table_data" style="width: 100%"
                      :empty-text="$t('no data')"
                      @sort-change="handleSortChange"
                      :header-cell-class-name="handlePromoterHeaderCellClass"
                      :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
            >
              <el-table-column prop="name" :label="$t('name')"  width="auto">
              </el-table-column>
              <el-table-column prop="click_count" :label="$t('Click Count')" width="auto" sortable="customer">
              </el-table-column>
              <el-table-column prop="install_count" width="auto" :label="$t('Install Count')" sortable="customer">
              </el-table-column>
              <el-table-column width="auto" prop="customer_count" :label="$t('Customer Count')" sortable="customer">
              </el-table-column>
              <el-table-column prop="created_time" width="auto" :label="$t('create time')">
              </el-table-column>
            </el-table>
            <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="promoter_data.page"
                :page-sizes="[10,20]"
                :page-size="promoter_data.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="promoter_data.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="add-share-dialog" v-if="commission_dialog_visible">
      <el-dialog
        :visible.sync="commission_dialog_visible"
        :show-close="false"
        width="50%"
      >
        <div style="padding: 16px 24px">
          <div class="title-16">
            {{$t('添加分佣活动')}}
          </div>
          <div style="padding-top: 24px">
            <el-form :model="commission" ref="commission_form" label-suffix=":" :rules="rules" label-width="125px">
              <el-form-item :label="$t('extension')" prop="client_key">
                <el-select style="max-width: 400px" size="small" v-model="commission.client_key" :placeholder="$t('Select Plugin for Share Link')" clearable filterable v-loading="extension_list_loading">
                  <el-option
                    v-for="item in extension_list"
                    :key="item.client_key"
                    :label="item.name"
                    :disabled="item.disabled"
                    :value="item.client_key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('name')" prop="name" >
                <el-input v-model="commission.name" :placeholder="$t('Please enter a name for self-identification')" style="max-width:300px" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('FP-key')" prop="x_api_key">
                <el-input v-model="commission.x_api_key" :placeholder="$t('FP API Key Content')" style="max-width:300px" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Extension URL')" prop="redirect_url">
                <el-input v-model="commission.redirect_url" :placeholder="$t('Marketplace URL for Publishing the Extension on Webstore')" style="max-width:300px" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Share Link')" prop="share_link">
              <span>
                <span>{{ `https://share.kodepay.io/${$mode}/` + (commission.client_key ? `${commission.client_key}` : "") }}</span>
              </span>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button type="primary" @click="submitCommissionForm" size="small" style="margin-left: 12px">{{$t('save')}}</el-button>
            <el-button @click="commission_dialog_visible = false" size="small" >{{ $t('cancel') }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="share-detail-dialog" v-if="show_commission_detail_dialog">
      <el-dialog
        :visible.sync="show_commission_detail_dialog"
        width="50%"
      >
        <div style="padding: 16px 24px;border-bottom: 1px solid rgba(232, 232, 232, 1)">
          <div class="title-16">{{$t('分佣活动详情')}}</div>
        </div>
        <div style="padding: 16px 24px">
          <div style="padding-bottom: 56px">
            <el-descriptions>
              <el-descriptions-item :label="$t('Belongs to Extension')"  :span="12">{{ choose_commission.client_name }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('name')" :span="12">{{ choose_commission.name }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Extension URL')" :span="12">{{ choose_commission.redirect_url }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('FP-key')" :span="12">{{ choose_commission.x_api_key }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Share Link')" :span="12">
                <div style="display: flex;align-items: center;">
                  <span> {{`https://share.kodepay.io/${api_prefix}/${choose_commission.client_key}`}}</span>
                  <span style="display: flex;align-items: center;justify-content: center"><svg width="16" height="16" @click="copy(`https://share.kodepay.io/${api_prefix}/${choose_commission.client_key}`)" style="cursor: pointer;padding-left: 8px" id="copy_text">
                  <use xlink:href="#copy">
                  </use>
                </svg></span>
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
import {getCommissionExtensionListApi, addCommissionApi, getCommissionListApi, getPromoterListApi, getAllCommissionListApi} from "../../api/interface";
import Clipboard from "clipboard";
import {timestampToDateString} from "../../utils/dateUtils";
export default {
  data() {
    return {
      active_name:"commission",
      ORDER_TYPE_REF: {
        "descending": "desc",
        "ascending": "asc"
      },
      commission_data: {
        table_data:[],
        total:0,
        page:1,
        page_size:10,
        sort:[
          {prop:"created_time", order:"descending"}
        ],
        condition:{},
        loading:false
      },
      promoter_data:{
        table_data:[],
        total:0,
        page:1,
        page_size:10,
        sort:[
          {prop:"created_time", order:"descending"}
        ],
        condition:{},
        loading:false
      },
      api_prefix:"",
      choose_commission: {},
      commission_dialog_visible:false,
      extension_list:[],
      extension_list_loading:false,
      commission_list_loading:false,
      commission_list:[],
      commission:{
        client_key:"",
        name:"",
        x_api_key:"",
        redirect_url:"",
      },
      show_commission_detail_dialog:false
    };
  },
  created() {
    this.api_prefix = this.$mode === this.MODECONFIG.SANDBOX.mode ? 'sandbox': 'production';
    this.getExtensionList();
    this.getAllCommissionList();
    this.getData();
  },
  computed:{
    rules () {
      return {
        client_key: [
          {required: true, message: this.$t('please select extension'), trigger: 'change'}
        ],
        x_api_key:[
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        name: [
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        redirect_url: [
          { required: true, message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    commissionChange() {
      this.getData();
    },
    getData() {
      if (this.active_name === 'commission') {
        this.getCommissionTableData();
      } else if (this.active_name ==='promoter') {
        this.getPromoterTableData();
      }
    },
    /**
     * 设置所有的commission
     */
    getAllCommissionList() {
      this.commission_list_loading = true;
      getAllCommissionListApi().then(res => {
        if (res.data.code === 100000) {
          this.commission_list = res.data.data;
        }
        this.commission_list_loading = false;
      }).catch(err => {
        this.commission_list_loading = false;
      })
    },
    /**
     * 格式化排序参数
     * @param sort
     * @returns {{}}
     */
    formatSortParams (sort) {
      let sort_params = {};
      sort.forEach(item => {
        sort_params[item.prop] = this.ORDER_TYPE_REF[item.order];
      })
      if (Object.keys(sort_params).length > 1){
        delete sort_params['created_time'];
      }
      return sort_params;
    },
    /**
     * 拷贝
     * @param text
     */
    copy (text){
      let clipboard = new Clipboard('#copy_text', {
        text: () => {
          return text
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
          message:  this.$t('browser not support copy'),
          type: 'warning'
        })
        clipboard.destroy() // 释放内存
      })
    },
    /**
     * 排序
     * @param prop
     * @param order
     */
    handleSortChange({prop, order }) {
      let sort;
      if (this.active_name === 'commission') {
        sort = this.commission_data.sort;
        this.commission_data.sort = this.formatSort(prop, order, sort)
      } else if (this.active_name === 'promoter') {
        sort = this.promoter_data.sort;
        this.promoter_data.sort = this.formatSort(prop, order, sort)
      }
      this.getData();
    },
    /**
     * 格式化sort
     * @param prop
     * @param order
     * @param sort
     * @returns {*}
     */
    formatSort(prop, order, sort) {
      if (order) {
        let flag_is_have = false
        sort.forEach(element => {
          if (element.prop === prop) {
            element.order = order
            flag_is_have = true
          }
        });
        if (!flag_is_have) {
          sort.push({
            prop:prop,
            order:order
          })
        }
      } else{  //不参与排序
        let order_index=0
        sort.forEach((element,index) => {
          if (element.prop === prop) {
            order_index = index
          }
        });
        sort.splice(order_index,1)
      }
      return sort;
    },
    /**
     * 打开分享的详情
     */
    openShareDetail (row) {
      this.choose_commission = row;
      this.show_commission_detail_dialog = true;
    },
    /**
     * 上传分享的数据
     */
    submitCommissionForm() {
      this.$refs['commission_form'].validate((valid) => {
        if (valid) {
          addCommissionApi(this.commission).then(res => {
            if (res.data && parseInt(res.data.code) === 100000) {
              this.$message({
                message: this.$t('add success'),
                type: 'success'
              })
              this.commission_dialog_visible = false;
              this.choose_commission = {};
              this.getExtensionList();
              this.getAllCommissionList();
              this.getData();
            } else {
              if (res && res.data && res.data.message) {
                this.$message.warning(res.data.message);
              }
            }
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            })
          })
        } else {
          return false;
        }
      })
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
    /**
     * 获取表格数据
     */
    getExtensionList () {
      this.extension_list_loading = true;
      let vm = this;
      getCommissionExtensionListApi().then(res => {
        if (res.data.code === 100000) {
          vm.extension_list = vm.formatExtensionList(res.data.data);
        }
        vm.extension_list_loading = false;
      }).catch(err => {
        vm.extension_list_loading = false;
      });
    },
    /**
     *
     * @param data
     * @returns {*}
     */
    formatExtensionList (data) {
      data.map(item=> {
        item.disabled = !!item.commission_status;
      })
      return data;
    },
    /**
     * 点击创建
     */
    createShare () {
      this.commission_dialog_visible = true;
    },
    /**
     * tab切换
     */
    handleClick() {
      this.getData();
    },
    openOrderDetail (order_id) {
      this.$router.push({path: "/orders/detail/" + order_id});
    },
    /**
     * 获取api参数
     * @param condition
     * @param orders
     * @param page
     * @param page_size
     * @returns {{condition: {}, page, page_size, order: {}}}
     */
    getApiArgs (condition, orders, page, page_size) {
      let condition_temp = {};
      for (let key in condition) {
        if (condition[key]) {
          condition_temp[key] = condition[key];
        }
      }
      return {
        'page': page,
        'page_size': page_size,
        'condition': condition_temp,
        'order': this.formatSortParams(orders)
      }
    },
    /**
     * 获取分佣活动表格数据
     * @returns {*}
     */
    getCommissionTableData () {
      this.commission_data.table_data =[];
      console.log(this.commission_data);
      let args = this.getApiArgs(this.commission_data.condition, this.commission_data.sort, this.commission_data.page, this.commission_data.page_size);
      this.commission_data.loading = true;
      console.log(args);
      getCommissionListApi(args).then(res => {
        this.commission_data.loading = false;
        if (res.data && res.data.code === 100000) {
          this.commission_data.table_data = this.formatTableData(res.data.data);
          this.commission_data.total = res.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      }).catch(err => {
        this.commission_data.loading = false;
        this.$message.error(err.message);
      });
    },
    /**
     *  获取推广员表格数据
     */
    getPromoterTableData () {
      this.promoter_data.table_data = [];
      let args = this.getApiArgs(this.promoter_data.condition, this.promoter_data.sort, this.promoter_data.page, this.promoter_data.page_size);
      this.promoter_data.loading = true;
      getPromoterListApi(args).then(res => {
        this.promoter_data.loading = false;
        if (res.data && res.data.code === 100000) {
          this.promoter_data.table_data = this.formatTableData(res.data.data);
          this.promoter_data.total = res.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      }).catch(err => {
        this.promoter_data.loading = false
        this.$message.error(err.message);
      });
    },
    //排序方法
    handleCommissionHeaderCellClass({column}){
      this.commission_data.sort.forEach(element => {
        if (column.property===element.prop) {
          column.order=element.order
        }
      });
    },
    handlePromoterHeaderCellClass({column}){
      this.promoter_data.sort.forEach(element => {
        if (column.property===element.prop) {
          column.order=element.order
        }
      });
    },
    /**
     * 格式化表格数据
     * @param data
     * @returns {*}
     */
    formatTableData (data) {
      data.map(item => {
        item.created_time = this.formatCreatedTime(item.created_time);
      })
      return data;
    },
    /**
     * 格式化创建时间
     * @param created_time
     * @returns {string}
     */
    formatCreatedTime (created_time) {
      if (created_time) {
        return timestampToDateString(created_time, 'yyyy-MM-dd HH:II:SS');
      }
      return "-";
    },
    /**
     * 分页
     */
    handleSizeChange(size) {
      if (this.active_name ==='commission') {
        this.commission_data.page_size = size;
      } else {
        this.commission_data.page_size = size;
      }
      this.getData()
    },
    /**
     * 分页
     */
    handleCurrentChange(page) {
      if (this.active_name ==='commission') {
        this.commission_data.page = page;
      } else {
        this.commission_data.page = page;
      }
      this.getData()
    },
  },
};
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
