<template>
  <div>
    <el-dialog :title="operationType === 'add' ? $t('create plugin') : $t('update plugin')" :visible.sync="dialog_form_visible" width="50%" :modal-append-to-body="false" :destroy-on-close="true">
      <el-form :model="plugin_data" :rules="rules" ref="pluginRuleForm" label-width="120px">
        <el-form-item :label="$t('extension id') + ':'" prop="client_key" v-if="operationType !== 'add'">
          <div>{{ plugin_data.client_key }}</div>
        </el-form-item>
        <el-form-item :label="$t('name') + ':'" prop="name">
          <el-input v-model="plugin_data.name" :placeholder="$t('extension name is required')" maxlength="100">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('icon') + ':'" prop="icon">
          <img-upload :icon_url="plugin_data.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
        </el-form-item>
        <el-form-item :label="$t('description') + ':'" prop="description">
          <el-input type="textarea" v-model="plugin_data.description" :placeholder="$t('please input description')" maxlength="120"></el-input>
        </el-form-item>
        <el-form-item :label="$t('store address') + ':'" prop="store_address">
          <el-input v-model="plugin_data.store_address" :placeholder="$t('please input store address')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Simultaneously Online') + ':'"  prop="allow_online_user_limit_count">
          <div style="display: flex;flex-direction: column">
            <div>
              <el-radio-group v-model="is_limit_user" @change="handleLimitChange">
                <el-radio :label="false">{{$t('No Limit')}}</el-radio>
                <el-radio :label="true">{{$t('Limit')}}</el-radio>
              </el-radio-group>
            </div>
            <div style="color: #929292">{{$t('Allow the number of simultaneous logins on different devices for the same account')}}</div>
            <div v-if="is_limit_user">
              <el-input-number v-model="plugin_data.allow_online_user_limit_count" size="small" :min="1" :max="20" :step="1">
              </el-input-number>
            </div>
          </div>
        </el-form-item>
        <div style="display: flex;justify-content:flex-end">
          <el-button type="primary" size="small" @click="submitForm('pluginRuleForm')" :loading="btn_loading">
            {{ operationType === 'add' ? $t('create') : $t('update') }}
          </el-button>
          <el-button @click="resetForm('pluginRuleForm')" size="small">{{ $t('Reset') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {addPlugin, uploadFile, updatePlugin} from "../../api/interface";
import imgUpload from "./img-upload.vue";
export default {
  data () {
    return {
      icon_file: null,
      is_limit_user:false,
      dialog_form_visible: false,
      plugin_data : {
        allow_online_user_limit_count:0,
      },
      btn_loading:false
    }
  },
  props: {
    operationType: {
      type: String,
      default: 'add'
    },
    visible: {
      type: Boolean,
      default: false
    },
    chosen_plugin_data: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    visibleChange : {
      type: Function,
      default: () => {
      }
    },
    operateSuccess : {
      type: Function,
      default: () => {
      },
      btn_loading:false
    }
  },
  components : {
    imgUpload
  },
  computed: {
    rules () {
      return {
        name: [
          { required: true, message: this.$t('1-100 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        store_address: [
          { message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
      }
    }
  },
  watch : {
    visible(newValue) {
      this.dialog_form_visible = newValue;
    },
    dialog_form_visible(newValue) {
      this.$emit('visibleChange', newValue);
      return newValue;
    },
    chosen_plugin_data(newValue) {
      if (newValue && Object.keys(newValue).length > 0) {
        this.plugin_data = JSON.parse(JSON.stringify(newValue));
        if (!this.plugin_data.hasOwnProperty('allow_online_user_limit_count')) {
          this.is_limit_user = false;
          this.$set(this.plugin_data, 'allow_online_user_limit_count', 0)
        } else {
          this.is_limit_user = true;
        }
      } else {
        this.plugin_data = {};
      }
    }
  },
  created() {
    this.dialog_form_visible = this.visible;
    if (this.chosen_plugin_data && Object.keys(this.chosen_plugin_data).length > 0) {
      this.plugin_data = JSON.parse(JSON.stringify(this.chosen_plugin_data));
      if (!this.plugin_data.hasOwnProperty('allow_online_user_limit_count')) {
        this.is_limit_user = false;
        this.$set(this.plugin_data, 'allow_online_user_limit_count', 0)
      } else {
        this.is_limit_user = true;
      }
    } else {
      this.plugin_data = {};
    }
  },
  mounted() {
    if (!this.plugin_data.hasOwnProperty('allow_online_user_limit_count')) {
      this.$set(this.plugin_data, 'allow_online_user_limit_count', 0)
      this.is_limit_user = false;
    } else {
      this.is_limit_user = this.plugin_data.allow_online_user_limit_count > 0;
    }
  },
  methods : {
    handleLimitChange(value) {
      if (value) {
        if (!this.plugin_data.allow_online_user_limit_count) {
          this.$set(this.plugin_data, 'allow_online_user_limit_count', 1)
        }
      }
      console.log(this.plugin_data.allow_online_user_limit_count);
    },
    validateTrimmedField(rule, value, callback) {
      if (value && value.trim() === '') {
        callback(new Error(this.$t('Field cannot be empty')));
      } else {
        callback();
      }
    },
    resetForm() {
      this.plugin_data = {
        client_key: this.chosen_plugin_data.client_key || ""
      };
    },

    /**
     *
     * @param path
     * @param file
     * @returns {Promise<*>}
     */
    async getIconUrl(path, file) {
      let response = await uploadFile({path: path, icon: file})
      if (parseInt(response.data.code) === 100000) {
        return response.data.data.url;
      } else {
        this.$message({
          message: 'upload icon error',
          type: 'error'
        });
      }
    },
    /**
     * 新增
     * @returns {Promise<void>}
     */
    async addPluginData () {
      let args = this.plugin_data;
      if (this.icon_file) {
        let icon = await this.getIconUrl('plugin', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      if (!this.is_limit_user) {
        args.allow_online_user_limit_count = 0;
      }
      this.btn_loading = true;
      addPlugin(args).then((res) => {
        this.btn_loading = false;
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: 'success',
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch((err) => {
        this.btn_loading = false;
        this.$message({
          message: 'fail',
          type: 'error'
        });
      });
    },

    /**
     * 更新
     * @returns {Promise<void>}
     */
    async updatePluginData() {
      // 对比this.pluginData 和 this.chosenPluginData，把不同的值赋值给args
      let args = {};
      for (let key in this.plugin_data) {
        if (this.plugin_data[key] !== this.chosen_plugin_data[key]) {
          args[key] = this.plugin_data[key];
        }
      }
      if (!this.is_limit_user) {
        args.allow_online_user_limit_count = 0;
      }
      if (this.icon_file) {
        let icon = await this.getIconUrl('plugin', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      args.client_key = this.chosen_plugin_data.client_key;
      this.btn_loading = true;
      updatePlugin(args).then(res => {
        this.btn_loading = false;
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: 'success',
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch((err) => {
        this.btn_loading = false;
        this.$message({
          message: 'fail',
          type: 'error'
        });
      });
    },
    /**
     *
     * @param formName
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operationType === 'add') {
            this.addPluginData();
          } else {
            this.updatePluginData();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 图标上传
     * @param file
     */
    iconUpSourceChange(file) {
      this.icon_file = file;
    }
  }
}
</script>
<style scoped lang="less">

</style>