<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div>
          <div>
            <div>
              <svg width="80" height="80" v-if="code === 100000">
                <use xlink:href="#success"></use>
              </svg>
              <svg width="80" height="80" v-else>
                <use xlink:href="#error"></use>
              </svg>
            </div>
            <div style="padding: 24px 80px;">
              {{message}}
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
      code: 0,
      message:"",
    };
  },
  created() {
    let params = this.$route.query;
    if (params.code && params.message) {
      this.code = parseInt(params.code);
      if(this.code === 100000) {
        window.postMessage({
          type: 'login in',
          data: this.params
        });
      }
      this.message = params.message;
    }
  },
  methods: {
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