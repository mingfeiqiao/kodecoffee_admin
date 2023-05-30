<template>
  <div>
    <el-popover
      placement="bottom"
      width="100"
      trigger="hover">
      <div @click="webLoginOut" style="cursor: pointer">
        login out
      </div>
      <div slot="reference" style="display: flex;align-items: center;cursor: pointer">
        <el-image style="width: 32px; height: 32px;border-radius: 50%;" :src="userInfo.icon" fit="fill"></el-image>
        <div style="padding-left: 12px;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{userInfo.email}}</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import {loginOut, postUserInfo} from "../../api/interface";
export default {
  data () {
    return {
      userInfo: {
      }
    }
  },
  created() {
    // fetch('https://kodepay.io/user/v2/userinfo').then(res => {
    //   console.log(res);
    // // 获取不到用户信息跳转到登录页面
    // }).catch(err => {
    //   window.location.href = 'https://kodepay.io/login';
    // });
    // 确定当前环境，如果是测试环境，那么就需要确实测试环境是否有用户信息，如果没有，那么需要接口调用获取用户信息
    let lUserInfo = localStorage.getItem(this.$mode + 'userInfo')
    console.log(lUserInfo)
    if (lUserInfo) { // 本地如果已经存储了用户信息，那么就不需要再次调用接口获取用户信息
      this.userInfo = JSON.parse(lUserInfo);
    } else {
      this.loginOrRegisterUser();
    }

  },
  methods: {
    loginOrRegisterUser() {
      let zbaseUserInfo = {
        "user_id": 28410,
        "email": "1173813923@qq.com",
        "username": "",
        "created_at": "2023-05-25 02:59:11",
        "phone_number": ""
      }
      this.userInfo = {
        zbase_user_id: zbaseUserInfo.user_id,
        email:zbaseUserInfo.email,
        account_name:zbaseUserInfo.username,
        phone_number:zbaseUserInfo.phone_number,
        area: zbaseUserInfo.area ? zbaseUserInfo.area : '',
      }
      postUserInfo(this.userInfo).then(res => {
        localStorage.setItem(this.$mode + 'userInfo', JSON.stringify(this.userInfo));
      }).catch(err => {
        console.log(err);
      })
      // fetch('https://kodepay.io/user/v2/userinfo').then(res => {
      //   if (parseInt(res.data.code) === 100000) {
      //     let user_info = res.data.data.userinfo;
      //     this.userInfo = {
      //       zbase_user_id: user_info.user_id,
      //       email:user_info.email ? user_info.email : '',
      //       account_name:user_info.username ? user_info.username : '',
      //       phone_number:user_info.phone_number ? user_info.phone_number : '',
      //       area: user_info.area ? user_info.area : '',
      //     }
      //     postUserInfo(this.userInfo).then(res => {
      //       localStorage.setItem(this.$mode + 'userInfo', JSON.stringify(this.userInfo));
      //     }).catch(err => {
      //       console.log(err);
      //     })
      //   }
      //   // 获取不到用户信息跳转到登录页面
      // }).catch(err => {
      //   window.location.href = 'https://kodepay.io/user/login';
      // });
    },
    webLoginOut() {
      loginOut().then(res => {
        // 清除本地存储的用户信息
        localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'applicationKey');
        localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'userInfo');
        localStorage.removeItem(this.MODECONFIG.PRODUCTION.mode + 'token');
        localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'applicationKey');
        localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'userInfo');
        localStorage.removeItem(this.MODECONFIG.SANDBOX.mode + 'token');
        this.$router.push('/login');
        // 最好把cookie 也清理了
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped lang="less">

</style>