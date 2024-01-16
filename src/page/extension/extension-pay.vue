<template>
    <div class="extension-pay">
        <!-- 左侧板块 -->
        <div class="left-content-box">
            <div class="left-pay-box">
                <div class="flex-box" style="margin-bottom: 30px;">
                    <b>{{ $t('Order') }}</b>
                    <!-- <div class="font-tips">选择币种</div> -->
                </div>
                <div class="try-box">
                    <span class="font-blue" v-html="$t('Free days').replace('{day}', '7')"></span>
                    <span class="font-tips" style="margin-left: 10px;">{{ $t('try out') }}</span>
                </div>
                <div class="try-box try-box-tips">
                    <p v-html="$t('Free duration').replace('{day}', '7').replace('{Amount}', '9.9')"></p>
                </div>
            </div>
            
            <div class="Order-details-content">
                <div class="Order-details-btn" @click="onShowOrderDetails">订单详情 ></div>
                <div class="Order-details-box">
                    <div class="flex-box plan-box">
                        <!-- 套餐详情 -->
                        <div class="plan-box-left">
                            <div class="background-box"></div>
                            <div>
                                <p style="margin-bottom: 7px;">套餐plan 名称</p>
                                <p class="font-tips">套餐描述有则显示，无则不显示</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin-bottom: 7px;" v-html="$t('Free days Try').replace('{day}', '7')"></p>
                            <p class="font-tips" v-html="$t('Free duration Amount').replace('{Amount}', '99.99')"></p>
                        </div>
                    </div>
                    <div class="flex-box">
                        <p>{{ $t('Subtotal') }}</p>
                        <b>US 19.99</b>
                    </div>
                    <!-- 添加优惠券 -->
                    <div class="add-coupon">{{ $t('Add coupon') }}</div>
                    <div class="flex-box font-tips">
                        <p>{{ $t('After trial') }}</p>
                        <p>US 99.99</p>
                    </div>
                    <div class="flex-box" style="margin-top: 10px;">
                        <p>{{ $t('Cope with today') }}</p>
                        <b>US 0.00</b>
                    </div>
                </div>
            </div>

            <div class="left-address-box font-tips">{{ $t('Add address') }}</div>
        </div>
        <!-- 右侧板块 -->
        <div class="right-content-box">
            <b class="right-pay-title">{{ $t('Payment') }}</b>
            <div class="contact-email">{{ $t('Contact email') }}</div>
            <div style="max-width: 400px;">
                <el-input v-model="input" :placeholder="$t('Contact email tips')"></el-input>
            </div>
            <!-- 支付类型 -->
            <div class="pay-title">{{ $t('payment method') }}</div>
            <div class="pay-type-box">
                <div v-for="(item,index) in payType" :key="index" :class="isActive == item.value ? 'active-pay-box basics-pay-box' :'basics-pay-box normal' " @click="onChangePay(item.value)">
                    <svg style="width: 16px;height: 16px;">
                        <use :xlink:href="item.svg"></use>
                    </svg>
                    <p>{{ $t(item.name) }}</p>
                </div>
            </div>
            <!-- 支付板块，银行卡需要引入板块，故此没写 -->
            <div class="pay-change-box">
                <div v-if="isActive == 'BANK'">
                  <!-- 引入 Stripe.js -->
                  <!-- 创建卡片信息收集的表单 -->
                  <form id="payment-form">
                    <!-- 这里添加用于收集卡片信息的字段，如卡号、过期日期、CVC等 -->
                    <!-- 用于容纳 Stripe.js 元素的容器 -->
                    <div id="card-element"></div>
                    <!-- 用于显示验证错误的元素 -->
                    <div id="card-errors" role="alert"></div>
                    <!-- 提交按钮 -->
                    <button type="submit">支付</button>
                  </form>
                </div>
                <div v-if="isActive == 'PAYPAL'">{{ $t('PayPal tips') }}</div>
                <div v-if="isActive == 'ZFB'">{{ $t('zfb tips') }}</div>
                <div v-if="isActive == 'WX'">{{ $t('wx tips') }}</div>
            </div>
            <!-- 支付按钮 -->
            <div class="pay-btn-box">
                <p class="font-tips" v-html="$t('try out tips').replace('{day}','2023年12月12日').replace('{amount}','99.99')"></p>
                <div class="pay-btn">{{ onBtnText() }}</div>
            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    data() {
        return {
            payType:[
                {
                    name:'card',
                    svg:"#bank-card",
                    text:'支付',
                    value:'BANK'
                },
                {
                    name:'paypal',
                    svg:"#paypal",
                    text:'前往PayPal支付',
                    value:'PAYPAL'
                },
                {
                    name:'alipay',
                    svg:"#alipay",
                    text:'前往支付宝',
                    value:'ZFB'
                },
                {
                    name:'wechat',
                    svg:"#wechat-pay",
                    text:'生成二维码',
                    value:'WX'
                }
            ],
            isActive:'BANK',
            input:'',
            isShowOrderDetails:false
        };
    },
    created() {
        //配置主题色
        document.body.style.setProperty('--leftContentBG', '#EFEFEF');
        document.body.style.setProperty('--fontSpecial', '#2F54EB');
        document.body.style.setProperty('--fontTips', '#3D3D3D');
        document.body.style.setProperty('--OrderDetailsBox', 'none');
        
    },
    computed: {

    },
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload  = () => {
      var stripe = Stripe('pk_test_51NJ9pwEl6sCLUmt264QVOrinvpxuJGiwAYfmbr3KpHDVEUvAgX321EzM0mCaqlWi3aX7z2aOMKYCalfyyQxswtBw00FYd7Y2Eu');
      var elements = stripe.elements();
      // 创建卡片信息输入框
      var card = elements.create('card');
      // 将卡片信息输入框添加到页面
      card.mount('#card-element');
      // 处理表单提交事件
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        // 使用 Setup Intent 中的 client_secret 进行验证
        stripe.handleCardSetup(clientSecret, card, {
          payment_method_data: {
            // 在这里添加额外的支付方法数据，例如用户信息等
          }
        }).then(function(result) {
          if (result.error) {
            // 处理验证错误
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            // 验证成功，将 Setup Intent 的 payment_method 放入表单中
            var paymentMethod = result.setupIntent.payment_method;
            // 将 paymentMethod 发送到服务器进行后续处理
          }
        });
      });
    }
    document.body.appendChild(script)
  },
  methods: {
        //切换支付方式
        onChangePay(value){
            this.isActive = value;
        },
        //支付按钮文案展示
        onBtnText() {
            let str = this.payType.filter(item => item.value == this.isActive)[0];
            return str.text;
        },
        onShowOrderDetails() {
            this.isShowOrderDetails = !this.isShowOrderDetails;
            document.body.style.setProperty('--OrderDetailsBox', this.isShowOrderDetails ? 'block':'none');
        }
    },
};
</script>
<style scoped lang="less">
.extension-pay {
    margin:0 auto;
    .left-content-box {
        height: 100%;
        box-sizing: border-box;
        position: relative;
        .flex-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .plan-box {
            border-bottom: 1px solid #D8D8D8;
            padding-bottom: 24px;
            box-sizing: border-box;
            margin-bottom: 12px;

            .plan-box-left{
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .background-box {
                width: 48px;
                height: 48px;
                background-color: #fff;
            }
        }

        .add-coupon {
            color: var(--fontSpecial);
            border-bottom: 1px solid #D8D8D8;
            padding: 24px 0 16px 0;
            margin-bottom: 16px;
            box-sizing: border-box;
            cursor: pointer;
        }
        .left-address-box{
            position: absolute;
            left: 23px;
            bottom: 20px;
            cursor: pointer;
        }
    }

    .right-content-box {
        position: relative;
        height: 100%;
        background-color: #fff;
        box-sizing: border-box;

        .pay-title{
            color: #3D3D3D;
            margin: 23px 0 8px 0;
        }

        .pay-type-box{
            display: flex;
            max-width: 400px;
            gap: 12px;
            margin-bottom: 20px;

            .active-pay-box{
                border: 1px solid #000000;
                box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
            }
            .normal{
                border: 1px solid #BFBFBF;
            }
            .basics-pay-box{
                width: 100%;
                height: 50px;
                font-size: 12px;
                padding: 8px 0 5px 12px;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
        .pay-btn-box{
            width: 90%;;
            max-width: 400px;
            margin: auto;
            .pay-btn{
                width: 100%;
                height: 40px;
                line-height: 40px;
                color: #fff;
                background-color: var(--fontSpecial);
                border-radius: 5px;
                text-align: center;
                margin-top: 5px;
                cursor: pointer;
            }
        }
        .pay-change-box{
            height: 200px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .font-tips {
        color: var(--fontTips);
        font-size: 12px;
        font-weight: 400;
    }

    .font-blue {
        color:var(--fontSpecial);
        font-size: 24px;
        font-weight: 700;
    }
}
@media screen and (min-width:700px) {
    .extension-pay {
        display: flex;
        height: 600px;
        color: #000;
        max-width: 1080px;
        margin: auto;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .left-content-box {
        width: 50%;
        background: var(--leftContentBG);
        padding: 23px 21px 20px 32px;
        .try-box-tips{
            margin: 15px 0px 30px;
        }
        .Order-details-btn{
            display: none;
        }
    }
    .right-content-box {
        width: 50%;
        padding: 23px 21px 20px 32px;
        .pay-btn-box{
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
        }
        .contact-email{
            margin: 20px 0 5px 0;
        }
    }
}
@media screen and (max-width:700px) {
    .try-box{
        margin: 0 auto;
        max-width: 160px;
        text-align: center;
    }
    .left-pay-box{
        padding: 23px 21px 16px 32px;
    }
    .Order-details-btn{
        text-align: center;
    }
    .try-box-tips{
        margin-top: 12px;
    }
    .Order-details-content{
        padding: 20px;
        box-sizing: border-box;
        background: var(--leftContentBG);
    }
    .Order-details-box{
        display: var(--OrderDetailsBox);
        margin-top: 20px;
    }
    
    .left-address-box{
        display: none;
    }
    .right-content-box{
        padding: 30px 20px;
        .right-pay-title{
            display: none;
        }
        .contact-email{
            margin-bottom: 5px;
        }
    }
    
}
</style>