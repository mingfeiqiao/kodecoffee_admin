<template>
</template>
<script>
import {attributeApi, attributeFprApi} from "../../api/interface";

export default {
  created() {
    console.log(this.$route.query);
    const query = this.$route.query;
    const redirect_url = query.redirect_url || "";
    const share_id = query.share_id || "";
    const extension_id = query.extension_id || "";
    const fpr_code = query.fpr_code || "";
    if (extension_id && redirect_url) {
      if (fpr_code) {
        this.attribute('commission', extension_id, fpr_code, redirect_url)
      } else {
        if (share_id) {
          this.attribute('share', extension_id, share_id, redirect_url)
        }
      }
    }
  },
  methods: {
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    /**
     * 裂变相关逻辑
     * @param type share=裂变，commission=分佣
     * @param extension_id
     * @param id 唯一id, 如果是share 那么就是share_id,如果是分佣，那么就是fpr_code
     * @param redirect_url
     */
    attribute(type ,extension_id, id, redirect_url) {
      let key = '';
      if (type === 'share') {
        key = this.$mode + '-share-ext-ids';
      } else if (type === 'commission') {
        key = this.$mode + '-commission-ext-ids';
      }
      let share_ext_ids = localStorage.getItem(key);
      if (share_ext_ids) {
        share_ext_ids = JSON.parse(share_ext_ids);
      } else {
        share_ext_ids = {};
      }
      if (share_ext_ids
        && share_ext_ids[extension_id]
        && share_ext_ids[extension_id].share_id
        && share_ext_ids[extension_id].share_id === id
        && share_ext_ids[extension_id].u_id
        && share_ext_ids[extension_id].click_time
      ) { // localstorage中已经记录了当前插件的完整的信息，此时什么都不需要做
        console.log('all ready have')
      } else { // localstorage中没有记录当前插件的完整信息，此时需要记录
        console.log(id)
        share_ext_ids[extension_id] = {};
        share_ext_ids[extension_id].share_id = id;
        share_ext_ids[extension_id].u_id = this.generateUUID();
        share_ext_ids[extension_id].click_time = Math.floor(Date.now() / 1000);
      }
      localStorage.setItem(key, JSON.stringify(share_ext_ids));
      if (share_ext_ids[extension_id] && share_ext_ids[extension_id].share_id) {
        let args = {
          step:"click",
          api_key:"",
          attribution: {
            extension_id: extension_id,
            u_id: share_ext_ids[extension_id].u_id,
            share_id: id,
            click_time: share_ext_ids[extension_id].click_time
          }
        };
        if (type === 'share') {
          attributeApi(args).then(res => {
            window.location.href = redirect_url;
          });
        } else if (type === 'commission') {
          args.attribution.fpr_code = args.attribution.share_id;
          delete args.attribution.share_id;
          attributeFprApi(args).then(res => {
            window.location.href = redirect_url;
          });
        }
      }
    }
  }
}
</script>