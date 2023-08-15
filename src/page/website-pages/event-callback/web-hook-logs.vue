
<template>
  <div>
    <div style="display: flex;align-items: center;flex-direction: column">
      <el-table v-loading="web_hook_log_table_loading" :data="web_hook_log_table_data" style="width: 100%"
                :empty-text="$t('no data')"
                :header-cell-style="{'background-color': 'var(--header-cell-background-color)','color': 'var(--header-cell-color)','font-weight': 'var(--header-cell-font-weight)'}"
      >
        <el-table-column prop="name" :label="$t('name')" width="auto">
        </el-table-column>
      </el-table>
      <div style="padding-top:12px;display: flex;align-items: center;justify-content: center;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10,20]"
          :page-size="page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page:1,
      page_size:10,
      total:0,
      web_hook_log_table_loading:false,
      web_hook_log_table_data:[]
    }
  },

  methods: {
    handleSizeChange(val) {
      this.page_size = val;
    },
    handleCurrentChange(val) {
      this.page = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style scoped lang="less">

</style>