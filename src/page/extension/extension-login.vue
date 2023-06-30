<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding: 24px 32px;height: calc(100% - 120px)">
          <div style="padding-bottom: 24px">
            <div class="title-28">{{$t('billing management')}}</div>
          </div>
          <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;height: 100%;">
            <div v-if="!is_send_email" style="height: 100%;padding:24px;">
              <div style="padding-bottom: 16px">{{$t('please input email')}}</div>
              <div style="display: flex;padding-bottom: 16px;">
                <el-input v-model="input" placeholder="example@mail.com" style="max-width: 350px"></el-input>
                <el-button size="small" type="primary" style="margin-left: 12px" @click="submitEmail">{{$t('send login')}}</el-button>
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
            <div v-else style="display: flex;align-items: center;flex-direction: column;padding:24px;">
              <div style="padding: 30px;">
                <div style="display: flex;justify-content: center;text-align: center;padding-top: 50px">
                  <span v-if="$i18n.locale === ZH_CODE">
                    已向<span class="title-16">{{input}}</span>发送邮件，<span class="title-16">请登录该邮箱并点击验证按钮以激活，</span>邮件有效期5分钟
                  </span>
                  <span v-else>
                    A verification email has been send to <span class="title-16">{{input}},Please login to your email and click Verify to activate.</span>Valid for 5 minutes
                  </span>
                </div>
              </div>
              <div style="height: 100%;display: flex;flex-direction: column;justify-content: space-between;width: 100%">
                <div class="link" style="width: 100%;text-align: center;padding: 30px 0" @click="toSubscription()">
                  {{$t('email verified')}}
                </div>
                <div>
                  <div style="color: #939393">{{ $t('mail not received') }}</div>
                  <div style="padding-top: 8px">
                    <span @click="submitEmail" class="link">{{$t('resend')}}</span>
                    <span class="link" style="margin-left: 8px" @click="is_send_email = false">{{$t('change email')}}</span>
                  </div>
                </div>
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
      const regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
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
      if (!this.isEmail(this.input)) {
        this.is_email_valid = false;
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
        let vm = this;
        extensionLogin(headers, body).then(res => {
          if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
            window.postMessage({
              type: 'login',
              data: vm.$route.query
            });
          } else {
            if (res && res.data && res.data.message) {
              vm.$message.warning(res.data.message)
            }
          }
        }).catch(err => {
          console.log(err)
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
.container {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  height: 600px;
  width: 600px;
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
  padding: 0 12px;
  cursor: pointer;
}
</style>