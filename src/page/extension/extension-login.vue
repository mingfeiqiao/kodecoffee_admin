<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div style="padding: 24px 32px;height: calc(100% - 120px)">
          <div style="padding-bottom: 24px">
            <div class="title-28">{{$t('billing management')}}</div>
          </div>
          <div style="border: 1px solid rgba(233, 233, 233, 1);border-radius: 4px;height: 100%;" v-loading="google_login_args.is_third_part_loading">
            <div v-if="google_login_args.is_login_success" style="width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: space-between;">
              <div style="width: 100%;height: 90%;display: flex;justify-content: center;align-items: center;flex-direction:column">
                <svg width="100" height="100">
                  <use xlink:href="#success"></use>
                </svg>
                <div style="padding-top: 24px;font-size: 18px">
                  {{$t('Google login successful!')}}
                </div>
              </div>
              <div style="width: 100%;height: 10%;display: flex;align-items: center;justify-content: center">
                <div class="link" style="padding-bottom: 12px" @click="toSubscription()">
                  {{$t('Go to the bill management page')}}
                </div>
              </div>
            </div>
            <div v-else>
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
                <div style="padding-top: 24px">
                  <div style="width: 220px;height: 40px" id="google-signin-button"></div>
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
      </div>
      <div>
        <language-change></language-change>
      </div>
    </main>
  </div>
</template>

