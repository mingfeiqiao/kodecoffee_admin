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
        <el-image v-if="userInfo.icon" style="width: 32px; height: 32px;border-radius: 50%;" :src="userInfo.icon" fit="fill"></el-image>
        <svg width="32" height="32">
          <use xlink:href="#default-user-icon"></use>
        </svg>
        <div style="padding-left: 12px;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{userInfo.email}}</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import {loginOut, postUserInfo, zbUserInfo} from "../../api/interface";

export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created() {
    // 确定当前环境，如果是测试环境，那么就需要确实测试环境是否有用户信息，如果没有，那么需要接口调用获取用户信息
    let lUserInfo = localStorage.getItem(this.$mode + 'userInfo')
    if (lUserInfo) { // 本地如果已经存储了用户信息，那么就不需要再次调用接口获取用户信息
      this.userInfo = JSON.parse(lUserInfo);
    } else {
      this.loginOrRegisterUser();
    }
  },
  methods: {
    testData() {
      return {
        "code": 100000,
        "message": "success",
        "product_id": 70,
        "product_mark": 70,
        "userinfo": {
          // "user_id": 12345678,
          "user_id":2870346,
          // "user_id":2912918,
          // "user_id":"2840846",
          "email": "ligoogel1918@gmail.com",
          "username": "李谷歌",
          "created_at": "2023-05-29 20:27:01",
          "phone_number": ""
        },
        "payinfo": {
          "is_subscribed": "0",
          "plan_start": "",
          "plan_end": "",
          "plan_price": "",
          "plan_name": "No Plan",
          "plan_date": "No upcoming payments",
          "is_recurly": "0",
          "channel": "0",
          "status": "0"
        }
      };
    },
    async loginOrRegisterUser() {
      // let res = await zbUserInfo();
      // res = res.data;
      let res = this.testData();
      if (parseInt(res.code) === 100000) {
        console.log(res);
        if (!res.userinfo) {
          this.$message.error('error: please login again');
          window.location.href = 'https://kodepay.io/user/login'
          return;
        }
        let user_info = res.userinfo;
        this.userInfo = {
          zbase_user_id: user_info.user_id,
          email: user_info.email ? user_info.email : '',
          account_name: user_info.username ? user_info.username : '',
          phone_number: user_info.phone_number ? user_info.phone_number : '',
          area: user_info.area ? user_info.area : '',
        };
        let vm = this;
        postUserInfo(vm.userInfo).then(function(res) {
          localStorage.setItem(vm.$mode + 'userInfo', JSON.stringify(vm.userInfo));
          vm.$store.commit('setLoginStatus', true); // 修改这一行
        }).catch(function(err) {
          console.log(err);
        });
      } else {
        this.$message.error('error: please login again');
        window.location.href = 'https://kodepay.io/user/login'
      }
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
        window.location.href = `${this.URL}/user/login`;
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