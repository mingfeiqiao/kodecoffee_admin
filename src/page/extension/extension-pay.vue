<template>
    <div class="extension-pay-content">
        <language-change></language-change>
        <div class="extension-pay">
            <!-- 左侧板块 -->
            <div class="left-content-box" v-loading="product_loading">
                <div class="left-pay-box">
                    <div class="flex-box" style="margin-bottom: 30px;">
                        <b>{{ $t('Order') }}</b>
                        <!-- <div class="font-tips">选择币种</div> -->
                    </div>
                    <!-- 免费试用 -->
                    <!-- <div class="try-box">
                        <span class="font-blue" v-html="$t('Free days').replace('{day}', '7')"></span>
                        <span class="font-tips" style="margin-left: 10px;">{{ $t('try out') }}</span>
                    </div>
                    <div class="try-box try-box-tips">
                        <p v-html="$t('Free duration').replace('{day}', '7').replace('{Amount}', '9.9')"></p>
                    </div> -->
                    <!-- 单次支付或循环订阅 -->
                    <div class="pay-title-font">
                        <div><span class="font-blue">{{ product_info.currency ? product_info.currency.toUpperCase() : '' }}{{ product_info.amount ? product_info.amount / 100 : '' }}</span></div>
                        <div style="margin-bottom: 30px;"><span class="font-tips">{{ product_info.plan_type == 'one_time' ? $t('one_time') : $t('recurring')
                        }}</span></div>
                    </div>
                </div>

                <div class="Order-details-content">
                    <div class="Order-details-btn" @click="onShowOrderDetails">{{ $t('Order details') }} ></div>
                    <div class="Order-details-box">
                        <div class="flex-box plan-box">
                            <!-- 套餐详情 -->
                            <div class="plan-box-left">
                                <div class="background-box"
                                    :style="{ backgroundImage: product_info.icon ? 'url(https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + product_info.icon + ')' : '' }">
                                </div>
                                <div>
                                    <p style="margin-bottom: 7px;">{{ product_info.name }}</p>
                                    <p class="font-tips" v-if="product_info.desc">{{ product_info.desc }}</p>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <!-- <p style="margin-bottom: 7px;" v-html="$t('Free days Try').replace('{day}', '7')"></p>
                                <p class="font-tips" v-html="$t('Free duration Amount').replace('{Amount}', product_info.amount ? product_info.amount / 100 : '')"></p> -->
                                {{ product_info.currency ? product_info.currency.toUpperCase() : '' }} {{ product_info.amount ? product_info.amount / 100 : '' || '' }}
                            </div>
                        </div>
                        <div class="flex-box">
                            <p>{{ $t('Subtotal') }}</p>
                            <b>{{ product_info.currency ? product_info.currency.toUpperCase() : '' }} {{ product_info.amount ? product_info.amount / 100 : '' || ''
                            }}</b>
                        </div>
                        <!-- 添加优惠券 -->
                        <!-- <div class="add-coupon">{{ $t('Add coupon') }}</div> -->
                        <!-- <div class="flex-box font-tips">
                            <p>{{ $t('After trial') }}</p>
                            <p>US {{ product_info.amount ? product_info.amount / 100 : '' }}</p>
                        </div> -->
                        <div class="flex-box" style="margin-top: 10px;">
                            <p>{{ $t('Cope with today') }}</p>
                            <b>{{ product_info.currency ? product_info.currency.toUpperCase() : '' }} {{ product_info.amount ? product_info.amount / 100 : '' || ''
                            }}</b>
                        </div>
                    </div>
                </div>

                <!-- <div class="left-address-box font-tips">{{ $t('Add address') }}</div> -->
            </div>
            <!-- 右侧板块 -->
            <div class="right-content-box">
                <div style="    margin: 0 auto;max-width: 400px;">
                    <b class="right-pay-title">{{ $t('Payment') }}</b>
                    <!-- 联系邮箱 -->
                    <!-- <div class="contact-email">{{ $t('Contact email') }}</div>
                    <div style="max-width: 400px;">
                        <el-input v-model="input" :placeholder="$t('Contact email tips')"></el-input>
                    </div> -->
                    <!-- 支付类型 -->
                    <div class="pay-title">{{ $t('payment method') }}</div>
                    <div class="pay-type-box">
                        <div v-for="(item, index) in payType" :key="index"
                            :class="isActive == item.value ? 'active-pay-box basics-pay-box' : 'basics-pay-box normal'"
                            @click="onChangePay(item.value)">
                            <svg style="width: 16px;height: 16px;">
                                <use :xlink:href="item.svg"></use>
                            </svg>
                            <p>{{ $t(item.name) }}</p>
                        </div>
                    </div>
                </div>
                <!-- 支付板块，银行卡需要引入板块，故此没写 -->
                <div class="pay-change-box" v-if="filteredArray.length">
                    <div v-if="isActive == 'BANK'" style="width: 100%;height: 100%;">
                        <div style="color: #3D3D3D;margin:20px 0 5px 0;">{{ $t('Enter card information') }}</div>
                        <!-- 引入 Stripe.js -->
                        <!-- 创建卡片信息收集的表单 -->
                        <form id="payment-form">
                            <!-- 这里添加用于收集卡片信息的字段，如卡号、过期日期、CVC等 -->
                            <!-- 用于容纳 Stripe.js 元素的容器 -->
                            <div id="card-element"></div>
                            <!-- 用于显示验证错误的元素 -->
                            <div id="card-errors" role="alert"></div>
                            <!-- 提交按钮 -->
                            <!-- <button type="submit">支付</button> -->
                        </form>
                    </div>
                    <div v-if="isActive == 'PAYPAL'">{{ $t('PayPal tips') }}</div>
                    <div v-if="isActive == 'ZFB'">{{ $t('zfb tips') }}</div>
                    <div v-if="isActive == 'WX'" id="wxPay">
                        <span v-if="!wx_img">{{ $t('wx tips') }}</span>
                        <img v-else :src="wx_img" alt="" style="width: 150px;height: 150px;">
                    </div>
                </div>
                <!-- 支付按钮 -->
                <div class="pay-btn-box" v-loading="payLoading">
                    <!-- <p class="font-tips"
                        v-html="$t('try out tips').replace('{day}', product_info.date).replace('{amount}', product_info.amount)"></p> -->
                    <div class="pay-btn" id="submit" @click="onPay">{{ onBtnText() }}</div>
                </div>
            </div>
        </div>
        <div class="agreement-box" style="font-size: 12px;">
            <div><b
                    style="font-size: 14px;margin-right: 5px;">KodePay</b><span v-html="$t('extensions tips').replace('${name}', product_info.name || '')"></span>
            </div>
            <div>Powered by <b>KodePay</b></div>
            <div class="protocol-manual" @click="onPolicyManualOpen()">{{ $t('Policy Manual') }}</div>
        </div>
    </div>
