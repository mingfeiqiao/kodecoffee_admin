<template>
  <el-dialog :title="operationType === 'add' ? '新增插件' : '更新插件'" :visible.sync="dialogFormVisible"  width="50%" :modal-append-to-body="false">
    <div>
      <el-form :model="pluginData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="插件ID:" prop="client_key">
          <div>{{pluginData.client_key}}</div>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="pluginData.name">
          </el-input>
        </el-form-item>
        <el-form-item label="icon:" prop="icon">
          <img-upload :icon_url="pluginData.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
        </el-form-item>
        <el-form-item label="说明:" prop="desc">
          <el-input type="textarea" v-model="pluginData.description"></el-input>
        </el-form-item>
        <el-form-item label="商店地址:" prop="store_address">
          <el-input v-model="pluginData.store_address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            确定
          </el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
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
          { required: true, message: '请输入插件名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      pluginData : {
      },
    }
  },
  components : {
    imgUpload
  },
  watch : {
    visible(newValue) {
      this.dialogFormVisible = newValue;
    },
    dialogFormVisible(newValue) {
      this.$emit('visibleChange', newValue);
      return newValue;
    },
    chosenPluginData(newValue) {
      if (newValue && Object.keys(newValue).length > 0) {
        this.pluginData = JSON.parse(JSON.stringify(newValue));
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
    chosenPluginData: {
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
      let args = this.pluginData;
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
          this.dialogFormVisible = false;
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
      for (let key in this.pluginData) {
        if (this.pluginData[key] !== this.chosenPluginData[key]) {
          args[key] = this.pluginData[key];
        }
      }
      if (this.icon_file) {
        let icon = await this.getIconUrl('plugin', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      args.client_key = this.chosenPluginData.client_key;
      updatePlugin(args).then((res) => {
        if (parseInt(res.data.code) === 100000) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
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