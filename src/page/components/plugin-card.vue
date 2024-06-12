<template>
  <el-card :body-style="{padding: '0px',width: '300px',height:'150px'}" shadow="hover">
    <div>
      <div style="display: flex;align-items: center;padding:8px;height: 100px;">
        <div style="width: 50px">
          <el-image
            v-if="data.icon"
            style="width: 50px; height: 50px;border-radius: 50%"
            :src="data.icon"
            fit="fit"></el-image>
          <svg width="50" height="50" v-else>
            <use xlink:href="#default-extension-icon"></use>
          </svg>
        </div>
        <div style="padding: 0 12px;">
          <div>
            <div class="text-container">
              <div class="text-content">{{ data.name }}</div>
            </div>
          </div>
          <div>
            <div class="text-container">
              <div style="display: flex;align-items: center">
                <div class="text-content">{{ data.client_key }}</div>
                <svg width="16" height="16" @click="copy(data.client_key)" style="cursor: pointer;padding-left: 8px" id="copy_text">
                  <use xlink:href="#copy">
                  </use>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div class="text-container">
              <div class="text-content">{{ data.description }}</div>
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
import EllipsisText from "./ellipsis-text.vue";
import Clipboard from "clipboard";
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
    copy (client_key){
      let clipboard = new Clipboard('#copy_text', {
        text: () => {
          return client_key
        }
      })
      clipboard.on('success', e => {
        this.$message({
          message: this.$t('copy success'),
          type: 'success'
        })
        clipboard.destroy() // 释放内存
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message:  this.$t('browser not support copy'),
          type: 'warning'
        })
        clipboard.destroy() // 释放内存
      })
    },
    editPluginCard() {
      this.$emit('operatePluginCard', this.data, 'edit');
    }
  },
  components: {
    EllipsisText
  }
}
</script>
<style scoped lang="less">
.time {
  font-size: 14px;
  color: #999;
}
.text-container {
  display: inline-block;
}

.text-content {
  max-width: 160px; /* 控制文本容器的最大宽度 */
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