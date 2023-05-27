<template>
  <div style="flex-wrap: wrap; display: flex;">
    <div  class="card" >
      <el-card :body-style="{padding: '0px',width: '300px',height:'130px'}">
        <div style="display: flex;justify-content: center;align-items: center;height: 100%" @click="operatePluginCard({}, 'add')">
          +添加插件
        </div>
      </el-card>
    </div>
    <div class="card" v-for="pluginData in pluginList"><plugin-card :data="pluginData" @operatePluginCard="operatePluginCard"></plugin-card></div>
    <add-plugin-dialog :visible="dialogFormVisible" @visibleChange="visibleChange" :operationType="operationType" :chosenPluginData="chosenPluginData">
    </add-plugin-dialog>
  </div>
</template>
<script>
import pluginCard from "../components/plugin-card.vue";
import addPluginDialog from "../components/add-plugin-dialog.vue";
export default {
  data () {
    return {
      pluginList: [
        {
          extensionName: '插件名称',
          remark: '插件备注说明',
          extension_id: '插件ID',
          application_id: '应用ID',
          icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          storeAddress: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        },
        {
          extensionName: '插件名称',
          remark: '插件备注说明',
          extension_id: '插件ID',
          application_id: '应用ID',
          icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          storeAddress: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        },
        {
          extensionName: '插件名称',
          remark: '插件备注说明',
          extension_id: '插件ID',
          application_id: '应用ID',
          icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          storeAddress: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        },
        {
          extensionName: '插件名称',
          remark: '插件备注说明',
          extension_id: '插件ID',
          application_id: '应用ID',
          icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          storeAddress: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        },
        {
          extensionName: '插件名称',
          remark: '插件备注说明',
          extension_id: '插件ID',
          application_id: '应用ID',
          icon: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          storeAddress: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        }
      ],
      chosenPluginData: {},
      dialogFormVisible: false,
      operationType: 'add'
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
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