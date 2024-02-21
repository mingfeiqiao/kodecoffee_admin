<template>
    <div class="extension-pay-content">
        <language-change></language-change>
        <div class="extension-pay">
            <!-- 左侧板块 -->
            <div class="left-content-box">
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
                    <div><span class="font-blue">{{ params.currency ? params.currency.toUpperCase() : '' }}{{
                        params.amount ? params.amount / 100 : '' }}</span></div>
                    <div style="margin-bottom: 30px;"><span class="font-tips">{{ params.plan_type == 'one_time' ?
                        $t('one_time') : $t('recurring')
                    }}</span></div>
                </div>

                <div class="Order-details-content">
                    <div class="Order-details-btn" @click="onShowOrderDetails">{{ $t('Order details') }} ></div>
                    <div class="Order-details-box">
                        <div class="flex-box plan-box">
                            <!-- 套餐详情 -->
                            <div class="plan-box-left">
                                <div class="background-box"
                                    :style="{ backgroundImage: params.icon ? 'url(https://kodepay-cdn.oss-us-west-1.aliyuncs.com/' + params.icon + ')' : '' }">
                                </div>
                                <div>
                                    <p style="margin-bottom: 7px;">{{ params.name }}</p>
                                    <p class="font-tips" v-if="params.desc">{{ params.desc }}</p>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <!-- <p style="margin-bottom: 7px;" v-html="$t('Free days Try').replace('{day}', '7')"></p>
                                <p class="font-tips" v-html="$t('Free duration Amount').replace('{Amount}', params.amount ? params.amount / 100 : '')"></p> -->
                                {{ params.currency ? params.currency.toUpperCase() : '' }} {{
                                    params.amount ? params.amount / 100 : '' || '' }}
                            </div>
                        </div>
                        <div class="flex-box">
                            <p>{{ $t('Subtotal') }}</p>
                            <b>{{ params.currency ? params.currency.toUpperCase() : '' }} {{ params.amount
                                ? params.amount / 100 : '' || ''
                            }}</b>
                        </div>
                        <!-- 添加优惠券 -->
                        <!-- <div class="add-coupon">{{ $t('Add coupon') }}</div> -->
                        <!-- <div class="flex-box font-tips">
                            <p>{{ $t('After trial') }}</p>
                            <p>US {{ params.amount ? params.amount / 100 : '' }}</p>
                        </div> -->
                        <div class="flex-box" style="margin-top: 10px;">
                            <p>{{ $t('Cope with today') }}</p>
                            <b>{{ params.currency ? params.currency.toUpperCase() : '' }} {{ params.amount
                                ? params.amount / 100 : '' || ''
                            }}</b>
                        </div>
                    </div>
                </div>

                <!-- <div class="left-address-box font-tips">{{ $t('Add address') }}</div> -->
            </div>
            <!-- 右侧板块 -->
            <div class="right-content-box">
                <div class="pay-completion-infor">
                    <svg width="80" height="80">
                        <use :xlink:href="PayCompletionObj.payStatusIcon"></use>
                    </svg>
                    <p class="pay-text">{{ PayCompletionObj.payText }}</p>
                    <!-- <p class="pay-tips">{{ PayCompletionObj.payTips }}</p> -->
                    <div v-if="params.redirect_url" style="padding: 24px 80px;">
                        <span>
                            <span>{{$t('seconds to jump', {seconds:this.countdown})}}</span>
                            <span class="text-loading"></span>
                        </span>
                    </div>
                    <div class="pay-repeat" v-if="PayCompletionObj.payStatus == 'error'">重新支付</div>
                </div>
            </div>
        </div>
        <div class="agreement-box" style="font-size: 12px;">
            <div><b style="font-size: 14px;margin-right: 5px;">KodePay</b><span
                    v-html="$t('extensions tips').replace('${name}', params.name || '')"></span>
            </div>
            <div>Powered by <b>KodePay</b></div>
            <div class="protocol-manual">{{ $t('Policy Manual') }}</div>
        </div>
    </div>
</template>
  
