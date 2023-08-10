<template>
  <div>
    <el-popover
      placement="bottom"
      width="100"
      trigger="hover">
      <div @click="webLoginOut" style="cursor: pointer">
        {{$t('Logout')}}
      </div>
      <div slot="reference" style="display: flex;align-items: center;cursor: pointer">
        <el-image v-if="k_user_info.icon" style="width: 32px; height: 32px;border-radius: 50%;" :src="k_user_info.icon" fit="fill"></el-image>
        <svg width="32" height="32">
          <use xlink:href="#default-user-icon"></use>
        </svg>
        <div style="padding-left: 12px;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{ k_user_info.email }}</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import {loginOut, postUserInfo,zbUserInfo} from "../../api/interface";
import axios from "axios";
export default {
  data () {
    return {
      k_user_info: {}
    }
  },
  created() {
    this.loginOrRegisterUser();
  },
  methods: {
    /**
     *
     */
    loginOrRegisterUser () {
      let vm = this;
      // zbUserInfo().then(function(res) { // 先请求zbase的用户信息
      // axios.get('http://127.0.0.1:3000/user/v2/userinfo')
      axios.get('http://127.0.0.1:3000/user/v2/userinfo').then(function(res) { // 先请求zbase的用户信息
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          if (!res.data.userinfo) { // 如果没有用户信息，就跳转到登录页面(这里可能是zbase出了问题)
            vm.$message.error(vm.$t('Login failed. Please try logging in again'));
            window.location.href = `${vm.URL}/user/login`;
            return;
          }
          let user_info = res.data.userinfo;
          vm.k_user_info = {
            zbase_user_id: user_info.user_id,
            email: user_info.email ? user_info.email : '',
            account_name: user_info.username ? user_info.username : '',
            phone_number: user_info.phone_number ? user_info.phone_number : '',
            area: user_info.area ? user_info.area : '',
          };
          let last_user_info = localStorage.getItem(vm.$mode + 'userInfo');// 获取上次登录的用户信息
          if (last_user_info) {
            last_user_info = JSON.parse(last_user_info);
            if (last_user_info.zbase_user_id !== vm.k_user_info.zbase_user_id) { // 如果上次登录的用户和这次登录的用户不一致，那么需要重新登录
              vm.userLogin(vm.k_user_info);
            } else {
              vm.$store.commit('setLoginStatus', true); // 修改这一行
            }
            // 如果上次登录的用户和这次登录的用户一致，那么就不需要重新登录
          } else { // 如果没有上次登录的信息，那么基本可以认为用户第一次登录，需要注册
            vm.userLogin(vm.k_user_info);
          }
        } else {
          vm.$message.error(vm.$t('Login failed. Please try logging in again'));
          window.location.href = `${vm.URL}/user/login`;
        }
      }).catch(function(err) {
        vm.$message.error(vm.$t('Login failed. Please try logging in again'));
        console.log(err);
      });
    },
    /**
     * 登录
     * @param user_info
     */
    userLogin (user_info) {
      let vm = this;
      postUserInfo(user_info).then(function(res) {
        if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
          localStorage.setItem(vm.$mode + 'userInfo', JSON.stringify(user_info));
          // 登录成功之后就把当前的cookie存储下来，用于判断用户是否切换了zbase user
          vm.$store.commit('setLoginStatus', true); // 修改这一行
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch(function(err) {
        console.log(err);
      });
    },
    /**
     * 清除信息
     */
    deleteLocalStorageUserInfo () {
      localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'applicationKey');
      localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'userInfo');
      localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'token');
      localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'applicationKey');
      localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'userInfo');
      localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'token');
      window.location.href = `${this.URL}/user/login`;
    },
    /**
     * 登出
     */
    webLoginOut() {
      let vm = this;
      loginOut().then(res => {
        if (!res.data) {
          vm.$message.error('error')
          return;
        }
        if (parseInt(res.data.code) === 100000) {
          // 清除本地存储的用户信息
          vm.deleteLocalStorageUserInfo();
        } else {
          if (res && res.data && res.data.message) {
            vm.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>