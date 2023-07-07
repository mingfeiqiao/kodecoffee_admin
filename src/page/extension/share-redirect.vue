<template>
</template>
<script>
import {attributeApi} from "../../api/interface";

export default {
  created() {
    console.log(this.$route.query);
    let key = this.$mode + '-share-ext-ids';
    const query = this.$route.query;
    const redirect_url = query.redirect_url || "";
    const share_id = query.share_id || "";
    const extension_id = query.extension_id || "";

    if (redirect_url && share_id && extension_id) { // 只有当信息完整时才会进行归因
      let share_ext_ids = localStorage.getItem(key);
      if (share_ext_ids) {
        share_ext_ids = JSON.parse(share_ext_ids);
      } else {
        share_ext_ids = {};
      }
      if (share_ext_ids
        && share_ext_ids[extension_id]
        && share_ext_ids[extension_id].share_id
        && share_ext_ids[extension_id].u_id
        && share_ext_ids[extension_id].click_time
      ) { // localstorage中已经记录了当前插件的完整的信息，此时什么都不需要做
        console.log('all ready')
      } else { // localstorage中没有记录当前插件的完整信息，此时需要记录
        console.log(share_id)
        share_ext_ids[extension_id] = {};
        share_ext_ids[extension_id].share_id = share_id;
        share_ext_ids[extension_id].u_id = this.generateUUID();
        share_ext_ids[extension_id].click_time = Math.floor(Date.now() / 1000);
      }
      localStorage.setItem(key, JSON.stringify(share_ext_ids));
      let args = {
        step:"click",
        api_key:"",
        attribution: {
          extension_id: extension_id,
          u_id: share_ext_ids[extension_id].u_id,
          share_id: share_ext_ids[extension_id].share_id,
          click_time: share_ext_ids[extension_id].click_time
        }
      };
      // attributeApi(args).then(res => {
      //   window.location.href = redirect_url;
      // })
    }
  },
  methods: {
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
}
</script>