<script>
import languageChange from "../components/language-change.vue";
import {attributeApi, attributeFprApi} from "../../api/interface";
export default {
    components: { languageChange },
    data() {
        return {
            PayCompletionObj: {
                payStatusIcon: '#successful-pay',
                payText: '支付成功',
                payTips: '试用期结束后，从2023年12月12日开始，您将被每个月扣取$99.99。你可以随时取消订阅。',
                payStatus: 'success'
            },
            countdown: 5, // 倒计时秒
            timer: null,// 用于存储计时器的引用
            params: this.$route.query,
        };
    },
    mounted() {
        if (parseInt(this.params.status) === 1 && this.params.redirect_url) {
            this.startCountDown()
        }
    },
    beforeDestroy() {
        // 在组件销毁之前清除计时器，以避免内存泄漏
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    created() {
        //配置主题色
        document.body.style.setProperty('--leftContentBG', '#EFEFEF');
        document.body.style.setProperty('--fontSpecial', '#2F54EB');
        document.body.style.setProperty('--fontTips', '#3D3D3D');
        document.body.style.setProperty('--OrderDetailsBox', 'none');
        window.postMessage({
            type: 'pay',
            data: this.params
        });
        if (window.opener) {
            window.opener.postMessage({
                type: 'pay',
                data: this.params
            }, "*");
        }
        if (parseInt(this.params.status) === 1) {
            this.attribute();
        }
    },
    methods: {
        onShowOrderDetails() {
            this.isShowOrderDetails = !this.isShowOrderDetails;
            document.body.style.setProperty('--OrderDetailsBox', this.isShowOrderDetails ? 'block' : 'none');
        },
        navigateToPage(params) {
            window.location.href = this.getRedirectUrl(params, this.params.redirect_url);
        },
        startCountDown() {
            this.timer = setInterval(() => {
                if (this.countdown > 1) {
                    this.countdown--;
                } else {
                    clearInterval(this.timer);
                    const params = {}
                    for (const key in this.params) {
                        if (key !== 'redirect_url') {
                            params[key] = this.params[key]
                        }
                    }
                    this.navigateToPage(params);
                }
            }, 1000)
        },
        getRedirectUrl(params, targetUrl) {
            // 获取目标URL的参数（如果有的话）
            const targetParams = new URLSearchParams(new URL(targetUrl).search);
            // 将源URL的参数添加到目标URL的参数中
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const value = params[key];
                    targetParams.append(key, value)
                }
            }
            // 构建新的目标URL
            return targetUrl.split('?')[0] + '?' + targetParams.toString();
        },
        /**
         * 打开计费管理页面
         */
        openPayManagePage() {
            this.$router.push({ path: '/extension/pay-manage', query: this.$route.query });
        },
        /**
         * 上报接口
         */
        attribute() {
            const api_key = this.$route.query.api_key || "";
            const extension_id = this.$route.query.client_id || "";
            if (api_key && extension_id) { // 这里代表正常参数，只处理正常参数的内容
                let commission_key = this.$mode + '-commission-ext-ids';
                let vitality_key = this.$mode + '-share-ext-ids';
                let commission_ext_ids = localStorage.getItem(commission_key);
                if (commission_ext_ids) {
                    commission_ext_ids = JSON.parse(commission_ext_ids);
                    this.attributePay('commission', commission_ext_ids, extension_id, api_key)
                } else {
                    let share_ext_ids = localStorage.getItem(vitality_key);
                    if (share_ext_ids) {
                        share_ext_ids = JSON.parse(share_ext_ids);
                        this.attributePay('share', share_ext_ids, extension_id, api_key)
                    }
                }
            }
        },
        attributePay(type, ext_ids, extension_id, api_key) {
            if (ext_ids[extension_id] && ext_ids[extension_id].share_id) { // 代表存在该插件的归因信息，不存在的不进行上报
                let args = {
                    step: "pay",
                    api_key: api_key,
                    attribution: {
                        extension_id: extension_id,
                        u_id: ext_ids[extension_id].u_id || "",
                        share_id: ext_ids[extension_id].share_id || "",
                        click_time: ext_ids[extension_id].click_time || "",
                        install_time: ext_ids[extension_id].install_time || ""
                    }
                }
                if (type === 'share') {
                    attributeApi(args).then(res => {
                        console.log('report success');
                    })
                } else if (type === 'commission') {
                    args.attribution.fpr_code = args.attribution.share_id;
                    delete args.attribution.share_id;
                    attributeFprApi(args).then(res => {
                        console.log('report success');
                    })
                }
            }
        }
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

    .pay-completion-infor {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
    }
}

@media screen and (max-width:700px) {
    .try-box {
        margin: 0 auto;
        max-width: 160px;
        text-align: center;
    }

    .left-pay-box {
        padding: 23px 21px 16px 32px;
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

.text-loading:after{
  content:'...';
  animation: text-loading 2s infinite;
}
@keyframes text-loading {
  25%{
    content: ".";
  }
  50%{
    content: "..";
  }
  100%{
    content: "...";
  }
}
</style>