<script>
import {
  attributeApi,
  extensionLogin,
  extensionUserInfo,
  attributeFprApi,
  extensionGoogleLoginApi
} from "../../api/interface";
import languageChange from "../components/language-change.vue";
export default {
  data() {
    return {
      input: "",
      LIMIT_GOOGLE_LOGIN_TIME: 120,
      is_email_valid: true,
      is_limit_click:false,
      args : {
        api_key: '',
        application_id: '',
        extension_id: '',
        language: '',
      },
      is_send_email: false,
      google_login_args: {
        google_client_id:'223143976587-tj8tqo961qf53m718cnae6jpp5fpdaps.apps.googleusercontent.com',
        is_third_part_loading:false,
        is_login_success:false,
        countdown: 5, // 初始倒计时秒数
        countdown_interval: null // 用于存储定时器引用的属性
      }
    };
  },
  beforeDestroy() {
    this.google_login_args.countdown_interval = null;
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: this.google_login_args.google_client_id,
        context:'signin',
        auto_prompt:'false',
        callback: this.handleCredentialResponse
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          type:'standard',
          shape:'pill',
          logo_alignment:'left',
          text: 'login_with',
          locale: this.$i18n.locale
        }
      );
    };
    // 将script标签添加到body中
    document.body.appendChild(script);
    this.handleGoogleLoginLimit();
  },
  created() {
    let headers = this.getCommonHeaders();
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
     * 处理Google 一键登录速率限制
     */
    handleGoogleLoginLimit() {
      const limit_time = this.getLimitGoogleLoginTime();
      if (limit_time > 0) {
        this.is_limit_click = true;
        const google_sign_button = document.getElementById('google-signin-button')
        google_sign_button.setAttribute('style', 'opacity:.5')
        google_sign_button.addEventListener('click', function (event) {
          // 检查点击事件的目标元素是否是 iframe
          if (this.is_limit_click && event.target.tagName === 'IFRAME') {
            event.preventDefault(); // 阻止 iframe 的点击事件
            event.stopPropagation(); // 阻止事件冒泡
          } else {
            this.$message.warning("请在" + limit_time + "后使用Google一键登录")
            setTimeout(() => {
              google_sign_button.setAttribute('style', 'opacity:0');
              this.is_limit_click = false;
            }, limit_time * 1000)
          }
        });
      }
    },
    /**
     * 用户还需要等待多少秒，才能继续使用Google登录
     * @returns {number} 0 不需要等待， N 需要等待N秒
     */
    getLimitGoogleLoginTime() {
      const unix_timestamp_seconds = this.getTimeStampNow();
      const last_google_login_success = localStorage.get('last_google_login_success');
      if (last_google_login_success) {
        return unix_timestamp_seconds - last_google_login_success;
      } else {
        return 0
      }
    },
    /**
     * 获取当前的unix时间戳，不带时区， 秒为单位
     * @returns {number}
     */
    getTimeStampNow () {
      // 将毫秒数转换为秒数（Unix 时间戳以秒为单位，不带时区）
      return Math.floor(Date.now() / 1000);
    },
    /**
     * 设置Google登录上次登录成功事件
     */
    setLastGoogleLoginSuccessTime() {
      localStorage.setItem('last_google_login_success', String(this.getTimeStampNow()))
    },
    getCommonHeaders() {
      let headers = {};
      for (let key in this.$route.query) {
        let newKey = key.replace(/_/g, "-");
        headers[newKey] = this.$route.query[key];
      }
      return headers
    },
    handleCredentialResponse(response) {
      const limit_time = this.getLimitGoogleLoginTime()
      if (limit_time > 0) {
        this.$message.warning("请在" + limit_time + "后使用Google一键登录");
      }
      this.google_login_args.is_third_part_loading = true;
      extensionGoogleLoginApi(this.getCommonHeaders(),response).then(res => {
        this.google_login_args.is_third_part_loading = false;
        const { data } = res || {};
        const { code = 0, message } = data;
        if (parseInt(code) === 100000) {
          this.setLastGoogleLoginSuccessTime();
          this.google_login_args.is_login_success = true;
          window.postMessage({
            type: 'login',
            data: this.$route.query
          });
        } else {
          if (message) {
            this.$message.warning(message)
          }
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
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
            vm.attribute();
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
    },
    /**
     * 上报接口
     */
    attribute () {
      const api_key = this.$route.query.api_key || "";
      const extension_id = this.$route.query.client_id || "";
      if (api_key && extension_id) { // 这里代表正常参数，只处理正常参数的内容
        let commission_key = this.$mode + '-commission-ext-ids';
        let vitality_key = this.$mode + '-share-ext-ids';
        let commission_ext_ids = localStorage.getItem(commission_key);
        if (commission_ext_ids) {
          commission_ext_ids = JSON.parse(commission_ext_ids);
          this.attributeLogin('commission', commission_ext_ids, extension_id, api_key)
        } else {
          let share_ext_ids = localStorage.getItem(vitality_key);
          if (share_ext_ids) {
            share_ext_ids = JSON.parse(share_ext_ids);
            this.attributeLogin('share', share_ext_ids, extension_id, api_key)
          }
        }
      }
    },
    /**
     * 不再存储了
     * @param type
     * @param ext_ids
     * @param extension_id
     * @param api_key
     */
    attributeLogin (type, ext_ids, extension_id, api_key) {
      if (ext_ids[extension_id] && ext_ids[extension_id].share_id) { // 代表存在该插件的归因信息，不存在的不进行上报
        let args = {
          step: "login",
          api_key: api_key,
          attribution: {
            email: this.input,
            extension_id: extension_id,
            u_id : ext_ids[extension_id].u_id || "",
            share_id: ext_ids[extension_id].share_id || "",
            click_time: ext_ids[extension_id].click_time || "",
            install_time: ext_ids[extension_id].install_time || "",
          }
        }
        if (type === 'share') {
          attributeApi(args).then(res => {
            console.log('report share success');
          })
        } else if (type === 'commission') {
          args.attribution.fpr_code = args.attribution.share_id;
          delete args.attribution.share_id;
          attributeFprApi(args).then(res => {
            console.log('report commission success');
          })
        }
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
.text-loading:after{
  content:'...';
  animation: text-loading 2s infinite;
}
@keyframes text-loading {
  25%{
    content: ".";
  }
  50%{
    content: "..";
  }
  100%{
    content: "...";
  }
}
</style>