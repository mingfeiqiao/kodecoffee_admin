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
                        item.icon = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + item.icon;
                        }
                        if (item.cover) {
                        item.cover = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + item.cover;
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
