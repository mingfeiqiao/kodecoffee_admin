<template>
  <el-container style="width: 100%;height: 100%">
    <el-aside :width="this.isCollapse ? '64px' : '300px'" ref="sidebar">
      <el-menu :default-active="currentMenu" :collapse="isCollapse" router style="height: calc(100% - 10px); bottom: 0;" >
        <template v-for="menu of MENU">
          <template v-if="menu.children">
            <el-submenu :index="menu.url">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title">{{$t(menu.title)}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="item of menu.children">
                  <el-menu-item :index="item.url"  @click="handleMenuItemClick(item.url)">
                    <i :class="item.icon"></i>
                    <span slot="title">{{$t(item.title)}}</span>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="menu.url"  @click="handleMenuItemClick(menu.url)">
              <i :class="menu.icon"></i>
              <span slot="title">{{$t(menu.title)}}</span>
            </el-menu-item>
          </template>
        </template>
        <el-menu-item index="bottom" style="position: absolute; bottom: 0;">
          <i class="el-icon-s-order"></i>
          <span slot="title">{{'xxxx'}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container ref="content">
      <el-header style="padding: 0;margin: 0;height: auto">
        <head-top @collapseChange="collapseChange" :collapse="isCollapse"></head-top>
      </el-header>
      <div style="padding-bottom: 20px">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/">Home</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
              <router-link :to="breadcrumb.route">{{ breadcrumb.label }}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          {{this.$route.name}}
        </div>
      </div>
      <el-main v-if="isLoginIn" style="padding: 24px; background-color: #f0f0f0;">
        <div style="height: 100%; overflow: auto;">
          <div style="width: 100%; height: 100%; background-color: #ffffff;">
            <router-view></router-view>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import menuList from '../configs/menu.json'
import headTop from "./components/head-top.vue";
import breadCrumb from "./components/bread-crumb.vue";

export default {
  data () {
    return {
      MENU: menuList.menu,
      isCollapse: false,
      currentMenu: ''
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
  },
  watch: {
  },
  created() {
    this.isLoginIn =  !!localStorage.getItem(this.$mode + 'userInfo');
    console.log('是否：',this.isLoginIn)
  },
  methods: {
    collapseChange(collapse) {
      this.isCollapse = !!collapse;
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleMenuItemClick(url) {
      this.currentMenu = url;
      console.log(url);
    }
  },
  components: {
    headTop,
    breadCrumb
  }
}
</script>
<style>
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
</style>
