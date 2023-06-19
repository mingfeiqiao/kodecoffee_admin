<template>
  <el-card :body-style="{padding: '0px',width: '300px',height:'150px'}" shadow="hover">
    <div>
      <div style="display: flex;align-items: center;padding:8px;height: 100px;">
        <div style="width: 50px">
          <el-image
            style="width: 50px; height: 50px;border-radius: 50%"
            :src="data.icon"
            fit="fit"></el-image>
        </div>
        <div style="padding: 0 12px;">
          <div>
            <div class="text-container">
              <el-tooltip :content="data.name">
                <div class="text-content">{{ data.name }}</div>
              </el-tooltip>
            </div>
          </div>
          <div>
            <div class="text-container">
              <el-tooltip :content="data.client_key">
                <div class="text-content">{{ data.client_key }}</div>
              </el-tooltip>
            </div>
          </div>
          <div>
            <div class="text-container">
              <el-tooltip :content="data.description">
                <div class="text-content">{{ data.description }}</div>
              </el-tooltip>
          </div>
        </div>
      </div>
      </div>
      <div style="display: flex;justify-content: center;align-items: center;padding: 6px 0;border-top: 1px solid rgb(217,217,217);" >
        <div style="width: 50%;"></div>
        <div style="width: 50%;text-align: center;border-left: 1px solid rgba(217, 217, 217, 1);cursor: pointer" @click="editPluginCard">{{$t('edit')}}</div>
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
.text-container {
  display: inline-block;
}

.text-content {
  max-width: 220px; /* 控制文本容器的最大宽度 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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