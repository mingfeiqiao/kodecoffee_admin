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
        <el-avatar :size="24" v-if="user_info.icon" :src="user_info.icon"></el-avatar>
        <el-avatar :size="24" v-else> {{getUserAvatar}} </el-avatar>
<!--        <div style="padding-left: 12px;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{user_info.email}}</div>-->
      </div>
    </el-popover>
  </div>
</template>
<script>
import {loginOut} from "@/api/interface";
export default {
  data () {
    return {
      user_info: {}
    }
  },
  computed: {
    getUserAvatar({user_info}) {
      if(user_info.account_name) {
        return user_info.account_name.slice(0,1)
      } else {
        user_info.email = user_info.email || ''
        return user_info.email.slice(0,2)
      }
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