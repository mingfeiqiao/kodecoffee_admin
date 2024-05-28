<template>
  <el-upload
    class="upload-cover"
    drag
    action=""
    accept="image/*"
    :show-file-list="false"
    :multiple="false"
    :before-upload="handleBeforeUpload"
    :on-success="handleUploadSuccess">
   <template v-if="image_url">
      <img :src="image_url" class="cover" alt="cover">
      <i v-if="image_url" class="el-icon-error" @click.stop="delImg()"></i>
    </template>
    <template v-else>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('Creator Cover Img tips')"></div>
    </template>
    <div class="el-upload__tip" slot="tip">{{$t("Cover Img placeholder")}}</div>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {
      image_url: null, // 本地预览图片的地址
      file: null, // 上传的文件对象
    };
  },
  watch: {
    icon_url(newValue) {
      this.image_url = newValue;
    }
  },
  mounted() {
    this.image_url = this.icon_url;
  },
  props: {
    iconUpSourceChange: {
      type: Function,
      default: () => {}
    },
    icon_url: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleBeforeUpload(file) {
      // 上传前的钩子函数
      this.file = file; // 保存文件对象
      const {size, ratio, message} = this.$attrs.limit
      const isJPG = true;
      const isLt2M = file.size / 1024 / 1024 < size;
      /* if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      } */
      if (!isLt2M) {
        this.$message.error(message);
      } else {
        this.image_url = URL.createObjectURL(file); // 使用本地预览图片
        this.$emit('iconUpSourceChange', file);
      }
      return false; // 阻止上传动作
    },
    handleUploadSuccess(response) {
    },
    delImg() {
      this.image_url = '';
      this.file = null;
      this.$emit('iconUpSourceChange', null);
    }
  },
};
</script>
<style scoped>
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
}
/deep/ .el-upload {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .el-upload:hover {
  border-color: #409eff;
}
.upload-cover .cover{
  width: 100%;
}
.el-icon-error {
  position: absolute;
  right: 3px;
  top: 3px;
  z-index: 9;
  font-size: 16px;
  cursor: pointer;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 2px #333;
}
</style>