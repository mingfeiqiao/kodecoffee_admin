<template>
  <el-container style="width: 100%;height: 100%">
    <el-aside :width="isCollapse ? '64px' : '180px'"  ref="sidebar"  class="sidebar" v-if="activeStep >= 3">
      <el-menu :default-active="currentMenu" :collapse="isCollapse" router style="height: 100%; bottom: 0;"
               background-color="#001529"
               text-color="#FFF"
               active-text-color="#FFF"
               active-background-color="#409eff"
               @open="handleOpen" @close="handleClose"
               class="el-menu-vertical-demo"
      >
        <el-menu-item style="height: 64px;cursor: default;">
          <img src="@/assets/cup.png" alt="kodecoffee" style="width: 30px;height: 30px">
          <span slot="title" style="color: #fff">KodeCoffee</span>
        </el-menu-item>
        <template v-for="menu of MENU">
          <template v-if="menu.children">
            <el-submenu :index="menu.url">
              <template slot="title">
                <svg width="18" height="18" style="padding-right: 8px" fill="#fff">
                  <use :xlink:href="'#' + menu.icon"></use>
                </svg>
                <span slot="title">{{$t(menu.title)}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="item of menu.children">
                  <el-menu-item :index="item.url"  @click="handleMenuItemClick(item.url)">
                    <span slot="title">{{$t(item.title)}}</span>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="menu.url"  @click="handleMenuItemClick(menu.url)">
              <svg width="18" height="18" style="padding-right: 8px" fill="#fff">
                <use :xlink:href="'#' + menu.icon"></use>
              </svg>
              <span slot="title">
                {{$t(menu.title)}}
              </span>
            </el-menu-item>
          </template>
        </template>
<!--        <el-menu-item @click="gotoDocCenter($i18n.locale)" >
          <svg width="18" height="18" style="padding-right: 8px" fill="#fff">
            <use xlink:href="#help-center"></use>
          </svg>
          <span slot="title">{{$t('document and help')}}</span>
        </el-menu-item>-->
      </el-menu>
    </el-aside>
    <el-container ref="content">
      <el-header style="padding: 0;margin: 0;height: auto;border-bottom: 1px solid rgba(232, 232, 232, 1);background-color: #ffffff">
        <head-top @collapseChange="collapseChange" :collapse="isCollapse"></head-top>
      </el-header>
      <div style="padding: 16px 24px" v-if="!['dashboard', 'guideStep'].includes($route.name)">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/">{{$t('Home')}}</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
              <router-link :to="breadcrumb.route">{{ $t(breadcrumb.label) }}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <el-main v-if="isLoginIn " style="padding: 24px; background-color: #f0f0f0;height: 100%" >
        <div v-if="$route.name !== 'dashboard'" style="background-color: #ffffff;padding: 24px;min-height: calc(100% - 48px);">
          <router-view></router-view>
        </div>
        <div v-else>
          <router-view></router-view>
        </div>
      </el-main>

      <el-footer height="60px">
        <el-tooltip placement="top" effect="light">
          <div slot="content" style="text-align: center;width: 200px;font-size: 14px;">
            <p style="color: #3D3D3D;font-weight: 700;margin-bottom: 16px;">{{ $t('technical support') }}</p>
            <img style="width: 150px;height: 150px;" src="http://saasbox.uncledesk.com/wp-content/uploads/2024/01/KodeLab_WeChat.png"><p style="margin-bottom: 25px;">微信扫码</p>
            <img style="width: 150px;height: 150px;" src="http://saasbox.uncledesk.com/wp-content/uploads/2024/01/KodeLab_WhatsApp.png"><p style="margin-bottom: 25px;">WhatsApp <el-link type="primary" href="https://api.whatsapp.com/send/?phone=15309888116&text&type=phone_number&app_absent=0">{{ $t('Start conversation') }}</el-link></p>
          </div>
          <div>
            <img src="http://saasbox.uncledesk.com/wp-content/uploads/2024/01/容器-1-1.png" alt="Technical Support" style="height: 24px;width: 24px;">
            <p>{{ $t('Technical Support') }}</p>
          </div>
        </el-tooltip>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import menuList from '@/configs/menu.json'
import OPTIONS from '@/options/coffee_price_options.json'
import headTop from "./AdminHeadTop.vue";
import { Crisp } from "crisp-sdk-web";
import breadCrumb from "@/page/components/bread-crumb.vue";
import {getOptions, postUserInfo, zbUserInfo, getGuideStepApi} from "@/api/interface";
import Vue from "vue";
export default {
  name: "AdminLayout",
  data () {
    return {
      MENU: menuList.menu,
      is_guide_loading_finish: false,
      isCollapse: false,
      currentMenu: '',
      is_option_load: false,
    }
  },
  computed: {
    breadcrumbs() {
      const matchedRoutes = this.$route.matched;
      const breadcrumbs = [];
      let path = '';
      for (let i = 1; i < matchedRoutes.length; i++) {
        const route = matchedRoutes[i];
        const breadcrumbLabel = route.meta.breadcrumbLabel;
        if (breadcrumbLabel) {
          path += route.path;
          breadcrumbs.push({
            label: breadcrumbLabel,
            route: path,
          });
          path += '/';
        }
      }
      return breadcrumbs;
    },
    isLoginIn: {
      get() {
        return this.$store.getters.isLoginIn;
      },
      set(value) {
        this.$store.commit('setLoginStatus', value);
      },
    },
    activeStep() {
      return this.$store.state.guide_step
    },
  },
  created() {
    // Crisp.configure('29c69934-5e71-4ba8-9eff-d80342cdd79e');
    // Crisp.chat.show();
    // Vue.prototype.$Crisp = Crisp;
    // this.loginOrRegisterUser();
    this.test();
    this.initOptions();
    this.currentMenu = this.$route.path; // 初始化当前路由路径
  },
  methods: {
    test() {
      const res = {};
      res.data123 = {
        "code": 100000,
        "message": "success",
        "product_id": 102,
        "product_mark": 101,
        "userinfo": {
            "user_id": 8081320,
            "email": "runninglei@gmail.com",
            "username": "Running V",
            "created_at": "2024-05-08 20:11:44",
            "phone_number": "",
            "utm_active_code": ""
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
      res.data = {
        "code": 100000,
        "message": "success",
        "product_id": 102,
        "product_mark": 101,
        "userinfo": {
            "user_id": 8127367,
            "email": "1140353684@qq.com",
            "username": "",
            "created_at": "2024-05-14 01:08:50",
            "phone_number": "",
            "utm_active_code": ""
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
    }
      this.handleResult(res);
    },
    /**
     *
     */
    loginOrRegisterUser () {
      // zbUserInfo().then(function(res) { // 先请求zbase的用户信息
      // axios.get('http://127.0.0.1:3000/user/v2/userinfo')
      zbUserInfo().then(res => { // 先请求zbase的用户信息
        this.handleResult(res);
      }).catch( err => {
        this.$message.error(this.$t('Login failed. Please try logging in again'));
        // window.location.href = `${this.URL}/user/login`;
      })
    },
    handleResult(res) {
      const data = res.data
      const userinfo = data.userinfo || {}
      if (+data.code === 100000) {
        if (!res.data.userinfo) { // 如果没有用户信息，就跳转到登录页面(这里可能是zbase出了问题)
          this.$message.error(this.$t('Login failed. Please try logging in again'));
          window.location.href = `${this.URL}/user/login`;
          return;
        }
        const user_info = userinfo;
        const k_user_info = {
          zbase_user_id: user_info.user_id ? user_info.user_id : '',
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
            // this.initModeOrUrl()
          }
        } else { // 如果没有上次登录的信息，那么基本可以认为用户第一次登录，需要注册
          this.userLogin(k_user_info);
        }
        if(user_info.user_id) {
          this.getGuideStep(user_info.user_id)
        }
      } else {
        this.$message.error(this.$t('Login failed. Please try logging in again'));
        window.location.href = `${this.URL}/user/login`;
      }
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
          // this.initModeOrUrl()
        } else {
          if (message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getGuideStep(zb_user_id) {
       getGuideStepApi({zb_user_id}).then(res => {
          const {data} = res.data
          this.$store.commit('setGuideStep', data.step)
          if(data.step < 3) {
            this.$router.replace('/guide-step')
          }
        })
    },
    collapseChange(collapse) {
      this.isCollapse = !!collapse;
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    handleMenuItemClick(url) {
      this.currentMenu = url;
    },
    initOptions() {
      getOptions().then(res => {
        return res.json();
      }).then(res => {
        Vue.prototype.OPTIONS = res;
        this.is_option_load = true;
      }).catch(err => {
        Vue.prototype.OPTIONS = OPTIONS;
        console.log(err);
      })
    }
  },
  components: {
    headTop,
    breadCrumb
  }
}
</script>
<style scoped lang="less">
@import '../css/global.less';
.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb span {
  margin-left: 5px;
  margin-right: 5px;
}

.breadcrumb span:first-child {
  margin-left: 0;
}

.breadcrumb span:last-child {
  font-weight: bold;
}
.el-menu-item.is-active {
  background-color: @theme-main-color !important;
}

</style>
<style>
.sidebar .el-submenu__title i {
  color: #ffffff;
}

.el-footer{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  color: #ffffff;
  opacity: 1;
  border-radius: 8px;
  background: #3662EC;
  text-align: center;
  padding: 5px 0 0 0 !important;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 12px;
}
</style>