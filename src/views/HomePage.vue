<template>
  <div class="main-container">
    <el-row :gutter="10" class="creator-box">
      <el-col :sm="24" :md="12">
        <div class="creator-info">
          <div class="creator-img"></div>
          <div class="creator-tips">
            <h5>创作者名称</h5>
            <p>创作者一句话介绍一下自己</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12">
        <div class="creator-support">
          <el-button class="el-button-orange" size="small" @click="goDetail">{{ $t('Support creator') }}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="24" :md="12">
        <div class="creator-content-left">
          <h5>正在创作</h5>
          <p>我在写作业</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aspernatur autem, dolorum inventore nulla odit pariatur placeat reprehenderit sit velit, voluptas voluptate! Aut consectetur enim harum hic nesciunt reprehenderit, similique.</p>
        </div>
      </el-col>
      <el-col :sm="24" :md="12">
        <div class="support-list">
          <div class="support-item" v-for="i in 2" :key="i">
            <div class="support-info">
              <h5>请我喝杯奶茶</h5>
              <div class="support-price">
                <strong>￥5</strong>
              </div>
              <p>打赏说明</p>
              <p>为爱发电</p>
              <p>感谢支持，你好你是我的英雄!</p>
            </div>
            <div class="support-img-box">
              <div class="support-img">
                <img src="" alt="">
              </div>
              <div style="text-align: center;">
                <el-button class="el-button-orange el-button-tiny" @click="goDetail">{{ $t('Support creator') }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="creator-content" v-if="0">
      <div class="creator-content-left">
        <h5>正在创作</h5>
        <p>我在写作业</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aspernatur autem, dolorum inventore nulla odit pariatur placeat reprehenderit sit velit, voluptas voluptate! Aut consectetur enim harum hic nesciunt reprehenderit, similique.</p>
      </div>
      <div class="creator-content-right">
        <div class="support-list">
          <div class="support-item" v-for="i in 2" :key="i">
            <div class="support-info">
              <h5>请我喝杯奶茶</h5>
              <div class="support-price">
                <strong>￥5</strong>
              </div>
              <p>打赏说明</p>
              <p>为爱发电</p>
              <p>感谢支持，你好你是我的英雄!</p>
            </div>
            <div class="support-img-box">
              <div class="support-img">
                <img src="" alt="">
              </div>
              <div style="text-align: center;">
                <el-button class="el-button-orange el-button-tiny" @click="goDetail">支持创作者</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    goDetail() {
      this.$router.push('/payCoffee')
    }
  },
}
</script>

<style scoped lang="less">
@media (min-width: 768px) {
  .main-container {
     width: 70%;
  }
}
.main-container{
  //margin-top: 60px;
  background: #fff;
  padding: 20px;

  color: #3D3D3D;
  margin: 0 auto;
  .creator-box{
    margin-bottom: 30px;
  }
  .creator-info{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .creator-img{
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #ccc;
    margin-right: 10px;
  }
  .creator-tips{
    color: #3D3D3D;
    h5{
      margin: 0;
      padding: 0;
      font-size: 20px;
    }
    p{
      font-size: 16px;
    }
  }
  .creator-support{
    float: right;
    margin-top: 20px;
    .el-button{}
  }
  .creator-content{
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    font-family: 思源黑体;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
  }
  .creator-content-left{
    border: 1px solid #dedede;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .creator-content-right{
    padding-left: 20px;
  }
  .support-list{
    .support-item{
      border: 1px solid #dedede;
      border-radius: 5px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px;
      .support-info{}
      .support-price{}
      .support-img-box{}
      .support-img{
        max-width: 120px;
        width: 100%;
        padding-bottom: 60%;
        border-radius: 5px;
        background: #ccc;
        margin-bottom: 40px;
      }
    }
  }
}
</style>