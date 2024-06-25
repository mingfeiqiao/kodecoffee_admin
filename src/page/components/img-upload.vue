<template>
  <el-upload ref="elUpload" action="" accept="image/*" class="avatar-uploader" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess">
    <img :style="styleObj" v-if="image_url" :src="image_url" class="avatar" alt="">
    <i v-else :style="styleObj" class="el-icon-plus avatar-uploader-icon"></i>
    <i v-if="image_url" class="el-icon-error" @click.stop="delImg()"></i>
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
  computed: {
    styleObj() {
      console.log(this.$attrs, 'this.$attrs')
      const {width=100, height} = this.$attrs.limit
      return {
        width: width + 'px',
        height: (height || width) + 'px',
      }
    },
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