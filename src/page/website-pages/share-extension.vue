<template>
  <div class="ko-mo">
    <div>
      <div>
        <div style="display: flex;margin:9px 0 24px 0">
          <div class="order-btn">
            <el-select size="small" v-model="condition.client_key" :placeholder="$t('Belongs to Extension')" clearable @change="search" filterable v-loading="extension_list_loading">
              <el-option
                v-for="item in extension_list"
                :key="item.client_key"
                :label="$t(item.name)"
                :value="item.client_key">
              </el-option>
            </el-select>
          </div>
          <div class="order-btn">
            <div>
              <el-input size="small" :placeholder="$t('name')" v-model="condition.name" clearable  @keyup.enter.native="search" @clear="search"></el-input>
            </div>
          </div>
          <el-button type="primary" size="small" @click="createShare">{{$t('create plan')}}</el-button>
        </div>
      </div>
      <div style="display: flex;align-items: center;flex-direction: column">

        <el-table v-loading="table_loading" :data="table_data" style="width: 100%"
                  :empty-text="$t('no data')"
                  @sort-change="handleSortChange"
                  :header-cell-class-name="handleHeaderCellClass"
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
            :current-page.sync="page"
            :page-sizes="[10,20]"
            :page-size="page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="add-share-dialog" v-if="share_dialog_visible">
      <el-dialog
        :visible.sync="share_dialog_visible"
        :show-close="false"
        width="50%"
      >
        <div style="padding: 16px 24px">
          <div class="title-16">
            {{$t('Add Share Link')}}
          </div>
          <div style="padding-top: 24px">
            <el-form :model="share_data" ref="share_form" label-suffix=":" :rules="rules" label-width="125px">
              <el-form-item :label="$t('extension')" prop="client_key">
                <el-select style="max-width: 400px" size="small" v-model="share_data.client_key"  :placeholder="$t('Select Plugin for Share Link')" clearable @change="search" filterable v-loading="extension_list_loading">
                  <el-option
                    v-for="item in extension_list"
                    :key="item.client_key"
                    :label="item.name"
                    :value="item.client_key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('name')" prop="name" >
                <el-input v-model="share_data.name" :placeholder="$t('Please enter a name for self-identification')" style="max-width:300px" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('description')" prop="description">
                <el-input v-model="share_data.desc" :placeholder="$t('Note Content')" style="max-width:300px" size="small"  type="textarea"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Extension URL')" prop="redirect_url">
                <el-input v-model="share_data.redirect_url" :placeholder="$t('Marketplace URL for Publishing the Extension on Webstore')" style="max-width:300px" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Share Link')" prop="share_code">
              <span>
                <span>{{`https://share.kodepay.io/${$mode}/` + (share_data.client_key ? `${share_data.client_key}/` : "")}}</span>
                 <span>
                   <el-input v-model="share_data.share_code" :placeholder="$t('Note Content')" style="max-width: 200px" size="small"></el-input>
                 </span>
                <span class="link" @click="generateRandomShareCode">
                  {{$t('Auto-generated')}}
                </span>
              </span>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex;flex-direction: row-reverse;align-items: center;">
            <el-button type="primary" @click="submit" size="small" style="margin-left: 12px">{{$t('save')}}</el-button>
            <el-button @click="share_dialog_visible = false" size="small" >{{ $t('cancel') }}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="share-detail-dialog" v-if="show_share_detail_dialog">
      <el-dialog
        :visible.sync="show_share_detail_dialog"
        width="50%"
      >
        <div style="padding: 16px 24px;border-bottom: 1px solid rgba(232, 232, 232, 1)">
          <div class="title-16">{{$t('分享者详情')}}</div>
        </div>
        <div style="padding: 16px 24px">
          <div style="padding-bottom: 56px">
            <el-descriptions>
              <el-descriptions-item :label="$t('Belongs to Extension')"  :span="12">{{choose_share_data.client_name}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('name')" :span="12">{{choose_share_data.name}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Note')" :span="12">{{choose_share_data.desc}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Extension URL')" :span="12">{{choose_share_data.redirect_url}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
              <el-descriptions-item :label="$t('Share Link')" :span="12">
                <div style="display: flex;align-items: center;">
                  <span> {{ `https://share.kodepay.io/${api_prefix}/${choose_share_data.client_key}/${choose_share_data.share_code}` }}</span>
                  <span style="display: flex;align-items: center;justify-content: center"><svg width="16" height="16" @click="copy(`https://share.kodepay.io/${api_prefix}/${choose_share_data.client_key}/${choose_share_data.share_code}`)" style="cursor: pointer;padding-left: 8px" id="copy_text">
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
import {pluginList, addExtensionShareApi, extensionShareListApi} from "../../api/interface";
import Clipboard from "clipboard";
import {timestampToDateString} from "../../utils/dateUtils";
export default {
  data() {
    return {
      ORDER_TYPE_REF: {
        "descending": "desc",
        "ascending": "asc"
      },
      api_prefix:"",
      page: 1,
      page_size: 10,
      total: 0,
      condition: {},
      sort:[
        {prop:"created_time", order:"descending"}
      ],
      choose_share_data: {},
      share_dialog_visible:false,
      extension_list:[],
      extension_list_loading:false,
      share_data:{
        client_key:"",
        name:"",
        desc:"",
        redirect_url:"",
        share_code:"",
      },
      table_data:[],
      table_loading:false,
      show_share_detail_dialog:false
    };
  },
  created() {
    this.api_prefix = this.$mode === this.MODECONFIG.SANDBOX.mode ? 'sandbox': 'production';
    this.getExtensionList();
    this.getTableData();
  },
  computed:{
    rules () {
      return {
        client_key: [
          {required: true, message: this.$t('please select extension'), trigger: 'change'}
        ],
        name: [
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        desc: [
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        redirect_url: [
          { required: true, message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        share_code: [
          { required: true, message: this.$t('1-20 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
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
      if (order) {
        let flag_is_have = false
        this.sort.forEach(element => {
          if (element.prop === prop) {
            element.order = order
            flag_is_have = true
          }
        });
        if (!flag_is_have) {
          this.sort.push({
            prop:prop,
            order:order
          })
        }
      } else{  //不参与排序
        let order_index=0
        this.sort.forEach((element,index) => {
          if (element.prop === prop) {
            order_index = index
          }
        });
        this.sort.splice(order_index,1)
      }
      this.getTableData();
    },
    /**
     * 打开分享的详情
     */
    openShareDetail (row) {
      this.choose_share_data = row;
      this.show_share_detail_dialog = true;
    },
    /**
     * 上传分享的数据
     */
    submit() {
      this.$refs['share_form'].validate((valid) => {
        if (valid) {
          let vm = this;
          addExtensionShareApi(this.share_data).then(res => {
            if (res.data && parseInt(res.data.code) === 100000) {
              vm.$message({
                message: this.$t('add success'),
                type: 'success'
              })
              vm.share_dialog_visible = false;
              vm.share_data = {};
              vm.getExtensionList();
              vm.getTableData();
            } else {
              if (res && res.data && res.data.message) {
                vm.$message.warning(res.data.message);
              }
            }
          }).catch(err => {
            vm.$message({
              message: err,
              type: 'error'
            })
          })
        } else {
          return false;
        }
      })
    },
    validateTrimmedField(rule, value, callback) {
      if (value && value.trim() === '') {
        callback(new Error(this.$t('Field cannot be empty')));
      } else {
        callback();
      }
    },
    generateRandomShareCode () {
      this.share_data.share_code = this.generateRandomID().toLowerCase();
    },
    /**
     * 生成8位随机唯一ID
     * @returns {string}
     */
    generateRandomID() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const idLength = 8;
      let id = '';
      // 获取当前时间戳
      const timestamp = Date.now().toString();
      // 添加时间戳的每一位数字或字符到ID中
      for (let i = 0; i < timestamp.length; i++) {
        id += characters.charAt(parseInt(timestamp.charAt(i), 10) % characters.length);
      }
      // 生成剩余的随机字符
      for (let i = id.length; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
      }
      return id;
    },
    /**
     * 获取表格数据
     */
    getExtensionList () {
      this.extension_list_loading = true;
      let vm = this;
      pluginList().then(res => {
        if (res.data.code === 100000) {
          vm.extension_list = res.data.data;
        }
        vm.extension_list_loading = false;
      }).catch(err => {
        vm.extension_list_loading = false;
      });
    },
    /**
     * 点击创建
     */
    createShare () {
      this.share_dialog_visible = true;
    },
    resetPageParams () {
      this.page = 1;
      this.page_size = 10;
      this.total = 0;
    },
    /**
     * tab切换
     */
    handleClick() {
      this.condition = {};
      this.resetPageParams();
      if (this.active_order_type === 'disputed') {
        this.condition = {order_status: 'disputed'};
      }
      this.getTableData();
    },
    openOrderDetail (order_id) {
      this.$router.push({path: "/orders/detail/" + order_id});
    },
    /**
     * 改变每页显示条数
     */
    reset() {
      this.condition = {};
      this.resetPageParams();
      this.getTableData();
    },
    /**
     * 搜索
     */
    search() {
      this.resetPageParams();
      this.getTableData();
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
      let orders_temp = {};
      for (let key in orders) {
        if (orders[key]) {
          orders_temp[key] = orders[key];
        }
      }
      return {
        'page': page,
        'page_size': page_size,
        'condition': condition_temp,
        'order': orders_temp
      }
    },
    /**
     * 获取表格数据
     * @returns {*}
     */
    getTableData () {
      this.table_data = [];
      let args = this.getApiArgs(this.condition, this.formatSortParams(this.sort), this.page, this.page_size);
      this.table_loading = true;
      let vm = this;
      extensionShareListApi(args).then(res => {
        if (res.data.code === 100000) {
          vm.table_data = this.formatTableData(res.data.data);
          vm.total = res.data.total;
        }
        vm.table_loading = false;
      }).catch(err => {
        vm.table_loading = false;
        console.log(err);
      });
      this.table_data = [
        {
          name:"xxx",
          desc:"xxxx",
          client_name:"xxxx",// 插件的名称
          client_key:"xxxx-xxxx-xxxx-xxx",// client_key
          redirect_url:"https://chrome/xxxxx?lang=ZH-CN",
          click_count:10,
          share_code:"xxxx",
          install_count:10,
          customer_count:10,
          status:1,
          created_time:13232234234
        }
      ];
      console.log(this.table_data);
      this.total = 1;
    },
    //排序方法
    handleHeaderCellClass({column}){
      this.sort.forEach(element => {
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
      this.resetPageParams();
      this.page_size = size;
      this.getTableData();
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
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
</style>
