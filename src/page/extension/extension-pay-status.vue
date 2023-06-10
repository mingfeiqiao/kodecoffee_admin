<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div>
          <div v-if="params.status == 1">
            <div>
              <svg width="100" height="100">
                <use xlink:href="#success"></use>
              </svg>
            </div>
            <div class="title-24">
              {{'支付成功'}}
            </div>
            <div style="padding: 24px 0;" class="title-14">
              支付成功，账单发送至填写的邮箱，请注意查收, 点击<span style="color: #1090FF;cursor: pointer" @click="openPayManagePage">个人中心</span>可查看并修改邮箱
            </div>
          </div>
          <div v-else>
            <div>
              <svg width="100" height="100">
                <use xlink:href="#error"></use>
              </svg>
            </div>
            <div class="title-24">
              {{'支付失败'}}
            </div>
            <div style="padding: 24px 0;color: #f78989" class="title-14">
              {{errorMessage}}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: this.$route.query,
      isPaidSuccess: true
    };
  },
  created() {
    console.log(this.params);
    window.postMessage({
      type: 'pay',
      data: this.params
    });
  },
  methods: {
    openPayManagePage () {
      this.$router.push({path: '/extension/pay-manage', query: this.$route.query});
    }
  }
};
</script>
<style scoped lang="less">
.container {
  width: 600px;
  height: 400px;
  border-radius: 5px;
  display:flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}
</style>