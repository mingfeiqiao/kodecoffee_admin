<template>
  <div style="width: 100%;height: 100%" v-if="is_guide_loading_finish">
    <router-view></router-view>
    <new-icon></new-icon>
  </div>
</template>
<script>
import NewIcon from "./page/components/new-icon.vue";
import axios from "axios";
import {postUserInfo, zbUserInfo} from "./api/interface";
export default {
  components: {NewIcon},
  data () {
    return {
      is_guide_loading_finish: false
    }
  },
  created() {
    this.loginOrRegisterUser()
  },
  methods: {
    /**
     *
     */
    loginOrRegisterUser () {
      // zbUserInfo().then(function(res) { // 先请求zbase的用户信息
      // axios.get('http://127.0.0.1:3000/user/v2/userinfo')
      zbUserInfo().then(res => { // 先请求zbase的用户信息
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          if (!res.data.userinfo) { // 如果没有用户信息，就跳转到登录页面(这里可能是zbase出了问题)
            this.$message.error(this.$t('Login failed. Please try logging in again'));
            window.location.href = `${this.URL}/user/login`;
            return;
          }
          const user_info = res.data.userinfo;
          const k_user_info = {
            zbase_user_id: user_info.user_id,
            email: user_info.email ? user_info.email : '',
            account_name: user_info.username ? user_info.username : '',
            phone_number: user_info.phone_number ? user_info.phone_number : '',
            area: user_info.area ? user_info.area : '',
          };
          let last_user_info = localStorage.getItem(this.$mode + 'userInfo');// 获取上次登录的用户信息
          if (last_user_info) {
            last_user_info = JSON.parse(last_user_info);
            if (last_user_info.zbase_user_id !== k_user_info.zbase_user_id) { // 如果上次登录的用户和这次登录的用户不一致，那么需要重新登录
              this.userLogin(k_user_info);
            } else {// 如果上次登录的用户和这次登录的用户一致，那么就不需要重新登录
              this.$store.commit('setLoginStatus', true);
              this.initModeOrUrl()
            }
          } else { // 如果没有上次登录的信息，那么基本可以认为用户第一次登录，需要注册
            this.userLogin(k_user_info);
          }
        } else {
          this.$message.error(this.$t('Login failed. Please try logging in again'));
          window.location.href = `${this.URL}/user/login`;
        }
      }).catch(function(err) {
        this.$message.error(this.$t('Login failed. Please try logging in again'));
        console.log(err);
      });
    },
    /**
     * 登录
     * @param user_info
     */
    userLogin (user_info) {
      postUserInfo(user_info).then(res => {
        const { data } = res || {};
        const { code = 0 } = data || {};
        const { message } = data || {};
        if (parseInt(code) === 100000) {
          localStorage.setItem(this.$mode + 'userInfo', JSON.stringify(user_info));
          this.$store.commit('setLoginStatus', true); // 修改这一行
          this.initModeOrUrl()
        } else {
          if (message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(function(err) {
        console.log(err);
      });
    },
    initModeOrUrl () {
      let guide_step = localStorage.getItem('guideStep') || 0
      if (guide_step === 4) {
        localStorage.setItem('guideStep', '4');
        this.$store.commit('setGuideStep', 4);
        this.is_guide_loading_finish = true;
      } else {
        let last_user_info = localStorage.getItem(this.$mode + 'userInfo');// 获取上次登录的用户信息
        last_user_info = JSON.parse(last_user_info);
        fetch(`${this.MODECONFIG.SANDBOX.apiURL}/guide-step/search-guide-step`,{
          'method':'POST',
          'headers':{
            'Content-Type':'application/json'
          },
          'body':JSON.stringify({'zb_user_id': last_user_info.zbase_user_id})
        }).then(res => {
          return res.json();
        }).then(res => {
          const guide_step = res && res.data && res.data.step ? res.data.step : 0;
          localStorage.setItem('guideStep', guide_step);
          this.$store.commit('setGuideStep', guide_step);
          this.is_guide_loading_finish = true;
        }).catch(err => {
          console.log(err)
        });
      }
    }
  }
}
</script>
<style lang="less">
  @import 'css/root';
  @import 'css/common';
  .el-table__header {
    background-color: #85ce61; /* 设置表头背景色 */
    /* 添加其他样式设置 */
  }
  .el-table {
    color: #101010;
  }
</style>
