<template>
  <div>
    <div>
      application_id: {{application_id}}
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
    data() {
      return {
        application_id: '123'
      }
    },
    mounted() {
      this.application_id = localStorage.getItem(this.$mode + 'applicationKey')
    }
  }
</script>
<style scoped lang="less">

</style>