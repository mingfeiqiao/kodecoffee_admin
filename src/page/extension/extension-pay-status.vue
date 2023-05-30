<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div v-loading="loading">
          <div v-if="isPaidSuccess">
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
import {getUserInfo} from "../../api/interface";
export default {
  data() {
    return {
      loading: false,
      isPaidSuccess: true,
      errorMessage:'请完成3DS验证后支付，或者更换其他支付方式',
    };
  },
  created() {

  },
  methods: {
    // 获取用户信息，3s一次，最多重试15次，最长1分钟，如果获取到用户订单信息（不论成功还是失败）,停止重试， 第一次请求不设置延时
    getPayStatus() {
      return new Promise((resolve, reject) => {
        let retries = 0;
        const maxRetries = 15;
        const retryInterval = 3000;
        const maxDuration = 60000;
        let timer;
        const fetchUserInfo = () => {
          getUserInfo(this.$route.query)
              .then((response) => {
                if (response.data.data.is_paid) {
                  this.isPaidSuccess = true;
                  clearInterval(timer);
                  resolve(response);
                } else if (retries >= maxRetries) {
                  this.isPaidSuccess = false;
                  clearInterval(timer);
                  reject(new Error('Maximum retries reached'));
                } else {
                  retries++;
                  if (retries * retryInterval >= maxDuration) {
                    this.isPaidSuccess = false;
                    clearInterval(timer);
                    reject(new Error('Maximum duration reached'));
                  }
                }
              })
              .catch((error) => {
                this.isPaidSuccess = false;
                clearInterval(timer);
                reject(error);
              });
        };

        fetchUserInfo(); // 发送第一次请求

        if (this.isPaidSuccess) {
          resolve();
        } else {
          timer = setInterval(fetchUserInfo, retryInterval);
        }
      });
    },
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