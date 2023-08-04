<template>
  <div>
    Welcome
  </div>
</template>
<script>
import {attributeApi} from "../../api/interface";
export default {
  created() {
    let key = this.$mode + '-share-ext-ids';
    const query = this.$route.query;
    const target = query.target || "";
    const extension_id = query.extension_id || "";
    if (extension_id) {
      console.log("extension_id", extension_id);
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
        share_ext_ids[extension_id].install_time = Math.floor(Date.now() / 1000);
      } else { // localstorage中没有记录当前插件的完整信息，此时需要记录
        share_ext_ids[extension_id] = {};
        share_ext_ids[extension_id].install_time = Math.floor(Date.now() / 1000);
      }
      localStorage.setItem(key, JSON.stringify(share_ext_ids));
      if (share_ext_ids[extension_id] && share_ext_ids[extension_id].share_id) {
        let args = {
          step: "install",
          attribution: {
            extension_id: extension_id,
            u_id: share_ext_ids[extension_id].u_id || "",
            share_id: share_ext_ids[extension_id].share_id || "",
            click_time: share_ext_ids[extension_id].click_time || "",
            install_time: share_ext_ids[extension_id].install_time || ""
          }
        };
        attributeApi(args).then(res => {
          if (target) {
            window.location.href = target;
          }
        });
      }
    }
  }
}
</script>