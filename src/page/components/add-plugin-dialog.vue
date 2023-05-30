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
          <img-upload @iconUpSourceChange="iconUpSourceChange"></img-upload>
        </el-form-item>
        <el-form-item label="说明:" prop="desc">
          <el-input type="textarea" v-model="pluginData.description"></el-input>
        </el-form-item>
        <el-form-item label="商店地址:" prop="storeAddress">
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
import {addPlugin} from "../../api/interface";
import imgUpload from "./img-upload.vue";

export default {
  data () {
    return {
      iconChanged: false,
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
      this.pluginData = newValue;
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
    iconUpSourceChange(newValue) {
      this.iconChanged = true;
      this.pluginData.icon = newValue;
    },
    /**
     *
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     *
     * @param formName
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addPlugin(this.pluginData).then((res) => {
            if (res.data.code === 10000) {
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
          // 这里从前端数据中判断是新增还是编辑，然后发请求即可
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped lang="less">

</style>