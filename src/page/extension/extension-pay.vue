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
                        <div><span class="font-blue">{{ product_info.currency ? product_info.currency.toUpperCase() : ''
                                }}{{ product_info.amount ? product_info.amount / 100 : '' }}</span>
                            <span v-if="product_info.interval">/ {{ $t(product_info.interval) }}</span>
                        </div>
                        <div style="margin-bottom: 30px;"><span class="font-tips">{{ product_info.plan_type ==
                'one_time' ? $t('one_time') : $t('recurring')
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
                                    :style="{ backgroundImage: product_info.icon ? 'url(https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + product_info.icon + ')' : 'url(https://kodepay-cdn.oss-us-west-1.aliyuncs.com/common/images/logo%E7%99%BD%E8%89%B2_%E8%93%9D%E5%BA%95.png)' }">
                                </div>
                                <div>
                                    <p style="margin-bottom: 7px;">{{ product_info.name }}</p>
                                    <p class="font-tips" v-if="product_info.desc">{{ product_info.desc }}</p>
                                </div>
                            </div>
                            <div style="text-align: right;flex-shrink: 0;">
                                <!-- <p style="margin-bottom: 7px;" v-html="$t('Free days Try').replace('{day}', '7')"></p>
                                <p class="font-tips" v-html="$t('Free duration Amount').replace('{Amount}', product_info.amount ? product_info.amount / 100 : '')"></p> -->
                                {{ product_info.currency ? product_info.currency.toUpperCase() : '' }} {{
                product_info.amount ? product_info.amount / 100 : '' || '' }}
                                <span v-if="product_info.interval">/ {{ $t(product_info.interval) }}</span>
                            </div>
                        </div>
                        <div class="flex-box">
                            <p>{{ $t('Subtotal') }}</p>
                            <b>{{ product_info.currency ? product_info.currency.toUpperCase() : '' }} {{
                product_info.amount ? product_info.amount / 100 : '' || ''
            }}</b>
                        </div>
                        <!-- 添加优惠券 -->
                        <!-- <div class="add-coupon">{{ $t('Add coupon') }}</div> -->
                        <!-- <div class="flex-box font-tips">
                            <p>{{ $t('After trial') }}</p>
                            <p>US {{ product_info.amount ? product_info.amount / 100 : '' }}</p>
                        </div> -->
                        <div class="flex-box" style="margin-top: 10px;">
                            <p>{{ $t('Quantity') }}</p>
                            <b>{{ product_info.quantity }}</b>
                        </div>
                        <div class="flex-box" style="margin-top: 10px;">
                            <p>{{ $t('Cope with today') }}</p>
                            <b>{{ product_info.currency ? product_info.currency.toUpperCase() : '' }}
                              {{transaction_info.amount / 100 }}</b>
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
                    <div class="contact-email" v-if="emailShow">{{ $t('Contact email') }}</div>
                    <div style="max-width: 400px;" v-if="emailShow">
                        <el-input v-model="emailInput" :placeholder="$t('Contact email tips')"></el-input>
                    </div>
                    <!-- 支付类型 -->
                    <!--
                    <div class="pay-title">{{ $t('payment method') }}</div>
                    <div class="pay-type-box">
                        <div v-for="(item, index) in filteredArray" :key="index"
                            :class="isActive == item.value ? 'active-pay-box basics-pay-box' : 'basics-pay-box normal'"
                            @click="onChangePay(item.value)">
                            <svg style="width: 16px;height: 16px;">
                                <use :xlink:href="item.svg"></use>
                            </svg>
                            <p>{{ $t(item.name) }}</p>
                        </div>
                    </div>
                    -->
                </div>

                <!-- 支付板块 -->
                <div class="pay-change-box">
                    <div style="width: 98%;display: flex;align-items: end;gap: 10px;margin-top: 20px;" v-loading="payLoading">
                        <div v-if="isShowPaypal" class="CheckoutElement" @click="onPay('paypal')">
                            <svg style="width: 100px;height: 45px;">
                                <use xlink:href="#paypal-pay"></use>
                            </svg>
                        </div>
                        <!-- 快速结账元素 -->
                        <div id="express-checkout-element" style="width: 50%;"></div>
                    </div>

                    <!-- <div style="color: #3D3D3D;margin:20px 0 5px 0;">{{ $t('Enter card information') }}</div> -->
                    <!-- 引入 Stripe.js -->
                    <!-- 创建卡片信息收集的表单 -->
                    <div style="width: 98%;max-height: 100%;min-height: 320px;margin-top: 20px;">
                        <form id="payment-form">
                            <!-- 这里添加用于收集卡片信息的字段，如卡号、过期日期、CVC等 -->
                            <!-- 用于容纳 Stripe.js 元素的容器 -->
                            <div id="card-element"></div>
                            <!-- 用于显示验证错误的元素 -->
                            <div id="card-errors" role="alert"></div>
                        </form>
                    </div>

                    <!-- <div v-if="isActive == 'BANK'" style="width: 100%;height: 100%;">
                        
                    </div>
                    <div v-if="isActive == 'PAYPAL'">{{ $t('PayPal tips') }}</div>
                    <div v-if="isActive == 'ZFB'">{{ $t('zfb tips') }}</div>
                    <div v-if="isActive == 'WX'" id="wxPay">
                        <span>{{ $t('wx tips') }}</span>
                    </div> -->
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
            <div><b style="font-size: 14px;margin-right: 5px;">KodePay</b><span
                    v-html="$t('extensions tips').replace('${name}', transaction_info.client_name || '')"></span>
            </div>
            <div>Powered by <b>KodePay</b></div>
            <div class="protocol-manual" @click="onPolicyManualOpen()">{{ $t('Policy Manual') }}</div>
        </div>

        <el-dialog :title="$t('wechat')" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
            <div style="text-align: center;">
                <img :src="wx_img" alt="" style="width: 200px;height: 200px;">
            </div>

        </el-dialog>
    </div>
</template>
<script>
import languageChange from "../components/language-change.vue";
import { paymentListApi, placeOrderApi, extensionUserInfo } from "../../api/interface";
export default {
    components: { languageChange },
    data() {
        return {
            payType: [
                {
                    name: 'card',
                    svg: "#bank-card",
                    text: 'pay by card',
                    value: 'card'
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
                    value: 'alipay'
                },
                {
                    name: 'wechat',
                    svg: "#wechat-pay",
                    text: 'Generate two-dimensional code',
                    value: 'wechat_pay'
                }
            ],
            isActive: 'card',
            input: '',
            isShowOrderDetails: false,
            elements: null,
            elements1: null,
            stripe: null,
            paymentElement: null,
            customer_id: '',
            stripe_public_key: '',
            client_secret: '',
            transaction_info: {},
            product_info: {},
            clientKey: '',
            transaction_id: '',
            wx_img: '',
            product_loading: true,
            filteredArray: [],
            PayCompletionInfor: {},
            payLoading: false,
            timer: null,
            PaymentListNub: 0,
            dialogVisible: false,
            pollingNub: 0,
            user_info: {},
            common_headers: {},
            emailInput: '',
            emailShow: false,
            isShowPaypal: false,
            paymentMethodTypes:[]
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
        this.onClearTimeout();
        this.getUserInfo();
        this.product_loading = true;
        const urlParams = new URLSearchParams(this.$route.query);
        const jsonResult = {};
        urlParams.forEach((value, key) => {
            jsonResult[key] = value;
        });

        let { transaction_id, client_id } = jsonResult;
        this.clientKey = client_id;
        this.transaction_id = transaction_id;
        this.pollingNub = 10;
        this.onPaymentListApi(transaction_id, client_id);
    },
    methods: {
        onPaymentListApi(transaction_id, client_id) {
            if (this.PaymentListNub >= this.pollingNub) {
                this.product_loading = false;
                clearTimeout(this.timer);
                this.PaymentListNub = 0;
                this.$message.error(this.$t('Network fluctuations'));
                return;
            }
            paymentListApi(client_id, transaction_id).then(result => {
                this.product_loading = false;
                let {data : {code, data}} = result;
                if (code == 100000) {
                    const {
                        payment_config_info: {
                            card: {
                                setup_intent: { client_secret },
                                stripe_public_key
                            },
                            available_payment_methods
                        }
                    } = data;

                    this.stripe_public_key = stripe_public_key;
                    this.client_secret = client_secret;
                    this.paymentMethodTypes = available_payment_methods.map(method => method === 'wechat' ? 'wechat_pay' : method);
                    this.paymentMethodTypes = this.paymentMethodTypes.filter(item => item != 'paypal');

                    this.product_info = data.product_info;
                    this.transaction_info = data.transaction_info;

                    this.isShowPaypal = data.payment_config_info.available_payment_methods.indexOf('paypal') == -1 ? false : true;

                    // 如果是支付中状态，就开始轮询
                    if (this.transaction_info.pay_status == 'confirming') {
                        //判断下，如果当前是获取支付状态，就添加loading
                        this.pollingNub == 10 ? this.product_loading = true : '';
                        this.timer = setTimeout(() => {
                            this.PaymentListNub++;
                            this.onPaymentListApi(transaction_id, client_id);
                        }, 5000);
                        //  支付成功就直接跳转过去了
                    } else if (this.transaction_info.pay_status == 'succeed') {
                        let jsonResult = {
                            status: '1',
                            transaction_key: transaction_id,
                            client_id: this.clientKey,
                            redirect_url: this.transaction_info.redirect_url,
                            ...this.product_info
                        };
                        this.$router.push({ path: '/extension/extension-pay-success', query: jsonResult });
                        //支付失败给提示语句
                    } else if (this.transaction_info.pay_status == 'failed') {
                        this.dialogVisible = false;
                        this.$message.error(this.$t('error pay'));
                    }
                    // 如果是银行卡支付，就加载Stripe
                    if (this.isActive == 'card' && this.PaymentListNub <= 1) {
                        this.$nextTick(() => {
                            this.onGetCard();
                        })
                    }
                    // 筛选一下已经有的支付方式
                    // this.filteredArray = this.payType.filter(item => available_payment_methods.includes(item.name));
                }
            }).catch(err => {
                this.product_loading = false;
                this.$message.error(err);
            })
        },
        /**
         * 获取用户信息
         */
        getUserInfo() {
            this.common_headers = this.getCommonHeaders();
            extensionUserInfo(this.common_headers).then(res => {
                let res_data = res.data;
                if (parseInt(res_data.code) === 100000) {
                    this.user_info = res_data.userinfo;
                    this.emailInput = this.user_info.email || '';
                    if (!this.user_info.email) this.emailShow = true;
                } else {
                    if (parseInt(res_data.code) === 401) {
                        this.$message.warning(res_data.message)
                    }
                }
            });
        },
        getCommonHeaders() {
            let headers = {};
            for (let key in this.$route.query) {
                let newKey = key.replace(/_/g, "-");
                headers[newKey] = this.$route.query[key];
            }
            return headers;
        },
        //切换支付方式
        onChangePay(value) {
            // 如果正在支付中，不允许切换支付方式
            if (this.payLoading) return;
            this.wx_img = '';
            this.isActive = value;
            //切换的时候清除现有的轮询状态(如果此时还在加载订单状态，就不清除轮询状态)
            if (!this.product_loading) this.onClearTimeout();

            if (this.isActive == 'card') {
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
        onPolicyManualOpen() {
            window.open('https://kodepay.io/privacy?utm_source=new_extension_pay', '_blank');
        },
        /**
         * 验证邮箱格式
         * @param mail
         * @returns {boolean}
         */
        isEmail(mail) {
            const regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            return regex.test(mail);
        },
        //获取卡支付
        async onGetCard() {
            this.stripe = Stripe(this.stripe_public_key);
            const options = {
                layout: {
                    type: 'tabs',
                    defaultCollapsed: false,
                },
            };
            this.elements = this.stripe.elements({
                mode: 'payment',
                currency: this.product_info.currency,
                amount: this.transaction_info.amount,
                paymentMethodTypes: this.paymentMethodTypes
            });

            this.paymentElement = this.elements.create('payment', options);
            this.paymentElement.mount("#card-element");

            // 监听元素变化事件
            this.paymentElement.on('change', (event) => {
                try {
                    this.isActive = event.value.type;
                } catch (error) {
                    console.log('error =>', error);
                }
            });


            this.elements1 = this.stripe.elements({
                mode: 'payment',
                currency: this.product_info.currency,
                amount: this.transaction_info.amount,
            });
            const expressCheckoutElement = this.elements1.create('expressCheckout');
            expressCheckoutElement.mount('#express-checkout-element')
        },
        //支付按钮
        async onPay(type) {
            if (this.isActive == 'card' && this.elements == null) return; //如果卡支付时Stripe没有加载出来，则不允许支付
            if (this.product_loading) {
                this.$message.warning(this.$t('paying tips'));  //支付套餐信息获取中，请稍等
                return;
            }
            if (!this.emailInput) {
                this.$message.warning(this.$t('email information first'));  //还未填写邮箱信息
                return
            }
            if (!this.isEmail(this.emailInput)) {
                this.$message.warning(this.$t('email format error'));  //邮箱格式错误
                return
            }
            //下单的时候清除现有的轮询状态（微信支付的轮询）
            this.onClearTimeout();
            let paymentID = null;
            this.payLoading = true;
            if (type !== 'paypal') {
                //如果下单方式为卡支付
                if (this.isActive == 'card') {
                    //先看下表单验证是否通过，有没有正常显示
                    try {
                        const { error: submitError } = await this.elements.submit();
                        if (submitError) { // 处理验证异常
                            this.$message.warning(submitError.message);
                            this.payLoading = false;
                            return;
                        }
                    } catch (error) {
                        this.$message.error(this.$t('error pay'));
                        this.payLoading = false;
                    }
                    const { setupIntent, error } = await this.stripe.handleCardSetup(this.client_secret, this.paymentElement, {
                        payment_method_data: {},
                    })
                    if(error){
                        this.$message.error(error.message);
                        this.payLoading = false;
                        return;
                    }
                    if (setupIntent) {
                        paymentID = setupIntent.payment_method || '';
                    }
                } else if (this.isActive == 'alipay' || this.isActive == 'wechat_pay') {
                    const { paymentMethod, error: paymentMethodError } = await this.stripe.createPaymentMethod(this.isActive == 'alipay' ? 'alipay' : 'wechat_pay', {
                        billing_details: {
                            name: 'Jenny Rosen',
                        },
                    });
                    if (paymentMethodError) {
                        this.$message.error(paymentMethodError.message);
                        this.payLoading = false;
                        return;
                    }
                    paymentID = paymentMethod.id;
                }
                if (paymentID == null && type != 'paypal') {
                    this.payLoading = false;
                    this.$message.error(this.$t('error pay'));
                    return;
                }
            }
            let param = {
                "transaction_id": this.transaction_info.transaction_id,
                "product_id": this.product_info.product_id,
                "currency": this.product_info.currency || '',
                "payment_channel": type == 'paypal' ? 'paypal' : 'stripe',
                "payment_method": this.isActive == 'wechat_pay'? 'wechat' : this.isActive,
                "email": this.emailInput
            }
            if (type != 'paypal') {
                param = {
                    ...param,
                    "payment_method_id": paymentID || '',
                }
            }
            //请求后端下单接口
            placeOrderApi(this.common_headers, param).then(res => {
                if (res.data.code == 100000) {
                    let { client_secret, cancel_url, success_url } = res.data.data;
                    let urlParams = new URLSearchParams(success_url.split('?')[1]);
                    let jsonResult = {};
                    urlParams.forEach((value, key) => {
                        jsonResult[key] = value;
                    });
                    jsonResult = {
                        ...jsonResult,
                        redirect_url: this.transaction_info.redirect_url,
                        ...this.product_info
                    }
                    if (type == 'paypal') {
                        this.payLoading = false;
                        window.open(res.data.data.client_secret);
                    } else if (this.isActive == 'card') {
                        this.stripe.confirmCardPayment(client_secret)
                            .then((result) => {
                                this.payLoading = false;
                                if (result.error) {
                                    this.$message.error(result.error.message);
                                } else if (result.paymentIntent.status === 'succeeded') {
                                    this.$router.push({ path: '/extension/extension-pay-success', query: jsonResult });
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            }).catch(() => {
                                this.payLoading = false;
                            })
                    } else if (this.isActive == 'alipay') {
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
                            if (result.error) {
                                this.$message.error(result.error.message);
                            } else if (paymentIntent.status === 'succeeded') {
                                this.$router.push({ path: '/extension/extension-pay-success', query: jsonResult });
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {
                            this.payLoading = false;
                        })
                    } else if (this.isActive == 'wechat_pay') {
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
                                this.$router.push({ path: '/extension/extension-pay-success', query: jsonResult });
                            } else if (paymentIntent.status === 'requires_action') {
                                this.wx_img = paymentIntent.next_action.wechat_pay_display_qr_code.image_data_url;
                                this.dialogVisible = true;
                                this.pollingNub = 60;
                                this.onPaymentListApi(this.transaction_id, this.clientKey);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        }).catch(err => {
                            this.payLoading = false;
                        });
                    }
                } else {
                    this.$message.error(res.data.message);
                    this.payLoading = false;
                    return;
                }
            }).catch(err => {
                this.$message.error(this.$t('error pay'));
                this.payLoading = false;
            })
        },
        onClearTimeout() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.product_loading = false;
                this.payLoading = false;
                this.PaymentListNub = 0;
            }
        }
    },
    beforeDestroy() {
        this.onClearTimeout();
    },
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
                background-size: 100% 100%;
                flex-shrink: 0;
                border-radius: 8px;
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
            max-height: 460px;
            width: 100%;
            overflow-y: auto;
        }

        // 快速结账盒子元素
        .CheckoutElement{
            height: 45px;
            width: 50%;
            cursor: pointer;
            background-color: #ffc439;
            border-radius: 5px;
            line-height: 45px;
            text-align: center;
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

.pay-completion-infor {
    text-align: center;

    .pay-text {
        font-size: 24px;
        margin: 18px 0 36px;
    }

    .pay-repeat {
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
        max-height: 800px;
        overflow-y: auto;
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
        height: 665px;
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

    .pay-completion-infor {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
    }
}

@media screen and (max-width:700px) {
    .pay-title-font {
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
        height: 600px !important;
        padding: 30px 20px;

        .right-pay-title {
            display: none;
        }

        .contact-email {
            margin-bottom: 5px;
        }

        .pay-change-box{
            height: 450px !important;
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

/* 美化整个滚动条 */
::-webkit-scrollbar {
  width: 3px; /* 设置滚动条的宽度 */
  background-color: #f9f9f9; /* 滚动条的背景颜色 */
}
 
/* 美化滚动条轨道 */
::-webkit-scrollbar-track {
  background: #e1e1e1; /* 轨道的背景颜色 */
  border-radius: 10px; /* 轨道的圆角大小 */
}
 
/* 美化滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1; /* 滑块的背景颜色 */
  border-radius: 10px; /* 滑块的圆角大小 */
  border: 2px solid #ffffff; /* 滑块边框 */
}
 
/* 当滑块悬停或活动时的样式 */
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 悬停或活动状态下滑块的背景颜色 */
}
</style>