<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">{{ $t('Home') }}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in menu" :key="index" :to="{path: item.url}">{{$t(item.name)}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">

</style>