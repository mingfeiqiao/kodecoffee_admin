<template>
  <div>
    <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadUrl: '', // 替换为你的上传接口地址
      imageUrl: '', // 上传成功后的图片链接
      file: null, // 上传的文件对象
    };
  },
  watch: {
    uploadUrl: function (val) {
      console.log(val)
    }
  },
  props: {
    iconUpSourceChange: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleBeforeUpload(file) {
      // 上传前的钩子函数
      this.file = file; // 保存文件对象
      this.imageUrl = URL.createObjectURL(file); // 使用本地预览图片
      return false; // 阻止上传动作
    },
    handleUploadSuccess(response) {
      console.log('xxxx');
      console.log(response);
      console.log(response.data);
      this.$emit('iconUpSourceChange', response.data);
    },
    changeAvatar() {
      // 更换头像操作
      this.file = null; // 清空文件对象
      this.imageUrl = ''; // 清空图片链接
    },
  },
};
</script>
<style scoped>
.avatar-uploader {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
