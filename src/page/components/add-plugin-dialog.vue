<template>
  <el-dialog :title="$t('Creator Info')"
             :visible.sync="dialog_form_visible" width="50%"
             :modal-append-to-body="false"
             :destroy-on-close="true">
    <el-form :model="plugin_data" :rules="rules" ref="pluginRuleForm" label-width="120px">
      <el-form-item :label="$t('Creator Client Id') + ':'" prop="client_key" v-if="operationType !== 'add'">
        <div>{{ plugin_data.client_key }}</div>
      </el-form-item>
      <el-form-item :label="$t('Creator Home link') + ':'" prop="uniq_name">
        <el-link :underline="false" :href="getShareLink" target="_blank">{{getShareLink}}</el-link>
        <el-button type="text" @click="copyShareLink"><span id="copy_text" style="padding: 0 10px">{{$t('CopyShare')}}</span></el-button>
      </el-form-item>
      <el-form-item :label="$t('Creator Name') + ':'" prop="name">
        <el-input v-model="plugin_data.name" :placeholder="$t('Creator placeholder')" maxlength="100">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Creator Profile photo') + ':'" prop="icon">
        <div style="display: flex;align-items: center;">
          <img-upload :limit="{size:5,ratio:'1x1', message: $t('Profile placeholder')}" style="width: 101px;" :icon_url="plugin_data.icon" @iconUpSourceChange="iconUpSourceChange"></img-upload>
          <span style="margin-left: 10px;color: #101010;font-size: 12px;">{{$t('Profile placeholder')}}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('Creator Product info') + ':'" prop="on_working">
        <el-input type="textarea" v-model="plugin_data.on_working" :placeholder="$t('Product info placeholder')" maxlength="120"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Creator About me') + ':'" prop="description">
        <el-input type="textarea" v-model="plugin_data.description" :placeholder="$t('About me placeholder')" maxlength="120"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Creator Project Link') + ':'" prop="external_link">
        <el-input type="text" v-model="plugin_data.external_link" :placeholder="$t('Project Link placeholder')" maxlength="120"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Creator Cover Img') + ':'" prop="cover">
        <img-upload-cover :limit="{size:5,ratio:'1140x200', message: $t('Cover Img placeholder')}"  :icon_url="plugin_data.cover" @iconUpSourceChange="handleCoverSourceChange"></img-upload-cover>
      </el-form-item>
      <el-form-item :label="$t('Simultaneously Online') + ':'"  prop="allow_online_user_limit_count" v-if="0">
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
<!--        <el-button @click="resetForm('pluginRuleForm')" size="small">{{ $t('Reset') }}</el-button>-->
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import Clipboard from "clipboard";
import {addPlugin, uploadFile, updatePlugin} from "@/api/interface";
import imgUpload from "./img-upload.vue";
import imgUploadCover from "./img-upload-cover.vue";
export default {
  data () {
    return {
      cover_url: null,
      cover_file: null,
      icon_file: null,
      is_limit_user:false,
      dialog_form_visible: false,
      store_address: this.URL+'/i/',
      plugin_data : {
        uniq_name: 'RunningV',
        allow_online_user_limit_count:0,
        external_link: '',
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
    imgUpload,
    imgUploadCover
  },
  computed: {
    rules () {
      return {
        name: [
          { required: true, message: this.$t('1-50 characters required'), trigger: 'blur'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        store_address123: [
          { message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
          { validator: this.validateTrimmedField, trigger: 'blur'}
        ],
        external_link: [
          { message: this.$t('please input valid URL'), trigger: 'blur', type:  'url'},
        ],
      }
    },
    getShareLink() {
      return this.plugin_data.store_address + this.plugin_data.uniq_name||''
    },
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
      args.store_address = this.store_address;
      if (this.icon_file) {
        let icon = await this.getIconUrl('plugin', this.icon_file);
        if (icon) {
          args.icon = icon;
        }
      }
      if (this.cover_file) {
        let cover = await this.getIconUrl('plugin', this.cover_file);
        if (cover) {
          args.cover = cover;
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
      if (this.cover_file) {
        let cover = await this.getIconUrl('plugin', this.cover_file);
        if (cover) {
          args.cover = cover;
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
      args.store_address = this.store_address;
      args.uniq_name = 'RunningV'
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
    },
    handleCoverSourceChange(file) {
      this.cover_file = file
    },
    copyShareLink(){
      let clipboard = new Clipboard('#copy_text', {
        text: () => {
          return this.getShareLink
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
  }
}
</script>
<style scoped lang="less">

</style>