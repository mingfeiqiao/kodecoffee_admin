<template>
    <div class="creater-info">
        <add-plugin-component :chosen_plugin_data="pluginObj" operationType="edit"  @operateSuccess="operateSuccess">
        </add-plugin-component>
    </div>
</template>

<script>
import {decodeEmojiObjByKeys} from '@/utils/emoji-stringify.js'
import {pluginList} from "@/api/interface";
import addPluginComponent from "../components/add-plugin-component.vue";
export default {
    name: 'Creator-info',
    components: {
        addPluginComponent,
    },
    data() {
        return {
            pluginObj: null
        };
    },
    mounted() {
        this.getPluginList()
    },
    methods: {
        getPluginList() {
            pluginList().then(res => {
                if (parseInt(res.data.code) === 100000) {
                    let data = res.data.data;
                    data.forEach(item => {
                        if (item.icon) {
                        item.icon = process.env.VUE_APP_OSS_URL + item.icon;
                        }
                        if (item.cover) {
                        item.cover = process.env.VUE_APP_OSS_URL + item.cover;
                        }
                    });
                    this.pluginObj = decodeEmojiObjByKeys(data[0], ['name', 'on_working', 'description']);
                } else {
                    if (res && res.data && res.data.message) {
                        this.$message.warning(res.data.message)
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
        operateSuccess() {
            
        },
    },
};
</script>
<style lang="scss" scoped>
    
</style>
