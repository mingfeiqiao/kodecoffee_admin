<template>
  <el-container style="height: 100%;width: 100%">
    <el-aside :width="this.isCollapse ? '64px' : '300px'" ref="sidebar" >
      <el-menu  :collapse="isCollapse" :router="true"  class="menu"  style="height: 100%; bottom: 0;" >
        <template v-for="menu of MENU">
          <template v-if="menu.children">
            <el-submenu :index="menu.url">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title">{{$t(menu.title)}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="item of menu.children">
                  <el-menu-item :index="item.url">
                    <i :class="item.icon"></i>
                    <span slot="title">{{$t(item.title)}}</span>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="menu.url">
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
      <el-header style="padding: 0;margin: 0;height: 40px">
        <head-top @collapseChange="collapseChange" :collapse="isCollapse"></head-top>
        <div>xxxx</div>
      </el-header>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
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
      isCollapse: false
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.resizeMenu();
  },
  methods: {
    collapseChange(collapse) {
      this.isCollapse = !!collapse;
      this.resizeMenu();
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
  },
  components: {
    headTop,
    breadCrumb
  }
}
</script>