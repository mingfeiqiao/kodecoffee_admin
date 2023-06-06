<template>
  <div>
    <el-upload action="" class="avatar-uploader" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <i v-if="imageUrl" class="el-icon-error" @click.stop="delImg()"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: null, // 本地预览图片的地址
      file: null, // 上传的文件对象
    };
  },
  watch: {
    icon_url(newValue) {
      this.imageUrl = newValue;
    }
  },
  mounted() {
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
      this.imageUrl = URL.createObjectURL(file); // 使用本地预览图片
      this.$emit('iconUpSourceChange', file);
      return false; // 阻止上传动作
    },
    handleUploadSuccess(response) {
    },
    delImg() {
      this.imageUrl = '';
      this.file = null;
      this.$emit('iconUpSourceChange', null);
    }
  },
};
</script>
<style scoped>
/deep/ .el-upload {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
/deep/ .avatar {
  width: 100px;
  height: 100px;
  display: block;
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