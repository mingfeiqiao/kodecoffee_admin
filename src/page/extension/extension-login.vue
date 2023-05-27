<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding-bottom: 24px">
          <div class="title-28">登录</div>
        </div>
        <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;min-height: 300px;">
          <div v-if="!isSendEmail">
            <div style="padding-bottom: 16px">请输入支付时填写的邮箱</div>
            <div style="display: flex;padding-bottom: 16px">
              <el-input v-model="input" placeholder="example@mail.com"></el-input>
              <div @click="submitEmail" class="send-button">发送-></div>
            </div>
            <div>
              <div v-if="!isEmailValid" style="color:red">
                邮箱格式不正确，请重新输入
              </div>
              <div>
                我们会向该邮箱发送一封验证邮件，请登录该邮箱并点击验证链接以激活登录
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div style="color:red">
                邮箱格式不正确，请重新输入
              </div>
              <div>
                已经向xxxxx@xxx.com邮箱发送一封验证邮件，请登录该邮箱并点击验证链接以激活登录，请登录邮箱并点击验证链接，即可登录
              </div>
              <div>
                <span>未收到邮件？</span>
                <span @click="submitEmail" style="color: #1090FF">重新发送</span>
                <span style="color: #1090FF" @click="isSendEmail = false">修改邮箱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {extensionLogin} from "../../api/interface";
export default {
  data() {
    return {
      input: "",
      isEmailValid: true,
      emailErrorMessage: "",
      args : {
        api_key: '',
        application_id: '',
        extension_id: '',
        language: '',
      },
      isSendEmail: false,
    };
  },
  created() {
    console.log(this.$route.query);
  },
  methods: {
    isEmail(mail) {
      const regex = /^[\w-]+(\.[\w-]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      return regex.test(mail);
    },
    submitEmail() {
      if (!this.isEmail(this.input)) {
        this.isEmailValid = false;
        this.emailErrorMessage = "邮箱格式不正确，请重新输入";
      } else {
        this.isEmailValid = true;
        this.emailErrorMessage = "";
        this.isSendEmail = true;
        // extensionLogin({headers: this.$route.query, email: this.input}).then(res => {
        //   console.log(res);
        // });
      }
    }
  }
};
</script>
<style scoped lang="less">
.container {
  max-width: 1080px;
  padding: 24px 32px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  min-width: 600px;
}
.send-button {
  margin-left: 16px;
  border-radius: 5px;
  background-color: rgba(24, 144, 255, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(24, 144, 255, 1);
  min-width: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
}
</style>