<template>
  <el-card :body-style="{padding: '0px',width: '300px',height:'130px'}">
    <div>
      <div style="display: flex;align-items: center;padding:16px;">
        <div>
          <img width="32" height="32" :src="data.icon" alt="cc" style="border-radius: 16px;">
        </div>
        <div style="padding: 0 12px;">
          <div>
            <div>{{data.name}}</div>
          </div>
          <div>
            <div>{{data.remark}}</div>
          </div>
          <div>
            <div>{{data.extension_id}}</div>
          </div>
          <div>
            <div>{{data.application_id}}</div>
          </div>
        </div>
      </div>
      <div style="display: flex;justify-content: center;align-items: center;padding: 6px 0;border-top: 1px solid rgb(217,217,217);" >
        <div style="width: 50%;"></div>
        <div style="width: 50%;text-align: center;border-left: 1px solid rgba(217, 217, 217, 1);" @click="editPluginCard">编辑</div>
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    operatePluginCard: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    editPluginCard() {
      this.$emit('operatePluginCard', this.data, 'edit');
    }
  },
  components: {
  }
}
</script>
<style scoped lang="less">
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>