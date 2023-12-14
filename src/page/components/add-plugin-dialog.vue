<template>
  <el-dialog :title="operationType === 'add' ? $t('create plugin') : $t('update plugin')" v-if="dialog_form_visible" :visible.sync="dialog_form_visible" width="50%"  :destroy-on-close="true">
    <div>
      <el-form :model="plugin_data" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item :label="$t('extension id') + ':'" prop="client_key" v-if="operationType !== 'add'">
          <div>{{ plugin_data.client_key }}</div>
        </el-form-item>
        <el-form-item :label="$t('name') + ':'" prop="name">
          <el-input v-model="plugin_data.name" :placeholder="$t('please input extension name')">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('icon') + ':'" prop="icon">
          <img-upload :icon_url="plugin_data.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
        </el-form-item>
        <el-form-item :label="$t('description') + ':'" prop="description">
          <el-input type="textarea" v-model="plugin_data.description" :placeholder="$t('please input description')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('store address') + ':'" prop="store_address">
          <el-input v-model="plugin_data.store_address" :placeholder="$t('please input store address')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('ruleForm')" :loading="btn_loading">
            {{ operationType === 'add' ? $t('create') : $t('update') }}
          </el-button>
          <el-button @click="resetForm('ruleForm')" size="small">{{ $t('Reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import {addPlugin, uploadFile, updatePlugin} from "../../api/interface";
import imgUpload from "./img-upload.vue";

export default {
  data () {
    return {
      icon_file: null,
      dialog_form_visible: false,
      plugin_data : {},
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
      } else {
        this.plugin_data = {};
      }
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
      }
    }
  },
  methods : {
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
      let vm = this;
      this.btn_loading = true;
      addPlugin(args).then((res) => {
        this.btn_loading = false;
        if (parseInt(res.data.code) === 100000) {
          vm.$message({
            message: 'success',
            type: 'success'
          });
          vm.dialog_form_visible = false;
          vm.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
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
      if (this.icon_file) {
        let icon = await this.getIconUrl('plugin', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      args.client_key = this.chosen_plugin_data.client_key;
      let vm = this;
      this.btn_loading = true;
      updatePlugin(args).then((res) => {
        this.btn_loading = false;
        if (parseInt(res.data.code) === 100000) {
          vm.$message({
            message: 'success',
            type: 'success'
          });
          vm.dialog_form_visible = false;
          vm.$emit('operateSuccess');
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch((err) => {
        this.btn_loading = false;
        vm.$message({
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