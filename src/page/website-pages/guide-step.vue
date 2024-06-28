<template>
  <div class="guide-step">
    <el-steps style="width: 80%; min-width: 500px;" :active="activeStep" align-center finish-status="success">
      <el-step :title="$t(step.title)" v-for="(step, i) in steps" :key="i"></el-step>
    </el-steps>
    <div class="guide-step-box">
      <el-card class="box-card" v-if="activeStep === 1">
        <add-plugin-component @operateSuccess="operateSuccess">
        </add-plugin-component>
      </el-card>
      <el-card class="box-card" v-if="activeStep === 2">
        <add-plan-component @operateSuccess="operateSuccess">
        </add-plan-component>
      </el-card>
      <el-card class="box-card" v-if="activeStep === 3">
        <el-result icon="success" :title="$t('Congratulations Creator')">
          <div slot="subTitle">
            <div>{{$t('Your Homepage')}} 
              <el-link type="success" :href="homeLink" target="_blank">{{homeLink}}</el-link></div>
            <div>
              <el-link type="success"  :href="homeLink" target="_blank"> {{$t('click link')}} </el-link>
              {{$t('Start tipping')}}
            </div>
            <div>{{$t('Guide Step Context 1')}}</div>
            <div>{{$t('Guide Step Context 2')}}</div>
          </div>
        </el-result>
      </el-card>
    </div>
  </div>
</template>

<script>
import {setGuideStepApi, getGuideStepApi, pluginList} from "@/api/interface";
import addPluginComponent from "../components/add-plugin-component.vue";
import addPlanComponent from "../components/add-plan-component.vue";
export default {
  name: "guide-step",
  components: {
    addPluginComponent,
    addPlanComponent
  },
  data() {
    return {
      homeLink: '',
      steps: [
        {title: 'Creator Info'},
        {title: 'Create Plan Combo'},
        {title: 'Finish'},
      ],
      pluginData: null,
    }
  },
  computed: {
    activeStep: {
      get() {
        return this.$store.state.guide_step
      },
      set(value) {
        this.$store.commit('setGuideStep', value);
      },
    },
  },
  created() {
    if(this.activeStep >= 3) {
      this.getPluginList()
    }
  },
  methods: {
    operateSuccess() {
      setGuideStepApi({step: this.activeStep + 1, status:1}).then(res => {
         if (res.data && res.data.code && parseInt(res.data.code) === 100000) {
           this.activeStep += 1;
           if(this.activeStep >= 3) {
             this.getPluginList()
           }
         }
      })
    },
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
          this.pluginData = data[0];
          const {uniq_name, store_address} = data[0]
          this.homeLink = store_address + uniq_name
        } else {
          if (res && res.data && res.data.message) {
            this.$message.warning(res.data.message)
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
  },
}
</script>

<style scoped lang="less">
.guide-step{}
.guide-step-box{
  margin-top: 20px;
  .box-card{
    width: 80%;
    min-width: 500px;
  }
}
</style>