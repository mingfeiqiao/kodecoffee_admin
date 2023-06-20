
<template>
  <el-card class="dashboard-card" shadow="never" :body-style="{'padding':'24px 24px 12px 24px'}">
    <div>
      <div style="border-bottom: 1px solid rgba(232, 232, 232, 1);padding-bottom: 24px">
        <div style="color: #939393">{{ $t(data.title)}}</div>
        <div class="title-28">{{data.title_value}}</div>
      </div>
      <div style="padding-top: 8px">
        <span>{{$t(data.bottom) + ":"}}</span><span style="padding-left: 12px">{{ data.bottom_value }}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  props:{
    data:{
      type:Object,
      default(){
        return {
          title:"",
          title_value:"",
          bottom:"",
          bottom_value:""
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.dashboard-card {
  width: calc((100% - 24px * 3) / 4);
}
</style>