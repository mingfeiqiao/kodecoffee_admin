<template>
  <div style="flex-wrap: wrap; display: flex;">
    <div  class="card" >
      <el-card :body-style="{padding: '0px',width: '300px',height:'150px'}" shadow="hover">
        <div style="display: flex;justify-content: center;align-items: center;height: 100%" @click="operatePluginCard({}, 'add')">
          {{$t('add plugin')}}
        </div>
      </el-card>
    </div>
    <div class="card" v-for="pluginData in pluginList"><plugin-card :data="pluginData" @operatePluginCard="operatePluginCard"></plugin-card></div>
    <add-plugin-dialog :visible="dialogFormVisible" @visibleChange="visibleChange" :operationType="operationType" @operateSuccess="operateSuccess" :chosenPluginData="chosenPluginData">
    </add-plugin-dialog>
  </div>
</template>
<script>
import pluginCard from "../components/plugin-card.vue";
import {pluginList} from "../../api/interface";
import addPluginDialog from "../components/add-plugin-dialog.vue";
export default {
  data () {
    return {
      pluginList: [],
      chosenPluginData: {},
      dialogFormVisible: false,
      operationType: 'add'
    }
  },
  created() {
    this.getPluginList();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getPluginList() {
      pluginList().then(res => {
        if (parseInt(res.data.code) === 100000) {
          let data = res.data.data;
          data.forEach(item => {
            item.icon = 'https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + item.icon;
          });
          this.pluginList = data;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * 操作插件卡片
     * @param pluginData
     * @param operation
     */
    operatePluginCard (pluginData, operation) {
      // 删除插件 -> 直接发请求
      // 编辑插件 -> 打开编辑插件的弹窗
      this.chosenPluginData = pluginData;
      this.operationType = operation;
      if (operation === 'edit') {
        this.dialogFormVisible = true;
      } else if (operation === 'delete') {
        // 发请求删除 --
      } else if (operation === 'add') {
        // 新增插件
        this.dialogFormVisible = true;
      }
    },
    /**
     *
     * @param visible
     */
    visibleChange (visible) {
      this.dialogFormVisible = visible;
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