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
import {loginOut, zbUserInfo, postUserInfo} from "../../api/interface";
export default {
  data () {
    return {
      userInfo: {
        icon:'https://lh3.google.com/u/0/ogw/AOLn63Gpb9pGgZzjno3a2M82bDzNz9AUcs4wNK_Tf8WP=s32-c-mo',
        email:'yuanshaokai@zingfront.com'
      }
    }
  },
  async created() {
    let zbaseUserInfo = {
      "user_id": 2841093,
      "email": "1173813923@qq.com",
      "username": "",
      "created_at": "2023-05-25 02:59:11",
      "phone_number": ""
    }
    let userInfo = {
      zbase_user_id: zbaseUserInfo.user_id,
      email:zbaseUserInfo.email,
      account_name:zbaseUserInfo.username,
      phone_number:zbaseUserInfo.phone_number,
      area: zbaseUserInfo.area ? zbaseUserInfo.area : '',
    }
    postUserInfo(userInfo).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
    //1. 获取用户信息
    // zbUserInfo().then(res => {
    //   console.log(res);
    //   postUserInfo(res.data).then(res => {
    //     console.log(res);
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // });
    //2. 将用户信息传递给后端
    //3. 拿到后端返回的token(这一步拦截器会自己做)
  },
  methods: {
    webLoginOut() {
      loginOut().then(res => {
        // 清除本地token
        // 清除本地cookie
        // 跳转到登录页面
        localStorage.removeItem('token');
        this.$router.push('/login');
      })
    }
  }
}
</script>
<style scoped lang="less">

</style>