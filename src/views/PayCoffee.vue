<template>
  <div class="main-container">
    <h4>{{ $t('Support creator') }}小明</h4>
    <div class="pay-box">
      <h5>请你喝咖啡套餐</h5>
      <div class="pay-select">
        <img class="pay-cup" src="@/assets/cup.png" alt="cup">
        <span class="pay-price">$ 5</span>
        <div class="pay-num-box">
          <span class="pay-label-num">{{ $t('Num') }}</span>
          <div class="pay-num-item active">1</div>
          <div class="pay-num-item">2</div>
          <div class="pay-num-item">5</div>
          <input class="pay-num-input" type="text">
        </div>
      </div>
      <div class="pay-context">
        <p>（ 2024 悫 15 · 2024 ． 5 ． 14 〗 PSD 与 录 屏 文 件 各 位 好 ， 在 2024 ． 4 ． 15 ． 2024 ． 5 ． 14 日 期 内 ． 赞 助 v 丨 P3 ， 会 获 得 《 溺 水 》 《 林 中 》 《 叼 刀 》 《 落 花 》 的 psd 文 件 。 赞 助 v 丨 P4 ， 会 获 得 《 溺 水 》 《 林 中 》 《 叼 刀 》 《 落 花 》 的 psd 文 件 ， 以 及 《 溺 水 》 《 林 中 》 的 5 倍 速 录 屏 文 件 。 赞 助 v 丨 P5 ， 会 获 得 上 述 psd 、 5 倍 速 录 屏 文 件 ， 以 及 原 速 录 屏 文 件 。 * 《 叼 刀 》 、 《 落 花 》 没 有 录 屏 。</p>
      </div>
      <div class="pay-message">
        <el-input class="pay-message-input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          :placeholder="$t('Encourage creator')">
        </el-input>
      </div>
      <div class="pay-button">
        <el-button class="el-button-orange">{{ $t('Pay') }} $15</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PayCoffee"
}
</script>

<style scoped lang="less">
@media (min-width: 768px) {
  .main-container {
     width: 70%;
    .pay-select{
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
    }
    .pay-box .pay-button{
      text-align: left;
      .el-button{
        padding: 12px 20px;
        width: 120px;
      }
    }
  }
}
.main-container {
  background: #fff;
  padding: 20px;
  color: #3D3D3D;
  margin: 0 auto;
  >h4{
    font-size: 20px;
    font-weight: bold;
  }
  .pay-box{
    margin: 20px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    >h5{
      font-weight: bold;
    }
  }

  .pay-select123{
    background: rgba(255, 149, 77, 0.1);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin: 15px 0;
  }
  .pay-select{
    background: rgba(255, 149, 77, 0.1);
    border-radius: 5px;
    padding: 10px;
    margin: 15px 0;
  }
  .pay-cup{
    width: 80px;
    height: 80px;
    vertical-align: bottom;
  }
  .pay-price{
    font-family: 思源黑体;
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    color: #FF954D;
    margin-right: 80px;
  }
  .pay-label-num{
    font-family: 思源黑体;
    font-size: 14px;
    color: #767676;
    align-self: flex-end;
    margin-right: 10px;
  }
  .pay-num-box{
    margin: 20px 0 0 20px;
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
  }
  .pay-num-item{
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 149, 77, 0.502);
    font-size: 20px;
    color: #FF954D;
    margin: 0 5px;
    cursor: pointer;
    &.active{
      background: rgba(255, 149, 77, 0.5);
      color: #fff;
    }
  }
  .pay-num-input{
    margin: 0 5px;
    width: 40px;
    max-width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.251);
    color: #3D3D3D;
    padding: 10px;
    outline: none;
    caret-color: #FF954D;
    &:active,&:focus{
       border: 1px solid rgba(0, 0, 0, 0.251);
    }
  }
  .pay-context{
    font-family: 思源黑体;
    font-size: 16px;
    color: #3D3D3D;
    p{
      line-height: 20px;
    }
  }
  .pay-message{
    margin: 50px 0;
    .pay-message-input{
      width: 100%;
      caret-color: #FF954D;
      .el-textarea__inner:focus{
        border: 1px solid #dcdfe6!important; //无效
      }
    }
  }
  .pay-button{
    text-align: center;
    .el-button{
      padding: 8px 14px;
    }
  }
}
</style>