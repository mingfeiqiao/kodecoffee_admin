<template>
  <div style="display: flex;align-items: center;justify-content: center;width: 100%;height: 100%">
    <main>
      <div class="container">
        <div>
          <div>
            <div>
              <svg width="80" height="80">
                <use xlink:href="#tips"></use>
              </svg>
            </div>
            <div style="padding: 24px 80px;">
              {{$t('Another user has logged into this account at off_line_timestamp. This device has been logged out', {'off_line_timestamp':this.off_line_timestamp})}}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import {timestampToDateString} from "../../utils/dateUtils";
export default {
  data() {
    return {
      off_line_timestamp:"",
    };
  },
  created() {
    let params = this.$route.query;
    if (params.off_line_timestamp) {
      this.off_line_timestamp =timestampToDateString(params.off_line_timestamp, 'yyyy-MM-dd HH:II:SS');
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