</template>
  
<script>
import languageChange from "../components/language-change.vue";
import { paymentListApi, createOrderApi, placeOrderApi } from "../../api/interface";
export default {
    components: { languageChange },
    data() {
        return {
            payType: [
                {
                    name: 'card',
                    svg: "#bank-card",
                    text: 'pay by card',
                    value: 'BANK'
                },
                {
                    name: 'paypal',
                    svg: "#paypal",
                    text: 'Go to PayPal',
                    value: 'PAYPAL'
                },
                {
                    name: 'alipay',
                    svg: "#alipay",
                    text: 'Go to Alipay',
                    value: 'ZFB'
                },
                {
                    name: 'wechat',
                    svg: "#wechat-pay",
                    text: 'Generate two-dimensional code',
                    value: 'WX'
                }
            ],
            isActive: 'BANK',
            input: '',
            isShowOrderDetails: false,
            elements: null,
            stripe: null,
            paymentElement: null,
            customer_id: '',
            stripe_public_key: '',
            client_secret: '',
            transaction_info: {},
            product_info: {},
            elements: {},
            clientKey: '',
            wx_img: '',
            product_loading:false,
            filteredArray:[],
            PayCompletionInfor:{},
            payLoading:false,
            card: null,
            cvc: null,
            exp: null,
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
        this.product_loading = true;
        createOrderApi({
            "redirect_path": "extension/pay-manage",
            "product_id": "prod_1ac7c64be993446f",
            "currency": "cny",
            "redirect_url":"https://www.baidu.com/"
        }).then(res => {
            let { code, data } = res.data;
            if (code == 100000) {
                const urlParams = new URLSearchParams(data.url.split('?')[1]);
                const jsonResult = {};
                urlParams.forEach((value, key) => {
                    jsonResult[key] = value;
                });

                let { transaction_id, client_id } = jsonResult;
                this.clientKey = client_id;
                paymentListApi(client_id, transaction_id).then(result => {
                    this.product_loading = false;
                    if (result.data.code == 100000) {
                        const {
                            payment_config_info: {
                                card: {
                                    setup_intent: { client_secret },
                                    stripe_public_key
                                },
                                available_payment_methods
                            }
                        } = result.data.data;
                        this.stripe_public_key = stripe_public_key;
                        this.client_secret = client_secret;

                        this.product_info = result.data.data.product_info;
                        this.transaction_info = result.data.data.transaction_info;

                        // 筛选一下已经有的支付方式
                        this.filteredArray = this.payType.filter(item => available_payment_methods.includes(item.name));
                        this.$nextTick(() => {
                            this.onGetCard();
                        })
                    }
                }).catch(err =>{
                    console.log('err =>', err);
                })
            }

        })
    },
    methods: {
        //切换支付方式
        onChangePay(value) {
            if(this.payLoading) return;
            this.isActive = value;

            if (this.isActive == 'BANK') {
                this.$nextTick(() => {
                    this.onGetCard();
                })
            }
        },
        //支付按钮文案展示
        onBtnText() {
            let str = this.payType.filter(item => item.value == this.isActive)[0];
            return this.$t(str.text);
        },
        onShowOrderDetails() {
            this.isShowOrderDetails = !this.isShowOrderDetails;
            document.body.style.setProperty('--OrderDetailsBox', this.isShowOrderDetails ? 'block' : 'none');
        },
        onPolicyManualOpen(){
            window.open('https://kodepay.io/privacy?utm_source=new_extension_pay', '_blank');
        },
        //获取卡支付
        async onGetCard() {
            const options = {
                clientSecret: this.client_secret,
            };
            this.stripe = Stripe(this.stripe_public_key);
            this.elements = this.stripe.elements(options);
            // Create and mount the Payment Element
            this.paymentElement = this.elements.create('card', 
                {theme: "stripe",}
            );
            this.paymentElement.mount("#card-element");
            const form = document.getElementById('payment-form');
        },
        //支付按钮
        async onPay() {
            if(this.isActive == 'Bank' && this.elements == null){
                return;
            }
            let pay = this.payType.find(item => item.value === this.isActive);
            pay = pay ? pay.name : null;
            this.payLoading = true;
            let paymentMethodObj = null;
            //如果下单方式为卡支付
            if (this.isActive == 'BANK') {
                //先看下表单验证是否通过，有没有正常显示
                try {
                    const { error: submitError } = await this.elements.submit();
                    if (submitError) { // 处理验证异常
                        console.log(submitError);
                        this.$message.error(this.$t('error pay'));
                        this.payLoading = false;
                        return;
                    }
                } catch (error) {
                    this.$message.error(this.$t('error pay'));
                    this.payLoading = false;
                }
                // 获取支付方式ID
                const { paymentMethod, error: paymentMethodError } = await this.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.paymentElement,
                    // request_three_d_secure: "any"
                });
                if (paymentMethodError) {
                    console.log('paymentMethodError =>', paymentMethodError);
                    this.$message.error(paymentMethodError.message);
                    this.payLoading = false;
                    return;
                }
                paymentMethodObj = paymentMethod;
            } else if (this.isActive == 'ZFB' || this.isActive == 'WX') {
                const { paymentMethod, error: paymentMethodError } = await this.stripe.createPaymentMethod(this.isActive == 'ZFB' ? 'alipay' : 'wechat_pay', {
                    billing_details: {
                        name: 'Jenny Rosen',
                    },
                });
                if (paymentMethodError) {
                    console.log('paymentMethodError =>', paymentMethodError);
                    this.$message.error(paymentMethodError.message);
                    this.payLoading = false;
                    return;
                }
                paymentMethodObj = paymentMethod;
            }
            if (paymentMethodObj.id == null) {
                return;
            }
            let param = {
                "transaction_id": this.transaction_info.transaction_id,
                "product_id": this.product_info.product_id,
                "currency": this.product_info.currency || '',
                // "currency": 'cny',
                "payment_channel": 'stripe',
                "payment_method": pay,
                "payment_method_id": paymentMethodObj.id || ''
            }
            //请求后端下单接口
            placeOrderApi(this.clientKey, param).then(res => {
                if (res.data.code == 100000) {
                    let { client_secret, cancel_url, success_url } = res.data.data;
                    let urlParams = new URLSearchParams(success_url.split('?')[1]);
                    let jsonResult = {};
                    urlParams.forEach((value, key) => {
                        jsonResult[key] = value;
                    });
                    jsonResult = {
                        ...jsonResult,
                        ...this.product_info
                    }

                    if (this.isActive == 'BANK') {
                        this.stripe.confirmCardPayment(client_secret)
                            .then((result)=> {
                                this.payLoading = false;
                                let { paymentIntent } = result;
                                if (paymentIntent.status === 'succeeded') {
                                    this.$router.push({path: '/extension/extension-pay-success', query: jsonResult});
                                } else if (paymentIntent.status === 'requires_action') {
                                    
                                }else{
                                    // this.PayCompletionInfor = this.PayCompletionObj.error;
                                    this.$message.error(res.data.message);
                                }
                            }).catch(() =>{
                                this.payLoading = false;
                            })
                    } else if (this.isActive == 'ZFB') {
                        this.stripe.confirmAlipayPayment(client_secret, {
                            'return_url': window.location.href,
                            // setup_future_usage: 'off_session',
                            mandate_data: {
                                customer_acceptance: {
                                    type: 'online',
                                    online: {
                                        ip_address: '127.0.0.1',
                                        user_agent: 'stripe.js',
                                    }
                                }
                            },
                        }).then((result) => {
                            this.payLoading = false;
                            let { paymentIntent } = result;
                            if (paymentIntent.status === 'succeeded') {
                                this.$router.push({path: '/extension/extension-pay-success', query: jsonResult});
                            } else if (paymentIntent.status === 'requires_action') {
                                
                            }else{
                                this.$message.error(res.data.message);
                            }
                        }).catch(() =>{
                            this.payLoading = false;
                        })
                    } else if (this.isActive == 'WX') {
                        this.stripe.confirmWechatPayPayment(client_secret, {
                            payment_method_options: {
                                wechat_pay: {
                                    client: 'web'
                                }
                            },
                        }, { handleActions: false }).then((result, error) => {
                            this.payLoading = false;
                            let { paymentIntent } = result;
                            if (paymentIntent.status === 'succeeded') {
                                this.$router.push({path: '/extension/extension-pay-success', query: jsonResult});
                            } else if (paymentIntent.status === 'requires_action') {
                                this.wx_img = paymentIntent.next_action.wechat_pay_display_qr_code.image_data_url;
                            }else{
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {
                            console.log('err', err)
                            this.payLoading = false;
                        });
                    }
                } else {
                    this.$message.error(res.data.message);
                    this.payLoading = false;
                    return;
                }
            }).catch(err => {
                console.log('err', err);
                this.$message.error(this.$t('error pay'));
                this.payLoading = false;
            })
        },
    }
}
</script>
<style scoped lang="less">
.extension-pay {
    margin: 0 auto;

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

            .plan-box-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .background-box {
                width: 48px;
                height: 48px;
                background-color: #fff;
                background-size: 100% 100%;
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

        .left-address-box {
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

        .pay-title {
            color: #3D3D3D;
            margin: 23px 0 8px 0;
        }

        .pay-type-box {
            display: flex;
            max-width: 400px;
            gap: 12px;
            margin-bottom: 20px;

            .active-pay-box {
                border: 1px solid #000000;
                box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
            }

            .normal {
                border: 1px solid #BFBFBF;
            }

            .basics-pay-box {
                width: 100%;
                height: 50px;
                font-size: 12px;
                padding: 8px 0 5px 12px;
                box-sizing: border-box;
                cursor: pointer;
                overflow: hidden;
            }
        }

        .pay-btn-box {
            width: 90%;
            ;
            max-width: 400px;
            margin: auto;

            .pay-btn {
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

        .pay-change-box {
            height: 240px;
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
        color: var(--fontSpecial);
        font-size: 24px;
        font-weight: 700;
    }
}

.protocol-manual {
    text-decoration: underline;
    cursor: pointer;
}
.pay-completion-infor{
    text-align: center;
    .pay-text{
        font-size: 24px;
        margin: 18px 0 36px;
    }
    
    .pay-repeat{
        width: 280px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        background-color: #2F54EB;
        border-radius: 8px;
        margin: 0 auto;
        margin-top: 72px;
        text-align: center;
    }
}
@media screen and (min-width:700px) {
    .extension-pay-content {
        max-height: 650px;
        color: #000;
        max-width: 880px;
        margin: auto;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .extension-pay {
        display: flex;
        border: 1px solid;
        height: 600px;
    }

    // .agreement-box{
    //     display: flex;
    //     justify-content: space-between;
    // }
    .agreement-box>div:nth-child(2) {
        display: none;
    }

    .agreement-box>div:last-child {
        text-align: right;
    }

    .left-content-box {
        width: 50%;
        background: var(--leftContentBG);
        padding: 23px 21px 20px 32px;

        .try-box-tips {
            margin: 15px 0px 30px;
        }

        .Order-details-btn {
            display: none;
        }
    }

    .right-content-box {
        width: 50%;
        padding: 23px 21px 20px 32px;

        .pay-btn-box {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
        }

        .contact-email {
            margin: 20px 0 5px 0;
        }
    }

    .pay-completion-infor{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
    }    
}

@media screen and (max-width:700px) {
    .pay-title-font{
        text-align: center;
    }
    .try-box {
        margin: 0 auto;
        max-width: 160px;
        text-align: center;
    }

    .left-pay-box {
        padding: 23px 21px 16px 21px;
    }

    .Order-details-btn {
        text-align: center;
    }

    .try-box-tips {
        margin-top: 12px;
    }

    .Order-details-content {
        padding: 20px;
        box-sizing: border-box;
        background: var(--leftContentBG);
    }

    .Order-details-box {
        display: var(--OrderDetailsBox);
        margin-top: 20px;
    }

    .left-address-box {
        display: none;
    }

    .right-content-box {
        padding: 30px 20px;

        .right-pay-title {
            display: none;
        }

        .contact-email {
            margin-bottom: 5px;
        }
    }

    .agreement-box {
        padding: 20px 30px;
        border-top: 1px solid #D8D8D8;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .agreement-box>div:first-child {
        b {
            display: none;
        }
    }

    .agreement-box>div:last-child {
        text-align: left;
    }
}

#card-element {
  border-radius: 4px;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  width: 94%;
}

</style>