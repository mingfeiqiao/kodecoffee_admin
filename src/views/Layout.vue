<template>
 <el-container style="width: 100%;height: 100%">
   <el-header>
     <div class="header-fixed">
       <a href="#/" class="header-logo">
         <img class="pay-cup" src="@/assets/cup.png" alt="cup">
         <span>KodeCoffee</span>
       </a>
       <div class="header-right">
        <language-change></language-change>
        <el-button class="el-button-orange" size="mini" v-if="isLogin">{{ $t('Become creator') }}</el-button>
        <el-button style="color: #3D3D3D;" type="text" @click="goLogin" v-else>{{ $t('Login') }}</el-button>
       </div>
     </div>
   </el-header>
   <el-main>
      <router-view></router-view>
   </el-main>
<!--   <el-footer>Footer</el-footer>-->
 </el-container>
</template>

<script>
import userInfo from "@/page/components/user-info.vue";
import languageChange from "@/page/components/language-change.vue";
export default {
  name: "Layout",
  components: {
    userInfo,
    languageChange
  },
  data() {
    return {
      isLogin: false
    }
  },
  methods: {
    goLogin() {
      window.location.href = `${this.URL}/user/login`;
    },
  },
}
</script>

<style scoped lang="less">
@media (max-width: 768px) {
  .el-main {
    padding: 0;
  }
}
@media (max-width: 600px) {
  .header-fixed{
    padding: 10px!important;
  }
}
.header-fixed{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px 10%;
  box-shadow: 0 2px 4px #ddd;
}
.header-logo{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3D3D3D;
  font-family: AlibabaPuHuiTi;
  font-size: 18px;
  font-weight: bold;
  >img{
    width: 40px;
    height: 40px;
  }
}
.gradient-text {
  background-image: linear-gradient(to right, #ff0000, #00ff00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 18px;
  font-weight: 600;
}
.header-right{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-button{
    margin: 0 20px;
  }
}
</style>