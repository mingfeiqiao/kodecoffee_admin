<template>
  <el-dialog :title="operationType === 'add' ? $t('create plugin') :  $t('update plugin')" v-if="dialog_form_visible" :visible.sync="dialog_form_visible" width="50%" :modal-append-to-body="false">
    <div>
      <el-form :model="plugin_data" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('extension id') + ':'" prop="client_key">
          <div>{{ plugin_data.client_key }}</div>
        </el-form-item>
        <el-form-item :label="$t('name') + ':'" prop="name">
          <el-input v-model="plugin_data.name">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('icon') + ':'" prop="icon">
          <img-upload :icon_url="plugin_data.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
        </el-form-item>
        <el-form-item :label="$t('description') + ':'" prop="desc">
          <el-input type="textarea" v-model="plugin_data.description"></el-input>
        </el-form-item>
        <el-form-item :label="$t('store address') + ':'" prop="store_address">
          <el-input v-model="plugin_data.store_address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            {{ operationType === 'add' ? $t('create') : $t('update') }}
          </el-button>
          <el-button @click="resetForm('ruleForm')">{{ $t('Reset') }}</el-button>
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
      rules: {
        name: [
          { required: true, message: '请输入插件名称', trigger: 'blur' }
        ]
      },
      dialog_form_visible: false,
      plugin_data : {},
    }
  },
  components : {
    imgUpload
  },
  watch : {
    visible(newValue) {
      this.dialog_form_visible = newValue;
    },
    dialog_form_visible(newValue) {
      this.$emit('visibleChange', newValue);
      return newValue;
    },
    chosenPluginData(newValue) {
      if (newValue && Object.keys(newValue).length > 0) {
        this.plugin_data = JSON.parse(JSON.stringify(newValue));
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
    /**
     *
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
          message: '上传图片失败',
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
      console.log('args',args);
      addPlugin(args).then((res) => {
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        }
      }).catch((err) => {
        this.$message({
          message: '操作失败',
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
      updatePlugin(args).then((res) => {
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialog_form_visible = false;
          this.$emit('operateSuccess');
        }
      }).catch((err) => {
        this.$message({
          message: '操作失败',
          type: 'error'
        });
      });
    },
    /**
     *
     * @param formName
     */
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.operationType === 'add') {
            await this.addPluginData();
          } else {
            await this.updatePluginData();
          }
        } else {
          console.log('error submit!!');
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