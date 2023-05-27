<template>
  <el-dialog :title="operationType === 'add' ? '新增插件' : '更新插件'" :visible.sync="dialogFormVisible"  width="30%" :modal-append-to-body="false">
    <div>
      <el-form :model="pluginData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="pluginData.extensionName"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input type="textarea" v-model="pluginData.remark"></el-input>
        </el-form-item>
        <el-form-item label="商店地址" prop="storeAddress">
          <el-input v-model="pluginData.storeAddress"></el-input>
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
export default {
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      pluginData : {},
    }
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
     * @param formName
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
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