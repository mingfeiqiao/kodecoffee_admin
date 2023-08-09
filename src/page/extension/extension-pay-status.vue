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
              {{$t('pay success')}}
            </div>
            <div style="padding: 24px 80px;">
              {{$t('pay success tip')}}
              <span style="color: #1090FF;cursor: pointer" @click="openPayManagePage">{{$t('click to billing')}}</span>
            </div>
          </div>
          <div v-else>
            <div>
              <svg width="100" height="100">
                <use xlink:href="#error"></use>
              </svg>
            </div>
            <div class="title-24">
              {{$t('pay failed')}}
            </div>
          </div>
        </div>
      </div>
      <div>
        <language-change></language-change>
      </div>
    </main>
  </div>
</template>
<script>
import languageChange from "../components/language-change.vue";
import {attributeApi, attributeFprApi} from "../../api/interface";
export default {
  components: {languageChange},
  data() {
    return {
      params: this.$route.query,
    };
  },
  created() {
    window.postMessage({
      type: 'pay',
      data: this.params
    });
    if (parseInt(this.params.status) === 1) {
      this.attribute();
    }
  },
  methods: {
    /**
     * 打开计费管理页面
     */
    openPayManagePage () {
      this.$router.push({path: '/extension/pay-manage', query: this.$route.query});
    },
    /**
     * 上报接口
     */
    attribute () {
      const api_key = this.$route.query.api_key || "";
      const extension_id = this.$route.query.client_id || "";
      if (api_key && extension_id) { // 这里代表正常参数，只处理正常参数的内容
        let commission_key = this.$mode + '-commission-ext-ids';
        let vitality_key = this.$mode + '-share-ext-ids';
        let commission_ext_ids = localStorage.getItem(commission_key);
        if (commission_ext_ids) {
          commission_ext_ids = JSON.parse(commission_ext_ids);
          this.attributePay('commission', commission_ext_ids, extension_id, api_key)
        } else {
          let share_ext_ids = localStorage.getItem(vitality_key);
          if (share_ext_ids) {
            share_ext_ids = JSON.parse(share_ext_ids);
            this.attributePay('share', share_ext_ids, extension_id, api_key)
          }
        }
      }
    },
    attributePay (type, ext_ids, extension_id, api_key) {
      if (ext_ids[extension_id] && ext_ids[extension_id].share_id) { // 代表存在该插件的归因信息，不存在的不进行上报
        let args = {
          step: "pay",
          api_key: api_key,
          attribution: {
            extension_id: extension_id,
            u_id : ext_ids[extension_id].u_id || "",
            share_id: ext_ids[extension_id].share_id || "",
            click_time: ext_ids[extension_id].click_time || "",
            install_time: ext_ids[extension_id].install_time || ""
          }
        }
        attributeApi(args).then(res => {
          console.log('report success');
        })
      }
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