<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding-bottom: 24px">
          <div class="title-28">{{$t('billing management')}}</div>
        </div>
        <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;padding: 16px 24px;min-height: 300px;width: 600px">
          <div v-if="!is_send_email">
            <div style="padding-bottom: 16px">{{$t('please input email')}}</div>
            <div style="display: flex;padding-bottom: 16px;">
              <el-input v-model="input" placeholder="example@mail.com" style="max-width: 400px"></el-input>
              <div @click="submitEmail" class="send-button">{{$t('send login')}}</div>
            </div>
            <div>
              <div v-if="!is_email_valid" style="color:red">
                {{$t('email format error')}}
              </div>
              <div>
                {{$t('send email to login')}}
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div>
                {{$t('email sent', {input: input})}}
              </div>
              <div style="color: #1090FF;cursor: pointer" @click="toSubscription()">
                  {{$t('email verified')}}
              </div>
              <div>
                <span>{{ $t('mail not received') }}</span>
                <span @click="submitEmail" style="color: #1090FF;cursor: pointer">{{$t('resend')}}</span>
                <span style="color: #1090FF;cursor: pointer" @click="is_send_email = false">{{$t('change email')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <language-change></language-change>
      </div>
    </main>
  </div>
</template>

<script>
import {extensionLogin, extensionUserInfo} from "../../api/interface";
import languageChange from "../components/language-change.vue";
export default {
  data() {
    return {
      input: "",
      is_email_valid: true,
      args : {
        api_key: '',
        application_id: '',
        extension_id: '',
        language: '',
      },
      is_send_email: false,
    };
  },
  created() {
    let headers = {};
    for (let key in this.$route.query) {
      let newKey = key.replace(/_/g, "-");
      headers[newKey] = this.$route.query[key];
    }
    let vm = this;
    extensionUserInfo(headers).then(res => {
      let resData = res.data;
      if (parseInt(resData.code) === 100000) {
        vm.$router.push({
          path: "/extension/pay-manage",
          query: vm.$route.query
        });
      }
    });
  },
  components: {
    languageChange
  },
  methods: {
    /**
     * 验证邮箱格式
     * @param mail
     * @returns {boolean}
     */
    isEmail(mail) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(mail);
    },
    /**
     * 跳转到订阅页面
     */
    toSubscription() {
      this.$router.push({
        path: "/extension/pay-manage",
        query: this.$route.query
      });
    },
    /**
     * 提交邮箱
     */
    submitEmail() {
      console.log(this.input);
      if (!this.isEmail(this.input)) {
        this.is_email_valid = false;
        return;
      } else {
        this.is_email_valid = true;
        this.is_send_email = true;
        let headers = {};
        for (let key in this.$route.query) {
          let newKey = key.replace(/_/g, "-");
          headers[newKey] = this.$route.query[key];
        }
        let body = {
          email: this.input
        };
        extensionLogin(headers, body).then(res => {
          if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
            window.postMessage({
              type: 'login',
              data: this.$route.query
            });
          }
        });
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
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
}
</style>