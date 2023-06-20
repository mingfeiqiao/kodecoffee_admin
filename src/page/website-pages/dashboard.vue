<template>
  <div style="width:100%;height: 100%;">
    <div class="dashboard-card-container">
      <dashboard-card v-for="(value, key) in overall_data" :key="key" :data="value"></dashboard-card>
    </div>
    <div style="margin-top: 24px;background-color: #ffffff;height: 100%;padding: 24px">
      <div>
        <div>
        </div>
      </div>
      <div>

      </div>
    </div>
  </div>
</template>
<script>
import DashboardCard from "../components/dashboard-card.vue";
export default {
  components: {DashboardCard},
  data () {
    return {
      overall_data : {},
      date: null,
    }
  },
  created() {
    this.overall_data = this.formatOverallData();
  },
  methods: {
    formatOverallData () {
      return {
        total_revenue_data: {
          title: 'total revenue',
          title_value: '￥0.00',
          bottom: 'yesterday revenue',
          bottom_value: '￥0.00',
        },
        current_subscription: {
          title: 'current subscriptions',
          title_value: '8888',
          bottom: 'yesterday new additions',
          bottom_value: '66',
        },
        total_customers: {
          title: 'total customers',
          title_value: '￥0.00',
          bottom: 'yesterday new additions',
          bottom_value: '66',
        },
        balance: {
          title: 'balance',
          title_value: '￥0.00',
          bottom: 'withdrawable balance',
          bottom_value: '￥0.00',
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.dashboard-card-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
}
</style>
