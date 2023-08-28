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
        <el-image v-if="user_info.icon" style="width: 32px; height: 32px;border-radius: 50%;" :src="user_info.icon" fit="fill"></el-image>
        <svg width="32" height="32">
          <use xlink:href="#default-user-icon"></use>
        </svg>
        <div style="padding-left: 12px;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{user_info.email}}</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import {loginOut} from "../../api/interface";
export default {
  data () {
    return {
      user_info: {}
    }
  },
  created() {
    this.user_info = localStorage.getItem(this.$mode + 'userInfo') ? JSON.parse(localStorage.getItem(this.$mode + 'userInfo')) : {};
  },
  methods: {
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
      loginOut().then(res => {
        if (!res.data) {
          this.$message.error('error')
          return;
        }
        const { data } = res || {};
        const { code = 0 } = data || {};
        const { message } = data || {};
        if (parseInt(code) === 100000) {
          // 清除本地存储的用户信息
          this.deleteLocalStorageUserInfo();
        } else {
          if (message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>