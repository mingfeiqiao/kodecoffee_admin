<template>
  <div style="flex-wrap: wrap; display: flex;">
    <div  class="card" >
      <el-card :body-style="{padding: '0px',width: '300px',height:'150px'}" shadow="hover" v-if="plugin_list.length === 0">
        <div style="display: flex;justify-content: center;align-items: center;height: 100%" @click="operatePluginCard({}, 'add')">
          {{$t('add plugin')}}
        </div>
      </el-card>
    </div>
    <div class="card" v-for="pluginData in plugin_list"><plugin-card :data="pluginData" @operatePluginCard="operatePluginCard"></plugin-card></div>
    <div v-if="dialog_form_visible">
      <add-plugin-dialog :visible="dialog_form_visible" @visibleChange="visibleChange" :operationType="operationType" @operateSuccess="operateSuccess" :chosen_plugin_data="chosen_plugin_data">
      </add-plugin-dialog>
    </div>
  </div>
</template>
<script>
import pluginCard from "../components/plugin-card.vue";
import {pluginList} from "../../api/interface";
import addPluginDialog from "../components/add-plugin-dialog.vue";
export default {
  data () {
    return {
      plugin_list: [],
      chosen_plugin_data: {},
      dialog_form_visible: false,
      operationType: 'add'
    }
  },
  created() {
    this.getPluginList();
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
          });
          this.plugin_list = data;
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * 操作插件卡片
     * @param plugin_data
     * @param operation
     */
    operatePluginCard (plugin_data, operation) {
      this.chosen_plugin_data = plugin_data;
      this.operationType = operation;
      if (operation === 'edit') {
        this.dialog_form_visible = true;
      } else if (operation === 'delete') {
        // 发请求删除 --
      } else if (operation === 'add') {
        // 新增插件
        this.dialog_form_visible = true;
      }
    },
    /**
     *
     * @param visible
     */
    visibleChange (visible) {
      this.dialog_form_visible = visible;
    },
    operateSuccess () {
      this.getPluginList();
    }
  },
  components: {
    pluginCard,
    addPluginDialog
  }
}
</script>
<style scoped lang="less">
 .card {
   padding: 16px;
 }
</style>