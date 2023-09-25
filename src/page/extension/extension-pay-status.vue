<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div>
          <div v-if="params.status == 1">
            <div>
              <svg width="100" height="100">
                <use xlink:href="#success"></use>
              </svg>
            </div>
            <div class="title-24">
              {{$t('pay success')}}
            </div>
            <div v-if="params.redirect_url" style="padding: 24px 80px;">
              <span>
                <span>{{$t('seconds to jump', {seconds:this.countdown})}}</span>
                <span class="text-loading"></span>
              </span>
            </div>
            <div v-else style="padding: 24px 80px;">
              {{$t('pay success tip')}}
              <span style="color: #1090FF;cursor: pointer" @click="openPayManagePage">{{$t('click to billing')}}</span>
            </div>
          </div>
          <div v-else>
            <div>
              <svg width="100" height="100">
                <use xlink:href="#error"></use>
              </svg>
            </div>
            <div class="title-24">
              {{$t('pay failed')}}
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
import languageChange from "../components/language-change.vue";
import {attributeApi, attributeFprApi} from "../../api/interface";
export default {
  components: {languageChange},
  data() {
    return {
      countdown: 5, // 倒计时秒
      timer:null,// 用于存储计时器的引用
      params: this.$route.query,
    };
  },
  mounted() {
    if (parseInt(this.params.status) === 1 && this.params.redirect_url) {
      this.startCountDown()
    }
  },
  beforeDestroy() {
    // 在组件销毁之前清除计时器，以避免内存泄漏
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {
    window.postMessage({
      type: 'pay',
      data: this.params
    });
    if (window.opener) {
      window.opener.postMessage({
        type: 'pay',
        data: this.params
      }, "*");
    }
    if (parseInt(this.params.status) === 1) {
      this.attribute();
    }
  },
  methods: {
    navigateToPage(params) {
     window.location.href = this.getRedirectUrl(params, this.params.redirect_url);
    },
    startCountDown() {
      this.timer = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown --;
        } else {
          clearInterval(this.timer);
          const params = {}
          for (const key in this.params){
            if (key !== 'redirect_url') {
              params[key] = this.params[key]
            }
          }
          this.navigateToPage(params);
        }
      }, 1000)
    },
    getRedirectUrl (params, targetUrl) {
      // 获取目标URL的参数（如果有的话）
      const targetParams = new URLSearchParams(new URL(targetUrl).search);
      // 将源URL的参数添加到目标URL的参数中
      for (const key in params){
        if (params.hasOwnProperty(key)) {
          const value = params[key];
          targetParams.append(key, value)
        }
      }
      // 构建新的目标URL
      return targetUrl.split('?')[0] + '?' + targetParams.toString();
    },
    /**
     * 打开计费管理页面
     */
    openPayManagePage () {
      this.$router.push({path: '/extension/pay-manage', query: this.$route.query});
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
          this.attributePay('commission', commission_ext_ids, extension_id, api_key)
        } else {
          let share_ext_ids = localStorage.getItem(vitality_key);
          if (share_ext_ids) {
            share_ext_ids = JSON.parse(share_ext_ids);
            this.attributePay('share', share_ext_ids, extension_id, api_key)
          }
        }
      }
    },
    attributePay (type, ext_ids, extension_id, api_key) {
      if (ext_ids[extension_id] && ext_ids[extension_id].share_id) { // 代表存在该插件的归因信息，不存在的不进行上报
        let args = {
          step: "pay",
          api_key: api_key,
          attribution: {
            extension_id: extension_id,
            u_id : ext_ids[extension_id].u_id || "",
            share_id: ext_ids[extension_id].share_id || "",
            click_time: ext_ids[extension_id].click_time || "",
            install_time: ext_ids[extension_id].install_time || ""
          }
        }
        if (type === 'share') {
          attributeApi(args).then(res => {
            console.log('report success');
          })
        } else if (type === 'commission') {
          args.attribution.fpr_code = args.attribution.share_id;
          delete args.attribution.share_id;
          attributeFprApi(args).then(res => {
            console.log('report success');
          })
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.container {
  width: 600px;
  height: 400px;
  border-radius: 5px;
  display:flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
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