<template>
  <div>
    Welcome
  </div>
</template>
<script>
import {attributeApi, attributeFprApi} from "../../api/interface";
export default {
  created() {
    const query = this.$route.query;
    const target = query.target || "";
    const extension_id = query.extension_id || "";
    let commission_key = this.$mode + '-commission-ext-ids';
    let vitality_key = this.$mode + '-share-ext-ids';
    if (extension_id) {
      let commission_ext_ids = localStorage.getItem(commission_key);
      if (commission_ext_ids) {
        commission_ext_ids = JSON.parse(commission_ext_ids);
        this.attribute('commission', commission_ext_ids, extension_id, target)
      } else {
        let share_ext_ids = localStorage.getItem(vitality_key);
        if (share_ext_ids) {
          share_ext_ids = JSON.parse(share_ext_ids);
          this.attribute('share', share_ext_ids, extension_id, target)
        }
      }
    }
  },
  methods: {
    /**
     *
     * @param type
     * @param ext_ids
     * @param extension_id
     * @param target
     */
    attribute(type, ext_ids, extension_id, target) {
      if (ext_ids
        && ext_ids[extension_id]
        && ext_ids[extension_id].share_id
        && ext_ids[extension_id].u_id
        && ext_ids[extension_id].click_time
      ) { // localstorage中已经记录了当前插件的完整的信息，此时什么都不需要做
        ext_ids[extension_id].install_time = Math.floor(Date.now() / 1000);
      } else { // localstorage中没有记录当前插件的完整信息，此时需要记录
        ext_ids[extension_id] = {};
        ext_ids[extension_id].install_time = Math.floor(Date.now() / 1000);
      }
      let key = '';
      if (type === 'commission') {
        key = this.$mode + '-commission-ext-ids';
      } else if (type === 'share') {
        key = this.$mode + '-share-ext-ids';
      }
      localStorage.setItem(key, JSON.stringify(ext_ids));
      if (ext_ids[extension_id] && ext_ids[extension_id].share_id) {
        let args = {
          step: "install",
          attribution: {
            extension_id: extension_id,
            u_id: ext_ids[extension_id].u_id || "",
            share_id: ext_ids[extension_id].share_id || "",
            click_time: ext_ids[extension_id].click_time || "",
            install_time: ext_ids[extension_id].install_time || ""
          }
        };
        if (type === 'commission') {
          attributeFprApi(args).then(res => {
            if (target) {
              window.location.href = target;
            }
          });
        } else if (type === 'share'){
          attributeApi(args).then(res => {
            if (target) {
              window.location.href = target;
            }
          });
        }
      }
    }
  }
}
</script>